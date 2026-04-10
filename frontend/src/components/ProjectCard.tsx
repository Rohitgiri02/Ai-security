import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../lib/api';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { RiskBadge } from './RiskBadge';
import { formatDate } from '../lib/utils';

interface ProjectCardProps {
  project: Project;
  onScan: (projectId: string) => void;
  scanningProjectId: string | null;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onScan, scanningProjectId }) => {
  const navigate = useNavigate();
  const risk = project.latestAnalysis?.risk ?? 0;
  const decision = project.latestAnalysis?.decision ?? 'allow';

  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg text-white font-semibold">{project.fullName}</h3>
          <p className="text-xs text-slate-400">Last scan: {formatDate(project.latestAnalysis?.meta?.scannedAt)}</p>
        </div>
        <RiskBadge risk={risk} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-[#071320] border border-white/10 p-3">
          <p className="text-slate-400 text-xs mb-1">Status</p>
          <p className="text-white font-medium uppercase">{decision === 'block' ? 'Blocked' : 'Safe'}</p>
        </div>
        <div className="rounded-lg bg-[#071320] border border-white/10 p-3">
          <p className="text-slate-400 text-xs mb-1">Issues</p>
          <p className="text-white font-medium">{project.latestAnalysis?.issues?.length || 0}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => navigate(`/project/${project._id}`)}>Project Details</Button>
        <Button variant="outline" onClick={() => navigate(`/scan-report/${project._id}`)}>Scan Report</Button>
        <Button
          onClick={() => onScan(project._id)}
          disabled={scanningProjectId === project._id}
        >
          {scanningProjectId === project._id ? 'Scanning...' : 'Run Scan'}
        </Button>
      </div>
    </Card>
  );
};
