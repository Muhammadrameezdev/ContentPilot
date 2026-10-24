import { GoogleGenAI } from "@google/genai";

// Image generation is handled by Google Gen AI (Imagen). Kept separate from the
// Groq text provider so the single AI route can map to either based on payload.
export const GEMINI_IMAGE_MODEL = "imagen-3.0-generate-002";

let client: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

export interface GeneratedImageResult {
  /** Data URL (data:<mime>;base64,<bytes>) ready to render in an <img>. */
  dataUrl: string;
  mimeType: string;
}

export async function generateImage(prompt: string): Promise<GeneratedImageResult> {
  const response = await getGemini().models.generateImages({
    model: GEMINI_IMAGE_MODEL,
    prompt,
    config: { numberOfImages: 1 },
  });

  const image = response.generatedImages?.[0]?.image;
  if (!image?.imageBytes) {
    throw new Error("Image generation returned no data");
  }

  const mimeType = image.mimeType ?? "image/png";
  return {
    dataUrl: `data:${mimeType};base64,${image.imageBytes}`,
    mimeType,
  };
}
