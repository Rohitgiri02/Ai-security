import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

const links = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4.5 h-4.5 flex-shrink-0" style={{ width: '18px', height: '18px' }}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    ),
  },
  {
    to: '/add-project',
    label: 'Add Project',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="flex-shrink-0" style={{ width: '18px', height: '18px' }}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
      </svg>
    ),
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="flex-shrink-0" style={{ width: '18px', height: '18px' }}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-60 border-r border-white/[0.06] bg-[#050d1a]/90 backdrop-blur-xl hidden lg:flex flex-col">
      {/* Top brand area */}
      <div className="px-5 pt-6 pb-4 border-b border-white/[0.06]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">Workspace</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-400/20 shadow-[0_0_12px_rgba(34,211,238,0.08)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={cn('transition-colors duration-200', isActive ? 'text-cyan-300' : 'text-slate-500 group-hover:text-slate-300')}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom status bar */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="rounded-xl bg-emerald-500/[0.07] border border-emerald-400/15 px-3 py-2.5 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <div>
            <p className="text-[11px] font-semibold text-emerald-300">Systems Online</p>
            <p className="text-[10px] text-slate-500 mt-0.5">AI scanner active</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
