
import React from 'react';
import type { GeneratedAds } from '../../types';
import { Loader } from './Loader';
import { PencilSquareIcon } from './Icon';

interface AdGeneratorProps {
  onGenerate: () => void;
  generatedAds: GeneratedAds | null;
  isLoading: boolean;
}

export const AdGenerator: React.FC<AdGeneratorProps> = ({ onGenerate, generatedAds, isLoading }) => {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-6">
      <h2 className="text-lg font-bold text-white">Generate Ad Copy</h2>
      <p className="text-sm text-slate-400 mt-1">
        Use AI to create conversion-optimized ad copy based on the landing page content.
      </p>

      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-cyan-900 bg-cyan-400 hover:bg-cyan-300 disabled:bg-slate-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all"
      >
        <PencilSquareIcon className="h-5 w-5" />
        {isLoading ? 'Generating...' : 'Generate Optimized Ads'}
      </button>

      {isLoading && <div className="mt-4"><Loader text="Writing ad copy..." /></div>}
      
      {generatedAds && (
        <div className="mt-6 space-y-4 animate-fade-in">
            <div>
                <h3 className="text-base font-semibold text-white">Generated Headlines</h3>
                <ul className="mt-2 space-y-2 list-disc list-inside text-slate-300">
                    {generatedAds.headlines.map((h, i) => <li key={i} className="bg-slate-900/50 p-2 rounded-md">{h}</li>)}
                </ul>
            </div>
             <div>
                <h3 className="text-base font-semibold text-white">Generated Descriptions</h3>
                <ul className="mt-2 space-y-2 list-disc list-inside text-slate-300">
                    {generatedAds.descriptions.map((d, i) => <li key={i} className="bg-slate-900/50 p-2 rounded-md">{d}</li>)}
                </ul>
            </div>
        </div>
      )}
    </div>
  );
};