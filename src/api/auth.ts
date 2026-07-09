import apiClient from './client';
import type { APIResponse, User, TokenResponse, RefreshTokenResponse } from '@/types';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirm_password: string;
  full_name: string;
  role?: string;
}

export interface LogoutData {
  refresh_token: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_new_password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  new_password: string;
  confirm_password: string;
}

export interface AccountStatus {
  id: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  is_locked: boolean;
  locked_until: string | null;
  failed_login_attempts: number;
  last_login_at: string | null;
  session_count: number;
}

export const authApi = {
  register: async (data: RegisterData) => {
    const response = await apiClient.post<APIResponse<TokenResponse>>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await apiClient.post<APIResponse<TokenResponse>>('/auth/login', data);
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get<APIResponse<User>>('/auth/me');
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post<APIResponse<RefreshTokenResponse>>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  logout: async (refreshToken: string) => {
    const response = await apiClient.post<APIResponse<void>>('/auth/logout', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  logoutAll: async () => {
    const response = await apiClient.post<APIResponse<{ message: string }>>('/auth/logout-all');
    return response.data;
  },

  changePassword: async (data: ChangePasswordData) => {
    const response = await apiClient.put<APIResponse<void>>('/auth/change-password', data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordData) => {
    const response = await apiClient.post<APIResponse<{ reset_token?: string }>>('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData) => {
    const response = await apiClient.post<APIResponse<void>>('/auth/reset-password', data);
    return response.data;
  },

  getAccountStatus: async () => {
    const response = await apiClient.get<APIResponse<AccountStatus>>('/auth/account-status');
    return response.data;
  },
};