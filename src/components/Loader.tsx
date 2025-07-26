import React from 'react';

interface LoaderProps {
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ text = "Loading..."}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 bg-slate-800/60 border border-slate-700 rounded-lg">
      <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent border-solid rounded-full animate-spin"></div>
      <p className="text-slate-300 font-medium">{text}</p>
    </div>
  );
};
