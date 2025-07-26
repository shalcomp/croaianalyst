
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { AdGenerator } from './components/AdGenerator';
import { WelcomeState } from './components/WelcomeState';
import { analyzeWebsite, generateAdCopy } from './services/geminiService';
import type { AnalysisResult, GeneratedAds, UserInput } from './types';
import { ExclamationTriangleIcon } from './components/Icon';

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
    <div className="min-h-screen font-sans">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-4xl font-extrabold tracking-tighter text-white sm:text-5xl lg:text-6xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Don't let customers</span>
                <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-500">slip away</span>
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-400">
                Instantly check if your website is optimized for conversions and get more value from your traffic.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <InputForm 
              userInput={userInput}
              setUserInput={setUserInput}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              analysisType={analysisType}
              setAnalysisType={setAnalysisType}
            />
             {analysisResult && !isLoading && (
               <div className="animate-fade-in-up" style={{animationDelay: '200ms'}}>
                 <AdGenerator 
                  onGenerate={handleGenerateAds}
                  generatedAds={generatedAds}
                  isLoading={isGeneratingAds}
                  />
               </div>
             )}
          </div>
          <div className="lg:col-span-3 lg:sticky lg:top-24">
            {isLoading && <Loader text="AI is analyzing the page... this may take a moment." />}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-lg flex items-center gap-3 animate-fade-in-up">
                <ExclamationTriangleIcon className="h-6 w-6" />
                <span>{error}</span>
              </div>
            )}
            {!isLoading && !analysisResult && !error && <WelcomeState />}
            {analysisResult && <ResultsDisplay result={analysisResult} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
