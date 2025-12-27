
import { GoogleGenAI } from "@google/genai";
import { ImageSize } from '../types';

/**
 * Generates an image based on prompt and size.
 * Uses gemini-2.5-flash-image for 1K and gemini-3-pro-image-preview for high resolution (2K/4K).
 */
export const generateImage = async (prompt: string, size: ImageSize): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const isHighRes = size === '2K' || size === '4K';
  const model = isHighRes ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          // Only gemini-3-pro-image-preview supports the imageSize parameter.
          ...(isHighRes ? { imageSize: size } : {})
        }
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        // Search for the image part in the response parts.
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

/**
 * Gets a response from the AI assistant for receipt management.
 * Uses gemini-3-flash-preview as it is best suited for basic summarization and Q&A tasks.
 */
export const getAIResponse = async (message: string, currentData: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are an assistant for 'CV. Kawan Lama' car rental. 
      You help staff manage receipts. Current receipt data: ${JSON.stringify(currentData)}. 
      Be professional, brief, and helpful. You can suggest total calculations or help fill fields.`,
    },
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};
