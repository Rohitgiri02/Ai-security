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
        <Card key={`${item.meta?.scannedAt || item.analyzedAt || idx}-${idx}`} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-white font-medium">Scan #{timeline.length - idx}</p>
              <p className="text-xs text-slate-400 mt-1">{formatDate(item.meta?.scannedAt || item.analyzedAt)}</p>
              <p className="text-xs text-slate-300 mt-2">{item.ai?.summary || 'No AI summary provided.'}</p>
            </div>
            <RiskBadge risk={item.risk} />
          </div>
        </Card>
      ))}
    </div>
  );
};
