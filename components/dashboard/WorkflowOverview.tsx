import { Card, CardHeader, CardTitle } from '@/components/ui';
import { workflowStates } from '@/lib/utils/workflow';
import type { WorkflowState } from '@/types';

const columnColors: Record<WorkflowState, string> = {
  backlog: 'bg-zinc-400',
  assigned: 'bg-sky-500',
  development: 'bg-blue-500',
  pull_request: 'bg-violet-500',
  review: 'bg-amber-500',
  merged: 'bg-emerald-500',
  released: 'bg-cyan-500',
  completed: 'bg-zinc-500',
};

export default function WorkflowOverview({
  counts,
}: {
  counts: Record<WorkflowState, number>;
}) {
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return (
    <Card padding="md">
      <CardHeader>
        <CardTitle>Workflow Distribution</CardTitle>
        <span className="text-xs text-[var(--muted-foreground)]">
          {total} issues
        </span>
      </CardHeader>
      <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-[var(--muted)]">
        {workflowStates.map((s) =>
          counts[s.state] ? (
            <div
              key={s.state}
              className={columnColors[s.state]}
              style={{ width: `${(counts[s.state] / total) * 100}%` }}
              title={`${s.label}: ${counts[s.state]}`}
            />
          ) : null
        )}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-8">
        {workflowStates.map((s) => (
          <div key={s.state} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${columnColors[s.state]}`} />
            <div>
              <p className="text-sm font-semibold">{counts[s.state] || 0}</p>
              <p className="text-xs text-[var(--muted-foreground)]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
