'use client';

import Button from '@/components/ui/Button';
import DropdownMenu from '@/components/ui/DropdownMenu';
import { workflowStates } from '@/lib/utils/workflow';
import type { WorkflowState } from '@/types';
import type { IssueUpdatePayload } from '@/types/kanban';

export default function BulkActionBar({
  count,
  onClear,
  onBulkUpdate,
}: {
  count: number;
  onClear: () => void;
  onBulkUpdate: (updates: IssueUpdatePayload) => void;
}) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 shadow-xl animate-[slideUp_0.3s_ease-out]">
      <span className="text-sm font-medium">{count} selected</span>
      <div className="h-4 w-px bg-[var(--border)]" />

      <DropdownMenu
        align="left"
        trigger={
          <Button variant="secondary" size="sm">
            Move to...
          </Button>
        }
        items={workflowStates.map((s) => ({
          label: s.label,
          onClick: () => onBulkUpdate({ state: s.state as WorkflowState }),
        }))}
      />

      <DropdownMenu
        align="left"
        trigger={
          <Button variant="secondary" size="sm">
            Priority
          </Button>
        }
        items={(['urgent', 'high', 'medium', 'low'] as const).map((p) => ({
          label: p.charAt(0).toUpperCase() + p.slice(1),
          onClick: () => onBulkUpdate({ priority: p }),
        }))}
      />

      <Button variant="ghost" size="sm" onClick={onClear}>
        Clear
      </Button>
    </div>
  );
}
