import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AutoPartsData, GeneralItemsData, GeneratedListings, ListingMode } from "../types";

const getClient = () => {
  const apiKey = "AIzaSyBuespvyXlqMA_UOcmcisiuXEUTV_Mst_Q";
  if (!apiKey) {
    throw new Error("API key not found");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Extracts text and details from an image using Gemini Vision
 */
export const analyzeImage = async (base64Data: string, mimeType: string): Promise<string> => {
  const ai = getClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data
            }
          },
          {
            text: "Extract all visible text from this image. If it looks like a product label, auto part, or box, specifically identify any Part Numbers, OEM Numbers, UPCs, or Model Names. Format the output as clean text."
          }
        ]
      }
    });

    return response.text || '';
  } catch (error) {
    console.error('Error analyzing image:', error);
    return '';
  }
};

/**
 * Generates optimized listings for Auto Parts or General Items
 */
export const generateListings = async (
  mode: ListingMode,
  data: AutoPartsData | GeneralItemsData
): Promise<GeneratedListings> => {
  const ai = getClient();

  const prompt = mode === ListingMode.AUTO_PARTS
    ? buildAutoPartsPrompt(data as AutoPartsData)
    : buildGeneralItemsPrompt(data as GeneralItemsData);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ text: prompt }] },
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object" as Type.OBJECT,
          properties: {
            ebay: {
              type: "object" as Type.OBJECT,
              properties: {
                title: { type: "string" as Type.STRING },
                description: { type: "string" as Type.STRING },
                price: { type: "string" as Type.STRING },
                shipping: { type: "string" as Type.STRING }
              },
              required: ["title", "description", "price", "shipping"]
            },
            facebook: {
              type: "object" as Type.OBJECT,
              properties: {
                title: { type: "string" as Type.STRING },
                description: { type: "string" as Type.STRING },
                price: { type: "string" as Type.STRING }
              },
              required: ["title", "description", "price"]
            },
            craigslist: {
              type: "object" as Type.OBJECT,
              properties: {
                title: { type: "string" as Type.STRING },
                description: { type: "string" as Type.STRING },
                price: { type: "string" as Type.STRING }
              },
              required: ["title", "description", "price"]
            }
          },
          required: ["ebay", "facebook", "craigslist"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return result as GeneratedListings;
  } catch (error) {
    console.error('Error generating listings:', error);
    throw error;
  }
};

function buildAutoPartsPrompt(data: AutoPartsData): string {
  return `Generate optimized listings for an auto part with the following details:

Year: ${data.year}
Make: ${data.make}
Model: ${data.model}
Trim/Engine: ${data.trimEngine}
Category: ${data.category}
Part Name: ${data.partName}
OEM Number: ${data.oemNumber}
Interchange Number: ${data.interchangeNumber}
Condition: ${data.condition}
Additional Notes: ${data.additionalNotes}
OCR Text from Images: ${data.ocrText}

Please create three optimized listings tailored for:
1. eBay - Detailed, SEO-optimized with fitment info
2. Facebook Marketplace - Casual, local buyer focused
3. Craigslist - Simple, keyword-rich

For pricing, suggest competitive prices based on condition and market research.`;
}

function buildGeneralItemsPrompt(data: GeneralItemsData): string {
  return `Generate optimized listings for a general item with the following details:

UPC: ${data.upc}
Category: ${data.category}
Brand: ${data.brand}
Item Name: ${data.itemName}
Size/Dimensions: ${data.sizeDimensions}
Condition: ${data.condition}
Additional Notes: ${data.additionalNotes}
OCR Text from Images: ${data.ocrText}

Please create three optimized listings tailored for:
1. eBay - Detailed, SEO-optimized
2. Facebook Marketplace - Casual, local buyer focused
3. Craigslist - Simple, keyword-rich

For pricing, suggest competitive prices based on condition and market research.`;
}
