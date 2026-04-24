import axios from 'axios';

const configuredBackend = (import.meta.env.VITE_BACKEND_URL || '').trim();
const API_BASE = configuredBackend ? configuredBackend.replace(/\/$/, '') : '/api';

type TokenGetter = () => Promise<string | null>;

let tokenGetter: TokenGetter | null = null;

export function setAuthTokenGetter(getter: TokenGetter) {
  tokenGetter = getter;
}

export interface UserProfile {
  _id: string;
  clerkId: string;
  username?: string;
  displayName?: string;
  email?: string;
  avatarUrl?: string;
  role: 'member' | 'admin';
  preferences: {
    emailAlerts: boolean;
    pushAlerts: boolean;
  };
}

export interface AnalysisResult {
  risk: number;
  decision: 'allow' | 'block';
  issues: any[];
  ai: {
    summary?: string;
    model?: string;
    error?: string;
  };
  meta: Record<string, any>;
}

export interface ProjectRecord {
  _id: string;
  owner: string;
  repo: string;
  fullName: string;
  latestAnalysis?: AnalysisResult;
  analyses?: Array<AnalysisResult & { analyzedAt: string }>;
  createdAt: string;
  updatedAt: string;
}

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = tokenGetter ? await tokenGetter() : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const usersAPI = {
  sync: (payload: {
    email?: string;
    username?: string;
    displayName?: string;
    avatarUrl?: string;
  }) => apiClient.post<UserProfile>('/users/sync', payload),
  me: () => apiClient.get<UserProfile>('/users/me'),
  updateMe: (payload: {
    displayName?: string;
    preferences?: {
      emailAlerts?: boolean;
      pushAlerts?: boolean;
    };
  }) => apiClient.patch<UserProfile>('/users/me', payload),
};

export const projectAPI = {
  list: () => apiClient.get<ProjectRecord[]>('/projects'),
  create: (owner: string, repo: string) => apiClient.post<ProjectRecord>('/projects', { owner, repo }),
  getById: (id: string) => apiClient.get<ProjectRecord>(`/projects/${id}`),
  delete: (id: string) => apiClient.delete(`/projects/${id}`),
  analyze: (id: string) => apiClient.post<{ projectId: string; analysis: AnalysisResult }>(`/projects/${id}/analyze`),
  getHistory: (projectId: string) => apiClient.get<Array<AnalysisResult & { analyzedAt: string }>>(`/projects/${projectId}/analyses`),
};

export const analysisAPI = {
  analyze: (repo: string) => apiClient.post<AnalysisResult>('/analyze', { repo }),
};
