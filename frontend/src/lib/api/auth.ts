'use client';

import { apiClient } from './client';
import { User } from '@/lib/types';

const AUTH_ENDPOINT = '/auth';

export type LoginCredentials = {
  username: string;
  password: string;
};

export type RegisterData = {
  username: string;
  email: string;
  password: string;
  fullName: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user?: User;
};

// ブラウザ環境でのみトークンを取得
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
}

// トークンを保存
export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
}

// トークンを削除
export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
}

// ログイン状態をチェック
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  // Convert to FormData for OAuth2PasswordRequestForm compatibility
  const formData = new FormData();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  const response = await apiClient<AuthResponse>(`${AUTH_ENDPOINT}/login`, {
    method: 'POST',
    body: formData,
    formData: true,  // Flag to indicate FormData submission
  });
  
  if (response.access_token) {
    setAuthToken(response.access_token);
  }
  
  return response;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await apiClient<AuthResponse>(`${AUTH_ENDPOINT}/register`, {
    method: 'POST',
    body: data,
  });
  
  if (response.access_token) {
    setAuthToken(response.access_token);
  }
  
  return response;
}

export async function logout(): Promise<void> {
  removeAuthToken();
  return apiClient<void>(`${AUTH_ENDPOINT}/logout`, {
    method: 'POST',
  });
}

export async function getProfile(): Promise<User> {
  return apiClient<User>(`${AUTH_ENDPOINT}/me`);
}