import React, { useEffect, useState } from 'react';
import { getHistory } from '../services/apiService';
import type { AnalysisHistoryItem } from '../types';
import { Header } from '../components/Header';
import { Loader } from '../components/Loader';
import { ResultsDisplay } from '../components/ResultsDisplay';
import { ClockIcon, ExclamationTriangleIcon, ChevronDownIcon } from '../components/Icon';

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openItemId, setOpenItemId] = useState<number | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (e: any) {
        setError(e.message || 'Failed to fetch analysis history.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);
  
  const toggleItem = (id: number) => {
    setOpenItemId(prevId => (prevId === id ? null : id));
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader text="Loading history..." />;
    }
    if (error) {
      return (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-center gap-3">
          <ExclamationTriangleIcon className="h-6 w-6" />
          <span>{error}</span>
        </div>
      );
    }
    if (history.length === 0) {
      return (
        <div className="text-center bg-slate-800/60 border border-slate-700 rounded-lg p-12">
          <ClockIcon className="mx-auto h-12 w-12 text-slate-500" />
          <h3 className="mt-4 text-xl font-bold text-white">No History Yet</h3>
          <p className="mt-2 text-slate-400">You haven't performed any analyses. Go to the dashboard to get started!</p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {history.map((item) => (
          <div key={item.id} className="bg-slate-800/60 border border-slate-700 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full p-4 text-left flex justify-between items-center hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-expanded={openItemId === item.id}
              aria-controls={`history-item-${item.id}`}
            >
              <div className="flex-grow">
                <p className="font-semibold text-white truncate" title={item.url}>{item.url}</p>
                <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                  <span>Type: <span className="font-medium text-slate-300">{item.analysis_type}</span></span>
                  <span>Date: <span className="font-medium text-slate-300">{new Date(item.created_at).toLocaleString()}</span></span>
                </div>
              </div>
              <ChevronDownIcon className={`h-6 w-6 text-slate-400 transition-transform ${openItemId === item.id ? 'rotate-180' : ''}`} />
            </button>
            {openItemId === item.id && (
              <div id={`history-item-${item.id}`} className="p-4 border-t border-slate-700 animate-fade-in">
                <ResultsDisplay result={item.result} />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-8">Analysis History</h1>
        {renderContent()}
      </main>
    </div>
  );
};

export default HistoryPage;
