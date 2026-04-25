import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { ProjectCard } from '../components/ProjectCard';
import { useStore } from '../store/useStore';
import { formatDate } from '../lib/utils';

/* ─── Tiny icon helpers (inline SVG, zero deps) ─────────────────────────── */
const Icon = {
  folder: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v8.25A2.25 2.25 0 0 0 4.5 16.5h15a2.25 2.25 0 0 0 2.25-2.25V8.25A2.25 2.25 0 0 0 19.5 6h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="m13 10 3-6-9 10h6l-3 6 9-10h-6Z" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  ),
  ban: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="m4.93 4.93 14.14 14.14" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
    </svg>
  ),
};

/* ─── Animated stat card ─────────────────────────────────────────────────── */
interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent: string;       // tailwind color key substring, e.g. "cyan" | "rose" | "violet" | "amber"
  suffix?: string;
  delay?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, accent, suffix = '', delay = '0ms' }) => {
  const accentMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    cyan:   { bg: 'bg-cyan-500/10',   text: 'text-cyan-300',   border: 'border-cyan-400/20',   glow: 'rgba(34,211,238,0.15)' },
    rose:   { bg: 'bg-rose-500/10',   text: 'text-rose-300',   border: 'border-rose-400/20',   glow: 'rgba(244,63,94,0.15)' },
    violet: { bg: 'bg-violet-500/10', text: 'text-violet-300', border: 'border-violet-400/20', glow: 'rgba(167,139,250,0.15)' },
    amber:  { bg: 'bg-amber-500/10',  text: 'text-amber-300',  border: 'border-amber-400/20',  glow: 'rgba(251,191,36,0.15)' },
  };
  const c = accentMap[accent] ?? accentMap.cyan;

  return (
    <div
      className={`relative rounded-2xl border ${c.border} bg-[#060e1c]/80 backdrop-blur-sm p-5 flex flex-col gap-4 overflow-hidden transition-all duration-300 hover:-translate-y-1`}
      style={{
        animationDelay: delay,
        boxShadow: `0 0 0 1px ${c.glow.replace('0.15', '0.08')}, 0 4px 24px rgba(0,0,0,0.3)`,
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 0 1px ${c.glow.replace('0.15', '0.25')}, 0 12px 40px rgba(0,0,0,0.4), 0 0 30px ${c.glow}`)}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 0 1px ${c.glow.replace('0.15', '0.08')}, 0 4px 24px rgba(0,0,0,0.3)`)}
    >
      {/* Background glow blob */}
      <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full blur-3xl opacity-20 ${c.bg}`} />

      <div className="flex items-center justify-between relative z-10">
        <p className="text-xs font-medium uppercase tracking-widest text-slate-400">{label}</p>
        <span className={`flex items-center justify-center w-9 h-9 rounded-xl ${c.bg} ${c.text} border ${c.border}`}>
          {icon}
        </span>
      </div>
      <div className="relative z-10">
        <p className={`text-4xl font-bold tracking-tight ${c.text}`}>
          {value}<span className="text-xl font-medium ml-1 opacity-70">{suffix}</span>
        </p>
      </div>
    </div>
  );
};

/* ─── Risk gauge bar ─────────────────────────────────────────────────────── */
const RiskGauge: React.FC<{ value: number }> = ({ value }) => {
  const clamped = Math.min(100, Math.max(0, value));
  const color =
    clamped >= 70 ? '#f43f5e' :
    clamped >= 40 ? '#fbbf24' :
    '#34d399';

  return (
    <div className="flex items-center gap-3 mt-1">
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${clamped}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-300 w-8 text-right">{clamped}</span>
    </div>
  );
};

/* ─── Activity row ───────────────────────────────────────────────────────── */
interface ActivityItem {
  id: string;
  repo: string;
  decision: string | undefined;
  risk: number | undefined;
  scannedAt: string | undefined;
  trigger: string;
}

const ActivityRow: React.FC<{ item: ActivityItem }> = ({ item }) => {
  const isBlock = item.decision === 'block';
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200 group">
      {/* Status dot */}
      <div className={`mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${isBlock ? 'bg-rose-500/15 text-rose-300 border border-rose-400/20' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/20'}`}>
        {isBlock ? Icon.ban : Icon.check}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white font-medium truncate">{item.repo}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="flex items-center gap-1 text-[11px] text-slate-500">
            {Icon.clock} {formatDate(item.scannedAt)}
          </span>
          <span className="text-slate-700">·</span>
          <span className="text-[11px] text-slate-400 uppercase tracking-wide">{item.trigger}</span>
        </div>
        <RiskGauge value={item.risk ?? 0} />
      </div>
      <span className={`flex-shrink-0 self-start text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border mt-0.5 ${isBlock ? 'bg-rose-500/10 text-rose-300 border-rose-400/20' : 'bg-emerald-500/10 text-emerald-300 border-emerald-400/20'}`}>
        {isBlock ? 'Blocked' : 'Safe'}
      </span>
    </div>
  );
};

