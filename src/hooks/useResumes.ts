import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resumesApi } from '@/api/resumes';
import toast from 'react-hot-toast';

export const useResumes = () => {
  return useQuery({
    queryKey: ['resumes'],
    queryFn: () => resumesApi.list(),
  });
};

export const useResume = (id: string) => {
  return useQuery({
    queryKey: ['resume', id],
    queryFn: () => resumesApi.getById(id),
    enabled: !!id,
  });
};

export const useUploadResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => resumesApi.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Resume uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error?.message || 'Failed to upload resume');
    },
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resumesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Resume deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error?.message || 'Failed to delete resume');
    },
  });
};

export const useSetPrimaryResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resumesApi.setPrimary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      toast.success('Primary resume updated');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error?.message || 'Failed to set primary resume');
    },
  });
};