import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <header className="h-16 border-b border-white/10 bg-[#07101dcc] backdrop-blur-xl px-6 flex items-center justify-between">
      <button className="flex items-center gap-3" type="button" onClick={() => navigate('/dashboard')}>
        <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-black text-xs grid place-items-center">
          ARC
        </span>
        <span className="text-left">
          <span className="block text-sm text-white font-semibold leading-tight">Arclight CI Security</span>
          <span className="block text-[11px] text-slate-400">AI-powered release governance</span>
        </span>
      </button>

      <div className="flex items-center gap-4">
        <SignedIn>
          <>
            <div className="text-right hidden sm:block">
              <p className="text-sm text-slate-200">{user?.fullName || user?.username || 'Developer'}</p>
              <p className="text-xs text-slate-400">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
            <UserButton afterSignOutUrl="/login" />
          </>
        </SignedIn>

        <SignedOut>
          <button
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm"
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
