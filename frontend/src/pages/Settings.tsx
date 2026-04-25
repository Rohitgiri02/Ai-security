import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';

/* ─── Page-level section wrapper ──────────────────────────────────────────── */
const Section: React.FC<{ title: string; description?: string; children: React.ReactNode }> = ({
  title,
  description,
  children,
}) => (
  <Card className="overflow-hidden">
    <div className="px-6 py-4 border-b border-white/[0.06]">
      <h2 className="text-sm font-semibold text-white">{title}</h2>
      {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
    </div>
    <div className="p-6">{children}</div>
  </Card>
);

/* ─── Toggle switch ────────────────────────────────────────────────────────── */
const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border transition-colors duration-200 focus-visible:outline-none ${
      checked
        ? 'bg-cyan-500/30 border-cyan-400/50'
        : 'bg-white/5 border-white/15'
    }`}
  >
    <span
      className={`pointer-events-none inline-block h-3.5 w-3.5 rounded-full shadow-sm transform transition-transform duration-200 my-auto mx-0.5 ${
        checked ? 'translate-x-4 bg-cyan-300' : 'translate-x-0 bg-slate-500'
      }`}
    />
  </button>
);

export const Settings: React.FC = () => {
  const { user } = useUser();
  const profile = useStore((state) => state.profile);
  const riskThreshold = useStore((state) => state.riskThreshold);
  const setRiskThreshold = useStore((state) => state.setRiskThreshold);
  const loadProfile = useStore((state) => state.loadProfile);
  const saveProfile = useStore((state) => state.saveProfile);

  const [displayName, setDisplayName] = useState('');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.displayName || '');
    setEmailAlerts(profile.preferences?.emailAlerts ?? true);
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    await saveProfile({
      displayName,
      preferences: {
        emailAlerts,
        pushAlerts: profile?.preferences?.pushAlerts ?? true,
      },
    });
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const githubConnected = Boolean(
    user?.externalAccounts?.some((account) => String(account.provider) === 'oauth_github')
  );

  const riskColor =
    riskThreshold >= 70 ? 'text-rose-400' :
    riskThreshold >= 40 ? 'text-amber-400' :
    'text-emerald-400';

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cyan-400 mb-2 flex items-center gap-2">
          <span className="inline-block w-5 h-px bg-cyan-400/60" />
          Workspace Controls
        </p>
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-slate-400 mt-1.5 text-sm">Configure scanning behavior, notifications, and your profile.</p>
      </div>

      {/* Risk threshold */}
      <Section
        title="Risk Threshold"
        description="Deployments are automatically blocked when risk exceeds this value."
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Block at risk score</span>
            <span className={`text-2xl font-bold tabular-nums ${riskColor}`}>{riskThreshold}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={riskThreshold}
            onChange={(e) => setRiskThreshold(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${
                riskThreshold >= 70 ? '#f43f5e' : riskThreshold >= 40 ? '#fbbf24' : '#34d399'
              } ${riskThreshold}%, rgba(255,255,255,0.08) ${riskThreshold}%)`,
            }}
          />
          <div className="flex justify-between text-[11px] text-slate-600">
            <span>0 — Always safe</span>
            <span>100 — Never block</span>
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" description="Choose how you want to be alerted about scan results.">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-200 font-medium">Email alerts</p>
            <p className="text-xs text-slate-500 mt-0.5">Receive an email when a deployment is blocked.</p>
          </div>
          <Toggle checked={emailAlerts} onChange={setEmailAlerts} />
        </div>
      </Section>

      {/* GitHub integration */}
      <Section title="GitHub Integration" description="OAuth connection status for repository access.">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center border text-sm ${githubConnected ? 'bg-emerald-500/10 border-emerald-400/20 text-emerald-300' : 'bg-amber-500/10 border-amber-400/20 text-amber-300'}`}>
              {githubConnected ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
              )}
            </span>
            <div>
              <p className={`text-sm font-semibold ${githubConnected ? 'text-emerald-300' : 'text-amber-300'}`}>
                {githubConnected ? 'Connected' : 'Not connected'}
              </p>
              <p className="text-[11px] text-slate-500">
                {githubConnected ? 'GitHub OAuth is active' : 'Connect GitHub to enable scanning'}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Profile */}
      <Section title="Profile" description="Update your display name used across the platform.">
        <div className="space-y-3">
          <label className="block text-xs text-slate-400 mb-1">Display name</label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.14] focus:border-cyan-400/40 focus:bg-white/[0.06] px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all duration-150"
          />
        </div>
      </Section>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={isSaving} className="px-6">
          {isSaving ? 'Saving…' : 'Save settings'}
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 animate-fadeIn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            Saved successfully
          </span>
        )}
      </div>
    </div>
  );
};
