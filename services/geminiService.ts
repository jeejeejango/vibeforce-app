import { GoogleGenAI, Type } from "@google/genai";
import { Task, StashItem } from "../types";

// Initialize the API client safely.
// Note: In production, API keys should not be exposed client-side if possible,
// or should be restricted by referer.
const getAIClient = () => {
  const apiKey = process.env.API_KEY || "";
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateSubtasks = async (
  taskTitle: string
): Promise<string[]> => {
  const ai = getAIClient();
  if (!ai) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Break down the following task into 3-5 actionable subtasks. Task: "${taskTitle}". Return only the subtasks as a JSON string array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as string[];
  } catch (error) {
    console.error("Gemini Task Breakdown Error:", error);
    return ["Failed to generate subtasks. Please try again."];
  }
};

export const generateTasksFromNaturalLanguage = async (
  prompt: string
): Promise<string[]> => {
  const ai = getAIClient();
  if (!ai) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Given the following request, generate a list of 3-7 actionable tasks, items to buy or place to visit to fulfill it. Each task should be a concise phrase. Return only the tasks as a JSON string array.

Request: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as string[];
  } catch (error) {
    console.error("Gemini Natural Language Task Generation Error:", error);
    return ["Failed to generate tasks from your request. Please try again."];
  }
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  console.warn("Speech-to-Text functionality is not fully implemented yet.");
  // Placeholder: In a real application, you would send this audioBlob to a Speech-to-Text API.
  // For example, Google Cloud Speech-to-Text.
  // This might involve:
  // 1. Converting Blob to base64 or suitable format.
  // 2. Making a POST request to a backend endpoint that then calls the STT API.
  // 3. Returning the transcription.

  // For demonstration, let's pretend it always transcribes to a fixed string for now.
  // Or, if we want to simulate some AI response, we can add a very basic Gemini call here
  // but directly sending audio for transcription is typically a separate specialized API.
  const ai = getAIClient();
  if (!ai) return "Speech-to-text service unavailable.";

  try {
    // This is a very rough simulation. Gemini is not a direct speech-to-text API.
    // A proper solution would involve a dedicated STT service.
    // For now, let's just make a dummy call or return a placeholder.
    // If you truly want to process audio with Gemini, you'd need a multi-modal model
    // that accepts audio input, which might not be directly available via generateContent for blobs.
    // Returning a placeholder for now.
    return "This is a transcribed voice input placeholder.";
  } catch (error) {
    console.error("Placeholder audio transcription error:", error);
    return "Failed to transcribe audio.";
  }
};

export const analyzeStashItem = async (
  content: string
): Promise<{ title: string; tags: string[]; summary: string }> => {
  const ai = getAIClient();
  if (!ai) return { title: "Untitled", tags: [], summary: "" };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following content (which could be a note, link, or snippet). 
      1. Generate a short, punchy title.
      2. Generate 3 to 5 relevant tags.
      3. Generate 2 to 5 lines summary.
      
      Content: "${content.substring(0, 1000)}..."`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING },
          },
          required: ["title", "tags", "summary"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Stash Analysis Error:", error);
    return {
      title: "Analysis Failed",
      tags: ["error"],
      summary: "Could not analyze content.",
    };
  }
};

export const getSmartProductivityTip = async (
  context: string
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Stay focused and keep moving forward!";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Give me a very short, motivating 1-sentence productivity tip based on this context: ${context}`,
    });
    return response.text || "Keep crushing it!";
  } catch (e) {
    return "Conquer the day!";
  }
};
