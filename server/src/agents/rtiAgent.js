import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initializes using process.env.GEMINI_API_KEY automatically
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});
export const runRTIAgent = async ({ message, conversation }) => {
  const previousConversation = conversation
    .map((item) => {
      return `${item.role}: ${item.content}`;
    })
    .join("\n");

  const prompt = `
You are an AI RTI Drafting Assistant for CivicAI.

Your job is to help Indian citizens convert their plain-language
information request into a properly structured RTI application.

IMPORTANT RULES:

1. Understand the citizen's actual information request.
2. Ask follow-up questions if important information is missing.
3. Do not invent government departments, laws, addresses or facts.
4. The final RTI should request specific information rather than
   asking the government to take an action.
5. Use simple language when communicating with the citizen.
6. When enough information is available, generate a properly
   structured RTI application.
7. Tell the citizen when some information still needs verification.
8. This is an assistance tool and not a substitute for legal advice.
9. LANGUAGE RULE: Communicate with the citizen in conversational Hindi (written in Roman/Hinglish script) or pure Hindi as per user preference, but make sure the final RTI application text (formal parts) remains in English or Hindi as officially required (usually English or Hindi is accepted).
Information that may be required:

- Applicant name
- Applicant address
- State
- District
- Village/city/locality
- Subject/topic
- Time period
- Exact information requested
- Relevant department/public authority

CONVERSATION SO FAR:

${previousConversation}

CURRENT USER MESSAGE:

${message}

Your response should either:

A. Ask the user for the missing information,

OR

B. If enough information is available, return a completed RTI draft.

When generating a draft, return it in this format:

DEPARTMENT:
[department]

SUBJECT:
[subject]

APPLICATION:
[full RTI application]

IMPORTANT:
[any information that still needs verification]
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash", 
    contents: prompt,
    config: {
     tools: [{ googleSearch: {} }], 
},
  });

  const output = response.text;

  return {
    reply: output,
    draft: null,
  };
};
// 