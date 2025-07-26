import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ChartBarIcon } from './Icon';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-slate-900/70 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <ChartBarIcon className="h-8 w-8 text-cyan-400" />
            <span className="text-xl font-bold text-white tracking-tight">CRO AI Analyst</span>
          </Link>
          <div className="flex items-center gap-6">
            {user && (
                <>
                    <nav className="flex items-center gap-4">
                        <Link to="/" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">Dashboard</Link>
                        <Link to="/history" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">History</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-400 hidden sm:block">Welcome, {user.email}</span>
                      <button
                          onClick={logout}
                          className="text-sm font-medium text-slate-400 hover:text-cyan-400 transition-colors"
                      >
                          Logout
                      </button>
                    </div>
                </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
