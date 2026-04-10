import React from 'react';
import { useAuth } from '@clerk/clerk-react';

type FooterProps = {
  className?: string;
};

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const { isSignedIn } = useAuth();

  return (
    <footer className={`border-t border-cyan-500/10 bg-[#020816] ${className}`}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-white">SecurityAnalyzer</p>
          <p className="text-sm text-slate-500">AI-powered release security for modern teams.</p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-slate-400">
          <a href="#features" className="transition hover:text-cyan-300">Features</a>
          {isSignedIn ? (
            <>
              <a href="/dashboard" className="transition hover:text-cyan-300">Dashboard</a>
              <a href="/settings" className="transition hover:text-cyan-300">Settings</a>
            </>
          ) : (
            <>
              <a href="/login" className="transition hover:text-cyan-300">Login</a>
              <a href="/sign-up" className="transition hover:text-cyan-300">Sign up</a>
            </>
          )}
        </div>

        <p className="text-sm text-slate-500">Copyright 2026 Security Analyzer.</p>
      </div>
    </footer>
  );
};
