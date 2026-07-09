import apiClient from './client';
import type { CandidateProfile, DashboardStats, RecommendedJob, SavedJob, JobApplication, Notification, ATSFeedback, CandidateRankingView } from '@/types/candidate';

export interface ProfileUpdateData {
  headline?: string;
  summary?: string;
  years_of_experience?: number;
  current_salary?: number;
  expected_salary?: number;
  currency?: string;
  preferred_work_type?: string;
  preferred_location?: string;
  willing_to_relocate?: boolean;
  available_immediately?: boolean;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  is_public?: boolean;
}

export const candidateApi = {
  getProfile: async () => {
    const response = await apiClient.get<{ success: boolean; data: CandidateProfile }>('/candidate/profile');
    return response.data;
  },

  updateProfile: async (data: ProfileUpdateData) => {
    const response = await apiClient.put<{ success: boolean; message: string; data: CandidateProfile }>('/candidate/profile', data);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await apiClient.get<{ success: boolean; data: DashboardStats }>('/candidate/dashboard');
    return response.data;
  },

  getRecommendedJobs: async (limit: number = 10) => {
    const response = await apiClient.get<{ success: boolean; data: RecommendedJob[] }>('/candidate/recommended-jobs', {
      params: { limit },
    });
    return response.data;
  },

  getSavedJobs: async (skip: number = 0, limit: number = 20) => {
    const response = await apiClient.get<{ success: boolean; data: { items: SavedJob[]; total: number } }>('/candidate/saved-jobs', {
      params: { skip, limit },
    });
    return response.data;
  },

  saveJob: async (jobId: string) => {
    const response = await apiClient.post<{ success: boolean; message: string }>(`/candidate/saved-jobs/${jobId}`);
    return response.data;
  },

  unsaveJob: async (jobId: string) => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/candidate/saved-jobs/${jobId}`);
    return response.data;
  },

  getApplications: async (skip: number = 0, limit: number = 20) => {
    const response = await apiClient.get<{ success: boolean; data: { items: JobApplication[]; total: number } }>('/candidate/applications', {
      params: { skip, limit },
    });
    return response.data;
  },

  getNotifications: async (skip: number = 0, limit: number = 20) => {
    const response = await apiClient.get<{ success: boolean; data: { items: Notification[]; total: number; unread_count: number } }>('/candidate/notifications', {
      params: { skip, limit },
    });
    return response.data;
  },

  markNotificationRead: async (notificationId: string) => {
    const response = await apiClient.patch<{ success: boolean; message: string }>(`/candidate/notifications/${notificationId}/read`);
    return response.data;
  },

  getAtsFeedback: async (jobId: string) => {
    const response = await apiClient.get<{ success: boolean; data: ATSFeedback }>(
      `/candidate/jobs/${jobId}/ats-feedback`,
    );
    return response.data;
  },

  getMyRanking: async (jobId: string) => {
    const response = await apiClient.get<{ success: boolean; data: CandidateRankingView }>(
      `/candidate/jobs/${jobId}/my-ranking`,
    );
    return response.data;
  },
};
