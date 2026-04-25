import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';
import { Footer } from '../components/Footer';
import { GateXAiLogo } from '../components/GateXAiLogo';

/* ─── Data ─────────────────────────────────────────────────────────────── */

const capabilities = [
  {
    title: 'SAST Scanning',
    desc: 'Inspect source paths, patterns, and risky logic before code reaches production.',
    icon: '🔍',
    num: '01',
    color: 'from-rose-500/20 to-rose-500/5',
    border: 'border-rose-400/20',
    glow: 'shadow-rose-500/10',
  },
  {
    title: 'CI/CD Integration',
    desc: 'Run as part of the pipeline so every push gets checked automatically.',
    icon: '⚙️',
    num: '02',
    color: 'from-amber-500/20 to-amber-500/5',
    border: 'border-amber-400/20',
    glow: 'shadow-amber-500/10',
  },
  {
    title: 'AI Remediation',
    desc: 'Turn findings into fixes with context-aware guidance that is easier to act on.',
    icon: '🤖',
    num: '03',
    color: 'from-orange-500/20 to-orange-500/5',
    border: 'border-orange-400/20',
    glow: 'shadow-orange-500/10',
  },
  {
    title: 'Secret Detection',
    desc: 'Catch exposed tokens, credentials, and configuration leaks early.',
    icon: '🔐',
    num: '04',
    color: 'from-pink-500/20 to-pink-500/5',
    border: 'border-pink-400/20',
    glow: 'shadow-pink-500/10',
  },
  {
    title: 'Dependency Risk',
    desc: 'Spot vulnerable packages and prioritize what needs attention first.',
    icon: '📦',
    num: '05',
    color: 'from-amber-500/20 to-amber-500/5',
    border: 'border-amber-400/20',
    glow: 'shadow-amber-500/10',
  },
  {
    title: 'Compliance View',
    desc: 'Keep an audit-friendly trail for SOC2, HIPAA, and internal controls.',
    icon: '📋',
    num: '06',
    color: 'from-emerald-500/20 to-emerald-500/5',
    border: 'border-emerald-400/20',
    glow: 'shadow-emerald-500/10',
  },
];

const metrics = [
  { value: 99.2, suffix: '%', label: 'Signal Precision', icon: '🎯' },
  { value: 4, suffix: ' min', label: 'Time to First Scan', icon: '⚡' },
  { value: 12, suffix: 'x', label: 'Faster Code Reviews', icon: '🚀' },
  { value: 0.2, suffix: 's', label: 'Median Alert Delivery', icon: '📡' },
];

const workflowSteps = [
  {
    title: 'Connect',
    desc: 'Add your repo and let GateXAi watch new commits, pull requests, and release branches.',
    icon: '🔗',
  },
  {
    title: 'Scan',
    desc: 'Analyze secrets, dependency exposure, and code patterns with CI-aware context.',
    icon: '🔎',
  },
  {
    title: 'Prioritize',
    desc: 'Sort findings by severity, reachability, and confidence so the team knows what to fix.',
    icon: '🎯',
  },
  {
    title: 'Ship',
    desc: 'Approve safe code quickly and keep risky changes from slipping into production.',
    icon: '🚀',
  },
];

const integrations = [
  'GitHub', 'GitLab', 'Bitbucket', 'CircleCI', 'GitHub Actions', 'Jenkins', 'Jira', 'Slack',
];

const testimonials = [
  {
    quote: 'GateXAi cut our security review time by 80%. The AI suggestions are genuinely useful, not just noise.',
    name: 'Sarah Chen',
    role: 'Head of Security, Fintech Co.',
    avatar: 'SC',
    color: 'from-rose-400 to-orange-500',
  },
  {
    quote: 'We caught a critical credential leak before it hit production. That single scan paid for itself immediately.',
    name: 'Marcus Rivera',
    role: 'Principal Engineer, SaaS Platform',
    avatar: 'MR',
    color: 'from-violet-400 to-purple-500',
  },
  {
    quote: 'Finally a tool that integrates into our pipeline without slowing us down. The findings are actually actionable.',
    name: 'Priya Nair',
    role: 'DevSecOps Lead, Enterprise Corp.',
    avatar: 'PN',
    color: 'from-emerald-400 to-teal-500',
  },
];

/* ─── Animated Counter ─────────────────────────────────────────────────── */

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(parseFloat(current.toFixed(1)));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Floating Orb ─────────────────────────────────────────────────────── */

