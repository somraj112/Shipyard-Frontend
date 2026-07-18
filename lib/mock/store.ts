/**
 * In-memory mock store for BFF API routes.
 * Persists mutations during the server process lifetime.
 */

import type { Issue, WorkflowState } from '@/types';
import type { Board, SavedView, CreateIssuePayload, IssueUpdatePayload } from '@/types/kanban';
import {
  seedIssues,
  seedBoards,
  seedSavedViews,
  getUserById,
  getRepositoryById,
  getMilestoneById,
} from '@/lib/mock/data/seed';
import { workflowStateMeta } from '@/lib/utils/workflow';

class MockStore {
  private issues: Issue[] = [];
  private boards: Board[] = [];
  private savedViews: SavedView[] = [];
  private issueCounter = 15;

  constructor() {
    this.reset();
  }

  reset() {
    this.issues = structuredClone(seedIssues);
    this.boards = structuredClone(seedBoards);
    this.savedViews = structuredClone(seedSavedViews);
    this.issueCounter = 15;
  }

  // ── Issues ─────────────────────────────────────

  getIssues(params?: { boardId?: string; state?: WorkflowState }): Issue[] {
    let result = [...this.issues];
    if (params?.boardId) {
      result = result.filter((i) => i.boardId === params.boardId);
    }
    if (params?.state) {
      result = result.filter((i) => i.state === params.state);
    }
    return result.sort((a, b) => (a.columnOrder ?? 0) - (b.columnOrder ?? 0));
  }

  getIssue(id: string): Issue | undefined {
    return this.issues.find((i) => i.id === id);
  }

  updateIssue(id: string, updates: IssueUpdatePayload): Issue | null {
    const index = this.issues.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const issue = this.issues[index];
    const now = new Date().toISOString();
    const activityEntries = [...(issue.activityLog ?? [])];

    if (updates.state && updates.state !== issue.state) {
      activityEntries.push({
        id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type: 'state_change',
        user: issue.assignee ?? getUserById('usr_4')!,
        from: workflowStateMeta(issue.state).label,
        to: workflowStateMeta(updates.state).label,
        timestamp: now,
      });
    }

    if (updates.assigneeId !== undefined) {
      const newAssignee = updates.assigneeId ? getUserById(updates.assigneeId) : undefined;
      if (newAssignee?.id !== issue.assignee?.id) {
        activityEntries.push({
          id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          type: 'assigned',
          user: getUserById('usr_4')!,
          to: newAssignee?.name ?? 'Unassigned',
          timestamp: now,
        });
      }
    }

    const updated: Issue = {
      ...issue,
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.state !== undefined && { state: updates.state }),
      ...(updates.priority !== undefined && { priority: updates.priority }),
      ...(updates.labels !== undefined && { labels: updates.labels }),
      ...(updates.dueDate !== undefined && { dueDate: updates.dueDate ?? undefined }),
      ...(updates.assigneeId !== undefined && {
        assignee: updates.assigneeId ? getUserById(updates.assigneeId) : undefined,
      }),
      ...(updates.milestoneId !== undefined && {
        milestone: updates.milestoneId ? getMilestoneById(updates.milestoneId) : undefined,
      }),
      activityLog: activityEntries,
      updatedAt: now,
    };

    this.issues[index] = updated;
    return updated;
  }

  bulkUpdateIssue(ids: string[], updates: IssueUpdatePayload): Issue[] {
    return ids
      .map((id) => this.updateIssue(id, updates))
      .filter((i): i is Issue => i !== null);
  }

  moveIssue(
    id: string,
    state: WorkflowState,
    columnOrder?: number
  ): Issue | null {
    const issue = this.getIssue(id);
    if (!issue) return null;

    const updates: IssueUpdatePayload = { state };
    const updated = this.updateIssue(id, updates);
    if (!updated) return null;

    if (columnOrder !== undefined) {
      const index = this.issues.findIndex((i) => i.id === id);
      this.issues[index] = { ...this.issues[index], columnOrder };
    }

    return this.issues.find((i) => i.id === id) ?? null;
  }

  reorderIssues(state: WorkflowState, orderedIds: string[]): void {
    orderedIds.forEach((id, index) => {
      const issueIndex = this.issues.findIndex((i) => i.id === id);
      if (issueIndex !== -1 && this.issues[issueIndex].state === state) {
        this.issues[issueIndex] = { ...this.issues[issueIndex], columnOrder: index };
      }
    });
  }

  createIssue(payload: CreateIssuePayload): Issue {
    this.issueCounter += 1;
    const id = `SHIP-${this.issueCounter}`;
    const now = new Date().toISOString();
    const repository = getRepositoryById(payload.repositoryId)!;

    const issue: Issue = {
      id,
      title: payload.title,
      description: payload.description,
      state: payload.state ?? 'backlog',
      priority: payload.priority ?? 'none',
      type: payload.type ?? 'task',
      assignee: payload.assigneeId ? getUserById(payload.assigneeId) : undefined,
      repository,
      labels: payload.labels ?? [],
      milestone: payload.milestoneId ? getMilestoneById(payload.milestoneId) : undefined,
      dueDate: payload.dueDate,
      boardId: payload.boardId ?? 'board_default',
      columnOrder: this.issues.filter((i) => i.state === (payload.state ?? 'backlog')).length,
      activityLog: [
        {
          id: `act_${Date.now()}`,
          type: 'created',
          user: getUserById('usr_4')!,
          timestamp: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    this.issues.push(issue);
    return issue;
  }

  deleteIssue(id: string): boolean {
    const index = this.issues.findIndex((i) => i.id === id);
    if (index === -1) return false;
    this.issues.splice(index, 1);
    return true;
  }

  addComment(issueId: string, body: string, authorId: string): Issue | null {
    const index = this.issues.findIndex((i) => i.id === issueId);
    if (index === -1) return null;

    const author = getUserById(authorId);
    if (!author) return null;

    const now = new Date().toISOString();
    const comment = {
      id: `cmt_${Date.now()}`,
      body,
      author,
      createdAt: now,
    };

    const issue = this.issues[index];
    this.issues[index] = {
      ...issue,
      comments: [...(issue.comments ?? []), comment],
      activityLog: [
        ...(issue.activityLog ?? []),
        {
          id: `act_${Date.now()}`,
          type: 'comment' as const,
          user: author,
          message: body.slice(0, 80),
          timestamp: now,
        },
      ],
      updatedAt: now,
    };

    return this.issues[index];
  }

  // ── Boards ─────────────────────────────────────

  getBoards(): Board[] {
    return [...this.boards];
  }

  getBoard(id: string): Board | undefined {
    return this.boards.find((b) => b.id === id);
  }

  // ── Saved Views ────────────────────────────────

  getSavedViews(boardId?: string): SavedView[] {
    if (boardId) {
      return this.savedViews.filter((v) => v.boardId === boardId);
    }
    return [...this.savedViews];
  }

  getSavedView(id: string): SavedView | undefined {
    return this.savedViews.find((v) => v.id === id);
  }

  // ── Metadata ───────────────────────────────────

  getAllLabels(): string[] {
    const labels = new Set<string>();
    this.issues.forEach((i) => i.labels.forEach((l) => labels.add(l)));
    return Array.from(labels).sort();
  }
}

const globalForMock = globalThis as typeof globalThis & { __shipyardMockStore?: MockStore };

export const mockStore = globalForMock.__shipyardMockStore ?? new MockStore();

if (process.env.NODE_ENV !== 'production') {
  globalForMock.__shipyardMockStore = mockStore;
}
