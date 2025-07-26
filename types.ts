
export interface UserInput {
  url: string;
  keywords: string;
  headlines: string;
  descriptions: string;
}

export interface AdMatchAnalysis {
  score: number;
  feedback: string;
}

export interface ConversionElement {
  rating: 'Excellent' | 'Good' | 'Needs Improvement' | 'Poor';
  comment: string;
}

export interface ConversionElements {
  cta: ConversionElement;
  valueProposition: ConversionElement;
  trustSignals: ConversionElement;
  contentClarity: ConversionElement;
  mobileFriendliness: ConversionElement;
}

export interface AnalysisResult {
  optimizationScore: number;
  summary: string;
  adMatchAnalysis?: AdMatchAnalysis;
  conversionElements: ConversionElements;
  recommendations: string[];
}

export interface GeneratedAds {
    headlines: string[];
    descriptions: string[];
}
