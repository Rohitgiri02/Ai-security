import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignUp } from '@clerk/clerk-react';
import { Footer } from '../components/Footer';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary text-white relative overflow-hidden flex flex-col">
      <div className="bg-orb bg-orb-one" />
      <div className="bg-orb bg-orb-two" />

      <div className="flex-1 px-6 py-12 md:py-16 flex items-center justify-center relative z-10">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="glass-panel p-10 lg:p-12">
            <p className="text-cyan-300 text-xs tracking-[0.2em] uppercase mb-5">Workspace Onboarding</p>
            <h1 className="text-4xl lg:text-5xl font-semibold leading-tight mb-5">
              Create your secure workspace.
            </h1>
            <p className="text-slate-300 mb-8 leading-relaxed">
              Set up your account once and manage all repositories, policies, and release risk dashboards from one place.
            </p>

            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              Already have an account? Sign in
            </button>
          </div>

          <div className="glass-panel p-10 lg:p-12 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Create account</h2>
              <p className="text-slate-300 text-sm mb-8">
                Use GitHub or email to start using the platform.
              </p>

              <div className="clerk-shell">
                <SignUp
                  path="/sign-up"
                  routing="path"
                  signInUrl="/login"
                  forceRedirectUrl="/dashboard"
                  appearance={{
                    elements: {
                      socialButtonsRoot: 'grid gap-3',
                      socialButtonsBlockButton:
                        'rounded-xl border border-white/10 bg-[#0b1220] text-white shadow-none transition hover:bg-white/5',
                      socialButtonsBlockButton__oauth_google:
                        'bg-white text-slate-900 border-white hover:bg-slate-100',
                      socialButtonsBlockButton__oauth_github:
                        'bg-[#161b22] text-white border-white/10 hover:bg-[#0d1117]',
                      socialButtonsBlockButtonText: 'font-semibold',
                      socialButtonsProviderIcon: 'opacity-95',
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

            <p className="text-xs text-slate-400 leading-relaxed mt-8">
              By creating an account, you agree to enterprise security policy enforcement and audit logging.
            </p>
          </div>
        </div>
      </div>

      <Footer className="relative z-10" />
    </div>
  );
};
