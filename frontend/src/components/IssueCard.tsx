import React, { useMemo, useState } from 'react';
import { ScanIssue } from '../lib/api';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface IssueCardProps {
  issue: ScanIssue;
}

const severityStyle: Record<string, string> = {
  critical: 'border-rose-400/40 bg-rose-500/20 text-rose-200',
  high: 'border-orange-400/40 bg-orange-500/20 text-orange-200',
  medium: 'border-amber-400/40 bg-amber-500/20 text-amber-200',
  low: 'border-emerald-400/40 bg-emerald-500/20 text-emerald-200',
};

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const [expanded, setExpanded] = useState(false);
  const aiExplanation = useMemo(
    () => `This issue is risky because ${issue.risk.toLowerCase()} can be exploited when untrusted data reaches this code path. Apply the suggested fix and add a regression test for the vulnerable flow.`,
    [issue.risk]
  );

  const copyFix = async () => {
    try {
      await navigator.clipboard.writeText(issue.fix);
    } catch {
      // Clipboard failures are non-critical for UX.
    }
  };

  return (
    <article className="rounded-xl border border-white/15 bg-[#081322cc] p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-white font-semibold">{issue.risk}</h4>
          <p className="text-xs text-slate-400 mt-1">{issue.file}:{issue.line}{issue.column ? `:${issue.column}` : ''}</p>
        </div>
        <Badge className={severityStyle[issue.severity] || severityStyle.low}>{issue.severity.toUpperCase()}</Badge>
      </div>

      <p className="text-sm text-slate-300">{issue.description}</p>

      <pre className="rounded-lg bg-[#060f19] border border-white/10 p-3 overflow-x-auto text-xs text-cyan-200 font-mono">
        <code>{issue.code}</code>
      </pre>

      <div className="rounded-lg bg-[#071320] border border-white/10 p-3">
        <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Fix Suggestion</p>
        <p className="text-sm text-slate-200">{issue.fix}</p>
        <Button variant="outline" className="mt-3" onClick={copyFix}>Copy fix</Button>
      </div>

      <button
        className="text-sm text-blue-300 hover:text-blue-200"
        onClick={() => setExpanded((prev) => !prev)}
        type="button"
      >
        {expanded ? 'Hide' : 'Explain like I am a developer'}
      </button>

      {expanded && (
        <div className="rounded-lg border border-white/10 bg-[#071320] p-3 text-sm text-slate-200">
          {aiExplanation}
        </div>
      )}
    </article>
  );
};
