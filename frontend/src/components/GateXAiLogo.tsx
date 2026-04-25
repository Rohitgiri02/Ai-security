import React from 'react';

interface GateXAiLogoProps {
  /** Height of the logo mark icon (the G-gate symbol), width scales proportionally */
  iconSize?: number;
  /** Whether to show the wordmark text next to the icon */
  showWordmark?: boolean;
  className?: string;
}

/**
 * GateXAi SVG logo — transparent background, gradient icon.
 * Designed to look great on any dark surface without a white backdrop.
 */
export const GateXAiLogo: React.FC<GateXAiLogoProps> = ({
  iconSize = 40,
  showWordmark = true,
  className = '',
}) => {
  const id = React.useId().replace(/:/g, '');

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* ── Icon mark ─────────────────────────────────────────── */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Main gradient: rose → orange */}
          <linearGradient id={`grad-main-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e11d48" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>

          {/* Circuit-dot accent gradient */}
          <linearGradient id={`grad-dot-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
        </defs>

        {/* ── G-gate pentagon/shield outline ────────────────── */}
        {/* Outer border strokes of the G-like shape */}
        <g stroke={`url(#grad-main-${id})`} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Left vertical bar of G */}
          <line x1="14" y1="18" x2="14" y2="75" />
          {/* Top horizontal bar */}
          <line x1="14" y1="18" x2="48" y2="18" />
          {/* Bottom horizontal bar */}
          <line x1="14" y1="75" x2="44" y2="75" />
          {/* Right vertical bar (partial — G shape) */}
          <line x1="44" y1="75" x2="44" y2="52" />
          {/* Horizontal middle bar of G */}
          <line x1="28" y1="52" x2="44" y2="52" />
        </g>

        {/* ── First chevron / play arrow ─────────────────────── */}
        <polyline
          points="52,28 72,50 52,72"
          stroke={`url(#grad-main-${id})`}
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* ── Second chevron (offset right) ─────────────────── */}
        <polyline
          points="62,35 80,50 62,65"
          stroke={`url(#grad-dot-${id})`}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.85"
        />

        {/* ── Circuit stem lines rising from top of G ───────── */}
        {/* Left stem */}
        <line x1="22" y1="18" x2="22" y2="8" stroke={`url(#grad-dot-${id})`} strokeWidth="2.5" strokeLinecap="round" />
        {/* Right stem */}
        <line x1="36" y1="18" x2="42" y2="6" stroke={`url(#grad-dot-${id})`} strokeWidth="2.5" strokeLinecap="round" />

        {/* ── Circuit end-dots ───────────────────────────────── */}
        <circle cx="22" cy="6" r="3.5" fill={`url(#grad-dot-${id})`} />
        <circle cx="42" cy="4" r="3.5" fill={`url(#grad-dot-${id})`} />
      </svg>

      {/* ── Wordmark ──────────────────────────────────────────── */}
      {showWordmark && (
        <div className="leading-tight select-none">
          <div className="flex items-baseline gap-0">
            <span className="text-[1.05rem] font-black tracking-tight text-white">gatex</span>
            <span
              className="text-[1.05rem] font-black tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #fb7185, #fb923c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ai
            </span>
          </div>
          <span className="block text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            AI Security Gateway
          </span>
        </div>
      )}
    </div>
  );
};
