import type { Issue, User, WorkflowState } from '@/types';

export interface Milestone {
  id: string;
  title: string;
  dueDate?: string;
  progress: number;
  openIssues: number;
  closedIssues: number;
}

export interface IssueComment {
  id: string;
  body: string;
  author: User;
  createdAt: string;
}

export interface IssueActivityEntry {
  id: string;
  type: 'state_change' | 'comment' | 'assigned' | 'label_added' | 'priority_changed' | 'created';
  user: User;
  from?: string;
  to?: string;
  message?: string;
  timestamp: string;
}

export interface BoardColumn {
  id: string;
  state: WorkflowState;
  label: string;
  order: number;
  wipLimit?: number;
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  type: 'project' | 'repository' | 'team' | 'custom';
  projectId?: string;
  repositoryId?: string;
  teamId?: string;
  columns: BoardColumn[];
  isDefault?: boolean;
}

export interface SavedView {
  id: string;
  name: string;
  boardId: string;
  filters: KanbanFilters;
  sort: KanbanSort;
  isDefault?: boolean;
}

export interface KanbanFilters {
  search: string;
  states: WorkflowState[];
  priorities: string[];
  labels: string[];
  assignees: string[];
  repositories: string[];
  milestones: string[];
  types: string[];
  hasDueDate?: boolean;
  overdue?: boolean;
}

export interface KanbanSort {
  field: 'priority' | 'dueDate' | 'updatedAt' | 'createdAt' | 'title';
  direction: 'asc' | 'desc';
}

export interface IssueUpdatePayload {
  state?: WorkflowState;
  priority?: Issue['priority'];
  assigneeId?: string | null;
  labels?: string[];
  milestoneId?: string | null;
  dueDate?: string | null;
  title?: string;
  description?: string;
}

export interface BulkUpdatePayload {
  issueIds: string[];
  updates: IssueUpdatePayload;
}

export interface CreateIssuePayload {
  title: string;
  description?: string;
  state?: WorkflowState;
  priority?: Issue['priority'];
  type?: Issue['type'];
  assigneeId?: string;
  repositoryId: string;
  labels?: string[];
  milestoneId?: string;
  dueDate?: string;
  boardId?: string;
}

export const defaultKanbanFilters: KanbanFilters = {
  search: '',
  states: [],
  priorities: [],
  labels: [],
  assignees: [],
  repositories: [],
  milestones: [],
  types: [],
};

export const defaultKanbanSort: KanbanSort = {
  field: 'priority',
  direction: 'desc',
};
