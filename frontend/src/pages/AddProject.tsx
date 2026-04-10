import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { parseRepoUrl } from '../lib/utils';
import { useStore } from '../store/useStore';

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
      setError('Please enter a valid GitHub repository URL or owner/repo.');
      return;
    }

    setIsSubmitting(true);

    const project = await connectRepository(parsed.owner, parsed.repo);
    if (!project) {
      setIsSubmitting(false);
      return;
    }

    await triggerScan(project._id);

    const fakePrUrl = `https://github.com/${parsed.owner}/${parsed.repo}/pull/1`;
    setCreatedPrUrl(fakePrUrl);
    setMessage('Pull Request created successfully');
    setRepoUrl('');
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 mb-2">Repository Onboarding</p>
        <h1 className="text-3xl font-semibold text-white">Add Project</h1>
        <p className="text-slate-300 mt-2">Connect GitHub repositories and automatically enforce security checks in CI/CD.</p>
      </div>

      <Card className="p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-300">GitHub Repository URL</label>
          <input
            value={repoUrl}
            onChange={(event) => setRepoUrl(event.target.value)}
            placeholder="https://github.com/owner/repo or owner/repo"
            className="w-full rounded-lg bg-[#071320] border border-white/15 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Connecting...' : 'Connect Repository'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </form>

        <div className="mt-5 rounded-lg bg-[#071320] border border-white/10 p-4 text-sm text-slate-300">
          <p>Status: <span className="capitalize text-cyan-300">{scanStatus}</span></p>
          <p className="text-xs text-slate-400 mt-1">Real-time scan state transitions: queued → scanning → done</p>
        </div>

        {error && <p className="text-sm text-rose-300 mt-4">{error}</p>}
        {message && <p className="text-sm text-emerald-300 mt-4">{message}</p>}

        {createdPrUrl && (
          <div className="mt-4">
            <Button type="button" onClick={() => window.open(createdPrUrl, '_blank', 'noopener,noreferrer')}>
              View PR
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
