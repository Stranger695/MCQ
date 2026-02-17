import { GoogleGenAI, Type } from "@google/genai";
import { Difficulty, MCQ } from "../types";

/**
 * AI Question Generator
 * Mimics a backend microservice that produces valid knowledge fragments.
 */
export async function generateAIQuestions(topic: string, difficulty: Difficulty, count: number = 5): Promise<Partial<MCQ>[]> {
  // Always initialize GoogleGenAI inside functions to ensure fresh API key usage
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Generate ${count} multiple choice questions about "${topic}" at a "${difficulty}" difficulty level. 
               Return the data as a JSON array of objects with these properties:
               - questionText (string)
               - options (array of 4 strings)
               - correctOptionIndex (number 0-3)
               - explanation (string)
               - difficulty (string: ${difficulty})`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            questionText: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctOptionIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
            difficulty: { type: Type.STRING }
          },
          required: ["questionText", "options", "correctOptionIndex", "explanation", "difficulty"]
        }
      }
    }
  });

  try {
    // Access .text property directly as per guidelines
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("AI Generation Parse Error", e);
    return [];
  }
}

/**
 * AI Security Auditor
 * Analyzes attempt metadata to detect potential academic integrity violations.
 */
export async function analyzeProctoringLogs(attemptData: any): Promise<string> {
  // Always initialize GoogleGenAI inside functions to ensure fresh API key usage
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following exam proctoring data and provide a concise security summary (2 sentences max). 
               Assess whether the behavior is suspicious.
               Data: ${JSON.stringify(attemptData)}`,
  });

  // Access .text property directly as per guidelines
  return response.text || "No analysis available.";
}