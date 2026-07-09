import apiClient from './client';
import type { APIResponse, Resume } from '@/types';

export const resumesApi = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<APIResponse<Resume>>('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  list: async () => {
    const response = await apiClient.get<APIResponse<{ items: Resume[]; total: number }>>('/resumes');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<APIResponse<Resume>>(`/resumes/${id}`);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete<APIResponse<void>>(`/resumes/${id}`);
    return response.data;
  },

  setPrimary: async (id: string) => {
    const response = await apiClient.put<APIResponse<Resume>>(`/resumes/${id}/primary`);
    return response.data;
  },
};