export interface EmployerProfile {
  id: string;
  user_id: string;
  designation?: string;
  department?: string;
  company_id?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  description?: string;
  industry?: string;
  size?: string;
  location?: string;
  website?: string;
  logo_url?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployerAnalytics {
  total_jobs: number;
  active_jobs: number;
  closed_jobs: number;
  total_applicants: number;
  shortlisted_candidates: number;
  interviews_scheduled: number;
  hired_candidates: number;
  avg_match_score: number | null;
}

export interface Applicant {
  id: string;
  application_id: string;
  candidate_id: string;
  candidate_name: string;
  candidate_email: string;
  resume_id: string;
  status: string;
  match_score: number | null;
  applied_at: string;
  resume?: {
    id: string;
    file_name: string;
  };
  ats_score?: {
    overall_score: number;
    skills_match_score: number;
  };
}

export interface ApplicationStatusUpdate {
  status: string;
  notes?: string;
}

export interface InterviewQuestion {
  id: string;
  job_id: string;
  application_id?: string | null;
  question_text: string;
  question_type: string;
  difficulty: number;
  sample_answer?: string;
  expected_answer?: string;
  evaluation_criteria?: Record<string, any>;
  follow_up_questions?: string[];
  focus_area?: string;
  seniority_level?: string;
  created_at: string;
}

export interface ScoreBreakdown {
  skills_match_percent?: number | null;
  experience_match_percent?: number | null;
  ats_score?: number | null;
  education_relevance?: number | null;
  certifications_relevance?: number | null;
  project_relevance?: number | null;
}

export interface CandidateRanking {
  id: string;
  candidate_id: string;
  resume_id?: string | null;
  job_id: string;
  score: number;
  rank_position?: number | null;
  candidate_name: string;
  candidate_email: string;
  status: string;
  breakdown: ScoreBreakdown;
  ai_summary?: string | null;
  application_status?: string | null;
}

export interface RankingComparison {
  job_id: string;
  job_title: string;
  candidates: CandidateRanking[];
  metric_averages: Record<string, number>;
}

export interface JobListItem {
  id: string;
  title: string;
  company: string;
  location?: string;
  job_type: string;
  experience_level: string;
  status: string;
  application_count: number;
  views_count: number;
  is_featured: boolean;
  created_at: string;
  expires_at?: string;
}

export interface ResumePreview {
  resume: {
    id: string;
    file_name: string;
    file_type: string;
    parsed_data?: Record<string, any>;
    skills?: string[];
    experience?: Record<string, any>[];
    education?: Record<string, any>[];
    summary?: string;
  };
  ats_score?: {
    overall_score: number;
    skills_match_score: number;
    experience_match_score: number;
    missing_skills?: string[];
    matched_skills?: string[];
    recommendations?: string;
  };
}