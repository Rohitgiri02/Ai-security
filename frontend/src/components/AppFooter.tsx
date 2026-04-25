import React from 'react';

/**
 * Slim footer for the authenticated app shell.
 * Matches the sidebar/navbar dark surface exactly — same background,
 * same border token, same muted text tone.
 */
export const AppFooter: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="flex-shrink-0 border-t border-white/[0.06] bg-[#050d1a]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-6 md:px-8">
        {/* Left — brand + year */}
        <p className="text-[11px] text-slate-600">
          © {year}{' '}
          <span className="text-slate-500 font-medium">GateXAi</span>
          <span className="hidden sm:inline"> · AI-powered release governance</span>
        </p>

        {/* Right — status dot */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline text-emerald-600">Systems online</span>
        </div>
      </div>
    </footer>
  );
};
