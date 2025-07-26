import type { UserInput, AnalysisResult, GeneratedAds } from "../types";
import type { AnalysisType } from "../App";

const apiEndpoint = '/api/gemini';

async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred on the server.' }));
    console.error("API Error:", errorData);
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
  return response.json();
}

export const analyzeWebsite = async (userInput: UserInput, analysisType: AnalysisType): Promise<AnalysisResult> => {
  console.log(`Requesting ${analysisType} website analysis from API...`);

  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'analyze',
      payload: { userInput, analysisType }
    })
  });

  const result = await handleApiResponse<AnalysisResult>(response);
  console.log("Received analysis from API:", result);
  return result;
};


export const generateAdCopy = async (url: string): Promise<GeneratedAds> => {
    console.log("Requesting ad copy generation from API...");
    
    const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateAds',
          payload: { url }
        })
    });
    
    const result = await handleApiResponse<GeneratedAds>(response);
    console.log("Received generated ads from API:", result);
    return result;
}
