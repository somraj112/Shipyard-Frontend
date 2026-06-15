/**
 * Shared TypeScript Types for Shipyard Frontend
 *
 * These types mirror the backend's shared-types package
 * and define the shape of API responses.
 */

// ── Workflow States ──────────────────────────────
export type WorkflowState =
  | 'backlog'
  | 'in_progress'
  | 'in_review'
  | 'changes_requested'
  | 'approved'
  | 'merged'
  | 'released';

// ── User Roles ───────────────────────────────────
export type UserRole = 'org_admin' | 'manager' | 'engineer';

// ── API Response Types ───────────────────────────
export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

export interface DetailedHealthResponse extends HealthResponse {
  uptime: number;
  memory: {
    heapUsed: string;
    heapTotal: string;
    rss: string;
  };
  version: string;
}

// ── Domain Entities (planned) ────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface WorkflowItem {
  id: string;
  title: string;
  state: WorkflowState;
  assigneeId?: string;
  repositoryId: string;
  pullRequestNumber?: number;
  createdAt: string;
  updatedAt: string;
}
