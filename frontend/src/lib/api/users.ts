'use client';

import { apiClient } from './client';
import { User, Role } from '@/lib/types';

const USERS_ENDPOINT = '/users';
const ROLES_ENDPOINT = '/roles';

export async function getUsers(): Promise<User[]> {
  return apiClient<User[]>(USERS_ENDPOINT);
}

export async function getUser(id: string): Promise<User> {
  return apiClient<User>(`${USERS_ENDPOINT}/${id}`);
}

export async function createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string }): Promise<User> {
  return apiClient<User>(USERS_ENDPOINT, {
    method: 'POST',
    body: data,
  });
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  return apiClient<User>(`${USERS_ENDPOINT}/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export async function deleteUser(id: string): Promise<void> {
  return apiClient<void>(`${USERS_ENDPOINT}/${id}`, {
    method: 'DELETE',
  });
}

export async function getRoles(): Promise<Role[]> {
  return apiClient<Role[]>(ROLES_ENDPOINT);
}

export async function getRole(id: string): Promise<Role> {
  return apiClient<Role>(`${ROLES_ENDPOINT}/${id}`);
}

export async function createRole(data: Partial<Role>): Promise<Role> {
  return apiClient<Role>(ROLES_ENDPOINT, {
    method: 'POST',
    body: data,
  });
}

export async function updateRole(id: string, data: Partial<Role>): Promise<Role> {
  return apiClient<Role>(`${ROLES_ENDPOINT}/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export async function deleteRole(id: string): Promise<void> {
  return apiClient<void>(`${ROLES_ENDPOINT}/${id}`, {
    method: 'DELETE',
  });
}