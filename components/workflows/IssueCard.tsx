'use client';

import { cn } from '@/lib/utils';
import Avatar from '@/components/ui/Avatar';
import {
  issueTypeMeta,
  priorityMeta,
  getLabelColor,
} from '@/lib/utils/workflow';
import type { Issue } from '@/types';

function formatDueDate(dueDate: string): { label: string; overdue: boolean } {
  const due = new Date(dueDate);
  const now = new Date();
  const diff = due.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const overdue = days < 0;

  if (days === 0) return { label: 'Due today', overdue: false };
  if (days === 1) return { label: 'Due tomorrow', overdue: false };
  if (days === -1) return { label: 'Due yesterday', overdue: true };
  if (days < 0) return { label: `${Math.abs(days)}d overdue`, overdue: true };
  if (days <= 7) return { label: `${days}d left`, overdue: false };

  return {
    label: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    overdue: false,
  };
}

export default function IssueCard({
  issue,
  selected,
  isDragging,
  onClick,
  onSelect,
}: {
  issue: Issue;
  selected?: boolean;
  isDragging?: boolean;
  onClick?: () => void;
  onSelect?: (e: React.MouseEvent) => void;
}) {
  const typeMeta = issueTypeMeta[issue.type];
  const pMeta = priorityMeta[issue.priority];
  const dueInfo = issue.dueDate ? formatDueDate(issue.dueDate) : null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cn(
        'group relative rounded-lg border bg-[var(--background)] p-3 cursor-pointer select-none',
        'transition-all duration-200 ease-out',
        'hover:border-zinc-400 dark:hover:border-zinc-500 hover:shadow-sm',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
        selected
          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
          : 'border-[var(--border)]',
        isDragging && 'shadow-lg rotate-[1.5deg] scale-[1.02] opacity-90'
      )}
      style={{ transform: isDragging ? 'rotate(1.5deg) scale(1.02) translateZ(0)' : undefined }}
    >
      {/* Multi-select checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(e);
        }}
        className={cn(
          'absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-150',
          selected
            ? 'border-blue-500 bg-blue-500 text-white opacity-100 scale-100'
            : 'border-[var(--border)] bg-[var(--background)] opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100'
        )}
        aria-label={selected ? 'Deselect issue' : 'Select issue'}
      >
        {selected && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M2 6l3 3 5-5" />
          </svg>
        )}
      </button>

      <div className="flex items-start gap-2">
        <span className="text-base leading-none shrink-0" title={typeMeta.label}>
          {typeMeta.icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-snug line-clamp-2">{issue.title}</p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)] font-mono">
            {issue.id}
          </p>
        </div>
        {issue.priority !== 'none' && (
          <span
            className={cn('text-xs font-bold shrink-0', pMeta.color)}
            title={`${pMeta.label} priority`}
          >
            ●
          </span>
        )}
      </div>

      {issue.pullRequest && (
        <div className="mt-2 flex items-center gap-1.5 rounded-md bg-[var(--muted)] px-2 py-1">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="shrink-0">
            <path d="M5 3.25a2.25 2.25 0 1 1-2.25 2.25A2.25 2.25 0 0 1 5 3.25zM10.75 4.5a.75.75 0 0 0 0 1.5h.5a1.75 1.75 0 0 1 1.75 1.75v2.25h-2.5a.75.75 0 0 0 0 1.5h2.5v2.25a1.75 1.75 0 0 1-1.75 1.75h-.5a.75.75 0 0 0 0 1.5h.5a3.25 3.25 0 0 0 3.25-3.25V7.75a3.25 3.25 0 0 0-3.25-3.25z" />
          </svg>
          <span className="text-xs font-medium">#{issue.pullRequest.number}</span>
        </div>
      )}

      {issue.milestone && (
        <div className="mt-2 flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M7.75 1a.75.75 0 0 1 .75.75V3h3.634a.75.75 0 0 1 .576.27l1.302 1.565a.75.75 0 0 1 .096.375V12.5A1.75 1.75 0 0 1 12.358 14H3.642A1.75 1.75 0 0 1 2 12.5V4.21a.75.75 0 0 1 .096-.375L3.398 2.27A.75.75 0 0 1 3.974 2H7V1.75A.75.75 0 0 1 7.75 1z" />
          </svg>
          <span className="truncate">{issue.milestone.title}</span>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1 min-w-0">
          {issue.labels.slice(0, 2).map((label) => (
            <span
              key={label}
              className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', getLabelColor(label))}
            >
              {label}
            </span>
          ))}
          {issue.labels.length > 2 && (
            <span className="text-[10px] text-[var(--muted-foreground)]">
              +{issue.labels.length - 2}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {dueInfo && (
            <span
              className={cn(
                'text-[10px] font-medium',
                dueInfo.overdue ? 'text-red-500' : 'text-[var(--muted-foreground)]'
              )}
            >
              {dueInfo.label}
            </span>
          )}
          {issue.assignee ? (
            <Avatar name={issue.assignee.name} src={issue.assignee.avatarUrl} size="sm" />
          ) : (
            <span className="h-6 w-6 rounded-full border border-dashed border-[var(--border)]" />
          )}
        </div>
      </div>
    </div>
  );
}
