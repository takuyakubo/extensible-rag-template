export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  references?: DocumentReference[];
}

export interface DocumentReference {
  id: string;
  title: string;
  content: string;
  relevanceScore: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

// ドキュメント関連の型定義
export interface Document {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: User;
  collectionId: string;
  status: 'processing' | 'indexed' | 'error' | 'deleted';
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  owner: User;
  documentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ユーザー関連の型定義
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  isActive: boolean;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
}