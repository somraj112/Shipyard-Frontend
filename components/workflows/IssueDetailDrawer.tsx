'use client';

import { useState } from 'react';
import Drawer from '@/components/ui/Drawer';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Input from '@/components/ui/Input';
import {
  workflowStateMeta,
  priorityMeta,
  issueTypeMeta,
  getLabelColor,
} from '@/lib/utils/workflow';
import { formatDate, cn } from '@/lib/utils';
import type { Issue, WorkflowState } from '@/types';
import type { IssueUpdatePayload } from '@/types/kanban';

export default function IssueDetailDrawer({
  issue,
  open,
  onClose,
  onUpdate,
}: {
  issue: Issue | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: IssueUpdatePayload) => Promise<unknown>;
}) {
  const [comment, setComment] = useState('');

  if (!issue) return null;

  const stateMeta = workflowStateMeta(issue.state);
  const typeMeta = issueTypeMeta[issue.type];
  const pMeta = priorityMeta[issue.priority];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={issue.title}
      subtitle={`${issue.id} · ${issue.repository.fullName}`}
      width="xl"
    >
      <div className="px-6 py-4 space-y-6">
        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <MetaField label="State">
            <Badge variant={stateMeta.badge}>{stateMeta.label}</Badge>
          </MetaField>
          <MetaField label="Priority">
            <span className={cn('text-sm font-medium', pMeta.color)}>
              {pMeta.label}
            </span>
          </MetaField>
          <MetaField label="Type">
            <span className="text-sm">
              {typeMeta.icon} {typeMeta.label}
            </span>
          </MetaField>
          <MetaField label="Assignee">
            {issue.assignee ? (
              <div className="flex items-center gap-2">
                <Avatar name={issue.assignee.name} src={issue.assignee.avatarUrl} size="sm" />
                <span className="text-sm">{issue.assignee.name}</span>
              </div>
            ) : (
              <span className="text-sm text-[var(--muted-foreground)]">Unassigned</span>
            )}
          </MetaField>
          {issue.dueDate && (
            <MetaField label="Due Date">
              <span className="text-sm">{formatDate(issue.dueDate)}</span>
            </MetaField>
          )}
          {issue.milestone && (
            <MetaField label="Milestone">
              <span className="text-sm">{issue.milestone.title}</span>
            </MetaField>
          )}
        </div>

        {/* Labels */}
        {issue.labels.length > 0 && (
          <div>
            <p className="text-xs font-medium text-[var(--muted-foreground)] mb-2">Labels</p>
            <div className="flex flex-wrap gap-1.5">
              {issue.labels.map((label) => (
                <span
                  key={label}
                  className={`rounded-md px-2 py-0.5 text-xs font-medium ${getLabelColor(label)}`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {issue.description && (
          <div>
            <p className="text-xs font-medium text-[var(--muted-foreground)] mb-2">Description</p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{issue.description}</p>
          </div>
        )}

        {/* PR link */}
        {issue.pullRequest && (
          <div className="rounded-lg border border-[var(--border)] p-3">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5 3.25a2.25 2.25 0 1 1-2.25 2.25A2.25 2.25 0 0 1 5 3.25zM10.75 4.5a.75.75 0 0 0 0 1.5h.5a1.75 1.75 0 0 1 1.75 1.75v2.25h-2.5a.75.75 0 0 0 0 1.5h2.5v2.25a1.75 1.75 0 0 1-1.75 1.75h-.5a.75.75 0 0 0 0 1.5h.5a3.25 3.25 0 0 0 3.25-3.25V7.75a3.25 3.25 0 0 0-3.25-3.25z" />
              </svg>
              <span className="text-sm font-medium">
                #{issue.pullRequest.number} {issue.pullRequest.title}
              </span>
              <Badge variant={issue.pullRequest.state === 'open' ? 'green' : 'purple'}>
                {issue.pullRequest.state}
              </Badge>
            </div>
          </div>
        )}

        {/* Quick state actions */}
        <div>
          <p className="text-xs font-medium text-[var(--muted-foreground)] mb-2">Move to</p>
          <div className="flex flex-wrap gap-1.5">
            {(['backlog', 'assigned', 'development', 'pull_request', 'review', 'merged', 'released', 'completed'] as WorkflowState[]).map(
              (state) => (
                <button
                  key={state}
                  disabled={issue.state === state}
                  onClick={() => onUpdate(issue.id, { state })}
                  className="rounded-md border border-[var(--border)] px-2 py-1 text-xs font-medium hover:bg-[var(--muted)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {workflowStateMeta(state).label}
                </button>
              )
            )}
          </div>
        </div>

        {/* Activity timeline */}
        {issue.activityLog && issue.activityLog.length > 0 && (
          <div>
            <p className="text-xs font-medium text-[var(--muted-foreground)] mb-3">Activity</p>
            <div className="space-y-3">
              {issue.activityLog.map((entry, i) => (
                <div key={entry.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
                    {i < issue.activityLog!.length - 1 && (
                      <div className="w-px flex-1 bg-[var(--border)] mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <p className="text-sm">
                      <span className="font-medium">{entry.user.name}</span>{' '}
                      {entry.type === 'state_change' && (
                        <>
                          moved from <span className="font-medium">{entry.from}</span> to{' '}
                          <span className="font-medium">{entry.to}</span>
                        </>
                      )}
                      {entry.type === 'assigned' && (
                        <>assigned to <span className="font-medium">{entry.to}</span></>
                      )}
                      {entry.type === 'created' && <>created this issue</>}
                      {entry.type === 'comment' && <>commented</>}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      {formatDate(entry.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        {issue.comments && issue.comments.length > 0 && (
          <div>
            <p className="text-xs font-medium text-[var(--muted-foreground)] mb-3">Comments</p>
            <div className="space-y-3">
              {issue.comments.map((c) => (
                <div key={c.id} className="rounded-lg border border-[var(--border)] p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar name={c.author.name} size="sm" />
                    <span className="text-sm font-medium">{c.author.name}</span>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {formatDate(c.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add comment */}
        <div className="border-t border-[var(--border)] pt-4">
          <Input
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mb-2"
          />
          <Button
            size="sm"
            disabled={!comment.trim()}
            onClick={() => setComment('')}
          >
            Comment
          </Button>
        </div>
      </div>
    </Drawer>
  );
}

function MetaField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-[var(--muted-foreground)] mb-1">{label}</p>
      {children}
    </div>
  );
}

