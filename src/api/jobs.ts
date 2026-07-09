import apiClient from './client';
import type { Job, JobFilters, JobListResponse, Application } from '@/types';

export const jobsApi = {
  browseJobs: async (filters: JobFilters = {}, skip: number = 0, limit: number = 20) => {
    const params: any = { skip, limit, ...filters };
    const response = await apiClient.get<{ success: boolean; data: JobListResponse }>('/jobs/browse', { params });
    return response.data;
  },

  getJob: async (jobId: string) => {
    const response = await apiClient.get<{ success: boolean; data: Job }>(`/jobs/${jobId}`);
    return response.data;
  },

  applyToJob: async (jobId: string, resumeId: string, coverLetter?: string) => {
    const response = await apiClient.post<{ success: boolean; message: string; data: Application }>(`/jobs/${jobId}/apply`, {
      resume_id: resumeId,
      cover_letter: coverLetter,
    });
    return response.data;
  },

  saveJob: async (jobId: string) => {
    const response = await apiClient.post<{ success: boolean; message: string }>(`/jobs/${jobId}/save`);
    return response.data;
  },

  unsaveJob: async (jobId: string) => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/jobs/${jobId}/save`);
    return response.data;
  },

  withdrawApplication: async (applicationId: string) => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(`/jobs/applications/${applicationId}/withdraw`);
    return response.data;
  },
};