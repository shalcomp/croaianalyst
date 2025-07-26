
import React, { useEffect } from 'react';
import type { UserInput } from '../types';
import { SparklesIcon } from './Icon';
import type { AnalysisType } from '../App';

interface InputFormProps {
  userInput: UserInput;
  setUserInput: React.Dispatch<React.SetStateAction<UserInput>>;
  onAnalyze: () => void;
  isLoading: boolean;
  analysisType: AnalysisType;
  setAnalysisType: React.Dispatch<React.SetStateAction<AnalysisType>>;
}

const TabButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-1/2 py-2.5 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 focus-visible:ring-cyan-500 ${
        isActive
          ? 'bg-cyan-500/20 text-cyan-300'
          : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
      }`}
    >
      {label}
    </button>
  );
};


export const InputForm: React.FC<InputFormProps> = ({ userInput, setUserInput, onAnalyze, isLoading, analysisType, setAnalysisType }) => {
  
  useEffect(() => {
    if (analysisType === 'ORGANIC') {
        setUserInput(prev => ({ ...prev, keywords: '', headlines: '', descriptions: '' }));
    }
  }, [analysisType, setUserInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserInput(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-6 space-y-6">
      <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
        <TabButton 
            label="PPC CRO"
            isActive={analysisType === 'PPC'}
            onClick={() => setAnalysisType('PPC')}
        />
        <TabButton 
            label="Organic CRO"
            isActive={analysisType === 'ORGANIC'}
            onClick={() => setAnalysisType('ORGANIC')}
        />
      </div>

      <div>
        <h2 className="text-lg font-bold text-white">Analysis Inputs</h2>
        <p className="text-sm text-slate-400 mt-1">
          {analysisType === 'PPC' 
            ? 'Provide campaign details to analyze ad-to-landing page relevance.'
            : 'Provide a URL for a general first-time user CRO analysis.'
          }
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-slate-300 mb-1">Website URL*</label>
          <input
            type="url"
            name="url"
            id="url"
            value={userInput.url}
            onChange={handleInputChange}
            className="block w-full bg-slate-700/50 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white p-2.5 border transition-colors focus:bg-slate-700"
            placeholder="https://example.com/landing-page"
            required
          />
        </div>

        {analysisType === 'PPC' && (
          <>
            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-slate-300 mb-1">Target Keywords</label>
              <input
                type="text"
                name="keywords"
                id="keywords"
                value={userInput.keywords}
                onChange={handleInputChange}
                className="block w-full bg-slate-700/50 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white p-2.5 border transition-colors focus:bg-slate-700"
                placeholder="e.g., premium dog food, grain-free kibble"
              />
              <p className="mt-1.5 text-xs text-slate-500">Comma-separated keywords your ad campaign is targeting.</p>
            </div>
            <div>
              <label htmlFor="headlines" className="block text-sm font-medium text-slate-300 mb-1">Ad Headlines</label>
              <textarea
                name="headlines"
                id="headlines"
                rows={2}
                value={userInput.headlines}
                onChange={handleInputChange}
                className="block w-full bg-slate-700/50 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white p-2.5 border transition-colors focus:bg-slate-700"
                placeholder="e.g., Premium Dog Food | 50% Off Today"
              />
            </div>
            <div>
              <label htmlFor="descriptions" className="block text-sm font-medium text-slate-300 mb-1">Ad Descriptions</label>
              <textarea
                name="descriptions"
                id="descriptions"
                rows={3}
                value={userInput.descriptions}
                onChange={handleInputChange}
                className="block w-full bg-slate-700/50 border-slate-600 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-white p-2.5 border transition-colors focus:bg-slate-700"
                placeholder="e.g., Give your best friend the nutrition they deserve."
              />
            </div>
          </>
        )}
      </div>
      <button
        onClick={onAnalyze}
        disabled={isLoading || !userInput.url}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-transparent text-base font-semibold rounded-md shadow-lg text-white bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all transform hover:scale-[1.02]"
      >
        <SparklesIcon className="h-5 w-5"/>
        {isLoading ? 'Analyzing...' : 'Analyze Website'}
      </button>
    </div>
  );
};