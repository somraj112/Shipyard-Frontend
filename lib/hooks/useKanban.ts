'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { IssueService } from '@/lib/services/issue.service';
import { BoardService } from '@/lib/services/board.service';
import { useToast } from '@/components/ui/Toast';
import type { Issue, WorkflowState } from '@/types';
import type {
  Board,
  SavedView,
  KanbanFilters,
  KanbanSort,
  CreateIssuePayload,
  IssueUpdatePayload,
} from '@/types/kanban';
import {
  defaultKanbanFilters,
  defaultKanbanSort,
} from '@/types/kanban';

export function useKanban(initialBoardId = 'board_default') {
  const { toast } = useToast();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [activeBoardId, setActiveBoardId] = useState(initialBoardId);
  const [activeViewId, setActiveViewId] = useState<string>('view_all');
  const [filters, setFilters] = useState<KanbanFilters>(defaultKanbanFilters);
  const [sort, setSort] = useState<KanbanSort>(defaultKanbanSort);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [labels, setLabels] = useState<string[]>([]);

  const activeBoard = boards.find((b) => b.id === activeBoardId);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [issuesData, boardsData, viewsData, meta] = await Promise.all([
        IssueService.getAll(activeBoardId),
        BoardService.getAll(),
        BoardService.getSavedViews(activeBoardId),
        BoardService.getMetadata(),
      ]);
      setIssues(issuesData);
      setBoards(boardsData);
      setSavedViews(viewsData);
      setLabels(meta.labels);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load board');
    } finally {
      setLoading(false);
    }
  }, [activeBoardId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredIssues = useMemo(() => {
    const filtered = IssueService.filterIssues(issues, filters);
    return IssueService.sortIssues(filtered, sort);
  }, [issues, filters, sort]);

  const applyView = useCallback(
    (viewId: string) => {
      const view = savedViews.find((v) => v.id === viewId);
      if (view) {
        setActiveViewId(viewId);
        setFilters(view.filters);
        setSort(view.sort);
      }
    },
    [savedViews]
  );

  const moveIssue = useCallback(
    async (id: string, state: WorkflowState, columnOrder?: number) => {
      const prev = issues;
      setIssues((current) =>
        current.map((issue) =>
          issue.id === id
            ? { ...issue, state, columnOrder, updatedAt: new Date().toISOString() }
            : issue
        )
      );

      try {
        const updated = await IssueService.move(id, state, columnOrder);
        setIssues((current) =>
          current.map((issue) => (issue.id === id ? updated : issue))
        );
        if (selectedIssue?.id === id) setSelectedIssue(updated);
      } catch {
        setIssues(prev);
        toast('Failed to move issue', 'error');
      }
    },
    [issues, selectedIssue, toast]
  );

  const reorderInColumn = useCallback(
    async (state: WorkflowState, orderedIds: string[]) => {
      setIssues((current) => {
        const updated = [...current];
        orderedIds.forEach((id, index) => {
          const idx = updated.findIndex((i) => i.id === id);
          if (idx !== -1) {
            updated[idx] = { ...updated[idx], columnOrder: index, state };
          }
        });
        return updated;
      });

      try {
        await IssueService.reorder(state, orderedIds);
      } catch {
        toast('Failed to reorder issues', 'error');
        loadData();
      }
    },
    [toast, loadData]
  );

  const updateIssue = useCallback(
    async (id: string, updates: IssueUpdatePayload) => {
      const prev = issues;
      setIssues((current) =>
        current.map((issue) =>
          issue.id === id
            ? {
                ...issue,
                ...updates,
                updatedAt: new Date().toISOString(),
              }
            : issue
        )
      );

      try {
        const updated = await IssueService.update(id, updates);
        setIssues((current) =>
          current.map((issue) => (issue.id === id ? updated : issue))
        );
        if (selectedIssue?.id === id) setSelectedIssue(updated);
        toast('Issue updated', 'success');
        return updated;
      } catch {
        setIssues(prev);
        toast('Failed to update issue', 'error');
        return null;
      }
    },
    [issues, selectedIssue, toast]
  );

  const bulkUpdate = useCallback(
    async (updates: IssueUpdatePayload) => {
      const ids = Array.from(selectedIds);
      if (ids.length === 0) return;

      try {
        const updated = await IssueService.bulkUpdate({ issueIds: ids, updates });
        setIssues((current) => {
          const map = new Map(updated.map((i) => [i.id, i]));
          return current.map((issue) => map.get(issue.id) ?? issue);
        });
        setSelectedIds(new Set());
        toast(`${ids.length} issues updated`, 'success');
      } catch {
        toast('Bulk update failed', 'error');
      }
    },
    [selectedIds, toast]
  );

  const createIssue = useCallback(
    async (payload: CreateIssuePayload) => {
      try {
        const issue = await IssueService.create({
          ...payload,
          boardId: activeBoardId,
        });
        setIssues((current) => [...current, issue]);
        toast('Issue created', 'success');
        return issue;
      } catch {
        toast('Failed to create issue', 'error');
        return null;
      }
    },
    [activeBoardId, toast]
  );

  const toggleSelect = useCallback((id: string, multi = false) => {
    setSelectedIds((prev) => {
      const next = new Set(multi ? prev : []);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const openIssue = useCallback(
    async (id: string) => {
      try {
        const issue = await IssueService.getById(id);
        setSelectedIssue(issue);
      } catch {
        const local = issues.find((i) => i.id === id);
        if (local) setSelectedIssue(local);
      }
    },
    [issues]
  );

  return {
    issues: filteredIssues,
    allIssues: issues,
    boards,
    savedViews,
    activeBoard,
    activeBoardId,
    setActiveBoardId,
    activeViewId,
    applyView,
    filters,
    setFilters,
    sort,
    setSort,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    selectedIssue,
    setSelectedIssue,
    openIssue,
    moveIssue,
    reorderInColumn,
    updateIssue,
    bulkUpdate,
    createIssue,
    loading,
    error,
    labels,
    reload: loadData,
  };
}
