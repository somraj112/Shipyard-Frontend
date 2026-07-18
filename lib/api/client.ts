/**
 * Shipyard API Client
 *
 * Centralized functions for communicating with the BFF layer.
 * All API calls go through these functions — components use services, not this directly.
 */

import type {
  Issue,
  User,
  Repository,
  Activity,
  WorkflowState,
  DetailedHealthResponse,
} from '@/types';
import type {
  Board,
  SavedView,
  CreateIssuePayload,
  IssueUpdatePayload,
  BulkUpdatePayload,
} from '@/types/kanban';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw new Error(error.message || error.error || `API Error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// ── Health ───────────────────────────────────────
export function getHealth() {
  return apiFetch<DetailedHealthResponse>('/api/health');
}

// ── Issues ───────────────────────────────────────
export function getIssues(boardId?: string) {
  const params = boardId ? `?boardId=${boardId}` : '';
  return apiFetch<Issue[]>(`/api/issues${params}`);
}

export function getIssue(id: string) {
  return apiFetch<Issue>(`/api/issues/${id}`);
}

export function updateIssue(id: string, updates: IssueUpdatePayload) {
  return apiFetch<Issue>(`/api/issues/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export function moveIssue(id: string, state: WorkflowState, columnOrder?: number) {
  return apiFetch<Issue>(`/api/issues/${id}/move`, {
    method: 'POST',
    body: JSON.stringify({ state, columnOrder }),
  });
}

export function reorderIssues(state: WorkflowState, orderedIds: string[]) {
  return apiFetch<{ ok: boolean }>(`/api/issues/reorder`, {
    method: 'POST',
    body: JSON.stringify({ state, orderedIds }),
  });
}

export function bulkUpdateIssues(payload: BulkUpdatePayload) {
  return apiFetch<Issue[]>(`/api/issues/bulk`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function createIssue(payload: CreateIssuePayload) {
  return apiFetch<Issue>('/api/issues', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function deleteIssue(id: string) {
  return apiFetch<{ ok: boolean }>(`/api/issues/${id}`, {
    method: 'DELETE',
  });
}

export function addIssueComment(issueId: string, body: string, authorId: string) {
  return apiFetch<Issue>(`/api/issues/${issueId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body, authorId }),
  });
}

// ── Boards ───────────────────────────────────────
export function getBoards() {
  return apiFetch<Board[]>('/api/boards');
}

export function getBoard(id: string) {
  return apiFetch<Board>(`/api/boards/${id}`);
}

export function getSavedViews(boardId?: string) {
  const params = boardId ? `?boardId=${boardId}` : '';
  return apiFetch<SavedView[]>(`/api/boards/views${params}`);
}

export function getKanbanMetadata() {
  return apiFetch<{ labels: string[] }>('/api/boards/metadata');
}

// ── Team ────────────────────────────────────────
export function getTeamMembers() {
  return apiFetch<User[]>('/api/teams');
}

// ── Repositories ────────────────────────────────
export function getRepositories() {
  return apiFetch<Repository[]>('/api/repos');
}

// ── Activity ────────────────────────────────────
export function getActivity() {
  return apiFetch<Activity[]>('/api/activities');
}

// ── Auth ─────────────────────────────────────────
export function exchangeGitHubCode(code: string) {
  return apiFetch<{
    accessToken: string;
    user: User;
  }>('/api/auth', {
    method: 'POST',
    body: JSON.stringify({ code }),
  });
}

export function signOut() {
  return apiFetch<{ ok: boolean }>('/api/auth', { method: 'DELETE' });
}
