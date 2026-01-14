import { GoogleGenAI, Type } from "@google/genai";
import { PropertyDetails, GeneratedCaptionResponse } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePostCaption = async (
  details: PropertyDetails, 
  platforms: ('instagram' | 'facebook' | 'linkedin')[],
  tone: 'professional' | 'excited' | 'luxury'
): Promise<GeneratedCaptionResponse> => {
  try {
    const ai = getClient();
    
    // Construct a rich prompt based on available details
    let prompt = `Write a ${tone} real estate social media post for ${platforms.join(' and ')}. 
    Property Details:
    - Address: ${details.address}
    - Price: ${details.price}
    - Specs: ${details.beds} Bed, ${details.baths} Bath, ${details.sqft} sqft
    - Key Features: ${details.features.join(', ')}
    - Description Notes: ${details.description}
    
    The post should be engaging and optimized for the selected platform's audience.
    Include emojis where appropriate.
    `;

    // If we have an image URL (in a real app we'd pass base64, here we simulate or use text-only if URL is remote)
    // For this demo, we rely on the text data primarily to ensure robustness without CORS issues on images.
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: {
              type: Type.STRING,
              description: "The main body text of the social media post.",
            },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of relevant hashtags (5-10).",
            },
          },
          required: ["caption", "hashtags"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedCaptionResponse;
    }
    
    throw new Error("No response from AI");
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if API fails
    return {
      caption: `Check out this amazing property at ${details.address}! Listed for ${details.price}. ${details.beds} beds, ${details.baths} baths. Contact me for a tour!`,
      hashtags: ["#realestate", "#justlisted", "#newhome"]
    };
  }
};

export const optimizePropertyDescription = async (rawText: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Rewrite the following rough property notes into a polished, luxury real estate description paragraph (max 50 words): "${rawText}"`,
    });
    return response.text || rawText;
  } catch (e) {
    return rawText;
  }
};