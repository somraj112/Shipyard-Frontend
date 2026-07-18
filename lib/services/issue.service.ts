/**
 * Issue Service — business logic layer for issue operations.
 * Components should use hooks that call this service, never the API directly.
 */

import * as api from '@/lib/api/client';
import type { Issue, WorkflowState } from '@/types';
import type {
  CreateIssuePayload,
  IssueUpdatePayload,
  BulkUpdatePayload,
  KanbanFilters,
  KanbanSort,
} from '@/types/kanban';
import { priorityMeta } from '@/lib/utils/workflow';

export const IssueService = {
  async getAll(boardId?: string): Promise<Issue[]> {
    return api.getIssues(boardId);
  },

  async getById(id: string): Promise<Issue> {
    return api.getIssue(id);
  },

  async update(id: string, updates: IssueUpdatePayload): Promise<Issue> {
    return api.updateIssue(id, updates);
  },

  async move(id: string, state: WorkflowState, columnOrder?: number): Promise<Issue> {
    return api.moveIssue(id, state, columnOrder);
  },

  async reorder(state: WorkflowState, orderedIds: string[]): Promise<void> {
    return api.reorderIssues(state, orderedIds);
  },

  async bulkUpdate(payload: BulkUpdatePayload): Promise<Issue[]> {
    return api.bulkUpdateIssues(payload);
  },

  async create(payload: CreateIssuePayload): Promise<Issue> {
    return api.createIssue(payload);
  },

  async delete(id: string): Promise<void> {
    return api.deleteIssue(id);
  },

  async addComment(issueId: string, body: string, authorId: string): Promise<Issue> {
    return api.addIssueComment(issueId, body, authorId);
  },

  filterIssues(issues: Issue[], filters: KanbanFilters): Issue[] {
    let result = [...issues];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
          i.labels.some((l) => l.toLowerCase().includes(q)) ||
          i.repository.fullName.toLowerCase().includes(q)
      );
    }

    if (filters.states.length > 0) {
      result = result.filter((i) => filters.states.includes(i.state));
    }

    if (filters.priorities.length > 0) {
      result = result.filter((i) => filters.priorities.includes(i.priority));
    }

    if (filters.labels.length > 0) {
      result = result.filter((i) => filters.labels.some((l) => i.labels.includes(l)));
    }

    if (filters.assignees.length > 0) {
      result = result.filter(
        (i) => i.assignee && filters.assignees.includes(i.assignee.id)
      );
    }

    if (filters.repositories.length > 0) {
      result = result.filter((i) => filters.repositories.includes(i.repository.id));
    }

    if (filters.milestones.length > 0) {
      result = result.filter(
        (i) => i.milestone && filters.milestones.includes(i.milestone.id)
      );
    }

    if (filters.types.length > 0) {
      result = result.filter((i) => filters.types.includes(i.type));
    }

    if (filters.hasDueDate) {
      result = result.filter((i) => !!i.dueDate);
    }

    if (filters.overdue) {
      const now = new Date();
      result = result.filter(
        (i) => i.dueDate && new Date(i.dueDate) < now && i.state !== 'completed'
      );
    }

    return result;
  },

  sortIssues(issues: Issue[], sort: KanbanSort): Issue[] {
    const sorted = [...issues];
    const dir = sort.direction === 'asc' ? 1 : -1;

    sorted.sort((a, b) => {
      switch (sort.field) {
        case 'priority':
          return (priorityMeta[a.priority].weight - priorityMeta[b.priority].weight) * dir * -1;
        case 'dueDate': {
          const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          return (aDate - bDate) * dir;
        }
        case 'updatedAt':
          return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * dir;
        case 'createdAt':
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
        case 'title':
          return a.title.localeCompare(b.title) * dir;
        default:
          return 0;
      }
    });

    return sorted;
  },
};
