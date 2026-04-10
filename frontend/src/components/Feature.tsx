import { useEffect, useRef, useState } from 'react';
import { motion, type Variants, useReducedMotion } from 'framer-motion';

const FEATURES = [
  { id: 1, icon: '🛡️', title: 'SAST Scanning', desc: 'Static analysis for deep code vulnerabilities.' },
  { id: 2, icon: '🚀', title: 'CI/CD Integration', desc: 'Seamlessly fits into your GitHub Actions.' },
  { id: 3, icon: '🤖', title: 'AI Remediation', desc: 'Auto-generated PRs to fix security flaws.' },
  { id: 4, icon: '📦', title: 'SCA Analysis', desc: 'Monitor your open-source dependencies.' },
  { id: 5, icon: '🔑', title: 'Secret Detection', desc: 'Stop API keys from leaking into prod.' },
  { id: 6, icon: '📝', title: 'Compliance', desc: 'Automated SOC2 and HIPAA reporting.' },
];

export const FeatureSlider = () => {
  // We double the items to create the infinite illusion.
  const displayItems = [...FEATURES, ...FEATURES.slice(0, 3)];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slideWidth = 100 / 3; // Showing exactly 3

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: 'easeOut',
        staggerChildren: 0.12,
      },
    },
  };

  const headingVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: 'easeOut' },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 22, scale: 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 16,
      },
    },
  };

  useEffect(() => {
    const nextSlide = () => {
      setCurrentIndex((prev) => prev + 1);
      setIsTransitioning(true);
    };

    intervalRef.current = setInterval(nextSlide, shouldReduceMotion ? 5000 : 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (resetRef.current) clearTimeout(resetRef.current);
    };
  }, [shouldReduceMotion]);

  // Reset back to the first slide after the duplicate cards scroll into view.
  useEffect(() => {
    if (currentIndex === FEATURES.length) {
      resetRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 500);
    }
  }, [currentIndex]);

  return (
    <motion.section
      className="py-20 bg-[#020617] overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-3xl font-bold text-white mb-12 text-center"
          variants={headingVariants}
        >
          Comprehensive Protection
        </motion.h2>

        <div className="relative group">
          <div className="overflow-hidden rounded-xl">
            <motion.div
              className={`flex transition-transform duration-500 ease-in-out ${!isTransitioning ? 'transition-none' : ''}`}
              style={{ transform: `translateX(-${currentIndex * slideWidth}%)` }}
            >
              {displayItems.map((item, idx) => (
                <motion.div
                  key={`${item.id}-${idx}`}
                  className="min-w-[33.333%] px-3 relative"
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                >
                  <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl h-full hover:border-blue-500/50 hover:bg-slate-900/70 transition-colors shadow-lg shadow-black/10">
                    <div className="text-3xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {FEATURES.map((_, idx) => (
              <motion.div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex % FEATURES.length === idx ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700'
                }`}
                animate={
                  currentIndex % FEATURES.length === idx
                    ? { scaleX: 1.15 }
                    : { scaleX: 1 }
                }
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};
