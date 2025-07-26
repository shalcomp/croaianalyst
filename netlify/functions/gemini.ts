import type { Handler, HandlerEvent } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";
import type { UserInput, AnalysisResult, GeneratedAds } from "../../types";
import { 
    GEMINI_MODEL, 
    ANALYSIS_SYSTEM_INSTRUCTION, 
    ANALYSIS_RESPONSE_SCHEMA,
    ORGANIC_ANALYSIS_SYSTEM_INSTRUCTION,
    ORGANIC_ANALYSIS_RESPONSE_SCHEMA,
    ADS_SYSTEM_INSTRUCTION,
    ADS_RESPONSE_SCHEMA,
} from "../../constants";
import type { AnalysisType } from "../../App";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set in the serverless function environment.");
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

const handler: Handler = async (event: HandlerEvent) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    try {
        const { action, payload } = JSON.parse(event.body || '{}');

        switch (action) {
            case 'analyze': {
                const { userInput, analysisType } = payload as { userInput: UserInput, analysisType: AnalysisType };
                
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
                
                const result: AnalysisResult = JSON.parse(response.text.trim());
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(result),
                };
            }
            case 'generateAds': {
                const { url } = payload as { url: string };
                
                const response = await ai.models.generateContent({
                    model: GEMINI_MODEL,
                    contents: generateAdsPrompt(url),
                    config: {
                        systemInstruction: ADS_SYSTEM_INSTRUCTION,
                        responseMimeType: "application/json",
                        responseSchema: ADS_RESPONSE_SCHEMA,
                    }
                });

                const result: GeneratedAds = JSON.parse(response.text.trim());
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(result),
                };
            }
            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Invalid action specified' }),
                };
        }
    } catch (error) {
        console.error('Error in serverless function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error instanceof Error ? error.message : 'An internal server error occurred.' }),
        };
    }
};

export { handler };
