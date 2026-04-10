import React from 'react';

interface RiskBadgeProps {
  risk: number;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ risk }) => {
  let bgColor = 'bg-emerald-500/20 border border-emerald-400/30';
  let textColor = 'text-emerald-200';
  let label = 'Low Risk';

  if (risk > 70) {
    bgColor = 'bg-rose-500/20 border border-rose-400/30';
    textColor = 'text-rose-200';
    label = 'High Risk - BLOCK';
  } else if (risk > 40) {
    bgColor = 'bg-amber-500/20 border border-amber-400/30';
    textColor = 'text-amber-200';
    label = 'Medium Risk';
  }

  return (
    <span className={`px-4 py-2 rounded-lg font-semibold text-sm ${bgColor} ${textColor} inline-block`}>
      {label} ({risk})
    </span>
  );
};

interface IssueCardProps {
  id: string;
  pattern: string;
  risk: string;
  severity: string;
  file: string;
  line: number;
  code: string;
  description: string;
  fix: string;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  id,
  pattern,
  risk,
  severity,
  file,
  line,
  code,
  description,
  fix,
}) => {
  const severityColors = {
    critical: 'bg-red-900 text-red-200',
    high: 'bg-orange-900 text-orange-200',
    medium: 'bg-yellow-900 text-yellow-200',
    low: 'bg-blue-900 text-blue-200',
  };

  return (
    <div className="bg-secondary border border-slate-700 rounded-lg p-6 mb-4 hover:border-slate-600 transition">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-white font-bold text-lg">{risk}</h4>
          <p className="text-gray-400 text-sm">{id}: {pattern}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${severityColors[severity as keyof typeof severityColors]}`}>
          {severity.toUpperCase()}
        </span>
      </div>

      <div className="bg-primary rounded p-3 mb-4 font-mono text-sm text-gray-300 overflow-x-auto">
        <p className="text-gray-500">{file}:{line}</p>
        <p className="text-cyan-400">{code}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-400 text-sm font-semibold mb-1">Description</p>
          <p className="text-gray-300 text-sm">{description}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm font-semibold mb-1">Fix</p>
          <p className="text-gray-300 text-sm">{fix}</p>
        </div>
      </div>
    </div>
  );
};
