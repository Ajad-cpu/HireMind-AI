export interface APIResponse<T = any> {
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface Resume {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  is_primary: boolean;
  parsed_data?: Record<string, any>;
  skills?: string[];
  experience?: any[];
  education?: any[];
  summary?: string;
  created_at: string;
  updated_at: string;
}