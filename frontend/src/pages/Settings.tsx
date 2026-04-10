import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';

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

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

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
  };

  const githubConnected = Boolean(
    user?.externalAccounts?.some((account) => String(account.provider) === 'oauth_github')
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300 mb-2">Workspace Controls</p>
        <h1 className="text-3xl font-semibold text-white">Settings</h1>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Risk Threshold</h2>
        <p className="text-sm text-slate-300">Block deployment automatically when risk score exceeds this value.</p>
        <input
          type="range"
          min={0}
          max={100}
          value={riskThreshold}
          onChange={(event) => setRiskThreshold(Number(event.target.value))}
          className="w-full"
        />
        <p className="text-sm text-cyan-200">Current threshold: {riskThreshold}</p>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Notifications</h2>
        <label className="flex items-center justify-between rounded-lg border border-white/10 bg-[#071320] p-4">
          <span className="text-sm text-slate-200">Email notifications for blocked deployments</span>
          <input
            type="checkbox"
            checked={emailAlerts}
            onChange={(event) => setEmailAlerts(event.target.checked)}
            className="w-5 h-5"
          />
        </label>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">GitHub Integration</h2>
        <div className="rounded-lg border border-white/10 bg-[#071320] p-4">
          <p className="text-sm text-slate-300">Status</p>
          <p className={`text-lg font-medium mt-1 ${githubConnected ? 'text-emerald-300' : 'text-amber-300'}`}>
            {githubConnected ? 'Connected' : 'Not connected'}
          </p>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Profile</h2>
        <input
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="Display name"
          className="w-full rounded-lg bg-[#071320] border border-white/15 px-4 py-3 text-white placeholder-slate-500"
        />
      </Card>

      <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save settings'}</Button>
    </div>
  );
};
