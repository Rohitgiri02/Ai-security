import { create } from 'zustand';
import {
  addProject,
  Analysis,
  deleteProject,
  getMyProfile,
  getProjectDetails,
  getProjects,
  getProjectTimeline,
  getScanReport,
  Project,
  runProjectScan,
  updateMyProfile,
  UserProfile,
} from '../lib/api';

type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface AppState {
  projects: Project[];
  selectedProject: Project | null;
  scanReport: Analysis | null;
  timeline: Analysis[];
  profile: UserProfile | null;
  riskThreshold: number;
  isLoadingProjects: boolean;
  isLoadingProjectDetails: boolean;
  isLoadingReport: boolean;
  isConnectingRepo: boolean;
  scanStatus: 'idle' | 'queued' | 'scanning' | 'done';
  activeScanProjectId: string | null;
  toasts: ToastItem[];
  issueSearch: string;
  issueSeverityFilter: 'all' | 'critical' | 'high' | 'medium' | 'low';

  loadProjects: () => Promise<void>;
  connectRepository: (owner: string, repo: string) => Promise<Project | null>;
  removeProject: (projectId: string) => Promise<void>;
  loadProjectDetails: (projectId: string) => Promise<void>;
  loadScanReport: (projectId: string) => Promise<void>;
  triggerScan: (projectId: string) => Promise<void>;
  loadProfile: () => Promise<void>;
  saveProfile: (payload: {
    displayName?: string;
    preferences?: { emailAlerts?: boolean; pushAlerts?: boolean };
  }) => Promise<void>;
  setRiskThreshold: (value: number) => void;
  setIssueSearch: (value: string) => void;
  setIssueSeverityFilter: (value: 'all' | 'critical' | 'high' | 'medium' | 'low') => void;
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

function makeToastId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useStore = create<AppState>((set, get) => ({
  projects: [],
  selectedProject: null,
  scanReport: null,
  timeline: [],
  profile: null,
  riskThreshold: 70,
  isLoadingProjects: false,
  isLoadingProjectDetails: false,
  isLoadingReport: false,
  isConnectingRepo: false,
  scanStatus: 'idle',
  activeScanProjectId: null,
  toasts: [],
  issueSearch: '',
  issueSeverityFilter: 'all',

  loadProjects: async () => {
    set({ isLoadingProjects: true });
    try {
      const projects = await getProjects();
      set({ projects, isLoadingProjects: false });
    } catch (error: any) {
      set({ isLoadingProjects: false });
      get().addToast({
        type: 'error',
        title: 'Failed to load projects',
        message: error?.response?.data?.error || error.message || 'Unknown error',
      });
    }
  },

  connectRepository: async (owner: string, repo: string) => {
    set({ isConnectingRepo: true, scanStatus: 'queued' });
    try {
      const project = await addProject({ owner, repo });
      set((state) => ({
        projects: [project, ...state.projects],
      }));
      get().addToast({
        type: 'success',
        title: 'Repository connected',
        message: `${owner}/${repo} has been connected successfully.`,
      });
      set({ isConnectingRepo: false, scanStatus: 'scanning', activeScanProjectId: project._id });
      return project;
    } catch (error: any) {
      set({ isConnectingRepo: false, scanStatus: 'idle', activeScanProjectId: null });
      get().addToast({
        type: 'error',
        title: 'Failed to connect repository',
        message: error?.response?.data?.error || error.message || 'Unknown error',
      });
      return null;
    }
  },

  removeProject: async (projectId: string) => {
    try {
      await deleteProject(projectId);
      set((state) => ({
        projects: state.projects.filter((project) => project._id !== projectId),
        selectedProject: state.selectedProject?._id === projectId ? null : state.selectedProject,
      }));
      get().addToast({
        type: 'success',
        title: 'Project removed',
        message: 'Repository disconnected successfully.',
      });
    } catch (error: any) {
      get().addToast({
        type: 'error',
        title: 'Failed to remove project',
        message: error?.response?.data?.error || error.message || 'Unknown error',
      });
    }
  },

  loadProjectDetails: async (projectId: string) => {
    set({ isLoadingProjectDetails: true });
    try {
      const [project, timeline] = await Promise.all([
        getProjectDetails(projectId),
        getProjectTimeline(projectId),
      ]);
      set({ selectedProject: project, timeline, isLoadingProjectDetails: false });
    } catch (error: any) {
      set({ isLoadingProjectDetails: false });
      get().addToast({
        type: 'error',
        title: 'Failed to load project details',
        message: error?.response?.data?.error || error.message || 'Unknown error',
      });
    }
  },

  loadScanReport: async (projectId: string) => {
    set({ isLoadingReport: true });
    try {
      const report = await getScanReport(projectId);
      set({ scanReport: report, isLoadingReport: false });
    } catch (error: any) {
      set({ isLoadingReport: false });
      get().addToast({
        type: 'error',
        title: 'Failed to load scan report',
        message: error?.response?.data?.error || error.message || 'Unknown error',
      });
    }
  },

  triggerScan: async (projectId: string) => {
    set({ scanStatus: 'scanning', activeScanProjectId: projectId });
    try {
      const analysis = await runProjectScan(projectId);
      const state = get();

      set({
        scanStatus: 'done',
        activeScanProjectId: null,
        scanReport: analysis,
        timeline: [{ ...analysis, analyzedAt: new Date().toISOString() }, ...state.timeline],
        projects: state.projects.map((project) =>
          project._id === projectId
            ? { ...project, latestAnalysis: analysis }
            : project
        ),
      });

      get().addToast({
        type: 'success',
        title: 'Scan completed',
        message: analysis.decision === 'block'
          ? 'Deployment blocked based on risk threshold.'
          : 'Deployment marked safe for release.',
      });
    } catch (error: any) {
      set({ scanStatus: 'idle', activeScanProjectId: null });
      get().addToast({
        type: 'error',
        title: 'Scan failed',
        message: error?.response?.data?.error || error.message || 'Unknown error',
      });
    }
  },

  loadProfile: async () => {
    try {
      const profile = await getMyProfile();
      set({ profile });
    } catch (error: any) {
      get().addToast({
        type: 'error',
        title: 'Failed to load profile',
        message: error?.response?.data?.error || error.message || 'Unknown error',
      });
    }
  },

  saveProfile: async (payload) => {
    try {
      const profile = await updateMyProfile(payload);
      set({ profile });
      get().addToast({
        type: 'success',
        title: 'Settings updated',
        message: 'Your preferences were saved.',
      });
    } catch (error: any) {
      get().addToast({
        type: 'error',
        title: 'Failed to update settings',
        message: error?.response?.data?.error || error.message || 'Unknown error',
      });
    }
  },

  setRiskThreshold: (value: number) => set({ riskThreshold: value }),
  setIssueSearch: (value: string) => set({ issueSearch: value }),
  setIssueSeverityFilter: (value) => set({ issueSeverityFilter: value }),

  addToast: (toast) => {
    const id = makeToastId();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));

    setTimeout(() => {
      get().removeToast(id);
    }, 3500);
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
