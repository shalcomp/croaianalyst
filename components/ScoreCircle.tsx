
import React from 'react';

interface ScoreCircleProps {
  score: number;
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({ score }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getStrokeColor = () => {
    if (score >= 80) return 'stroke-green-400';
    if (score >= 50) return 'stroke-yellow-400';
    return 'stroke-red-400';
  };

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          className="text-slate-700"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
        <circle
          className={`${getStrokeColor()} transition-all duration-1000 ease-out`}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-sm text-slate-400">/ 100</span>
      </div>
    </div>
  );
};
