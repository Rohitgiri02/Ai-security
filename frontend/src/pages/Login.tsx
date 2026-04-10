import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignIn, useAuth } from '@clerk/clerk-react';
import { Footer } from '../components/Footer';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard');
    }
  }, [isSignedIn, navigate]);

  const goToLanding = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-primary text-white relative overflow-hidden flex flex-col">
      <div className="bg-orb bg-orb-one" />
      <div className="bg-orb bg-orb-two" />

      <div className="flex-1 px-6 py-12 md:py-16 flex items-center justify-center relative z-10">
        <div className="w-full max-w-6xl grid gap-6 lg:grid-cols-2 items-stretch">
          <div className="glass-panel h-full p-8 md:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              <p className="text-cyan-300 text-xs tracking-[0.2em] uppercase mb-5">Secure Release Intelligence</p>
              <h1 className="text-4xl lg:text-5xl font-semibold leading-tight mb-5 max-w-xl">
                Ship code with confidence.
              </h1>
              <p className="text-slate-300 mb-8 leading-relaxed max-w-xl">
                Arclight continuously scans every push, validates findings with AI context,
                and gives your team a clear go/no-go decision before production.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="metric-card">
                  <p className="metric-value">98%</p>
                  <p className="metric-label">API cost reduction</p>
                </div>
                <div className="metric-card">
                  <p className="metric-value">100%</p>
                  <p className="metric-label">False positives filtered</p>
                </div>
                <div className="metric-card">
                  <p className="metric-value">20+</p>
                  <p className="metric-label">Security patterns</p>
                </div>
                <div className="metric-card">
                  <p className="metric-value">3-5s</p>
                  <p className="metric-label">Scan turnaround</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel h-full p-8 md:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                  <p className="text-cyan-300 text-xs tracking-[0.2em] uppercase mb-2">Workspace access</p>
                  <h2 className="text-2xl font-semibold mb-2">Sign in to your workspace</h2>
                  <p className="text-slate-300 text-sm leading-relaxed max-w-md">
                    Use your work account to access projects, security policies, and deployment controls.
                  </p>
                </div>

                <button
                  onClick={goToLanding}
                  className="shrink-0 text-sm text-slate-300 transition hover:text-white"
                >
                  Back
                </button>
              </div>

              <div className="clerk-shell flex justify-center">
                <div className="w-full max-w-[420px]">
                  <SignIn
                    path="/login"
                    routing="path"
                    signUpUrl="/sign-up"
                    forceRedirectUrl="/dashboard"
                    appearance={{
                      elements: {
                        socialButtonsRoot: 'grid gap-5 w-full',
                        socialButtonsBlockButton:
                          'w-full min-w-full self-stretch rounded-xl border border-white/10 bg-[#0b1220] px-4 py-3 text-white shadow-none transition hover:bg-white/5 flex items-center justify-start gap-3 text-left',
                        socialButtonsBlockButton__oauth_google:
                          'bg-white text-slate-900 border-white hover:bg-slate-100',
                        socialButtonsBlockButton__oauth_github:
                          'bg-[#161b22] text-white border-white/10 hover:bg-[#0d1117]',
                        socialButtonsBlockButtonText: 'font-semibold flex-1 whitespace-nowrap',
                        socialButtonsProviderIcon: 'opacity-95 shrink-0',
                        dividerLine: 'bg-white/10',
                        dividerText: 'text-slate-500',
                      },
                      variables: {
                        colorPrimary: '#3b82f6',
                        colorBackground: 'rgba(7, 14, 24, 0.45)',
                        colorText: '#f8fafc',
                        colorInputBackground: '#0a1625',
                        colorInputText: '#e2e8f0',
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mt-8 max-w-md">
              If GitHub says external account not found, choose Create account to complete first-time onboarding.
            </p>
          </div>
        </div>
      </div>

      <Footer className="relative z-10" />
    </div>
  );
};
