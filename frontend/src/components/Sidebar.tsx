import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/add-project', label: 'Add Project' },
  { to: '/settings', label: 'Settings' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 border-r border-white/10 bg-[#060f1acc] backdrop-blur-xl hidden lg:block">
      <div className="p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-4">Workspace</p>
        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'block px-3 py-2 rounded-lg text-sm transition',
                  isActive
                    ? 'bg-blue-500/20 text-blue-200 border border-blue-400/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};
