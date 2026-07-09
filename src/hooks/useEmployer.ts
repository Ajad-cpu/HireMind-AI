import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employerApi } from '@/api/employer';

export function useEmployerAnalytics() {
  return useQuery({
    queryKey: ['employer', 'analytics'],
    queryFn: employerApi.getAnalytics,
  });
}

export function useEmployerProfile() {
  return useQuery({
    queryKey: ['employer', 'profile'],
    queryFn: employerApi.getProfile,
  });
}

export function useUpdateEmployerProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => employerApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer', 'profile'] });
    },
  });
}

export function useEmployerJobs(skip: number = 0, limit: number = 20, status?: string, search?: string) {
  return useQuery({
    queryKey: ['employer', 'jobs', skip, limit, status, search],
    queryFn: () => employerApi.getJobs(skip, limit, status, search),
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => employerApi.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer', 'jobs'] });
      queryClient.invalidateQueries({ queryKey: ['employer', 'analytics'] });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: any }) => employerApi.updateJob(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer', 'jobs'] });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (jobId: string) => employerApi.deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer', 'jobs'] });
      queryClient.invalidateQueries({ queryKey: ['employer', 'analytics'] });
    },
  });
}

export function useApplicants(jobId?: string, skip: number = 0, limit: number = 20) {
  return useQuery({
    queryKey: ['employer', 'applicants', jobId, skip, limit],
    queryFn: () => employerApi.getApplicants(jobId, skip, limit),
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ applicationId, status, notes }: { applicationId: string; status: string; notes?: string }) =>
      employerApi.updateApplicationStatus(applicationId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employer', 'applicants'] });
      queryClient.invalidateQueries({ queryKey: ['employer', 'analytics'] });
    },
  });
}

export function useGenerateInterviewQuestions() {
  return useMutation({
    mutationFn: ({ jobId, count, applicationId }: { jobId: string; count?: number; applicationId?: string }) =>
      employerApi.generateInterviewQuestions(jobId, count, applicationId),
  });
}

export function useApplicantResume() {
  return useMutation({
    mutationFn: (applicationId: string) => employerApi.getApplicantResume(applicationId),
  });
}