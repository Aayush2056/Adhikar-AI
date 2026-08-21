import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const runSchemeAgent = async ({ message, conversation = [] }) => {
  console.log('hello')
  const systemPrompt = `
You are a helpful, polite, and empathetic Government Scheme Assistant for Indian citizens. Your goal is to efficiently guide citizens in finding central and state government schemes they are eligible for.

RULES OF ENGAGEMENT:
1. LANGUAGE MATCHING RULE: Detect the user's language and respond in the EXACT SAME language/style. If the user speaks in English, reply in clear and polite English. If the user speaks in Hindi or Hinglish, reply in warm, polite Hinglish.

2. EFFICIENT QUESTIONING (Group 3 to 4 related questions together):
Do NOT ask questions one by one. To save time and requests, group related details together politely:
- If details are missing, ask for Name, State/District, and Age together in your first question.
- Next, ask for Occupation/Profession and Annual Income (or BPL/EWS status) together.
- Also check if they belong to any Special Category (SC/ST/OBC, Widow, Single Parent) or have any Disability/Health condition.

3. COMPLETE SCHEME OUTPUT:
Once you have gathered these details, list out the eligible Central & State Government Schemes and include:
- A clear list of Required Documents (like Aadhaar Card, Income Certificate, Student ID, Bank Passbook, etc.).
- Official Website links or portal names (like myscheme.gov.in or state government portals) to apply.

4. STRICT FORMATTING RULE: Absolutely DO NOT use any markdown formatting symbols like asterisks (*, **, ***) or hashes (#) anywhere in your response. Keep the text clean, natural, and readable without any bold or heading tags.
`;

  let formattedHistory = conversation.map(msg => 
    `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content || msg.text}`
  ).join("\n");

  const fullPrompt = `
${systemPrompt}

Conversation History:
${formattedHistory}

User: ${message}
Assistant:
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: fullPrompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate scheme advice.");
  }
};