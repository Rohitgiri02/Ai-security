import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RiskBadge, IssueCard } from '../components/SecurityComponents';
import { projectAPI, ProjectRecord } from '../services/api';

interface Analysis {
  risk: number;
  decision: string;
  issues: any[];
  ai: { summary: string };
  timestamp: string;
}

export const ProjectDetail: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const selectedAnalysis = useMemo(() => analyses[selectedIndex], [analyses, selectedIndex]);

  const loadProject = async () => {
    if (!projectId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [projectRes, historyRes] = await Promise.all([
        projectAPI.getById(projectId),
        projectAPI.getHistory(projectId),
      ]);

      setProject(projectRes.data);

      const normalizedHistory = (historyRes.data || []).map((item: any) => ({
        ...item,
        timestamp: item.analyzedAt || item.meta?.scannedAt || new Date().toISOString(),
      }));

      setAnalyses(normalizedHistory);
      setSelectedIndex(0);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to load project details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const handleRunAnalysis = async () => {
    if (!projectId) {
      return;
    }

    setIsLoadingAnalysis(true);
    try {
      await projectAPI.analyze(projectId);
      await loadProject();
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary text-white pt-20 px-6">
        <div className="max-w-7xl mx-auto glass-panel p-8">Loading project details...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-primary text-white pt-20 px-6">
        <div className="max-w-7xl mx-auto glass-panel border border-rose-400/30 p-8 text-rose-200">
          {error || 'Project not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-white pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-accent hover:text-blue-300 mb-4 flex items-center gap-1"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {project.owner}/{project.repo}
              </h1>
              <p className="text-gray-400 mb-2">Continuous analysis and risk tracking for this repository.</p>
              <a
                href={`https://github.com/${project.owner}/${project.repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-blue-300 text-sm"
              >
                View on GitHub →
              </a>
            </div>
            <button
              onClick={handleRunAnalysis}
              disabled={isLoadingAnalysis}
              className={`px-6 py-3 rounded-lg font-bold transition ${
                isLoadingAnalysis
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-accent hover:bg-blue-600 text-white'
              }`}
            >
              {isLoadingAnalysis ? 'Analyzing...' : 'Run Analysis'}
            </button>
          </div>
        </div>

        {/* Analysis History */}
        {analyses.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Analysis History</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {analyses.map((analysis, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`flex-shrink-0 px-6 py-3 rounded-lg font-bold transition ${
                    selectedIndex === idx
                      ? 'bg-accent text-white'
                      : 'bg-secondary border border-slate-700 hover:border-slate-600 text-gray-300'
                  }`}
                >
                  <div className="text-sm">
                    {new Date(analysis.timestamp).toLocaleDateString()}
                  </div>
                  <div className="text-lg">{analysis.risk}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {selectedAnalysis && (
          <div>
            {/* Summary */}
            <div className="bg-secondary rounded-lg border border-slate-700 p-8 mb-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <p className="text-gray-400 text-sm font-semibold mb-2">Risk Score</p>
                  <RiskBadge risk={selectedAnalysis.risk} />
                </div>

                <div>
                  <p className="text-gray-400 text-sm font-semibold mb-2">Decision</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        selectedAnalysis.decision === 'block'
                          ? 'bg-red-500'
                          : 'bg-green-500'
                      }`}
                    />
                    <span className="font-bold text-lg uppercase">
                      {selectedAnalysis.decision}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm font-semibold mb-2">Issues Found</p>
                  <p className="text-2xl font-bold">
                    {selectedAnalysis.issues.length}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-gray-400 text-sm font-semibold mb-2">AI Analysis</p>
                <p className="text-white leading-relaxed">
                  {selectedAnalysis.ai?.summary || 'No summary available.'}
                </p>
              </div>
            </div>

            {/* Issues List */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Issues Found</h2>

              {selectedAnalysis.issues.length === 0 ? (
                <div className="bg-secondary rounded-lg border border-slate-700 p-8 text-center">
                  <p className="text-green-400 text-lg font-bold">✓ No issues found!</p>
                  <p className="text-gray-400 mt-2">
                    Your code passed all security checks
                  </p>
                </div>
              ) : (
                <div>
                  {selectedAnalysis.issues.map((issue) => (
                    <IssueCard key={issue.id} {...issue} />
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            {selectedAnalysis.issues.length > 0 && (
              <div className="mt-8 bg-secondary rounded-lg border border-slate-700 p-8">
                <h3 className="text-xl font-bold mb-4">Summary</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Critical</p>
                    <p className="text-2xl font-bold text-red-500">
                      {selectedAnalysis.issues.filter((i) => i.severity === 'critical').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">High</p>
                    <p className="text-2xl font-bold text-orange-500">
                      {selectedAnalysis.issues.filter((i) => i.severity === 'high').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Medium</p>
                    <p className="text-2xl font-bold text-yellow-500">
                      {selectedAnalysis.issues.filter((i) => i.severity === 'medium').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Low</p>
                    <p className="text-2xl font-bold text-blue-500">
                      {selectedAnalysis.issues.filter((i) => i.severity === 'low').length}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
