import { Router } from 'express';
import { GoogleGenAI } from "@google/genai";
import { verifyToken, AuthRequest } from '../middleware/auth';
import type { UserInput, AnalysisResult, GeneratedAds, AnalysisType } from '../../src/types';
import { 
    GEMINI_MODEL, 
    ANALYSIS_SYSTEM_INSTRUCTION, 
    ANALYSIS_RESPONSE_SCHEMA,
    ORGANIC_ANALYSIS_SYSTEM_INSTRUCTION,
    ORGANIC_ANALYSIS_RESPONSE_SCHEMA,
    ADS_SYSTEM_INSTRUCTION,
    ADS_RESPONSE_SCHEMA,
} from "../constants";
import { pool } from '../db';

const router = Router();

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


router.post('/analyze', verifyToken, async (req: AuthRequest, res) => {
    const { userInput, analysisType } = req.body as { userInput: UserInput, analysisType: AnalysisType };
    const userId = req.user?.id;

    if (!userInput || !analysisType || !userInput.url) {
        return res.status(400).json({ message: 'Missing required analysis parameters.' });
    }
    if (!userId) {
      return res.status(401).json({ message: 'Authentication error.' });
    }

    try {
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
        const result: AnalysisResult = JSON.parse(text);

        // Save analysis to database
        await pool.query(
            'INSERT INTO analyses (user_id, url, analysis_type, result) VALUES ($1, $2, $3, $4)',
            [userId, userInput.url, analysisType, result]
        );

        res.json(result);

    } catch (error) {
        console.error("Error in /api/analyze:", error);
        res.status(500).json({ message: "Failed to analyze website due to an internal error." });
    }
});

router.post('/ads', verifyToken, async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'URL is required to generate ads.' });
    }

    try {
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
        const result: GeneratedAds = JSON.parse(text);

        res.json(result);
    } catch (error) {
        console.error("Error in /api/ads:", error);
        res.status(500).json({ message: "Failed to generate ad copy due to an internal error." });
    }
});

router.get('/history', verifyToken, async (req: AuthRequest, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Authentication error.' });
    }

    try {
        const result = await pool.query(
            'SELECT id, url, analysis_type, result, created_at FROM analyses WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ message: 'Failed to fetch analysis history.' });
    }
});


export default router;