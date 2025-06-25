
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is missing. Please set the process.env.API_KEY environment variable.");
  // Potentially throw an error or handle this state in the UI
}

const ai = new GoogleGenAI({ apiKey: API_KEY! }); // Non-null assertion, assuming API_KEY is checked or provided by environment.

export const generateText = async (prompt: string, systemInstruction?: string): Promise<string> => {
  if (!API_KEY) {
    return "Error: Gemini API key is not configured.";
  }
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: prompt,
      config: {
        ...(systemInstruction && { systemInstruction }),
        // Disable thinking for potentially faster, lower latency, but possibly less nuanced responses.
        // Omit thinkingConfig entirely for default (thinking enabled) behavior.
        // thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating text with Gemini:", error);
    if (error instanceof Error) {
        return `Error from Gemini: ${error.message}`;
    }
    return "An unknown error occurred while generating text.";
  }
};

export const generateJson = async <T,>(prompt: string, systemInstruction?: string): Promise<T | { error: string }> => {
  if (!API_KEY) {
    return { error: "Gemini API key is not configured." };
  }
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: prompt,
      config: {
        ...(systemInstruction && { systemInstruction }),
        responseMimeType: "application/json",
      }
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    try {
      const parsedData = JSON.parse(jsonStr) as T;
      return parsedData;
    } catch (e) {
      console.error("Failed to parse JSON response:", e, "Raw response:", jsonStr);
      return { error: `Failed to parse JSON response. Raw: ${jsonStr.substring(0,100)}...` };
    }

  } catch (error) {
    console.error("Error generating JSON with Gemini:", error);
     if (error instanceof Error) {
        return { error: `Error from Gemini: ${error.message}`};
    }
    return { error: "An unknown error occurred while generating JSON." };
  }
};
