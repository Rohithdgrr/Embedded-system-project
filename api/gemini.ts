
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../database/types";

export const callGeminiVision = async (base64Image: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image
          }
        },
        {
          text: `Perform a high-stakes exam proctoring analysis on this image. 
            Analyze the scene and count occurrences of the following:
            - Phones/Tablets
            - Earphones/Headphones
            - Smart Watches
            - Chits/Small slips of paper
            - Textbooks
            - Notebooks
            - General electronic devices
            - Total number of people (head count)
            
            Also, detect suspicious behaviors like:
            - Sudden head turns
            - Excessive leaning
            - Multiple people in one seat
            - Empty seats
            
            Return the results in JSON format with an overall integrity score (0-100) and specific counts.`
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          alerts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, description: "One of: PHONE, EARPHONE, WATCH, CHIT, TEXTBOOK, NOTEBOOK, DEVICE, HEAD_TURN, LEANING, MULTIPLE_PEOPLE, NO_PERSON" },
                seat: { type: Type.STRING, description: "The seat ID, e.g., B3, D5" },
                level: { type: Type.STRING, description: "STABLE, LOW, MEDIUM, HIGH, CRITICAL" },
                description: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                score: { type: Type.NUMBER, description: "Severity score 0-100" }
              },
              required: ["type", "seat", "level", "description", "confidence", "score"]
            }
          },
          overallIntegrityScore: { type: Type.NUMBER },
          stats: {
            type: Type.OBJECT,
            properties: {
              phone: { type: Type.NUMBER },
              earphone: { type: Type.NUMBER },
              watch: { type: Type.NUMBER },
              chit: { type: Type.NUMBER },
              textbook: { type: Type.NUMBER },
              notebook: { type: Type.NUMBER },
              device: { type: Type.NUMBER },
              detectedCount: { type: Type.NUMBER }
            },
            required: ["phone", "earphone", "watch", "chit", "textbook", "notebook", "device", "detectedCount"]
          }
        },
        required: ["alerts", "overallIntegrityScore", "stats"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini API");
  return JSON.parse(text.trim()) as AnalysisResult;
};
