import type { UserInput, AnalysisResult, GeneratedAds, AnalysisHistoryItem, AnalysisType } from '../types';

const getAuthToken = () => localStorage.getItem('token');

const handleResponse = async (response: Response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
}

export const login = async (email: string, password: string): Promise<{token: string, user: {id: number, email: string}}> => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
};

export const register = async (email: string, password: string) => {
    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
};

export const analyzeWebsite = async (userInput: UserInput, analysisType: AnalysisType): Promise<AnalysisResult> => {
    const token = getAuthToken();
    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userInput, analysisType }),
    });
    return handleResponse(response);
};


export const generateAdCopy = async (url: string): Promise<GeneratedAds> => {
    const token = getAuthToken();
    const response = await fetch('/api/ads', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url }),
    });
    return handleResponse(response);
}

export const getHistory = async (): Promise<AnalysisHistoryItem[]> => {
    const token = getAuthToken();
    const response = await fetch('/api/history', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return handleResponse(response);
}