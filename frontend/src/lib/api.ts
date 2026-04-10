import axios from 'axios';

export type RiskDecision = 'allow' | 'block';

type TokenGetter = () => Promise<string | null>;
let accessTokenGetter: TokenGetter | null = null;

export const setApiTokenGetter = (getter: TokenGetter): void => {
  accessTokenGetter = getter;
};

export interface ScanIssue {
  id: string;
  pattern: string;
  risk: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  fix: string;
  file: string;
  line: number;
  column?: number;
  code: string;
  confidence?: string;
  validated?: boolean;
}

export interface Analysis {
  risk: number;
  decision: RiskDecision;
  issues: ScanIssue[];
  ai: {
    summary?: string;
    model?: string;
    explanation?: string;
  };
  meta?: {
    scannedAt?: string;
    fileCount?: number;
    issuesValidated?: number;
    trigger?: 'manual' | 'ci' | 'webhook';
    source?: string;
    branch?: string;
    commitSha?: string;
  };
  analyzedAt?: string;
}

export interface Project {
  _id: string;
  owner: string;
  repo: string;
  fullName: string;
  latestAnalysis?: Analysis | null;
  analyses?: Analysis[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  _id: string;
  clerkId: string;
  email?: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
  role: 'member' | 'admin';
  preferences: {
    emailAlerts: boolean;
    pushAlerts: boolean;
  };
}

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = accessTokenGetter ? await accessTokenGetter() : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getProjects(): Promise<Project[]> {
  const res = await api.get<Project[]>('/projects');
  return res.data;
}

export async function addProject(payload: { owner: string; repo: string }): Promise<Project> {
  const res = await api.post<Project>('/projects', payload);
  return res.data;
}

export async function getProjectDetails(projectId: string): Promise<Project> {
  const res = await api.get<Project>(`/projects/${projectId}`);
  return res.data;
}

export async function deleteProject(projectId: string): Promise<void> {
  await api.delete(`/projects/${projectId}`);
}

export async function runProjectScan(projectId: string): Promise<Analysis> {
  const res = await api.post<{ projectId: string; analysis: Analysis }>(`/projects/${projectId}/analyze`);
  return res.data.analysis;
}

export async function getScanReport(projectId: string): Promise<Analysis | null> {
  const res = await api.get<Analysis[]>(`/projects/${projectId}/analyses`);
  return res.data[0] || null;
}

export async function getProjectTimeline(projectId: string): Promise<Analysis[]> {
  const res = await api.get<Analysis[]>(`/projects/${projectId}/analyses`);
  return res.data;
}

export async function syncUserProfile(payload: {
  email?: string;
  username?: string;
  displayName?: string;
  avatarUrl?: string;
}): Promise<UserProfile> {
  const res = await api.post<UserProfile>('/users/sync', payload);
  return res.data;
}

export async function getMyProfile(): Promise<UserProfile> {
  const res = await api.get<UserProfile>('/users/me');
  return res.data;
}

export async function updateMyProfile(payload: {
  displayName?: string;
  preferences?: {
    emailAlerts?: boolean;
    pushAlerts?: boolean;
  };
}): Promise<UserProfile> {
  const res = await api.patch<UserProfile>('/users/me', payload);
  return res.data;
}
