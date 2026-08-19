import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const runRightsAgent = async ({ category, query }) => {
  const prompt = `
You are an expert Legal Rights Navigator for Indian citizens.
The user has a dispute in the category: ${category.toUpperCase()}.

User's Problem:
${query}

IMPORTANT INSTRUCTIONS:
1. Explain the user's rights in simple, clear Hinglish/Hindi so a common person can understand.
2. Do not use complex legal jargon without explaining it.
3. Provide step-by-step actionable advice (e.g., Send a legal notice, approach Consumer Forum, file a complaint with Labour Commissioner, etc.).
4. Add a standard disclaimer at the end that this is legal information, not formal legal advice.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate rights advice");
  }
};