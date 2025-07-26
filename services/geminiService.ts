
import { GoogleGenAI } from "@google/genai";
import type { UserInput, AnalysisResult, GeneratedAds } from "../types";
import { 
    GEMINI_MODEL, 
    ANALYSIS_SYSTEM_INSTRUCTION, 
    ANALYSIS_RESPONSE_SCHEMA,
    ORGANIC_ANALYSIS_SYSTEM_INSTRUCTION,
    ORGANIC_ANALYSIS_RESPONSE_SCHEMA,
    ADS_SYSTEM_INSTRUCTION,
    ADS_RESPONSE_SCHEMA,
} from "../constants";
import type { AnalysisType } from "../App";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateAnalysisPrompt = (userInput: UserInput): string => {
  return `
    Please perform a CRO analysis based on the following information:
    - Website URL: ${userInput.url}
    - Target Keywords: "${userInput.keywords || 'Not provided'}"
    - Ad Headlines: "${userInput.headlines || 'Not provided'}"
    - Ad Descriptions: "${userInput.descriptions || 'Not provided'}"

    Analyze the landing page at the URL in conjunction with the ad copy and keywords.
    Provide your response in the specified JSON format.
    `;
};

const generateOrganicAnalysisPrompt = (url: string): string => {
    return `
    Please perform a general CRO analysis for a first-time user for the following website:
    - Website URL: ${url}

    Analyze the landing page at the URL from the perspective of an organic visitor with no prior context.
    Provide your response in the specified JSON format.
    `;
}

const generateAdsPrompt = (url: string): string => {
    return `
    Please generate ad copy for the following website:
    - Website URL: ${url}
    
    Analyze the page to understand its product, service, and value proposition. Then, create highly relevant and compelling ad copy.
    Provide your response in the specified JSON format.
    `;
};


export const analyzeWebsite = async (userInput: UserInput, analysisType: AnalysisType): Promise<AnalysisResult> => {
  console.log(`Starting ${analysisType} website analysis with Gemini...`);

  const isPPC = analysisType === 'PPC';

  const systemInstruction = isPPC ? ANALYSIS_SYSTEM_INSTRUCTION : ORGANIC_ANALYSIS_SYSTEM_INSTRUCTION;
  const contents = isPPC ? generateAnalysisPrompt(userInput) : generateOrganicAnalysisPrompt(userInput.url);
  const responseSchema = isPPC ? ANALYSIS_RESPONSE_SCHEMA : ORGANIC_ANALYSIS_RESPONSE_SCHEMA;
  
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: contents,
    config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
    }
  });

  const text = response.text.trim();
  console.log("Received analysis from Gemini:", text);

  try {
    const result: AnalysisResult = JSON.parse(text);
    return result;
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini:", text);
    throw new Error("Received an invalid response from the AI. Please check the console for details.");
  }
};


export const generateAdCopy = async (url: string): Promise<GeneratedAds> => {
    console.log("Starting ad copy generation with Gemini...");

    const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: generateAdsPrompt(url),
        config: {
            systemInstruction: ADS_SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            responseSchema: ADS_RESPONSE_SCHEMA,
        }
    });

    const text = response.text.trim();
    console.log("Received generated ads from Gemini:", text);
    
    try {
        const result: GeneratedAds = JSON.parse(text);
        return result;
    } catch (e) {
        console.error("Failed to parse JSON response for ad generation:", text);
        throw new Error("Received an invalid response from the AI for ad generation.");
    }
}
