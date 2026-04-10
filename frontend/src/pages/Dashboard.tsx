import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { ProjectCard } from '../components/ProjectCard';
import { useStore } from '../store/useStore';
import { formatDate } from '../lib/utils';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const projects = useStore((state) => state.projects);
  const isLoadingProjects = useStore((state) => state.isLoadingProjects);
  const scanStatus = useStore((state) => state.scanStatus);
  const activeScanProjectId = useStore((state) => state.activeScanProjectId);
  const loadProjects = useStore((state) => state.loadProjects);
  const triggerScan = useStore((state) => state.triggerScan);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const blockedDeployments = projects.filter((p) => p.latestAnalysis?.decision === 'block').length;
    const avgRisk = totalProjects
      ? Math.round(projects.reduce((sum, p) => sum + (p.latestAnalysis?.risk || 0), 0) / totalProjects)
      : 0;

    return { totalProjects, blockedDeployments, avgRisk };
  }, [projects]);

  const recentActivity = useMemo(() => {
    return projects
      .filter((p) => p.latestAnalysis)
      .map((p) => ({
        id: p._id,
        repo: p.fullName,
        decision: p.latestAnalysis?.decision,
        risk: p.latestAnalysis?.risk,
        scannedAt: p.latestAnalysis?.meta?.scannedAt,
      }))
      .sort((a, b) => new Date(b.scannedAt || 0).getTime() - new Date(a.scannedAt || 0).getTime())
      .slice(0, 6);
  }, [projects]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 mb-2">Security Command Center</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-white">Dashboard</h1>
          <p className="text-slate-300 mt-2">Track project risk, deployment blocks, and AI-guided remediation.</p>
        </div>
        <Button onClick={() => navigate('/add-project')}>+ Add Project</Button>
      </div>

      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Total Projects</p>
          <p className="text-3xl mt-2 font-semibold text-white">{stats.totalProjects}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Blocked Deployments</p>
          <p className="text-3xl mt-2 font-semibold text-rose-300">{stats.blockedDeployments}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Average Risk</p>
          <p className="text-3xl mt-2 font-semibold text-amber-200">{stats.avgRisk}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Realtime Scan Status</p>
          <p className="text-lg mt-3 font-semibold capitalize text-cyan-200">{scanStatus}</p>
        </Card>
      </section>

      <section className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Connected Projects</h2>
            <p className="text-sm text-slate-400">{projects.length} repositories</p>
          </div>

          {isLoadingProjects ? (
            <div className="space-y-3">
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-44 w-full" />
            </div>
          ) : projects.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-lg text-slate-200">No projects connected yet</p>
              <p className="text-sm text-slate-400 mt-2">Start by connecting your first GitHub repository.</p>
              <Button className="mt-4" onClick={() => navigate('/add-project')}>Connect Repository</Button>
            </Card>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onScan={triggerScan}
                scanningProjectId={scanStatus === 'scanning' ? activeScanProjectId : null}
              />
            ))
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <Card className="p-4 space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-slate-400">No scans recorded yet.</p>
            ) : (
              recentActivity.map((item) => (
                <div key={item.id} className="rounded-lg border border-white/10 bg-[#071320] p-3">
                  <p className="text-sm text-white font-medium">{item.repo}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(item.scannedAt)}</p>
                  <p className="text-xs mt-2 text-slate-300">
                    Risk {item.risk ?? 0} · {item.decision === 'block' ? 'Deployment Blocked' : 'Deployment Safe'}
                  </p>
                </div>
              ))
            )}
          </Card>
        </div>
      </section>
    </div>
  );
};
