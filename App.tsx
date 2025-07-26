
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { InputForm } from './components/InputForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { AdGenerator } from './components/AdGenerator';
import { analyzeWebsite, generateAdCopy } from './services/geminiService';
import type { AnalysisResult, GeneratedAds, UserInput } from './types';
import { CheckCircleIcon, ExclamationTriangleIcon } from './components/Icon';

export type AnalysisType = 'PPC' | 'ORGANIC';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput>({
    url: '',
    keywords: '',
    headlines: '',
    descriptions: '',
  });
  const [analysisType, setAnalysisType] = useState<AnalysisType>('PPC');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [generatedAds, setGeneratedAds] = useState<GeneratedAds | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingAds, setIsGeneratingAds] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!userInput.url) {
      setError('Website URL is required for analysis.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setGeneratedAds(null);

    try {
      const result = await analyzeWebsite(userInput, analysisType);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      setError('Failed to analyze the website. The AI may be busy or the URL might be inaccessible. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userInput, analysisType]);

  const handleGenerateAds = useCallback(async () => {
    if (!userInput.url) {
      setError('Website URL is required to generate ads.');
      return;
    }
    setIsGeneratingAds(true);
    setError(null);
    
    try {
        const ads = await generateAdCopy(userInput.url);
        setGeneratedAds(ads);
    } catch (e) {
        console.error(e);
        setError('Failed to generate ad copy. Please try again later.');
    } finally {
        setIsGeneratingAds(false);
    }
  }, [userInput.url]);


  return (
    <div className="min-h-screen text-slate-200 font-sans">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Unlock Your <span className="bg-gradient-to-r from-cyan-400 to-sky-500 bg-clip-text text-transparent">Conversion</span> Potential
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-slate-300">
                Our AI analyzes your landing pages and ad copy to find what's chasing customers away. Stop guessing, start converting.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <InputForm 
              userInput={userInput}
              setUserInput={setUserInput}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              analysisType={analysisType}
              setAnalysisType={setAnalysisType}
            />
             {analysisResult && !isLoading && (
               <AdGenerator 
                onGenerate={handleGenerateAds}
                generatedAds={generatedAds}
                isLoading={isGeneratingAds}
                />
             )}
          </div>
          <div className="lg:sticky lg:top-24">
            {isLoading && <Loader text="AI is analyzing the page... this may take a moment." />}
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3 animate-fade-in">
                <ExclamationTriangleIcon className="h-6 w-6" />
                <span>{error}</span>
              </div>
            )}
            {!isLoading && !analysisResult && !error && (
                 <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-8 text-center animate-fade-in">
                    <CheckCircleIcon className="mx-auto h-12 w-12 text-cyan-400" />
                    <h2 className="mt-4 text-xl font-bold text-white">Ready for Analysis</h2>
                    <p className="mt-2 text-slate-400">
                        Select an analysis type and enter a website URL to begin. The AI will provide a complete conversion optimization analysis.
                    </p>
                </div>
            )}
            {analysisResult && <ResultsDisplay result={analysisResult} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
