import React from 'react';
import { useAuth } from '@clerk/clerk-react';

type FooterProps = {
  className?: string;
};

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const { isSignedIn } = useAuth();

  return (
    <footer className={`border-t border-cyan-500/10 bg-[#020816] ${className}`}>
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
                GXI
              </div>
              <div>
                <p className="text-sm font-semibold text-white">GateXAi</p>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">AI-powered release security</p>
              </div>
            </div>

            <p className="max-w-md text-sm leading-5 text-slate-400">
              Secure your delivery pipeline with AI-assisted scanning and actionable findings.
            </p>

            <div className="flex items-center gap-3">
              <SocialLink href="https://github.com" label="GitHub" icon="github" />
              <SocialLink href="https://x.com" label="X" icon="x" />
              <SocialLink href="https://linkedin.com" label="LinkedIn" icon="linkedin" />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-2">
            <FooterGroup title="Product" links={[{ href: '#features', label: 'Features' }, { href: '#workflow', label: 'Workflow' }]} />
            <FooterGroup
              title="Account"
              links={
                isSignedIn
                  ? [
                      { href: '/dashboard', label: 'Dashboard' },
                      { href: '/settings', label: 'Settings' },
                    ]
                  : [
                      { href: '/login', label: 'Login' },
                      { href: '/sign-up', label: 'Sign up' },
                    ]
              }
            />
          </div>

          <div className="space-y-3 lg:col-span-3">
            <p className="text-sm font-semibold text-white">Get in touch</p>
            <div className="space-y-2 text-sm text-slate-400">
              <p>support@GateXAi.dev</p>
              <p>Built for teams shipping fast.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-white/8 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 Security Analyzer.</p>
          <p>AI-powered release security for modern teams.</p>
        </div>
      </div>
    </footer>
  );
};

type LinkItem = {
  href: string;
  label: string;
};

type FooterGroupProps = {
  title: string;
  links: LinkItem[];
};

const FooterGroup: React.FC<FooterGroupProps> = ({ title, links }) => (
  <div>
    <p className="text-sm font-semibold text-white">{title}</p>
    <div className="mt-3 space-y-2">
      {links.map((link) => (
        <a key={link.label} href={link.href} className="block text-sm text-slate-400 transition hover:text-cyan-300">
          {link.label}
        </a>
      ))}
    </div>
  </div>
);

type SocialIconName = 'github' | 'x' | 'linkedin';

type SocialLinkProps = {
  href: string;
  label: string;
  icon: SocialIconName;
};

const SocialLink: React.FC<SocialLinkProps> = ({ href, label, icon }) => (
  <a
    href={href}
    aria-label={label}
    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/10 bg-white/5 text-slate-300 transition hover:border-cyan-300/30 hover:bg-cyan-400/10 hover:text-cyan-200"
    target="_blank"
    rel="noreferrer"
  >
    {icon === 'github' && (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.02c0 4.425 2.865 8.17 6.839 9.504.5.092.682-.217.682-.483 0-.238-.009-.868-.014-1.703-2.782.604-3.369-1.343-3.369-1.343-.455-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.004.071 1.532 1.034 1.532 1.034.892 1.53 2.341 1.088 2.91.832.091-.648.35-1.089.636-1.34-2.22-.253-4.555-1.113-4.555-4.952 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.274.098-2.656 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.851.004 1.706.115 2.505.338 1.909-1.296 2.747-1.026 2.747-1.026.546 1.382.203 2.402.1 2.656.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.92.678 1.855 0 1.338-.012 2.418-.012 2.747 0 .269.18.58.688.481C19.14 20.186 22 16.44 22 12.02 22 6.484 17.523 2 12 2Z" />
      </svg>
    )}
    {icon === 'x' && (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M18.9 2H22l-7.06 8.09L23.25 22h-6.74l-5.28-6.9L5.2 22H2l7.64-8.77L.75 2h6.9l4.8 6.33L18.9 2Zm-1.18 18h1.72L6.7 3.92H4.86L17.72 20Z" />
      </svg>
    )}
    {icon === 'linkedin' && (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95v5.67H9.32V9h3.42v1.56h.05c.48-.91 1.65-1.86 3.39-1.86 3.63 0 4.3 2.39 4.3 5.49v6.26ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45Z" />
      </svg>
    )}
  </a>
);
