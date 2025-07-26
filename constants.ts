
import type { AnalysisResult, GeneratedAds } from "./types";
import { Type } from "@google/genai";

export const GEMINI_MODEL = 'gemini-2.5-flash';

export const ANALYSIS_SYSTEM_INSTRUCTION = `You are a world-class Conversion Rate Optimization (CRO) expert. Your task is to analyze a website based on its URL, provided keywords, and ad copy. 
- You must simulate accessing and analyzing the content of the provided URL.
- Your analysis must be thorough, objective, and focused on maximizing conversions.
- Provide a score from 0-100 representing the page's overall conversion optimization.
- Evaluate how well the ad copy and keywords align with the landing page content.
- Assess key conversion elements rigorously.
- Offer specific, actionable recommendations for improvement.
- Adhere strictly to the requested JSON schema for your response. Do not output any text outside of the JSON structure.
`;

export const ORGANIC_ANALYSIS_SYSTEM_INSTRUCTION = `You are a world-class Conversion Rate Optimization (CRO) expert. Your task is to analyze a website for a first-time user based on its URL. 
- You must simulate accessing and analyzing the content of the provided URL.
- Your analysis must be thorough, objective, and focused on maximizing conversions for an organic visitor who may have no prior context.
- Provide a score from 0-100 representing the page's overall conversion optimization.
- Assess key conversion elements rigorously: value proposition, call-to-action, trust signals, content clarity, and mobile experience.
- Offer specific, actionable recommendations for improvement.
- Adhere strictly to the requested JSON schema for your response. Do not output any text outside of the JSON structure.
`;

export const ADS_SYSTEM_INSTRUCTION = `You are an expert direct response copywriter specializing in high-converting ad copy for search engine marketing (SEM).
- Your goal is to create compelling ad headlines and descriptions that are highly relevant to the provided website URL.
- Generate 10 compelling ad headlines, each under 30 characters.
- Generate 4 persuasive ad descriptions, each under 90 characters.
- You must simulate accessing and understanding the core value proposition of the website at the provided URL.
- Adhere strictly to the requested JSON schema for your response.
`;

const CONVERSION_ELEMENTS_SCHEMA = {
    type: Type.OBJECT,
    properties: {
      cta: {
        type: Type.OBJECT,
        properties: {
          rating: { type: Type.STRING, enum: ["Excellent", "Good", "Needs Improvement", "Poor"]},
          comment: { type: Type.STRING, description: "Comment on Call-to-Action effectiveness."}
        },
        required: ["rating", "comment"]
      },
      valueProposition: {
        type: Type.OBJECT,
        properties: {
          rating: { type: Type.STRING, enum: ["Excellent", "Good", "Needs Improvement", "Poor"]},
          comment: { type: Type.STRING, description: "Comment on the clarity and impact of the value proposition."}
        },
        required: ["rating", "comment"]
      },
      trustSignals: {
        type: Type.OBJECT,
        properties: {
          rating: { type: Type.STRING, enum: ["Excellent", "Good", "Needs Improvement", "Poor"]},
          comment: { type: Type.STRING, description: "Comment on the presence and quality of trust signals (reviews, testimonials, security badges)."}
        },
        required: ["rating", "comment"]
      },
      contentClarity: {
        type: Type.OBJECT,
        properties: {
          rating: { type: Type.STRING, enum: ["Excellent", "Good", "Needs Improvement", "Poor"]},
          comment: { type: Type.STRING, description: "Comment on how clear, concise, and persuasive the page content is."}
        },
        required: ["rating", "comment"]
      },
      mobileFriendliness: {
          type: Type.OBJECT,
          properties: {
            rating: { type: Type.STRING, enum: ["Excellent", "Good", "Needs Improvement", "Poor"]},
            comment: { type: Type.STRING, description: "Comment on the inferred mobile user experience (layout, readability, navigation)."}
          },
          required: ["rating", "comment"]
      },
    },
    required: ["cta", "valueProposition", "trustSignals", "contentClarity", "mobileFriendliness"]
};

export const ANALYSIS_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    optimizationScore: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 representing the overall conversion readiness of the page."
    },
    summary: {
      type: Type.STRING,
      description: "A 2-3 sentence executive summary of the CRO analysis."
    },
    adMatchAnalysis: {
      type: Type.OBJECT,
      properties: {
        score: {
          type: Type.INTEGER,
          description: "A score from 0-100 for how well keywords and ads match the landing page."
        },
        feedback: {
          type: Type.STRING,
          description: "Detailed feedback on the ad copy and keyword relevance to the landing page."
        }
      },
      required: ["score", "feedback"]
    },
    conversionElements: CONVERSION_ELEMENTS_SCHEMA,
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        description: "A specific, actionable recommendation for improvement."
      }
    }
  },
  required: ["optimizationScore", "summary", "adMatchAnalysis", "conversionElements", "recommendations"]
};

export const ORGANIC_ANALYSIS_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    optimizationScore: {
      type: Type.INTEGER,
      description: "A score from 0 to 100 representing the overall conversion readiness of the page for an organic visitor."
    },
    summary: {
      type: Type.STRING,
      description: "A 2-3 sentence executive summary of the CRO analysis for a first-time user."
    },
    conversionElements: CONVERSION_ELEMENTS_SCHEMA,
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        description: "A specific, actionable recommendation for improvement."
      }
    }
  },
  required: ["optimizationScore", "summary", "conversionElements", "recommendations"]
}

export const ADS_RESPONSE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        headlines: {
            type: Type.ARRAY,
            description: "10 compelling ad headlines, each under 30 characters.",
            items: { type: Type.STRING }
        },
        descriptions: {
            type: Type.ARRAY,
            description: "4 persuasive ad descriptions, each under 90 characters.",
            items: { type: Type.STRING }
        }
    },
    required: ["headlines", "descriptions"]
};
