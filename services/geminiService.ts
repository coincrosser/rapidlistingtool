import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AutoPartsData, GeneralItemsData, GeneratedListings, ListingMode } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
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
            text: "Extract all visible text from this image. If it looks like a product label, auto part, or box, specifically identify any Part Numbers, OEM Numbers, UPCs, or Model Names. Format the output clearly."
          }
        ]
      }
    });

    return response.text || "No text extracted.";
  } catch (error) {
    console.error("Gemini OCR Error:", error);
    throw new Error("Failed to analyze image.");
  }
};

/**
 * Generates listings for multiple platforms
 */
export const generateListings = async (
  mode: ListingMode,
  data: AutoPartsData | GeneralItemsData
): Promise<GeneratedListings> => {
  const ai = getClient();

  let prompt = "";
  
  if (mode === ListingMode.AUTO_PARTS) {
    const d = data as AutoPartsData;
    prompt = `
      Create professional reseller listings for an AUTO PART with the following details:
      Year: ${d.year}
      Make: ${d.make}
      Model: ${d.model}
      Trim/Engine: ${d.trimEngine}
      Part Name: ${d.partName}
      Category: ${d.category}
      OEM Part Number: ${d.oemNumber}
      Interchange: ${d.interchangeNumber}
      Condition: ${d.condition}
      Notes: ${d.additionalNotes}
      Extracted Text from Images: ${d.ocrText}
    `;
  } else {
    const d = data as GeneralItemsData;
    prompt = `
      Create professional reseller listings for a GENERAL ITEM with the following details:
      Item Name: ${d.itemName}
      Brand: ${d.brand}
      Category: ${d.category}
      UPC: ${d.upc}
      Size/Dimensions: ${d.sizeDimensions}
      Condition: ${d.condition}
      Notes: ${d.additionalNotes}
      Extracted Text from Images: ${d.ocrText}
    `;
  }

  prompt += `
    \nGENERATE 3 DISTINCT LISTING FORMATS in JSON:
    1. eBay: SEO optimized title (max 80 chars), detailed HTML-friendly description.
    2. Facebook Marketplace: Catchy title, concise description with keywords.
    3. Craigslist: Descriptive title, standard text description.
    
    Ensure the tone is professional and trustworthy. Highlight the condition and fitment/specs.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      ebayTitle: { type: Type.STRING },
      ebayDescription: { type: Type.STRING },
      facebookTitle: { type: Type.STRING },
      facebookDescription: { type: Type.STRING },
      craigslistTitle: { type: Type.STRING },
      craigslistDescription: { type: Type.STRING },
    },
    required: ["ebayTitle", "ebayDescription", "facebookTitle", "facebookDescription", "craigslistTitle", "craigslistDescription"],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");

    return JSON.parse(jsonText) as GeneratedListings;
  } catch (error) {
    console.error("Gemini Listing Gen Error:", error);
    throw new Error("Failed to generate listings.");
  }
};
