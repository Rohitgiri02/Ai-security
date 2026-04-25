import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignUp } from '@clerk/clerk-react';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: '#030712' }}>

      {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] flex-shrink-0 relative overflow-hidden px-12 py-10">
        {/* Layered background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0a1e] via-[#08061a] to-[#030712]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
        {/* Orbs */}
        <div className="absolute top-[-80px] right-[-60px] w-[380px] h-[380px] rounded-full bg-violet-500/12 blur-[100px]" />
        <div className="absolute bottom-[-80px] left-[-40px] w-[300px] h-[300px] rounded-full bg-cyan-600/8 blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full bg-blue-600/6 blur-[60px]" />
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
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/5 px-3.5 py-1.5 mb-6">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-violet-400">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
              </svg>
              <span className="text-[11px] font-semibold text-violet-300 tracking-wide">Free to start · No credit card</span>
            </div>

            <h1 className="text-4xl xl:text-[2.75rem] font-black text-white leading-[1.08] tracking-tight">
              Your security
              <br />
              <span className="bg-gradient-to-r from-violet-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                command center.
              </span>
            </h1>
            <p className="mt-5 text-slate-400 leading-relaxed text-base max-w-sm">
              Manage all repositories, policies, and release risk dashboards from one place — set up in under 2 minutes.
            </p>
          </div>

          {/* How it works */}
          <div className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600">Get started in 4 steps</p>
            {[
              { n: '1', t: 'Sign up with GitHub or email — free, instant access.' },
              { n: '2', t: 'Connect your first repository in under 2 minutes.' },
              { n: '3', t: 'GateXAi runs an AI scan and delivers an instant risk report.' },
              { n: '4', t: 'Merge the auto-generated PR to enable CI/CD security gates.' },
            ].map(s => (
              <div key={s.n} className="flex items-start gap-3 text-sm text-slate-400">
                <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-violet-500/10 border border-violet-400/20 flex items-center justify-center text-[11px] font-bold text-violet-300 mt-0.5">
                  {s.n}
                </span>
                {s.t}
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600 mb-3">Trusted by teams shipping fast</p>
            <div className="flex flex-wrap gap-2">
              {['Free to start', 'SOC2 Ready', 'GitHub Native', 'GDPR Compliant', 'Zero config CI'].map((b) => (
                <span key={b} className="text-[11px] text-slate-500 border border-white/[0.07] bg-white/[0.02] rounded-full px-3 py-1">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Security metrics mini-panel */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-black text-white">20+</p>
              <p className="text-[11px] text-slate-500">Scan patterns</p>
            </div>
            <div className="h-10 w-px bg-white/[0.07]" />
            <div className="text-center">
              <p className="text-2xl font-black text-white">100%</p>
              <p className="text-[11px] text-slate-500">AI-validated</p>
            </div>
            <div className="h-10 w-px bg-white/[0.07]" />
            <div className="text-center">
              <p className="text-2xl font-black text-white">3–5s</p>
              <p className="text-[11px] text-slate-500">Scan time</p>
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#030712] to-[#050d1a]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-violet-500/4 blur-[120px] pointer-events-none" />

        {/* Mobile logo */}
        <div className="lg:hidden relative z-10 flex items-center gap-2.5 mb-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-400 to-cyan-500 text-[11px] font-black text-slate-950 shadow-[0_0_16px_rgba(139,92,246,0.35)]">GX</span>
            <span className="text-sm font-bold text-white">GateXAi</span>
          </button>
        </div>

        {/* Auth card */}
        <div className="relative z-10 w-full max-w-[420px]">
          <div className="text-center mb-7">
            <h2 className="text-2xl font-bold text-white">Create your account</h2>
            <p className="text-sm text-slate-400 mt-1.5">Start for free — no credit card required</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-[#060e1c]/95 backdrop-blur-xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
            <div className="h-0.5 bg-gradient-to-r from-violet-500/70 via-cyan-500/60 to-blue-500/40" />
            <div className="clerk-shell">
              <SignUp
                path="/sign-up"
                routing="path"
                signInUrl="/login"
                forceRedirectUrl="/dashboard"
                appearance={{
                  layout: {
                    socialButtonsVariant: 'blockButton',
                    socialButtonsPlacement: 'top',
                  },
                  variables: {
                    colorPrimary: '#8b5cf6',
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

          <p className="text-center text-[11px] text-slate-700 mt-5 leading-relaxed px-4">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-violet-400 hover:text-violet-300 transition-colors font-semibold">
              Sign in instead
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