/* ─── Main Dashboard ─────────────────────────────────────────────────────── */
export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const projects = useStore((state) => state.projects);
  const isLoadingProjects = useStore((state) => state.isLoadingProjects);
  const scanStatus = useStore((state) => state.scanStatus);
  const activeScanProjectId = useStore((state) => state.activeScanProjectId);
  const loadProjects = useStore((state) => state.loadProjects);
  const triggerScan = useStore((state) => state.triggerScan);
  const removeProject = useStore((state) => state.removeProject);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const blockedDeployments = projects.filter((p) => p.latestAnalysis?.decision === 'block').length;
    const automatedScans = projects.filter(
      (p) => p.latestAnalysis?.meta?.trigger === 'ci' || p.latestAnalysis?.meta?.trigger === 'webhook'
    ).length;
    const avgRisk = totalProjects
      ? Math.round(projects.reduce((sum, p) => sum + (p.latestAnalysis?.risk || 0), 0) / totalProjects)
      : 0;
    return { totalProjects, blockedDeployments, automatedScans, avgRisk };
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
        trigger: p.latestAnalysis?.meta?.trigger || 'manual',
      }))
      .sort((a, b) => new Date(b.scannedAt || 0).getTime() - new Date(a.scannedAt || 0).getTime())
      .slice(0, 8);
  }, [projects]);

  return (
    <div className="space-y-8 pb-8 animate-fadeIn">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-2 flex items-center gap-2">
            <span className="inline-block w-5 h-px bg-cyan-400/60" />
            Security Command Center
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-400 mt-1.5 text-sm">
            Track project risk, deployment blocks &amp; AI-guided remediation.
          </p>
        </div>

        <button
          onClick={() => navigate('/add-project')}
          className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/25 hover:border-cyan-400/50 text-cyan-300 text-sm font-semibold transition-all duration-200 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] self-start sm:self-auto"
        >
          <span className="transition-transform duration-200 group-hover:rotate-90">{Icon.plus}</span>
          Add Project
        </button>
      </div>

      {/* ── Stat cards ───────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Projects"      value={stats.totalProjects}      icon={Icon.folder} accent="cyan"   delay="0ms"   />
        <StatCard label="Blocked Deployments" value={stats.blockedDeployments} icon={Icon.shield} accent="rose"   delay="60ms"  />
        <StatCard label="Automated Scans"     value={stats.automatedScans}     icon={Icon.bolt}   accent="violet" delay="120ms" />
        <StatCard label="Average Risk"        value={stats.avgRisk}            icon={Icon.chart}  accent="amber"  delay="180ms" suffix="/ 100" />
      </section>

      {/* ── Main grid ────────────────────────────────────────────────────── */}
      <section className="grid xl:grid-cols-3 gap-6">

        {/* Projects column */}
        <div className="xl:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500 inline-block" />
              Connected Projects
            </h2>
            <span className="text-xs text-slate-500 bg-white/5 border border-white/10 rounded-full px-3 py-1">
              {projects.length} {projects.length === 1 ? 'repo' : 'repos'}
            </span>
          </div>

          {isLoadingProjects ? (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-52 w-full rounded-2xl" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-white/8 bg-[#060e1c]/60 backdrop-blur-sm p-10 text-center space-y-3 flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300 mb-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                </svg>
              </div>
              <p className="text-base font-semibold text-white">No repositories connected yet</p>
              <p className="text-sm text-slate-400 max-w-xs">
                Start by connecting your first GitHub repository to begin AI-powered security scanning.
              </p>
              <button
                onClick={() => navigate('/add-project')}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/25 hover:border-cyan-400/50 text-cyan-300 text-sm font-semibold transition-all duration-200"
              >
                {Icon.plus} Connect Repository
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onScan={triggerScan}
                  onRemove={removeProject}
                  scanningProjectId={scanStatus === 'scanning' ? activeScanProjectId : null}
                />
              ))}
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-violet-400 to-purple-600 inline-block" />
              Recent Activity
            </h2>
            {recentActivity.length > 0 && (
              <span className="text-xs text-slate-500 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                {recentActivity.length} scans
              </span>
            )}
          </div>

          <div className="rounded-2xl border border-white/8 bg-[#060e1c]/60 backdrop-blur-sm overflow-hidden">
            {recentActivity.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-400/20 flex items-center justify-center text-violet-300 mx-auto mb-3">
                  {Icon.clock}
                </div>
                <p className="text-sm font-medium text-slate-300">No scans recorded yet</p>
                <p className="text-xs text-slate-500 mt-1">Run a scan to see activity here.</p>
              </div>
            ) : (
              <div className="p-3 space-y-2">
                {recentActivity.map((item) => (
                  <ActivityRow key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* Footer summary bar */}
            {recentActivity.length > 0 && (
              <div className="border-t border-white/5 bg-white/[0.01] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {recentActivity.filter(a => a.decision !== 'block').length} safe
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] text-rose-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    {recentActivity.filter(a => a.decision === 'block').length} blocked
                  </span>
                </div>
                <span className="text-[11px] text-slate-600">last {recentActivity.length} scans</span>
              </div>
            )}
          </div>

          {/* Quick security tips panel */}
          <div className="rounded-2xl border border-violet-400/10 bg-violet-500/5 p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">Security Tips</p>
            {[
              'Scan after every merge to main branch.',
              'Review HIGH-risk issues before deployment.',
              'Use auto-scan via CI webhook for continuous coverage.',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-slate-400">
                <span className="mt-0.5 w-4 h-4 flex-shrink-0 rounded-full bg-violet-500/20 border border-violet-400/20 flex items-center justify-center text-violet-300 text-[9px] font-bold">
                  {i + 1}
                </span>
                {tip}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
