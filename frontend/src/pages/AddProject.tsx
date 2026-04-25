import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { parseRepoUrl } from '../lib/utils';
import { useStore } from '../store/useStore';

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  idle:     { label: 'Idle',     color: 'text-slate-400',   dot: 'bg-slate-500' },
  queued:   { label: 'Queued',   color: 'text-amber-400',   dot: 'bg-amber-400 animate-pulse' },
  scanning: { label: 'Scanning', color: 'text-cyan-400',    dot: 'bg-cyan-400 animate-pulse' },
  done:     { label: 'Done',     color: 'text-emerald-400', dot: 'bg-emerald-400' },
  error:    { label: 'Error',    color: 'text-rose-400',    dot: 'bg-rose-400' },
};

export const AddProject: React.FC = () => {
  const navigate = useNavigate();
  const connectRepository = useStore((state) => state.connectRepository);
  const triggerScan = useStore((state) => state.triggerScan);
  const scanStatus = useStore((state) => state.scanStatus);
  const [repoUrl, setRepoUrl] = useState('');
  const [createdPrUrl, setCreatedPrUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setCreatedPrUrl(null);

    const parsed = parseRepoUrl(repoUrl);
    if (!parsed) {
      setError('Please enter a valid GitHub repository URL or owner/repo format.');
      return;
    }

    setIsSubmitting(true);
    const project = await connectRepository(parsed.owner, parsed.repo);
    if (!project) {
      setIsSubmitting(false);
      return;
    }

    await triggerScan(project._id);
    setCreatedPrUrl(project.workflowPrUrl || null);
    setMessage(
      project.workflowPrUrl
        ? 'GitHub Action PR created. Review and merge it in the repository.'
        : 'Project connected successfully. Workflow PR was not returned.'
    );
    setRepoUrl('');
    setIsSubmitting(false);
  };

  const sc = statusConfig[scanStatus] ?? statusConfig.idle;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-2 flex items-center gap-2">
          <span className="inline-block w-5 h-px bg-cyan-400/60" />
          Repository Onboarding
        </p>
        <h1 className="text-3xl font-bold text-white tracking-tight">Add Project</h1>
        <p className="text-slate-400 mt-1.5 text-sm">
          Connect a GitHub repository to enable AI-powered security scanning and CI/CD enforcement.
        </p>
      </div>

      {/* Form card */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white">Connect Repository</h2>
        </div>
        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-400">GitHub Repository URL</label>
            <div className="relative">
              {/* URL icon */}
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
              </span>
              <input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repo  or  owner/repo"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] focus:border-cyan-400/40 focus:bg-white/[0.06] text-sm text-white placeholder-slate-600 outline-none transition-all duration-150"
              />
            </div>
          </div>

          {/* Error / success feedback */}
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl bg-rose-500/8 border border-rose-400/20 px-4 py-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <p className="text-xs text-rose-300">{error}</p>
            </div>
          )}
          {message && (
            <div className="flex items-start gap-2.5 rounded-xl bg-emerald-500/8 border border-emerald-400/20 px-4 py-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <p className="text-xs text-emerald-300">{message}</p>
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <Button type="submit" disabled={isSubmitting} className="px-6">
              {isSubmitting ? 'Connecting…' : 'Connect Repository'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/dashboard')}>
              ← Back
            </Button>
            {createdPrUrl && (
              <Button
                type="button"
                variant="outline"
                onClick={() => window.open(createdPrUrl, '_blank', 'noopener,noreferrer')}
              >
                Review GitHub Action PR ↗
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Scan status card */}
      <Card className="px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">Scan Status</p>
          <p className={`text-sm font-semibold ${sc.color}`}>{sc.label}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
          <span className="text-xs text-slate-500 font-mono">queued → scanning → done</span>
        </div>
      </Card>

      {/* How it works */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">How it works</p>
        {[
          ['1', 'Enter your GitHub repository URL above.', 'cyan'],
          ['2', 'GateXAi installs a workflow and opens a PR with the security check action.', 'violet'],
          ['3', 'Merge the PR — every future push auto-triggers a scan.', 'emerald'],
        ].map(([num, text, color]) => (
          <div key={num} className="flex items-start gap-3 text-xs text-slate-400">
            <span className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-lg flex items-center justify-center text-[10px] font-bold bg-${color}-500/10 border border-${color}-400/20 text-${color}-300`}>
              {num}
            </span>
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};
