import apiClient from './client';
import type { EmployerAnalytics, Applicant, JobListItem, InterviewQuestion, Company, ResumePreview, CandidateRanking, RankingComparison } from '@/types/employer';

export const employerApi = {
  getAnalytics: async () => {
    const response = await apiClient.get<{ success: boolean; data: EmployerAnalytics }>('/employer/analytics');
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get<{ success: boolean; data: any }>('/employer/profile');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await apiClient.put<{ success: boolean; message: string; data: any }>('/employer/profile', data);
    return response.data;
  },

  createCompany: async (data: any) => {
    const response = await apiClient.post<{ success: boolean; message: string; data: Company }>('/employer/companies', data);
    return response.data;
  },

  updateCompany: async (companyId: string, data: any) => {
    const response = await apiClient.put<{ success: boolean; message: string; data: Company }>(`/employer/companies/${companyId}`, data);
    return response.data;
  },

  getJobs: async (skip: number = 0, limit: number = 20, status?: string, search?: string) => {
    const response = await apiClient.get<{ success: boolean; data: { items: JobListItem[]; total: number } }>('/employer/jobs', {
      params: { skip, limit, status, search },
    });
    return response.data;
  },

  createJob: async (data: any) => {
    const response = await apiClient.post<{ success: boolean; message: string; data: JobListItem }>('/employer/jobs', data);
    return response.data;
  },

  updateJob: async (jobId: string, data: any) => {
    const response = await apiClient.put<{ success: boolean; message: string; data: JobListItem }>(`/employer/jobs/${jobId}`, data);
    return response.data;
  },

  deleteJob: async (jobId: string) => {
    await apiClient.delete(`/employer/jobs/${jobId}`);
  },

  getApplicants: async (jobId?: string, skip: number = 0, limit: number = 20) => {
    const response = await apiClient.get<{ success: boolean; data: { items: Applicant[]; total: number } }>('/employer/applicants', {
      params: { job_id: jobId, skip, limit },
    });
    return response.data;
  },

  updateApplicationStatus: async (applicationId: string, status: string, notes?: string) => {
    const response = await apiClient.patch<{ success: boolean; message: string; data: Applicant }>(`/employer/applications/${applicationId}/status`, {
      status,
      notes,
    });
    return response.data;
  },

  generateInterviewQuestions: async (
    jobId: string,
    count: number = 6,
    applicationId?: string,
    options?: { difficulty?: number; seniority_level?: string; question_types?: string[] },
  ) => {
    const response = await apiClient.post<{ success: boolean; data: InterviewQuestion[] }>('/employer/interview-questions/generate', {
      job_id: jobId,
      application_id: applicationId,
      count,
      difficulty: options?.difficulty ?? 5,
      seniority_level: options?.seniority_level,
      question_types: options?.question_types,
    });
    return response.data;
  },

  rankCandidates: async (jobId: string) => {
    const response = await apiClient.post<{ success: boolean; data: CandidateRanking[] }>(
      `/employer/jobs/${jobId}/rank-candidates`,
    );
    return response.data;
  },

  getRankings: async (jobId: string) => {
    const response = await apiClient.get<{ success: boolean; data: RankingComparison }>(
      `/employer/jobs/${jobId}/rankings`,
    );
    return response.data;
  },

  compareCandidates: async (jobId: string, candidateIds?: string[]) => {
    const response = await apiClient.get<{ success: boolean; data: RankingComparison }>(
      `/employer/jobs/${jobId}/compare`,
      { params: { candidate_ids: candidateIds?.join(',') } },
    );
    return response.data;
  },

  getApplicantResume: async (applicationId: string) => {
    const response = await apiClient.get<{ success: boolean; data: ResumePreview }>(`/employer/applications/${applicationId}/resume`);
    return response.data;
  },
};