function FloatingOrb({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[100px] pointer-events-none ${className}`}
      animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ─── Main Component ───────────────────────────────────────────────────── */

export const Landing: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  };

  const cardVariant: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.94 },
    show: {
      opacity: 1, y: 0, scale: 1,
      transition: { type: 'spring', stiffness: 120, damping: 16 },
    },
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0507] text-slate-200 selection:bg-rose-400/30 overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          isScrolled
            ? 'bg-[#0d0507]/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
            : 'bg-transparent'
        }`}
      >
        {/* Top shimmer line — only when scrolled */}
        {isScrolled && (
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-500/50 to-transparent" />
        )}

        <div className="mx-auto max-w-7xl px-6">
          <div className={`flex items-center justify-between gap-4 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}>

            {/* Logo */}
            <a href="/" className="shrink-0">
              <GateXAiLogo iconSize={36} showWordmark={true} />
            </a>

            {/* Desktop nav */}
            <div className="hidden items-center gap-1 md:flex">
              {/* Status pill */}
              <div className="mr-4 flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-[11px] font-medium text-emerald-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                All systems operational
              </div>

              {/* Links */}
              {[['#features', 'Features'], ['#workflow', 'Workflow'], ['#integrations', 'Integrations']].map(([href, label]) => (
                <a
                  key={label}
                  href={href}
                  className="relative rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition-colors duration-200 hover:text-white group"
                >
                  {label}
                  <span className="absolute inset-x-2 -bottom-px h-px scale-x-0 bg-gradient-to-r from-rose-400 to-orange-400 transition-transform duration-200 group-hover:scale-x-100" />
                </a>
              ))}

              <div className="mx-3 h-5 w-px bg-white/10" />

              <a
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition-colors duration-200 hover:text-white"
              >
                Sign in
              </a>
              <a
                href="/login"
                className="relative ml-1 inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-rose-500 to-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition-all duration-300 hover:shadow-rose-500/40 hover:scale-[1.03]"
              >
                <span className="relative">Start Free</span>
                <span className="relative text-rose-200">→</span>
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-300 transition hover:border-rose-400/20 hover:bg-rose-400/10 hover:text-rose-300 md:hidden"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          <motion.div
            initial={false}
            animate={mobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden md:hidden"
          >
            <div className="rounded-2xl border border-white/8 bg-[#180909]/95 p-4 mb-4 shadow-2xl backdrop-blur-2xl">
              <div className="mb-3 flex items-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2 text-xs text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live monitoring active
              </div>
              <div className="flex flex-col gap-1 text-sm font-medium">
                {[['#features', 'Features'], ['#workflow', 'Workflow'], ['#integrations', 'Integrations']].map(([href, label]) => (
                  <a key={label} href={href} onClick={closeMobileMenu}
                    className="rounded-xl px-4 py-2.5 text-slate-300 transition hover:bg-rose-400/10 hover:text-rose-200">
                    {label}
                  </a>
                ))}
                <div className="my-1 h-px bg-white/6" />
                <a href="/login" onClick={closeMobileMenu}
                  className="rounded-xl px-4 py-2.5 text-slate-300 transition hover:bg-rose-400/10 hover:text-rose-200">
                  Sign in
                </a>
                <a href="/login" onClick={closeMobileMenu}
                  className="mt-1 rounded-xl bg-gradient-to-r from-rose-500 to-orange-600 px-4 py-2.5 text-center font-bold text-white">
                  Start Free Trial →
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-20 pt-32 sm:pt-40 lg:pt-48">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          {/* Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />
          {/* Radial fade on grid */}
          <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,black,transparent)]" />
          {/* Orbs */}
          <FloatingOrb className="left-1/2 top-0 h-[40rem] w-[40rem] -translate-x-1/2 bg-rose-500/15" />
          <FloatingOrb className="right-[-10rem] top-[8rem] h-[28rem] w-[28rem] bg-orange-600/12" />
          <FloatingOrb className="left-[-8rem] top-[16rem] h-[24rem] w-[24rem] bg-violet-600/8" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-12 lg:items-center">
          {/* Left copy */}
          <motion.div
            className="lg:col-span-6 xl:col-span-7"
            initial="hidden"
            animate="show"
            variants={stagger}
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-rose-300 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-300 opacity-80" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-400" />
              </span>
              v2.0 — Now Live
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUp} className="mt-6 text-[2.75rem] font-black leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-[4.5rem]">
              Ship secure code{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-rose-300 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                  without the guesswork
                </span>
                <span className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-rose-400/60 via-amber-400/40 to-transparent" />
              </span>
            </motion.h1>

            {/* Subhead */}
            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg leading-8 text-slate-400 sm:text-xl">
              GateXAi gives your team AI-assisted vulnerability scanning, clear prioritization, and a polished review flow—so every release is a confident release.
            </motion.p>

            {/* CTA row */}
            <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href="/login"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-rose-400 to-orange-500 px-7 py-4 text-sm font-bold text-slate-950 shadow-[0_16px_40px_rgba(34,211,238,0.25)] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(34,211,238,0.4)] hover:scale-105"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-rose-300 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative">Continue with GitHub</span>
                <span className="relative" aria-hidden="true">→</span>
              </a>
              <a
                href="#workflow"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-rose-400/30 hover:bg-rose-400/8 hover:text-rose-200"
              >
                Watch the demo
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </a>
            </motion.div>

            {/* Trust pills */}
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: '✓', text: 'GitHub Actions ready' },
                { icon: '✓', text: 'Zero-noise findings' },
                { icon: '✓', text: 'SOC2 compliant' },
                { icon: '✓', text: 'Built for fast teams' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.03] px-3.5 py-1.5 text-xs text-slate-400">
                  <span className="text-rose-400">{item.icon}</span> {item.text}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — live dashboard card */}
          <motion.div
            className="lg:col-span-6 xl:col-span-5"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
          >
            <div className="relative">
              {/* Glow halo behind card */}
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-rose-500/20 via-orange-500/10 to-violet-500/10 blur-2xl -z-10" />

              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#160809] p-5 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                {/* Top shimmer line */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose-400/70 to-transparent" />

                {/* Header row */}
                <div className="flex items-center justify-between border-b border-white/6 pb-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-rose-400">Live Analysis</p>
                    <p className="mt-0.5 text-sm text-slate-400">acme/payments-api · main</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                    <span className="text-xs font-semibold text-emerald-300">Scanning…</span>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {/* Posture card */}
                  <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-white">Security Posture</p>
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">4 issues triaged</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Risk Score', value: '21', sub: '↓ 18 pts this week', subColor: 'text-emerald-400' },
                        { label: 'Confidence', value: '96%', sub: 'AI verified', subColor: 'text-rose-400' },
                      ].map((stat) => (
                        <div key={stat.label} className="rounded-xl bg-[#1e0c0c] p-3">
                          <p className="text-[10px] uppercase tracking-widest text-slate-500">{stat.label}</p>
                          <p className="mt-1.5 text-2xl font-black text-white">{stat.value}</p>
                          <p className={`mt-1 text-[11px] font-medium ${stat.subColor}`}>{stat.sub}</p>
                        </div>
                      ))}
                    </div>
                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="mb-1.5 flex justify-between text-[10px] text-slate-500">
                        <span>Scan progress</span><span>78%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-rose-400 to-orange-500"
                          initial={{ width: '0%' }}
                          animate={{ width: '78%' }}
                          transition={{ duration: 1.8, delay: 0.5, ease: 'easeInOut' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Findings row */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Secret Scan', value: '1 token', sub: 'Removed before merge', color: 'text-rose-400', bgColor: 'bg-rose-400/5 border-rose-400/15' },
                      { label: 'Dependencies', value: '3 packages', sub: 'Prioritized by risk', color: 'text-amber-400', bgColor: 'bg-amber-400/5 border-amber-400/15' },
                    ].map((item) => (
                      <div key={item.label} className={`rounded-2xl border ${item.bgColor} p-3`}>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500">{item.label}</p>
                        <p className={`mt-1.5 text-sm font-bold ${item.color}`}>{item.value}</p>
                        <p className="mt-1 text-[11px] text-slate-500">{item.sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* AI suggestion card */}
                  <div className="rounded-2xl border border-rose-400/15 bg-gradient-to-br from-rose-400/8 to-orange-600/8 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">🤖</span>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-rose-300">AI Recommendation</p>
                    </div>
                    <p className="text-sm leading-6 text-slate-300">
                      Block this release. Patch the credential leak in <code className="rounded bg-white/8 px-1 py-0.5 text-xs text-rose-300">config/env.js</code> and rerun the pipeline.
                    </p>
                  </div>
                </div>

                {/* Bottom shimmer line */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-orange-400/30 to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── METRICS BAR ─────────────────────────────────────────────────── */}
      <section className="relative px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {metrics.map((m) => (
              <motion.div
                key={m.label}
                variants={cardVariant}
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm hover:border-rose-400/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-rose-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <p className="text-3xl mb-1">{m.icon}</p>
                <p className="mt-1 text-3xl font-black tracking-tight text-white">
                  <AnimatedCounter target={m.value} suffix={m.suffix} />
                </p>
                <p className="mt-1.5 text-sm text-slate-400">{m.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── INTEGRATIONS STRIP ──────────────────────────────────────────── */}
      <section id="integrations" className="border-t border-white/5 px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Integrates with your stack</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {integrations.map((name) => (
                <div
                  key={name}
                  className="rounded-xl border border-white/8 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:border-rose-400/25 hover:bg-rose-400/5 hover:text-slate-200 cursor-default"
                >
                  {name}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES GRID ───────────────────────────────────────────────── */}
      <section id="features" className="border-t border-white/5 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="max-w-2xl"
          >
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">Capabilities</motion.p>
            <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Everything your team needs to{' '}
              <span className="bg-gradient-to-r from-rose-300 to-orange-400 bg-clip-text text-transparent">ship with confidence</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-5 text-lg leading-8 text-slate-400">
              Six purpose-built tools, one unified platform. Clean signal, zero fluff.
            </motion.p>
          </motion.div>

          <motion.div
            className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {capabilities.map((item) => (
              <motion.div
                key={item.title}
                variants={cardVariant}
                className={`group relative overflow-hidden rounded-[1.5rem] border ${item.border} bg-gradient-to-br ${item.color} p-6 shadow-lg ${item.glow} transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-default`}
              >
                {/* Corner shine */}
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/5 blur-2xl group-hover:bg-white/10 transition-all duration-300" />

                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-600">{item.num}</span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400 group-hover:text-slate-300 transition-colors duration-300">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── WORKFLOW ────────────────────────────────────────────────────── */}
      <section id="workflow" className="border-t border-white/5 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-12 lg:items-start">
            <motion.div
              className="lg:col-span-4"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={stagger}
            >
              <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">Workflow</motion.p>
              <motion.h2 variants={fadeUp} className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                From repo to release in four clean steps
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-5 leading-7 text-slate-400">
                Straightforward by design. It mirrors the actual security flow your team needs—without the overhead.
              </motion.p>

              <motion.a
                variants={fadeUp}
                href="/login"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-400 to-orange-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105 transition-all duration-200"
              >
                Get started free →
              </motion.a>
            </motion.div>

            <motion.div
              className="lg:col-span-8 grid gap-4 sm:grid-cols-2"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {workflowSteps.map((step, i) => (
                <motion.div
                  key={step.title}
                  variants={cardVariant}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-white/8 bg-[#17080a] p-6 hover:border-rose-400/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-400/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-400/15 bg-rose-400/5 text-xl">
                      {step.icon}
                    </span>
                    <span className="text-2xl font-black text-slate-800/80">0{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  <p className="mt-2.5 text-sm leading-6 text-slate-400 group-hover:text-slate-300 transition-colors">{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>


      {/* ── CTA BANNER ──────────────────────────────────────────────────── */}
      <section className="border-t border-white/5 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-[2rem] p-px"
          >
            {/* Gradient border */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-rose-400/30 via-orange-500/20 to-violet-500/20" />
            <div className="relative rounded-[calc(2rem-1px)] bg-[#17080a] px-8 py-14 sm:px-14">
              {/* Background blobs inside CTA */}
              <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-rose-500/8 blur-3xl pointer-events-none" />
              <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-orange-600/8 blur-3xl pointer-events-none" />

              <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">Ready to ship smarter?</p>
                  <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                    Give your release pipeline a{' '}
                    <span className="bg-gradient-to-r from-rose-300 to-orange-400 bg-clip-text text-transparent">
                      cleaner security story
                    </span>
                  </h2>
                  <p className="mt-4 max-w-xl leading-7 text-slate-400">
                    Join engineering teams that trust GateXAi to keep vulnerabilities out and confidence high—from the first commit to production.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:flex-col lg:items-end">
                  <a
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-400 to-orange-500 px-8 py-4 text-sm font-bold text-slate-950 shadow-[0_20px_60px_rgba(34,211,238,0.3)] hover:shadow-[0_24px_70px_rgba(34,211,238,0.45)] hover:scale-105 transition-all duration-300"
                  >
                    Start free trial →
                  </a>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-8 py-4 text-sm font-semibold text-white hover:border-rose-400/25 hover:bg-rose-400/8 hover:text-rose-200 transition-all duration-300"
                  >
                    Explore all features
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
