
import React from 'react';
import type { AnalysisResult, ConversionElement } from '../types';
import { ScoreCircle } from './ScoreCircle';
import { LightBulbIcon, ClipboardDocumentListIcon, CheckCircleIcon, XCircleIcon, MinusCircleIcon } from './Icon';

interface ResultsDisplayProps {
  result: AnalysisResult;
}

const getRatingIcon = (rating: ConversionElement['rating']) => {
  switch (rating) {
    case 'Excellent':
      return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
    case 'Good':
      return <CheckCircleIcon className="h-5 w-5 text-lime-400" />;
    case 'Needs Improvement':
      return <MinusCircleIcon className="h-5 w-5 text-yellow-400" />;
    case 'Poor':
      return <XCircleIcon className="h-5 w-5 text-red-400" />;
    default:
      return null;
  }
};


const ConversionElementCard: React.FC<{ title: string, data: ConversionElement }> = ({ title, data }) => (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 transition-transform duration-300 hover:-translate-y-1 hover:border-slate-600">
        <div className="flex items-center justify-between">
            <h4 className="font-semibold text-white">{title}</h4>
            <div className="flex items-center gap-2 text-sm">
                {getRatingIcon(data.rating)}
                <span className="font-medium text-slate-300">{data.rating}</span>
            </div>
        </div>
        <p className="text-slate-400 text-sm mt-2">{data.comment}</p>
    </div>
);


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-lg shadow-lg animate-fade-in-up">
        <div className="p-6">
            <h2 className="text-2xl font-bold text-white text-center">Analysis Report</h2>
        </div>
        <div className="p-6 border-y border-slate-700 flex flex-col md:flex-row items-center gap-6 bg-slate-800/30">
            <div className="flex-shrink-0">
                <ScoreCircle score={result.optimizationScore} />
            </div>
            <div className="text-center md:text-left">
                <h3 className="text-lg font-semibold text-white">Overall Summary</h3>
                <p className="text-slate-300 mt-1 max-w-prose">{result.summary}</p>
            </div>
        </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <ClipboardDocumentListIcon className="h-6 w-6 text-cyan-400" />
            Core Conversion Elements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ConversionElementCard title="Call to Action (CTA)" data={result.conversionElements.cta} />
            <ConversionElementCard title="Value Proposition" data={result.conversionElements.valueProposition} />
            <ConversionElementCard title="Content Clarity" data={result.conversionElements.contentClarity} />
            <ConversionElementCard title="Trust Signals" data={result.conversionElements.trustSignals} />
            <ConversionElementCard title="Mobile Friendliness" data={result.conversionElements.mobileFriendliness} />
            {result.adMatchAnalysis && (
                 <div className="bg-slate-800 p-4 rounded-lg md:col-span-2 border border-slate-700">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white">Ad & Page Alignment</h4>
                        <span className="text-sm font-bold text-white bg-cyan-500/20 text-cyan-300 px-2.5 py-1 rounded-full">{result.adMatchAnalysis.score}/100</span>
                    </div>
                    <p className="text-slate-400 text-sm mt-2">{result.adMatchAnalysis.feedback}</p>
                </div>
            )}
        </div>
      </div>
      
      <div className="p-6 border-t border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <LightBulbIcon className="h-6 w-6 text-yellow-300" />
            AI Recommendations
        </h3>
        <ul className="space-y-3">
          {result.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/60 transition-all duration-300 hover:bg-slate-800/70 hover:border-cyan-500/30">
                <span className="text-cyan-400 pt-1 font-bold">&#x2713;</span>
                <span className="text-slate-300 leading-relaxed">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};