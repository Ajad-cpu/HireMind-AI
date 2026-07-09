export * from './candidate';
export * from './employer';
export * from './common';

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location?: string;
  job_type: string;
  experience_level: string;
  salary_min?: number;
  salary_max?: number;
  skills_required?: string[];
  status: string;
  is_featured: boolean;
  application_count: number;
  views_count: number;
  created_at: string;
  expires_at?: string;
}

export interface JobFilters {
  search?: string;
  location?: string;
  job_type?: string;
  experience_level?: string;
  salary_min?: number;
  remote_only?: boolean;
  posted_within_days?: number;
  sort_by?: string;
  order?: 'asc' | 'desc';
}

export interface JobListResponse {
  items: Job[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface Application {
  id: string;
  job_id: string;
  user_id: string;
  resume_id: string;
  cover_letter?: string;
  status: string;
  match_score?: number;
  applied_at: string;
  updated_at: string;
  job?: Job;
}