import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { IssueCard } from '../components/IssueCard';
import { RiskMeter } from '../components/RiskMeter';
import { useStore } from '../store/useStore';

export const ScanReport: React.FC = () => {
  const { projectId = '' } = useParams();
  const scanReport = useStore((state) => state.scanReport);
  const isLoadingReport = useStore((state) => state.isLoadingReport);
  const loadScanReport = useStore((state) => state.loadScanReport);
  const issueSearch = useStore((state) => state.issueSearch);
  const issueSeverityFilter = useStore((state) => state.issueSeverityFilter);
  const setIssueSearch = useStore((state) => state.setIssueSearch);
  const setIssueSeverityFilter = useStore((state) => state.setIssueSeverityFilter);

  useEffect(() => {
    if (projectId) {
      loadScanReport(projectId);
    }
  }, [projectId, loadScanReport]);

  const filteredIssues = useMemo(() => {
    const issues = scanReport?.issues || [];
    return issues.filter((issue) => {
      const matchesSearch = !issueSearch
        || issue.risk.toLowerCase().includes(issueSearch.toLowerCase())
        || issue.file.toLowerCase().includes(issueSearch.toLowerCase())
        || issue.description.toLowerCase().includes(issueSearch.toLowerCase());
      const matchesSeverity = issueSeverityFilter === 'all' || issue.severity === issueSeverityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [scanReport, issueSearch, issueSeverityFilter]);

  if (isLoadingReport) {
    return <Card className="p-8 text-slate-300">Loading scan report...</Card>;
  }

  if (!scanReport) {
    return <Card className="p-8 text-slate-300">No scan report available for this project.</Card>;
  }

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-[auto,1fr] gap-6 items-center">
        <Card className="p-6">
          <RiskMeter score={scanReport.risk} />
        </Card>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Scan Report</p>
          <h1 className="text-3xl font-semibold text-white mt-2">Risk Score: {scanReport.risk}</h1>
          <p className="text-slate-300 mt-2">
            Deployment decision: <span className="font-medium uppercase">{scanReport.decision}</span>
          </p>
          <p className="text-slate-400 mt-4 text-sm">{scanReport.ai?.summary || 'No AI summary available.'}</p>
        </Card>
      </div>

      <Card className="p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input
          value={issueSearch}
          onChange={(event) => setIssueSearch(event.target.value)}
          placeholder="Search issues by title, file, or description"
          className="md:w-[60%] rounded-lg bg-[#071320] border border-white/15 px-3 py-2 text-sm text-white placeholder-slate-500"
        />

        <select
          value={issueSeverityFilter}
          onChange={(event) => setIssueSeverityFilter(event.target.value as 'all' | 'critical' | 'high' | 'medium' | 'low')}
          className="rounded-lg bg-[#071320] border border-white/15 px-3 py-2 text-sm text-white"
        >
          <option value="all">All severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </Card>

      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <Card className="p-6 text-slate-300">No issues match your search/filter.</Card>
        ) : (
          filteredIssues.map((issue, idx) => (
            <IssueCard key={`${issue.id}-${issue.file}-${idx}`} issue={issue} />
          ))
        )}
      </div>
    </div>
  );
};
