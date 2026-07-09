export interface CandidateProfile {
  id: string;
  user_id: string;
  headline?: string;
  summary?: string;
  years_of_experience?: number;
  current_salary?: number;
  expected_salary?: number;
  currency: string;
  preferred_work_type?: string;
  preferred_location?: string;
  willing_to_relocate: boolean;
  available_immediately: boolean;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  is_public: boolean;
  profile_views: number;
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface SkillGapItem {
  skill: string;
  importance: string;
  suggestion: string;
}

export interface ATSFeedback {
  job_id: string;
  job_title: string;
  ats_score: number | null;
  matched_skills: string[];
  missing_skills: string[];
  skill_gaps: SkillGapItem[];
  suggested_improvements: string[];
  ai_summary: string | null;
}

export interface CandidateRankingView {
  job_id: string;
  job_title: string;
  score: number;
  rank_position?: number | null;
  breakdown: {
    skills_match_percent?: number | null;
    experience_match_percent?: number | null;
    ats_score?: number | null;
    education_relevance?: number | null;
    certifications_relevance?: number | null;
    project_relevance?: number | null;
  };
  ai_summary?: string | null;
}

export interface DashboardStats {
  profile_completion: number;
  total_applications: number;
  pending_applications: number;
  shortlisted_count: number;
  interviewed_count: number;
  saved_jobs_count: number;
  unread_notifications: number;
  resume_views: number;
  match_score_avg: number | null;
}

export interface RecommendedJob {
  id: string;
  title: string;
  company: string;
  location?: string;
  job_type: string;
  match_score: number;
  reason?: string;
  created_at: string;
}

export interface SavedJob {
  id: string;
  job_id: string;
  job: {
    title: string;
    company: string;
    location?: string;
    job_type: string;
    experience_level: string;
  };
  created_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  job: {
    title: string;
    company: string;
    location?: string;
  };
  status: string;
  match_score?: number;
  interview_date?: string;
  feedback?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface ApplicationTimelineItem {
  status: string;
  timestamp: string;
  notes?: string;
  updated_by?: string;
}