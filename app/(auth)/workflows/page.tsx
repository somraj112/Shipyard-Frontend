'use client';

import { useState, useCallback } from 'react';
import KanbanBoard from '@/components/workflows/KanbanBoard';
import KanbanToolbar from '@/components/workflows/KanbanToolbar';
import BulkActionBar from '@/components/workflows/BulkActionBar';
import IssueDetailDrawer from '@/components/workflows/IssueDetailDrawer';
import CreateIssueModal from '@/components/workflows/CreateIssueModal';
import { Skeleton } from '@/components/ui';
import { useKanban } from '@/lib/hooks/useKanban';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';

export default function WorkflowsPage() {
  const {
    issues,
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
  } = useKanban();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleNewIssue = useCallback(() => setShowCreateModal(true), []);

  useKeyboardShortcuts([
    { key: 'n', meta: true, handler: handleNewIssue, description: 'New issue' },
    { key: 'Escape', handler: () => { setSelectedIssue(null); clearSelection(); } },
    { key: 'a', meta: true, shift: true, handler: () => {
      issues.forEach((i) => toggleSelect(i.id, true));
    }},
  ]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Workflow Pipeline</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Engineering workflow — drag issues between columns to update state
        </p>
      </div>

      <KanbanToolbar
        boards={boards}
        savedViews={savedViews}
        activeBoardId={activeBoardId}
        activeViewId={activeViewId}
        filters={filters}
        sort={sort}
        labels={labels}
        onBoardChange={setActiveBoardId}
        onViewChange={applyView}
        onFiltersChange={setFilters}
        onSortChange={setSort}
        onCreateIssue={handleNewIssue}
      />

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          Failed to load board: {error}
        </div>
      )}

      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[480px] w-72 shrink-0 rounded-xl" />
          ))}
        </div>
      ) : activeBoard ? (
        <>
          {issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] py-20">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-sm font-medium">No issues match your filters</p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Try adjusting filters or create a new issue
              </p>
            </div>
          ) : (
            <KanbanBoard
              board={activeBoard}
              issues={issues}
              selectedIds={selectedIds}
              onMoveIssue={moveIssue}
              onReorder={reorderInColumn}
              onIssueClick={openIssue}
              onIssueSelect={toggleSelect}
            />
          )}
        </>
      ) : null}

      <BulkActionBar
        count={selectedIds.size}
        onClear={clearSelection}
        onBulkUpdate={bulkUpdate}
      />

      <IssueDetailDrawer
        issue={selectedIssue}
        open={!!selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onUpdate={updateIssue}
      />

      <CreateIssueModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={createIssue}
      />

      {/* Keyboard shortcuts hint */}
      <div className="fixed bottom-4 left-4 text-[10px] text-[var(--muted-foreground)] opacity-60">
        <kbd className="rounded border border-[var(--border)] px-1">⌘N</kbd> New ·{' '}
        <kbd className="rounded border border-[var(--border)] px-1">Esc</kbd> Close ·{' '}
        <kbd className="rounded border border-[var(--border)] px-1">Click</kbd> checkbox to multi-select
      </div>
    </div>
  );
}
