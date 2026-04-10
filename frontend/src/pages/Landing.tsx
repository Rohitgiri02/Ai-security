import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { FeatureSlider } from '../components/Feature';
import { Footer } from '../components/Footer';

export const Landing: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const workflowContainer: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.08,
      },
    },
  };

  const workflowCard: Variants = {
    hidden: { opacity: 0, y: 48, scale: 0.88, rotateX: -18 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 130,
        damping: 14,
        mass: 0.9,
      },
    },
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050816] text-slate-200 selection:bg-cyan-400/30">
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#050816]/92 backdrop-blur-xl shadow-[0_1px_0_rgba(34,211,238,0.12),0_12px_30px_rgba(0,0,0,0.28)] py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between gap-4">
            <a href="/" className="flex items-center gap-3 font-bold tracking-tight text-white">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-300 to-blue-500 flex items-center justify-center text-slate-950 text-sm shadow-lg shadow-cyan-500/20">
                S
              </div>
              <span className="leading-tight">
                <span className="block text-lg">SecurityAnalyzer</span>
                <span className="block text-xs font-medium text-slate-400">AI-powered release security</span>
              </span>
            </a>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <a href="#features" className="hover:text-cyan-300 transition">Features</a>
              <a href="#workflow" className="hover:text-cyan-300 transition">Workflow</a>
              <a
                href="/login"
                className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-full transition shadow-lg shadow-cyan-500/20"
              >
                Start Free Trial
              </a>
            </div>

            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-xl border border-cyan-400/15 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-cyan-400/10"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? 'Close' : 'Menu'}
            </button>
          </div>

          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${
              mobileMenuOpen ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="rounded-2xl border border-cyan-400/10 bg-[#08111f]/95 backdrop-blur-xl p-4 shadow-2xl shadow-black/20">
              <div className="flex flex-col gap-3 text-sm font-medium text-slate-300">
                <a href="#features" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-cyan-400/10 hover:text-cyan-200 transition">
                  Features
                </a>
                <a href="#workflow" onClick={closeMobileMenu} className="rounded-lg px-3 py-2 hover:bg-cyan-400/10 hover:text-cyan-200 transition">
                  Workflow
                </a>
                <a
                  href="/login"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-3 py-2 bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition"
                >
                  Start Free Trial
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-48 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-24 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-xs font-bold uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            v2.0 Now Live
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight text-white leading-[1.1]">
            Ship secure code <br />
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              without the friction
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Eliminate vulnerabilities before they reach production. Our AI contextually understands your logic to provide zero-noise security analysis.
          </p>

          <div id="cta" className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-cyan-400 text-slate-950 rounded-xl font-bold transition hover:bg-cyan-300 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" className="w-5 h-5 invert" alt="" />
              Continue with GitHub
            </a>
            <button className="w-full sm:w-auto px-8 py-4 bg-slate-900/50 text-white rounded-xl font-bold border border-cyan-400/15 hover:bg-slate-900/80 hover:border-cyan-400/30 transition">
              View Demo
            </button>
          </div>
        </div>
      </section>

      <section id="features" className="px-6 py-0 border-t border-cyan-500/10">
        <FeatureSlider />
      </section>

      <section id="workflow" className="px-6 py-24 border-t border-cyan-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300 mb-3">Workflow</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">From repo to release in four clear steps</h2>
            <p className="text-slate-300 leading-relaxed">
              SecurityAnalyzer fits into your existing delivery flow, so teams can scan, review, and ship without slowing down.
            </p>
          </div>

          <motion.div
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
            variants={workflowContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.35 }}
          >
            <motion.div
              variants={workflowCard}
              className="rounded-2xl border border-cyan-400/10 bg-[#07101d] p-6 shadow-lg shadow-black/10 will-change-transform"
            >
              <p className="text-cyan-300 text-sm font-semibold mb-3">01</p>
              <h3 className="text-lg font-semibold text-white mb-2">Connect</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Link your GitHub repository and let the platform track changes automatically.
              </p>
            </motion.div>

            <motion.div
              variants={workflowCard}
              className="rounded-2xl border border-cyan-400/10 bg-[#07101d] p-6 shadow-lg shadow-black/10 will-change-transform"
            >
              <p className="text-cyan-300 text-sm font-semibold mb-3">02</p>
              <h3 className="text-lg font-semibold text-white mb-2">Scan</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Every push is analyzed for secrets, dependency risks, and logic-level security issues.
              </p>
            </motion.div>

            <motion.div
              variants={workflowCard}
              className="rounded-2xl border border-cyan-400/10 bg-[#07101d] p-6 shadow-lg shadow-black/10 will-change-transform"
            >
              <p className="text-cyan-300 text-sm font-semibold mb-3">03</p>
              <h3 className="text-lg font-semibold text-white mb-2">Review</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                AI-generated findings are prioritized so your team can focus on what matters most.
              </p>
            </motion.div>

            <motion.div
              variants={workflowCard}
              className="rounded-2xl border border-cyan-400/10 bg-[#07101d] p-6 shadow-lg shadow-black/10 will-change-transform"
            >
              <p className="text-cyan-300 text-sm font-semibold mb-3">04</p>
              <h3 className="text-lg font-semibold text-white mb-2">Ship</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Approve safe code with confidence and keep risky changes from reaching production.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
