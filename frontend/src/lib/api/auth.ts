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
  token: string;
  user: User;
};

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return apiClient<AuthResponse>(`${AUTH_ENDPOINT}/login`, {
    method: 'POST',
    body: credentials,
  });
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  return apiClient<AuthResponse>(`${AUTH_ENDPOINT}/register`, {
    method: 'POST',
    body: data,
  });
}

export async function logout(): Promise<void> {
  return apiClient<void>(`${AUTH_ENDPOINT}/logout`, {
    method: 'POST',
  });
}

export async function getProfile(): Promise<User> {
  return apiClient<User>(`${AUTH_ENDPOINT}/profile`);
}