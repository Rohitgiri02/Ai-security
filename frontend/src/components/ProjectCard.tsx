import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project, ScanIssue } from '../lib/api';
import { Button } from './ui/Button';
import { RiskBadge } from './RiskBadge';
import { formatDate } from '../lib/utils';

interface ProjectCardProps {
  project: Project;
  onScan: (projectId: string) => void;
  onRemove: (projectId: string) => void;
  scanningProjectId: string | null;
}

const ScanPulse: React.FC = () => (
  <span className="flex items-center gap-1.5 text-cyan-300 text-xs font-medium">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
    </span>
    Scanning…
  </span>
);

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onScan, onRemove, scanningProjectId }) => {
  const navigate = useNavigate();
  const risk = project.latestAnalysis?.risk ?? 0;
  const decision = project.latestAnalysis?.decision ?? 'allow';
  const trigger = project.latestAnalysis?.meta?.trigger || 'manual';
  const branch = project.latestAnalysis?.meta?.branch;
  const commitSha = project.latestAnalysis?.meta?.commitSha;
  const shortSha = commitSha ? commitSha.slice(0, 7) : null;
  const latestIssues = project.latestAnalysis?.issues || [];
  const fixSuggestions = latestIssues.filter((issue) => Boolean(issue.fix)).slice(0, 2);
  const isScanning = scanningProjectId === project._id;
  const isBlocked = decision === 'block';

  const copyFix = async (issue: ScanIssue) => {
    try {
      await navigator.clipboard.writeText(issue.fix);
    } catch {
      // Ignore clipboard failures silently
    }
  };

  const buildPatchSnippet = (issue: ScanIssue) => {
    const vulnerable = issue.code || '// vulnerable code';
    const safeFix = issue.fix || '// apply secure fix';
    return ['// Before (vulnerable)', vulnerable, '', '// After (suggested fix)', safeFix].join('\n');
  };

  return (
    <div
      className="rounded-2xl border bg-[#060e1c]/80 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:-translate-y-0.5 group"
      style={{
        borderColor: isBlocked ? 'rgba(244,63,94,0.18)' : 'rgba(255,255,255,0.08)',
        boxShadow: isBlocked
          ? '0 0 0 1px rgba(244,63,94,0.08), 0 4px 24px rgba(0,0,0,0.3)'
          : '0 0 0 1px rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.25)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = isBlocked
          ? '0 0 0 1px rgba(244,63,94,0.22), 0 12px 40px rgba(0,0,0,0.4), 0 0 24px rgba(244,63,94,0.08)'
          : '0 0 0 1px rgba(34,211,238,0.15), 0 12px 40px rgba(0,0,0,0.4), 0 0 24px rgba(34,211,238,0.06)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = isBlocked
          ? '0 0 0 1px rgba(244,63,94,0.08), 0 4px 24px rgba(0,0,0,0.3)'
          : '0 0 0 1px rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.25)';
      }}
    >
      {/* Top accent line */}
      <div className={`h-0.5 w-full ${isBlocked ? 'bg-gradient-to-r from-rose-500/60 via-rose-400/80 to-transparent' : 'bg-gradient-to-r from-cyan-500/40 via-blue-400/50 to-transparent'}`} />

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base text-white font-semibold truncate">{project.fullName}</h3>
              {isScanning && <ScanPulse />}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Last scan: <span className="text-slate-400">{formatDate(project.latestAnalysis?.meta?.scannedAt)}</span>
            </p>
          </div>
          <RiskBadge risk={risk} />
        </div>

        {/* Meta pills row */}
        <div className="flex flex-wrap gap-2">
          {/* Status */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${isBlocked ? 'bg-rose-500/10 text-rose-300 border-rose-400/20' : 'bg-emerald-500/10 text-emerald-300 border-emerald-400/20'}`}>
            {isBlocked ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-3 h-3">
                <circle cx="12" cy="12" r="9"/><path strokeLinecap="round" d="m4.93 4.93 14.14 14.14"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
              </svg>
            )}
            {isBlocked ? 'Blocked' : 'Safe'}
          </span>

          {/* Issue count */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border bg-white/5 text-slate-300 border-white/10">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3 text-amber-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
            </svg>
            {latestIssues.length} issue{latestIssues.length !== 1 ? 's' : ''}
          </span>

          {/* Trigger */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border bg-white/5 text-slate-400 border-white/10 capitalize">
            {trigger}
          </span>

          {/* Branch / commit */}
          {branch && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border bg-white/5 text-slate-400 border-white/10 font-mono">
              {branch}{shortSha ? ` @ ${shortSha}` : ''}
            </span>
          )}
        </div>

        {/* Risk bar */}
        {project.latestAnalysis && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-slate-500 uppercase tracking-wide">Risk Score</span>
              <span className={`text-[11px] font-bold ${risk >= 70 ? 'text-rose-400' : risk >= 40 ? 'text-amber-400' : 'text-emerald-400'}`}>{risk} / 100</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, risk)}%`,
                  background: risk >= 70
                    ? 'linear-gradient(90deg, #f43f5e88, #f43f5e)'
                    : risk >= 40
                    ? 'linear-gradient(90deg, #fbbf2488, #fbbf24)'
                    : 'linear-gradient(90deg, #34d39988, #34d399)',
                }}
              />
            </div>
          </div>
        )}

        {/* Fix suggestions */}
        {fixSuggestions.length > 0 && (
          <div className="rounded-xl border border-white/[0.07] bg-black/20 p-3.5 space-y-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Suggested Code Fixes</p>
            {fixSuggestions.map((issue, idx) => (
              <div key={`${project._id}-${issue.id}-${idx}`} className="rounded-lg border border-white/[0.07] bg-[#040b13] p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-white font-medium">{issue.risk}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {issue.file}:{issue.line}{issue.column ? `:${issue.column}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => copyFix(issue)}
                    className="flex-shrink-0 text-[11px] px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all duration-150"
                  >
                    Copy Fix
                  </button>
                </div>
                <pre className="rounded-lg border border-white/[0.06] bg-[#020810] p-2.5 overflow-x-auto text-[11px] text-cyan-200 font-mono leading-relaxed">
                  <code>{buildPatchSnippet(issue)}</code>
                </pre>
              </div>
            ))}
            <button
              onClick={() => navigate(`/scan-report/${project._id}`)}
              className="w-full text-xs text-center py-1.5 rounded-lg border border-white/[0.07] text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-150"
            >
              View all fix suggestions →
            </button>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => navigate(`/project/${project._id}`)}
            className="flex-1 min-w-[7rem] text-xs py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium transition-all duration-150 text-center"
          >
            Project Details
          </button>
          <button
            onClick={() => navigate(`/scan-report/${project._id}`)}
            className="flex-1 min-w-[7rem] text-xs py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium transition-all duration-150 text-center"
          >
            Scan Report
          </button>
          {project.workflowPrUrl && (
            <button
              onClick={() => window.open(project.workflowPrUrl, '_blank', 'noopener,noreferrer')}
              className="flex-1 min-w-[7rem] text-xs py-2 px-3 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 border border-violet-400/20 hover:border-violet-400/40 text-violet-300 font-medium transition-all duration-150 text-center"
            >
              Review Action PR
            </button>
          )}
          <button
            onClick={() => onScan(project._id)}
            disabled={isScanning}
            className="flex-1 min-w-[7rem] text-xs py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/20 hover:border-cyan-400/40 text-cyan-300 font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed text-center"
          >
            {isScanning ? 'Scanning…' : 'Run Scan'}
          </button>
          <button
            onClick={() => {
              const confirmed = window.confirm(`Remove ${project.fullName} from your dashboard?`);
              if (confirmed) onRemove(project._id);
            }}
            className="text-xs py-2 px-3 rounded-xl bg-rose-500/5 hover:bg-rose-500/15 border border-rose-400/10 hover:border-rose-400/30 text-rose-400 font-medium transition-all duration-150 text-center"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};
