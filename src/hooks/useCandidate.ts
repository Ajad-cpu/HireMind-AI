import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { candidateApi } from '@/api/candidate';
import type { ProfileUpdateData } from '@/api/candidate';

export function useCandidateProfile() {
  return useQuery({
    queryKey: ['candidate', 'profile'],
    queryFn: candidateApi.getProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ProfileUpdateData) => candidateApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['candidate', 'dashboard'] });
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['candidate', 'dashboard'],
    queryFn: candidateApi.getDashboardStats,
  });
}

export function useRecommendedJobs(limit: number = 10) {
  return useQuery({
    queryKey: ['candidate', 'recommended-jobs', limit],
    queryFn: () => candidateApi.getRecommendedJobs(limit),
  });
}

export function useSavedJobs(skip: number = 0, limit: number = 20) {
  return useQuery({
    queryKey: ['candidate', 'saved-jobs', skip, limit],
    queryFn: () => candidateApi.getSavedJobs(skip, limit),
  });
}

export function useSaveJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (jobId: string) => candidateApi.saveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'saved-jobs'] });
    },
  });
}

export function useUnsaveJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (jobId: string) => candidateApi.unsaveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'saved-jobs'] });
    },
  });
}

export function useApplications(skip: number = 0, limit: number = 20) {
  return useQuery({
    queryKey: ['candidate', 'applications', skip, limit],
    queryFn: () => candidateApi.getApplications(skip, limit),
  });
}

export function useNotifications(skip: number = 0, limit: number = 20) {
  return useQuery({
    queryKey: ['candidate', 'notifications', skip, limit],
    queryFn: () => candidateApi.getNotifications(skip, limit),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId: string) => candidateApi.markNotificationRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', 'notifications'] });
      queryClient.invalidateQueries({ queryKey: ['candidate', 'dashboard'] });
    },
  });
}