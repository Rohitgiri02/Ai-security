import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';

/* ─── Icon helpers ────────────────────────────────────────────────────────── */
const BellIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path d="M10 2a6 6 0 0 0-6 6v2.586l-.707.707A1 1 0 0 0 4 13h12a1 1 0 0 0 .707-1.707L16 10.586V8a6 6 0 0 0-6-6ZM10 18a3 3 0 0 1-2.83-2h5.66A3 3 0 0 1 10 18Z" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
    <path fillRule="evenodd" d="M9.661 2.237a.531.531 0 0 1 .678 0 11.947 11.947 0 0 0 7.078 2.749.5.5 0 0 1 .479.425c.069.52.104 1.05.104 1.589 0 5.162-3.26 9.563-7.834 11.256a.48.48 0 0 1-.332 0C5.26 16.563 2 12.162 2 7c0-.538.035-1.069.104-1.589a.5.5 0 0 1 .48-.425 11.947 11.947 0 0 0 7.077-2.749Zm4.196 5.954a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
  </svg>
);

/* ─── Breadcrumb mapping ──────────────────────────────────────────────────── */
const ROUTE_LABELS: Record<string, string> = {
  '/dashboard':  'Dashboard',
  '/projects':   'Projects',
  '/add-project':'New Project',
  '/settings':   'Settings',
  '/scans':      'Scan Reports',
};

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const [hasNotif] = useState(true); // demo state

  const currentLabel = ROUTE_LABELS[location.pathname] ?? 'GateXAi';

  return (
    <header className="flex h-14 items-center justify-between border-b border-white/[0.06] bg-[#050d1a]/90 px-4 backdrop-blur-xl flex-shrink-0 gap-4">

      {/* ── Left: Brand + breadcrumb ───────────────────────────────────────── */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 group flex-shrink-0"
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-[10px] font-black text-slate-950 shadow-[0_0_10px_rgba(34,211,238,0.3)] group-hover:shadow-[0_0_16px_rgba(34,211,238,0.5)] transition-shadow duration-200">
            GX
          </span>
          <span className="text-sm font-bold text-white hidden sm:block tracking-tight">GateXAi</span>
        </button>

        {/* Divider + page label */}
        <div className="flex items-center gap-2 text-slate-600 hidden sm:flex">
          <span className="text-slate-700">/</span>
          <span className="text-xs font-medium text-slate-400 truncate">{currentLabel}</span>
        </div>
      </div>

      {/* ── Center: Status pill ────────────────────────────────────────────── */}
      <div className="hidden md:flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/5 px-3 py-1">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        <span className="text-[10px] font-semibold text-emerald-400 tracking-wide">All systems operational</span>
      </div>

      {/* ── Right: Actions + user ──────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-shrink-0">

        {/* Quick search */}
        <button
          type="button"
          className="hidden sm:flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-500 hover:bg-white/[0.06] hover:text-slate-300 hover:border-white/10 transition-all duration-150"
          title="Search"
        >
          <SearchIcon />
          <span className="hidden lg:block">Search…</span>
          <kbd className="hidden lg:block rounded bg-white/[0.05] px-1 py-0.5 text-[10px] text-slate-600 font-mono">⌘K</kbd>
        </button>

        {/* Add project shortcut */}
        <button
          type="button"
          onClick={() => navigate('/add-project')}
          className="flex items-center gap-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/18 border border-cyan-400/20 hover:border-cyan-400/35 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition-all duration-150"
          title="Add project"
        >
          <PlusIcon />
          <span className="hidden sm:block">New scan</span>
        </button>

        {/* Notification bell */}
        <button
          type="button"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-slate-400 hover:bg-white/[0.07] hover:text-slate-200 transition-all duration-150"
          title="Notifications"
        >
          <BellIcon />
          {hasNotif && (
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
          )}
        </button>

        {/* Vertical divider */}
        <div className="h-5 w-px bg-white/[0.07] hidden sm:block" />

        {/* User section */}
        <SignedIn>
          <div className="flex items-center gap-2.5">
            <div className="hidden text-right lg:block">
              <p className="text-xs font-medium text-slate-300 leading-tight">
                {user?.fullName || user?.username || 'Developer'}
              </p>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <ShieldIcon />
                <p className="text-[10px] text-emerald-400 leading-tight font-medium">Active</p>
              </div>
            </div>
            <div className="ring-1 ring-white/10 rounded-full hover:ring-cyan-400/30 transition-all duration-150">
              <UserButton afterSignOutUrl="/login" />
            </div>
          </div>
        </SignedIn>

        <SignedOut>
          <button
            className="rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/20 hover:border-cyan-400/40 px-4 py-1.5 text-xs font-semibold text-cyan-300 transition-all duration-150"
            onClick={() => navigate('/login')}
            type="button"
          >
            Sign in
          </button>
        </SignedOut>
      </div>
    </header>
  );
};

export { Navbar };
export default Navbar;
