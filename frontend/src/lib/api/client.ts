'use client';

import { getAuthToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';
const USE_MOCK_API = true; // 開発中はモックAPIを使用 (true にすると実際のAPIを呼び出さない)

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  formData?: boolean; // Flag to indicate if body is FormData
};

// モックレスポンスの提供
function getMockResponse(endpoint: string, method: string, body?: any): any {
  console.log(`[MOCK API] ${method} ${endpoint}`, body);
  
  // 認証関連のモックレスポンス
  if (endpoint.includes('/auth/login')) {
    return {
      access_token: 'mock_token_12345',
      token_type: 'bearer',
      user: {
        id: '1',
        email: body instanceof FormData ? body.get('username') : body?.username || 'user@example.com',
        fullName: 'テストユーザー'
      }
    };
  }
  
  if (endpoint.includes('/auth/register')) {
    return {
      access_token: 'mock_token_register_67890',
      token_type: 'bearer',
      user: {
        id: '2',
        email: body?.email || 'newuser@example.com',
        fullName: body?.fullName || '新規ユーザー'
      }
    };
  }

  if (endpoint.includes('/auth/me')) {
    return {
      id: '1',
      email: 'user@example.com',
      fullName: 'テストユーザー',
      role: 'user'
    };
  }

  // コレクション関連のモックレスポンス
  if (endpoint.includes('/collections')) {
    return [
      { id: '1', name: 'ビジネス文書', documentCount: 5 },
      { id: '2', name: '技術文書', documentCount: 8 },
      { id: '3', name: '法律文書', documentCount: 3 }
    ];
  }

  // デフォルトのレスポンス
  return { message: 'モックレスポンス: エンドポイントは実装されていません' };
}

/**
 * API呼び出しを行うための基本的なクライアント関数
 */
export async function apiClient<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, formData = false } = options;
  
  // モックAPIを使用する場合
  if (USE_MOCK_API) {
    // 実際のAPIコールをシミュレートするための遅延
    await new Promise(resolve => setTimeout(resolve, 800));
    return getMockResponse(endpoint, method, body) as T;
  }
  
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