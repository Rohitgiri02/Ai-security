import React from 'react';
import { Badge } from './ui/Badge';
import { getRiskLevel } from '../lib/utils';

interface RiskBadgeProps {
  risk: number;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ risk }) => {
  const level = getRiskLevel(risk);

  if (level === 'high') {
    return <Badge className="border-rose-400/40 bg-rose-500/20 text-rose-200">High Risk ({risk})</Badge>;
  }

  if (level === 'medium') {
    return <Badge className="border-amber-400/40 bg-amber-500/20 text-amber-200">Medium Risk ({risk})</Badge>;
  }

  return <Badge className="border-emerald-400/40 bg-emerald-500/20 text-emerald-200">Safe ({risk})</Badge>;
};
