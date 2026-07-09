import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/api/jobs';
import type { Job, JobFilters, Application } from '@/types';

export function useBrowseJobs(filters: JobFilters = {}, skip: number = 0, limit: number = 20) {
  return useQuery({
    queryKey: ['jobs', 'browse', filters, skip, limit],
    queryFn: () => jobsApi.browseJobs(filters, skip, limit),
  });
}

export function useJob(jobId: string) {
  return useQuery({
    queryKey: ['jobs', jobId],
    queryFn: () => jobsApi.getJob(jobId),
    enabled: !!jobId,
  });
}

export function useApplyJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ jobId, resumeId, coverLetter }: { jobId: string; resumeId: string; coverLetter?: string }) =>
      jobsApi.applyToJob(jobId, resumeId, coverLetter),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['candidate', 'applications'] });
      queryClient.invalidateQueries({ queryKey: ['candidate', 'dashboard'] });
    },
  });
}

export function useSaveJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (jobId: string) => jobsApi.saveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['candidate', 'saved-jobs'] });
    },
  });
}

export function useUnsaveJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (jobId: string) => jobsApi.unsaveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['candidate', 'saved-jobs'] });
    },
  });
}

export function useWithdrawApplication() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (applicationId: string) => jobsApi.withdrawApplication(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['candidate', 'applications'] });
      queryClient.invalidateQueries({ queryKey: ['candidate', 'dashboard'] });
    },
  });
}