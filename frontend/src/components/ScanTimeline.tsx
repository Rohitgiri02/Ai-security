import React from 'react';
import { Analysis } from '../lib/api';
import { Card } from './ui/Card';
import { RiskBadge } from './RiskBadge';
import { formatDate } from '../lib/utils';

interface ScanTimelineProps {
  timeline: Analysis[];
}

export const ScanTimeline: React.FC<ScanTimelineProps> = ({ timeline }) => {
  if (!timeline.length) {
    return (
      <Card className="p-6 text-sm text-slate-300">
        No scans yet. Trigger the first scan to populate timeline.
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {timeline.map((item, idx) => (
        <Card key={`${item.meta?.scannedAt || item.analyzedAt || idx}-${idx}`} className="p-5 md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white">Scan #{timeline.length - idx}</p>
              <p className="mt-1 text-xs text-slate-400">{formatDate(item.meta?.scannedAt || item.analyzedAt)}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {item.ai?.summary || 'No AI summary provided.'}
              </p>
            </div>
            <div className="shrink-0">
              <RiskBadge risk={item.risk} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
