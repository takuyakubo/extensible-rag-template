'use client';

import { apiClient } from './client';
import { Document, Collection } from '@/lib/types';

const DOCUMENTS_ENDPOINT = '/documents';
const COLLECTIONS_ENDPOINT = '/collections';

export async function getDocuments(): Promise<Document[]> {
  return apiClient<Document[]>(DOCUMENTS_ENDPOINT);
}

export async function getDocument(id: string): Promise<Document> {
  return apiClient<Document>(`${DOCUMENTS_ENDPOINT}/${id}`);
}

export async function createDocument(data: FormData): Promise<Document> {
  // FormDataを使用する場合は特殊なハンドリングが必要
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}${DOCUMENTS_ENDPOINT}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: data,
      // FormDataを使用するため、Content-Typeヘッダーは自動的に設定される
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `ドキュメントのアップロードに失敗しました: ${response.status}`
      );
    }
    
    return await response.json();
  } catch (error) {
    console.error('ドキュメントアップロードエラー:', error);
    throw error;
  }
}

export async function updateDocument(id: string, data: Partial<Document>): Promise<Document> {
  return apiClient<Document>(`${DOCUMENTS_ENDPOINT}/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export async function deleteDocument(id: string): Promise<void> {
  return apiClient<void>(`${DOCUMENTS_ENDPOINT}/${id}`, {
    method: 'DELETE',
  });
}

export async function getCollections(): Promise<Collection[]> {
  return apiClient<Collection[]>(COLLECTIONS_ENDPOINT);
}

export async function getCollection(id: string): Promise<Collection> {
  return apiClient<Collection>(`${COLLECTIONS_ENDPOINT}/${id}`);
}

export async function createCollection(data: Partial<Collection>): Promise<Collection> {
  return apiClient<Collection>(COLLECTIONS_ENDPOINT, {
    method: 'POST',
    body: data,
  });
}

export async function updateCollection(id: string, data: Partial<Collection>): Promise<Collection> {
  return apiClient<Collection>(`${COLLECTIONS_ENDPOINT}/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export async function deleteCollection(id: string): Promise<void> {
  return apiClient<void>(`${COLLECTIONS_ENDPOINT}/${id}`, {
    method: 'DELETE',
  });
}