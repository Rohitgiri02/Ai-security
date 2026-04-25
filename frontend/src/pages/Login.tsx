import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignIn, useAuth } from '@clerk/clerk-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) navigate('/dashboard');
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: '#030712' }}>

      {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] flex-shrink-0 relative overflow-hidden px-12 py-10">
        {/* Layered background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#060e1c] to-[#030712]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        {/* Orbs */}
        <div className="absolute top-[-100px] left-[-60px] w-[420px] h-[420px] rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute bottom-[-80px] right-[-60px] w-[320px] h-[320px] rounded-full bg-blue-600/10 blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-violet-600/8 blur-[60px]" />
        {/* Right edge fade */}
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#030712] to-transparent" />

        {/* Logo */}
        <div className="relative z-10">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-400 to-cyan-500 text-[12px] font-black text-slate-950 shadow-[0_0_20px_rgba(139,92,246,0.4)] group-hover:shadow-[0_0_28px_rgba(139,92,246,0.55)] transition-shadow duration-300">
              GX
            </span>
            <div>
              <p className="text-sm font-bold text-white leading-tight">GateXAi</p>
              <p className="text-[10px] text-slate-500">AI Release Governance</p>
            </div>
          </button>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3.5 py-1.5 mb-6">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
              </span>
              <span className="text-[11px] font-semibold text-cyan-300 tracking-wide">Live · All systems operational</span>
            </div>

            <h1 className="text-4xl xl:text-[2.75rem] font-black text-white leading-[1.08] tracking-tight">
              Ship secure code
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-400 bg-clip-text text-transparent">
                without guesswork.
              </span>
            </h1>
            <p className="mt-5 text-slate-400 leading-relaxed text-base max-w-sm">
              AI-powered SAST scanning that gives every push a clear security verdict — before it hits production.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: '99.2%', label: 'Precision' },
              { val: '< 5s',  label: 'Per scan' },
              { val: '0',     label: 'False positives' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 text-center">
                <p className="text-xl font-black text-white">{s.val}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Feature checks */}
          <div className="space-y-3">
            {[
              'GitHub Actions ready — zero config',
              'SAST + secret + dependency scanning',
              'AI-guided fix suggestions per issue',
              'SOC2-ready audit trail built in',
            ].map(f => (
              <div key={f} className="flex items-center gap-3 text-sm text-slate-400">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/15 border border-cyan-400/25 flex items-center justify-center">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-cyan-400">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                  </svg>
                </span>
                {f}
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <p className="text-sm text-slate-300 leading-relaxed italic">
              "GateXAi caught a critical credential leak before it hit production. That single scan paid for itself immediately."
            </p>
            <div className="flex items-center gap-2.5 mt-4">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">MR</div>
              <div>
                <p className="text-xs font-semibold text-white">Marcus Rivera</p>
                <p className="text-[11px] text-slate-500">Principal Engineer, SaaS Platform</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-[11px] text-slate-700">© {new Date().getFullYear()} GateXAi · <span className="hover:text-slate-500 cursor-pointer transition-colors">Privacy</span></p>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center relative px-5 py-10 min-h-screen">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#030712] to-[#050d1a]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/4 blur-[120px] pointer-events-none" />

        {/* Mobile logo */}
        <div className="lg:hidden relative z-10 flex items-center gap-2.5 mb-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-[11px] font-black text-slate-950 shadow-[0_0_16px_rgba(34,211,238,0.35)]">GX</span>
            <span className="text-sm font-bold text-white">GateXAi</span>
          </button>
        </div>

        {/* Auth card */}
        <div className="relative z-10 w-full max-w-[420px]">
          {/* Header above card */}
          <div className="text-center mb-7">
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="text-sm text-slate-400 mt-1.5">Sign in to your security workspace</p>
          </div>

          {/* Clerk card wrapper */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#060e1c]/95 backdrop-blur-xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
            <div className="h-0.5 bg-gradient-to-r from-cyan-500/70 via-blue-500/60 to-violet-500/40" />
            {/* px-7 pt-6 gives the form padding; footer extends edge-to-edge */}
            <div className="px-7 pt-6">
              <div className="clerk-shell">
                <SignIn
                  path="/login"
                  routing="path"
                  signUpUrl="/sign-up"
                  forceRedirectUrl="/dashboard"
                  appearance={{
                    layout: {
                      socialButtonsVariant: 'blockButton',
                      socialButtonsPlacement: 'top',
                    },
                    elements: {
                      rootBox: 'w-full',
                      card: 'w-full shadow-none bg-transparent border-none rounded-none p-0',
                      header: 'hidden',
                      main: 'gap-4',
                      socialButtonsRoot: 'flex flex-col gap-2.5 w-full',
                      footerAction: 'justify-center',
                    },
                    variables: {
                      colorPrimary: '#22d3ee',
                      colorBackground: 'transparent',
                      colorText: '#f8fafc',
                      colorTextSecondary: '#94a3b8',
                      colorInputBackground: 'rgba(255,255,255,0.05)',
                      colorInputText: '#e2e8f0',
                      colorDanger: '#fb7185',
                      borderRadius: '0.75rem',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: '14px',
                    },
                  }}
                />
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] text-slate-700 mt-5 leading-relaxed px-4">
            New to GateXAi?{' '}
            <button onClick={() => navigate('/sign-up')} className="text-cyan-500 hover:text-cyan-400 transition-colors font-semibold">
              Create a free account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
