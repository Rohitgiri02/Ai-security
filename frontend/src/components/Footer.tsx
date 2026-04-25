import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@clerk/clerk-react';
import { GateXAiLogo } from './GateXAiLogo';

type FooterProps = {
  className?: string;
};

/* ─── Social icons ──────────────────────────────────────────────────────── */
type SocialIconName = 'github' | 'x' | 'linkedin' | 'discord';

const SocialIcons: Record<SocialIconName, React.FC<{ className?: string }>> = {
  github: ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.02c0 4.425 2.865 8.17 6.839 9.504.5.092.682-.217.682-.483 0-.238-.009-.868-.014-1.703-2.782.604-3.369-1.343-3.369-1.343-.455-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.004.071 1.532 1.034 1.532 1.034.892 1.53 2.341 1.088 2.91.832.091-.648.35-1.089.636-1.34-2.22-.253-4.555-1.113-4.555-4.952 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.274.098-2.656 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.851.004 1.706.115 2.505.338 1.909-1.296 2.747-1.026 2.747-1.026.546 1.382.203 2.402.1 2.656.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.92.678 1.855 0 1.338-.012 2.418-.012 2.747 0 .269.18.58.688.481C19.14 20.186 22 16.44 22 12.02 22 6.484 17.523 2 12 2Z" />
    </svg>
  ),
  x: ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-7.06 8.09L23.25 22h-6.74l-5.28-6.9L5.2 22H2l7.64-8.77L.75 2h6.9l4.8 6.33L18.9 2Zm-1.18 18h1.72L6.7 3.92H4.86L17.72 20Z" />
    </svg>
  ),
  linkedin: ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95v5.67H9.32V9h3.42v1.56h.05c.48-.91 1.65-1.86 3.39-1.86 3.63 0 4.3 2.39 4.3 5.49v6.26ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  ),
  discord: ({ className }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  ),
};

/* ─── Social link ─────────────────────────────────────────────────────────── */
const SocialLink: React.FC<{ href: string; label: string; icon: SocialIconName }> = ({ href, label, icon }) => {
  const Icon = SocialIcons[icon];
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-500 transition-all duration-200 hover:border-rose-400/30 hover:bg-rose-400/10 hover:text-rose-300 hover:shadow-[0_0_14px_rgba(251,113,133,0.15)]"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
};

/* ─── Footer link group ───────────────────────────────────────────────────── */
type LinkItem = { href: string; label: string; badge?: string };

const FooterGroup: React.FC<{ title: string; links: LinkItem[] }> = ({ title, links }) => (
  <div>
    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-600">{title}</p>
    <ul className="mt-4 space-y-2.5">
      {links.map((link) => (
        <li key={link.label} className="flex items-center gap-2">
          <a
            href={link.href}
            className="text-sm text-slate-500 transition-colors duration-150 hover:text-rose-300"
          >
            {link.label}
          </a>
          {link.badge && (
            <span className="rounded-full border border-rose-400/20 bg-rose-400/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-400">
              {link.badge}
            </span>
          )}
        </li>
      ))}
    </ul>
  </div>
);

/* ─── Main Footer (Landing page only) ────────────────────────────────────── */
export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const { isSignedIn } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubmitted(true); setEmail(''); }
  };

  const currentYear = new Date().getFullYear();

  const productLinks: LinkItem[] = [
    { href: '#features',     label: 'Features' },
    { href: '#workflow',     label: 'How it works' },
    { href: '#integrations', label: 'Integrations' },
    { href: '/changelog',    label: 'Changelog', badge: 'new' },
  ];

  const accountLinks: LinkItem[] = isSignedIn
    ? [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/settings',  label: 'Settings' },
        { href: '/scans',     label: 'My Scans' },
      ]
    : [
        { href: '/login',    label: 'Sign in' },
        { href: '/sign-up',  label: 'Get started free' },
        { href: '#features', label: 'View pricing' },
      ];

  const resourceLinks: LinkItem[] = [
    { href: '/docs',                    label: 'Documentation' },
    { href: '/blog',                    label: 'Security blog' },
    { href: '/status',                  label: 'System status' },
    { href: 'mailto:support@gatexai.dev', label: 'Support' },
  ];

  return (
    <footer className={`relative border-t border-white/[0.06] bg-[#0d0507] ${className}`}>
      {/* Top rose glow — matches landing page hero/nav accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-rose-500/[0.04] to-transparent pointer-events-none" />

      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-10">
        <div className="grid gap-12 lg:grid-cols-12">

          {/* Brand column */}
          <div className="space-y-6 lg:col-span-4">
            <a href="/">
              <GateXAiLogo iconSize={36} showWordmark={true} />
            </a>

            <p className="max-w-xs text-sm leading-7 text-slate-500">
              AI-powered SAST, secret detection, and dependency risk analysis — built for teams that ship fast and need to ship safe.
            </p>

            {/* Status pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3.5 py-1.5 text-xs font-medium text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              All systems operational
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2">
              <SocialLink href="https://github.com"   label="GitHub"      icon="github"  />
              <SocialLink href="https://x.com"        label="X / Twitter" icon="x"       />
              <SocialLink href="https://linkedin.com" label="LinkedIn"    icon="linkedin" />
              <SocialLink href="https://discord.com"  label="Discord"     icon="discord" />
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <FooterGroup title="Product"   links={productLinks}  />
            <FooterGroup title="Account"   links={accountLinks}  />
            <FooterGroup title="Resources" links={resourceLinks} />
          </div>

          {/* Newsletter column */}
          <div className="space-y-4 lg:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-600">Security digest</p>
            <p className="text-sm leading-6 text-slate-500">
              Weekly insights on AppSec, CI/CD threats, and zero-day alerts — no spam.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/8 px-4 py-3 text-sm text-emerald-300"
              >
                <span>✓</span> You're on the list!
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] focus-within:border-rose-400/30 focus-within:bg-rose-400/[0.03] transition-all duration-200">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder-slate-700 outline-none"
                  />
                  <button
                    type="submit"
                    className="shrink-0 rounded-r-xl bg-gradient-to-r from-rose-500 to-orange-600 px-4 py-2.5 text-xs font-bold text-slate-950 transition-all duration-200 hover:from-rose-400 hover:to-orange-500 hover:shadow-[0_0_16px_rgba(251,113,133,0.3)]"
                  >
                    Subscribe
                  </button>
                </div>
                <p className="text-[11px] text-slate-700">No spam. Unsubscribe anytime.</p>
              </form>
            )}

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {['SOC2', 'GDPR', 'HIPAA'].map((badge) => (
                <span
                  key={badge}
                  className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ──────────────────────────────────────────────────────── */}
        <div className="mt-12 mb-8 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        {/* ── Bottom bar ───────────────────────────────────────────────────── */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-700">
            © {currentYear}{' '}
            <span className="text-slate-600 font-medium">GateXAi</span>. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-700">
            {[
              { href: '/privacy',  label: 'Privacy Policy' },
              { href: '/terms',    label: 'Terms of Service' },
              { href: '/security', label: 'Security' },
              { href: '/cookies',  label: 'Cookies' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors duration-150 hover:text-slate-400"
              >
                {link.label}
              </a>
            ))}
          </div>

          <p className="text-xs text-slate-700">
            Made with{' '}
            <span className="text-rose-500/70">♥</span>{' '}
            for DevSecOps teams
          </p>
        </div>
      </div>
    </footer>
  );
};
