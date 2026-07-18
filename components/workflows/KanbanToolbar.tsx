'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import DropdownMenu from '@/components/ui/DropdownMenu';
import { cn } from '@/lib/utils';
import { workflowStates, priorityMeta, issueTypeMeta } from '@/lib/utils/workflow';
import type { Board, SavedView, KanbanFilters, KanbanSort } from '@/types/kanban';
import type { WorkflowState } from '@/types';

interface KanbanToolbarProps {
  boards: Board[];
  savedViews: SavedView[];
  activeBoardId: string;
  activeViewId: string;
  filters: KanbanFilters;
  sort: KanbanSort;
  labels: string[];
  onBoardChange: (boardId: string) => void;
  onViewChange: (viewId: string) => void;
  onFiltersChange: (filters: KanbanFilters) => void;
  onSortChange: (sort: KanbanSort) => void;
  onCreateIssue: () => void;
}

export default function KanbanToolbar({
  boards,
  savedViews,
  activeBoardId,
  activeViewId,
  filters,
  sort,
  labels,
  onBoardChange,
  onViewChange,
  onFiltersChange,
  onSortChange,
  onCreateIssue,
}: KanbanToolbarProps) {
  const [showFilters, setShowFilters] = useState(false);
  const activeBoard = boards.find((b) => b.id === activeBoardId);
  const activeFiltersCount =
    filters.priorities.length +
    filters.labels.length +
    filters.assignees.length +
    filters.states.length +
    filters.types.length +
    (filters.overdue ? 1 : 0);

  function toggleFilter<T extends string>(
    key: keyof KanbanFilters,
    value: T
  ) {
    const current = filters[key] as T[];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [key]: next });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Board selector */}
        <DropdownMenu
          align="left"
          trigger={
            <button className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm font-medium hover:bg-[var(--muted)] transition-colors cursor-pointer">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M1.5 2.75a.25.25 0 0 1 .25-.25h8.5a.25.25 0 0 1 .25.25v5.5a.25.25 0 0 1-.25.25h-8.5a.25.25 0 0 1-.25-.25zm10.75 0a.25.25 0 0 1 .25-.25h2.5a.25.25 0 0 1 .25.25v5.5a.25.25 0 0 1-.25.25h-2.5a.25.25 0 0 1-.25-.25zm0 8a.25.25 0 0 1 .25-.25h2.5a.25.25 0 0 1 .25.25v2.5a.25.25 0 0 1-.25.25h-2.5a.25.25 0 0 1-.25-.25z" />
              </svg>
              {activeBoard?.name ?? 'Select Board'}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M3 4.5L6 7.5L9 4.5" />
              </svg>
            </button>
          }
          items={boards.map((b) => ({
            label: b.name,
            onClick: () => onBoardChange(b.id),
          }))}
        />

        {/* Saved views */}
        <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] p-0.5">
          {savedViews.map((view) => (
            <button
              key={view.id}
              onClick={() => onViewChange(view.id)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer',
                activeViewId === view.id
                  ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              )}
            >
              {view.name}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Search */}
        <div className="relative w-64">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z" />
          </svg>
          <Input
            placeholder="Search issues..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-8 h-8 text-sm"
          />
        </div>

        {/* Filter toggle */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={activeFiltersCount > 0 ? 'border-blue-500/50' : ''}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1.5 3.25a.75.75 0 0 1 .75-.75h11.5a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1-.75-.75zm2.5 4.25a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5H4.75a.75.75 0 0 1-.75-.75zm2.5 4.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H7.25a.75.75 0 0 1-.75-.75z" />
          </svg>
          Filters
          {activeFiltersCount > 0 && (
            <span className="ml-1 rounded-full bg-blue-500 px-1.5 text-[10px] text-white">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        {/* Sort */}
        <DropdownMenu
          align="right"
          trigger={
            <Button variant="secondary" size="sm">
              Sort: {sort.field}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M3 4.5L6 7.5L9 4.5" />
              </svg>
            </Button>
          }
          items={(
            ['priority', 'dueDate', 'updatedAt', 'createdAt', 'title'] as const
          ).map((field) => ({
            label: `${field} (${sort.field === field ? sort.direction : 'desc'})`,
            onClick: () =>
              onSortChange({
                field,
                direction:
                  sort.field === field && sort.direction === 'desc' ? 'asc' : 'desc',
              }),
          }))}
        />

        <Button size="sm" onClick={onCreateIssue}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Issue
        </Button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--sidebar)] p-4 space-y-4 animate-[fadeIn_0.2s_ease-out]">
          <div>
            <p className="text-xs font-medium text-[var(--muted-foreground)] mb-2">Priority</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(priorityMeta)
                .filter(([k]) => k !== 'none')
                .map(([key, meta]) => (
                  <button
                    key={key}
                    onClick={() => toggleFilter('priorities', key)}
                    className={cn(
                      'rounded-md px-2 py-1 text-xs font-medium border transition-colors cursor-pointer',
                      filters.priorities.includes(key)
                        ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'border-[var(--border)] hover:bg-[var(--muted)]'
                    )}
                  >
                    {meta.label}
                  </button>
                ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-[var(--muted-foreground)] mb-2">Type</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(issueTypeMeta).map(([key, meta]) => (
                <button
                  key={key}
                  onClick={() => toggleFilter('types', key)}
                  className={cn(
                    'rounded-md px-2 py-1 text-xs font-medium border transition-colors cursor-pointer',
                    filters.types.includes(key)
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-[var(--border)] hover:bg-[var(--muted)]'
                  )}
                >
                  {meta.icon} {meta.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-[var(--muted-foreground)] mb-2">Labels</p>
            <div className="flex flex-wrap gap-1.5">
              {labels.map((label) => (
                <button
                  key={label}
                  onClick={() => toggleFilter('labels', label)}
                  className={cn(
                    'rounded-md px-2 py-1 text-xs font-medium border transition-colors cursor-pointer',
                    filters.labels.includes(label)
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-[var(--border)] hover:bg-[var(--muted)]'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-[var(--muted-foreground)] mb-2">State</p>
            <div className="flex flex-wrap gap-1.5">
              {workflowStates.map((s) => (
                <button
                  key={s.state}
                  onClick={() => toggleFilter('states', s.state as WorkflowState)}
                  className={cn(
                    'rounded-md px-2 py-1 text-xs font-medium border transition-colors cursor-pointer',
                    filters.states.includes(s.state)
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-[var(--border)] hover:bg-[var(--muted)]'
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={!!filters.overdue}
                onChange={(e) =>
                  onFiltersChange({ ...filters, overdue: e.target.checked || undefined })
                }
                className="rounded"
              />
              Overdue only
            </label>
            <button
              onClick={() =>
                onFiltersChange({
                  search: filters.search,
                  states: [],
                  priorities: [],
                  labels: [],
                  assignees: [],
                  repositories: [],
                  milestones: [],
                  types: [],
                })
              }
              className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
