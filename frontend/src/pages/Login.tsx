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

      <div className="flex-1 px-6 flex items-center justify-center relative z-10">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="glass-panel p-10 lg:p-12">
            <p className="text-cyan-300 text-xs tracking-[0.2em] uppercase mb-5">Secure Release Intelligence</p>
            <h1 className="text-4xl lg:text-5xl font-semibold leading-tight mb-5">
              Ship code with confidence.
            </h1>
            <p className="text-slate-300 mb-8 leading-relaxed">
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

          <div className="glass-panel p-10 lg:p-12 flex flex-col justify-between">
            <div>
              <button
                onClick={goToLanding}
                className="text-slate-300 hover:text-white text-sm transition mb-10"
              >
                Back to landing
              </button>

              <h2 className="text-2xl font-semibold mb-2">Sign in to your workspace</h2>
              <p className="text-slate-300 text-sm mb-8">
                Use your work account to access projects, security policies, and deployment controls.
              </p>

              <div className="clerk-shell">
                <SignIn
                  path="/login"
                  routing="path"
                  signUpUrl="/sign-up"
                  forceRedirectUrl="/dashboard"
                  appearance={{
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
              If GitHub says external account not found, choose Create account to complete first-time onboarding.
            </p>
          </div>
        </div>
      </div>

      <Footer className="relative z-10" />
    </div>
  );
};
