/**
 * Shared TypeScript Types for Shipyard Frontend
 */

// ── Workflow States ──────────────────────────────
export type WorkflowState =
  | 'backlog'
  | 'assigned'
  | 'development'
  | 'pull_request'
  | 'review'
  | 'merged'
  | 'released'
  | 'completed';

// ── User Roles ───────────────────────────────────
export type UserRole =
  | 'org_admin'
  | 'manager'
  | 'team_lead'
  | 'engineer'
  | 'product_manager';

// ── Priority ─────────────────────────────────────
export type Priority = 'none' | 'low' | 'medium' | 'high' | 'urgent';

// ── Issue Type ───────────────────────────────────
export type IssueType = 'bug' | 'feature' | 'task' | 'improvement';

// ── Health ───────────────────────────────────────
export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

export interface DetailedHealthResponse extends HealthResponse {
  uptime: number;
  memory: { heapUsed: string; heapTotal: string; rss: string };
  version: string;
}

// ── User ─────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

// ── Organization ─────────────────────────────────
export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

// ── Repository ───────────────────────────────────
export interface Repository {
  id: string;
  name: string;
  fullName: string;
  owner: string;
  url: string;
  defaultBranch: string;
  connected: boolean;
  createdAt: string;
}

// ── Milestone (re-exported from kanban for convenience) ──
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
  type:
    | 'state_change'
    | 'comment'
    | 'assigned'
    | 'label_added'
    | 'priority_changed'
    | 'created';
  user: User;
  from?: string;
  to?: string;
  message?: string;
  timestamp: string;
}

// ── Issue ────────────────────────────────────────
export interface Issue {
  id: string;
  title: string;
  description?: string;
  state: WorkflowState;
  priority: Priority;
  type: IssueType;
  assignee?: User;
  repository: Repository;
  labels: string[];
  milestone?: Milestone;
  dueDate?: string;
  boardId?: string;
  columnOrder?: number;
  pullRequest?: {
    number: number;
    url: string;
    title: string;
    state: 'open' | 'closed' | 'merged';
  };
  comments?: IssueComment[];
  activityLog?: IssueActivityEntry[];
  createdAt: string;
  updatedAt: string;
}

// ── Team ─────────────────────────────────────────
export interface Team {
  id: string;
  name: string;
  members: User[];
}

// ── Activity ─────────────────────────────────────
export interface Activity {
  id: string;
  type: 'state_change' | 'pr_opened' | 'pr_merged' | 'comment' | 'assigned';
  issue: { id: string; title: string };
  user: User;
  from?: string;
  to?: string;
  timestamp: string;
}

// ── Dashboard Stats ──────────────────────────────
export interface DashboardStats {
  activeWorkflows: number;
  openPRs: number;
  teamMembers: number;
  repositories: number;
  issuesByState: Record<WorkflowState, number>;
  recentActivity: Activity[];
}

// ── Workflow Column (for Kanban) ─────────────────
export interface WorkflowColumn {
  state: WorkflowState;
  label: string;
  issues: Issue[];
}
