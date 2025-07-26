
import React, { useState } from 'react';
import type { GeneratedAds } from '../types';
import { Loader } from './Loader';
import { PencilSquareIcon, ClipboardDocumentListIcon, CheckCircleIcon } from './Icon';

interface AdGeneratorProps {
  onGenerate: () => void;
  generatedAds: GeneratedAds | null;
  isLoading: boolean;
}

export const AdGenerator: React.FC<AdGeneratorProps> = ({ onGenerate, generatedAds, isLoading }) => {
  const [copiedItem, setCopiedItem] = useState<{type: 'headline' | 'description', index: number} | null>(null);

  const handleCopy = (text: string, type: 'headline' | 'description', index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedItem({ type, index });
    setTimeout(() => {
        setCopiedItem(null);
    }, 2000);
  };

  const renderCopyButton = (text: string, type: 'headline' | 'description', index: number) => {
    const isCopied = copiedItem?.type === type && copiedItem?.index === index;
    return (
        <button 
            onClick={() => handleCopy(text, type, index)}
            className="text-slate-400 hover:text-cyan-400 transition-colors flex-shrink-0 ml-4"
            aria-label={isCopied ? 'Copied to clipboard' : 'Copy to clipboard'}
        >
            {isCopied ? (
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
            ) : (
                <ClipboardDocumentListIcon className="h-5 w-5" />
            )}
        </button>
    )
  };


  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-6 animate-fade-in-up">
      <h2 className="text-lg font-bold text-white">Generate Ad Copy</h2>
      <p className="text-sm text-slate-400 mt-1">
        Use AI to create conversion-optimized ad copy based on the landing page content.
      </p>

      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border border-cyan-500/50 text-sm font-semibold rounded-md shadow-sm text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all"
      >
        <PencilSquareIcon className="h-5 w-5" />
        {isLoading ? 'Generating...' : 'Generate Optimized Ads'}
      </button>

      {isLoading && <div className="mt-4"><Loader text="Writing ad copy..." /></div>}
      
      {generatedAds && (
        <div className="mt-6 space-y-5 animate-fade-in">
            <div>
                <h3 className="text-base font-semibold text-white">Generated Headlines</h3>
                <ul className="mt-2 space-y-2">
                    {generatedAds.headlines.map((h, i) => 
                        <li key={`h-${i}`} className="bg-slate-900/50 p-3 rounded-md flex justify-between items-center text-slate-300 text-sm border border-slate-700/80">
                           <span>{h}</span>
                           {renderCopyButton(h, 'headline', i)}
                        </li>
                    )}
                </ul>
            </div>
             <div>
                <h3 className="text-base font-semibold text-white">Generated Descriptions</h3>
                <ul className="mt-2 space-y-2">
                    {generatedAds.descriptions.map((d, i) => 
                        <li key={`d-${i}`} className="bg-slate-900/50 p-3 rounded-md flex justify-between items-center text-slate-300 text-sm border border-slate-700/80">
                           <span>{d}</span>
                           {renderCopyButton(d, 'description', i)}
                        </li>
                    )}
                </ul>
            </div>
        </div>
      )}
    </div>
  );
};
