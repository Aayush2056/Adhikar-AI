import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Helper to safely clean markdown JSON from Gemini response
const cleanJSON = (text) => {
  let raw = text.trim();
  raw = raw.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
  return JSON.parse(raw);
};

// Fallback schemas for testing if API quota exhausts
const fallbackSchemas = {
  "income certificate": {
    exists: true,
    formTitle: "Income Certificate",
    fields: [
      { key: "fullName", label: "Full Name" },
      { key: "fatherName", label: "Father's Name" },
      { key: "address", label: "Residential Address" },
      { key: "annualIncome", label: "Annual Family Income" }
    ]
  },
  "ration card": {
    exists: true,
    formTitle: "Ration Card Application",
    fields: [
      { key: "headName", label: "Head of Family Name" },
      { key: "totalMembers", label: "Total Family Members" },
      { key: "address", label: "Address" },
      { key: "monthlyIncome", label: "Monthly Income" }
    ]
  }
};

// 1. Validate Form Name & Get Schema (Filters out greetings/gibberish)
export const validateAndGetSchema = async (formName) => {
  try {
    const prompt = `
      You are an expert Indian government document assistant.
      The user input for the form name is: "${formName}".
      
      Task: Analyze this input. Is it a real, recognized Indian government form, document, or certificate name? 
      Note: Greetings like "hi", "hello", "hlw", random gibberish, or casual talk are NOT valid form names.
      
      If it is a greeting, casual chat, or NOT a valid form, respond strictly with this JSON:
      { "exists": false, "message": "Namaste! Kripya mujhe batayein ki aapko kaunsa sarkari form bharna hai (jaise: Income Certificate, Ration Card, Caste Certificate, etc.)." }

      If it is a valid form name, respond strictly with this JSON structure:
      {
        "exists": true,
        "formTitle": "Official name of the form",
        "fields": [
          { "key": "fullName", "label": "Full Name" },
          { "key": "dob", "label": "Date of Birth" },
          { "key": "address", "label": "Residential Address" },
          { "key": "income", "label": "Annual Income" }
        ]
      }
      Return ONLY raw JSON. No markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    return cleanJSON(response.text);

  } catch (error) {
    console.warn("API Quota exceeded or failed. Using fallback check...", error.message);
    
    const key = formName.toLowerCase().trim();
    
    if (["hi", "hello", "hlw", "hey", "sup", "hii", "helo"].includes(key)) {
      return {
        exists: false,
        message: "Namaste! Kripya mujhe batayein ki aapko kaunsa sarkari form bharna hai (jaise: Income Certificate, Ration Card, etc.)."
      };
    }

    if (fallbackSchemas[key]) {
      return fallbackSchemas[key];
    }

    return {
      exists: true,
      formTitle: formName,
      fields: [
        { key: "fullName", label: "Full Name" },
        { key: "address", label: "Address" },
        { key: "purpose", label: "Purpose of Form" }
      ]
    };
  }
};

// 2. Intelligent Interview & Turn Validation Agent
export const processInterviewTurn = async (formName, requiredFields, collectedData, currentField, userMessage) => {
  try {
    const prompt = `
      You are an intelligent government form-filling assistant in India.
      Form Name: "${formName}"
      All Required Fields: ${JSON.stringify(requiredFields)}
      Current Data Collected So Far: ${JSON.stringify(collectedData)}
      We are currently trying to collect data for this specific field: "${currentField.key}" (${currentField.label}).
      
      User's latest message: "${userMessage}"

      Instructions:
      1. Analyze the user's message. Did they provide a valid answer to the current field ("${currentField.label}"), OR did they ask a side-question, chat casually, or give gibberish/invalid input?
      2. IF the user asked a question or talked off-topic: Answer their question politely, do NOT save their message into the field, keep the current field active, and ask them for the current field again. Set "isAnswerValid": false.
      3. IF the user gave a valid answer: Save this answer into the collected data under key "${currentField.key}". Then, determine the NEXT missing field from the required fields list. Set "isAnswerValid": true.
      4. IF all fields are successfully collected, set "isComplete": true and generate a formal final template draft of the filled form.

      Respond strictly in this JSON format:
      {
        "isAnswerValid": true/false,
        "reply": "Your conversational reply to the user",
        "updatedData": { ...merged data if valid, or same as before if invalid... },
        "nextFieldKey": "key of the next field to ask, or null if complete",
        "isComplete": true/false,
        "finalTemplate": "Full formatted text draft of the form if complete, otherwise empty string"
      }
      Return ONLY raw JSON. No markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    return cleanJSON(response.text);

  } catch (error) {
    console.warn("AI processing error (Quota/Network). Using offline fallback:", error.message);
    
    const updatedData = { ...collectedData, [currentField.key]: userMessage };
    return {
      isAnswerValid: true,
      reply: "Got it! (Offline mode). Next, please provide the next detail.",
      updatedData,
      nextFieldKey: null,
      isComplete: false,
      finalTemplate: ""
    };
  }
};