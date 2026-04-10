import React from 'react';
import { getRiskLevel } from '../lib/utils';

interface RiskMeterProps {
  score: number;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ score }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, score));
  const offset = circumference - (progress / 100) * circumference;
  const level = getRiskLevel(score);

  const color = level === 'high' ? '#fb7185' : level === 'medium' ? '#f59e0b' : '#10b981';

  return (
    <div className="relative h-36 w-36">
      <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#1e293b" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <p className="text-2xl font-semibold text-white">{score}</p>
        <p className="text-xs text-slate-400 uppercase tracking-wide">Risk</p>
      </div>
    </div>
  );
};
