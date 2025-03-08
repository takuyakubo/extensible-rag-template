'use client';

import { getAuthToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  formData?: boolean; // Flag to indicate if body is FormData
};

/**
 * API呼び出しを行うための基本的なクライアント関数
 */
export async function apiClient<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, formData = false } = options;
  
  const url = `${API_BASE_URL}${endpoint}`;
  
  const requestHeaders: HeadersInit = {
    ...headers,
  };

  // FormData以外の場合はContent-Typeを設定
  if (!formData) {
    requestHeaders['Content-Type'] = 'application/json';
  }
  
  // 認証トークンがある場合は追加
  const token = getAuthToken();
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    method,
    headers: requestHeaders,
    body: body ? (formData ? body : JSON.stringify(body)) : undefined,
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || errorData.message || `API呼び出しに失敗しました: ${response.status}`
      );
    }
    
    // JSONでない場合（204 No Content等）
    if (response.status === 204) {
      return {} as T;
    }
    
    return await response.json();
  } catch (error) {
    console.error('API呼び出しエラー:', error);
    throw error;
  }
}