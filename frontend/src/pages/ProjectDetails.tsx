import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RiskBadge } from '../components/RiskBadge';
import { RiskMeter } from '../components/RiskMeter';
import { ScanTimeline } from '../components/ScanTimeline';
import { useStore } from '../store/useStore';

export const ProjectDetails: React.FC = () => {
  const { projectId = '' } = useParams();
  const navigate = useNavigate();
  const selectedProject = useStore((state) => state.selectedProject);
  const timeline = useStore((state) => state.timeline);
  const isLoadingProjectDetails = useStore((state) => state.isLoadingProjectDetails);
  const loadProjectDetails = useStore((state) => state.loadProjectDetails);

  useEffect(() => {
    if (projectId) {
      loadProjectDetails(projectId);
    }
  }, [projectId, loadProjectDetails]);

  const latest = selectedProject?.latestAnalysis;
  const issueCounts = {
    critical: latest?.issues?.filter((issue) => issue.severity === 'critical').length || 0,
    high: latest?.issues?.filter((issue) => issue.severity === 'high').length || 0,
    medium: latest?.issues?.filter((issue) => issue.severity === 'medium').length || 0,
    low: latest?.issues?.filter((issue) => issue.severity === 'low').length || 0,
  };

  if (isLoadingProjectDetails) {
    return <Card className="p-8 text-slate-300">Loading project details...</Card>;
  }

  if (!selectedProject) {
    return <Card className="p-8 text-rose-200">Project not found.</Card>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 mb-2">Project Details</p>
          <h1 className="text-3xl font-semibold text-white">{selectedProject.fullName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <RiskBadge risk={latest?.risk || 0} />
          <Button variant="outline" onClick={() => navigate(`/scan-report/${selectedProject._id}`)}>
            Open Scan Report
          </Button>
        </div>
      </div>

      <section className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center justify-center">
          <RiskMeter score={latest?.risk || 0} />
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">Vulnerability Summary</h2>
          <div className="grid sm:grid-cols-4 gap-3 text-sm">
            <div className="rounded-lg bg-rose-500/10 border border-rose-400/20 p-3">
              <p className="text-rose-300">Critical</p>
              <p className="text-2xl text-white mt-1">{issueCounts.critical}</p>
            </div>
            <div className="rounded-lg bg-orange-500/10 border border-orange-400/20 p-3">
              <p className="text-orange-300">High</p>
              <p className="text-2xl text-white mt-1">{issueCounts.high}</p>
            </div>
            <div className="rounded-lg bg-amber-500/10 border border-amber-400/20 p-3">
              <p className="text-amber-300">Medium</p>
              <p className="text-2xl text-white mt-1">{issueCounts.medium}</p>
            </div>
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-400/20 p-3">
              <p className="text-emerald-300">Low</p>
              <p className="text-2xl text-white mt-1">{issueCounts.low}</p>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-white/10 bg-[#071320] p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Last deployment decision</p>
            <p className="mt-2 text-lg text-white font-medium uppercase">
              {latest?.decision === 'block' ? 'Blocked' : 'Safe to deploy'}
            </p>
          </div>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">Scan Timeline</h2>
        <ScanTimeline timeline={timeline} />
      </section>
    </div>
  );
};
