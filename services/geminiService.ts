
import { GoogleGenAI, Type } from "@google/genai";
import type { SWOTAnalysis } from '../types';

const swotSchema = {
  type: Type.OBJECT,
  properties: {
    strengths: {
      type: Type.ARRAY,
      description: "A list of 3-5 strengths for the given topic.",
      items: { type: Type.STRING },
    },
    weaknesses: {
      type: Type.ARRAY,
      description: "A list of 3-5 weaknesses for the given topic.",
      items: { type: Type.STRING },
    },
    opportunities: {
      type: Type.ARRAY,
      description: "A list of 3-5 potential opportunities for the given topic.",
      items: { type: Type.STRING },
    },
    threats: {
      type: Type.ARRAY,
      description: "A list of 3-5 potential threats to the given topic.",
      items: { type: Type.STRING },
    },
  },
  required: ["strengths", "weaknesses", "opportunities", "threats"],
};


export const generateSWOT = async (topic: string): Promise<SWOTAnalysis> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a concise SWOT analysis for the following company or idea: "${topic}". Provide 3-5 bullet points for each category.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: swotSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);

    // Basic validation to ensure the parsed object matches our expected structure
    if (
      !parsedJson.strengths || !Array.isArray(parsedJson.strengths) ||
      !parsedJson.weaknesses || !Array.isArray(parsedJson.weaknesses) ||
      !parsedJson.opportunities || !Array.isArray(parsedJson.opportunities) ||
      !parsedJson.threats || !Array.isArray(parsedJson.threats)
    ) {
        throw new Error("Invalid SWOT analysis format received from API.");
    }

    return parsedJson as SWOTAnalysis;
  } catch (error) {
    console.error("Error generating SWOT analysis:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate SWOT analysis: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the SWOT analysis.");
  }
};
