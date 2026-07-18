import type { WorkflowState, Priority, IssueType } from '@/types';

export const workflowStates: {
  state: WorkflowState;
  label: string;
  badge: 'neutral' | 'blue' | 'amber' | 'green' | 'purple' | 'red' | 'cyan' | 'violet';
  color: string;
  description: string;
}[] = [
  {
    state: 'backlog',
    label: 'Backlog',
    badge: 'neutral',
    color: 'border-l-zinc-400',
    description: 'Issues awaiting triage and prioritization',
  },
  {
    state: 'assigned',
    label: 'Assigned',
    badge: 'blue',
    color: 'border-l-sky-500',
    description: 'Assigned to an engineer, ready to start',
  },
  {
    state: 'development',
    label: 'Development',
    badge: 'blue',
    color: 'border-l-blue-500',
    description: 'Actively being worked on',
  },
  {
    state: 'pull_request',
    label: 'Pull Request',
    badge: 'purple',
    color: 'border-l-violet-500',
    description: 'PR opened, awaiting review',
  },
  {
    state: 'review',
    label: 'Review',
    badge: 'amber',
    color: 'border-l-amber-500',
    description: 'Under code review',
  },
  {
    state: 'merged',
    label: 'Merged',
    badge: 'green',
    color: 'border-l-emerald-500',
    description: 'Code merged to main branch',
  },
  {
    state: 'released',
    label: 'Released',
    badge: 'cyan',
    color: 'border-l-cyan-500',
    description: 'Deployed to production',
  },
  {
    state: 'completed',
    label: 'Completed',
    badge: 'neutral',
    color: 'border-l-zinc-500',
    description: 'Fully done and verified',
  },
];

export const columnColors: Record<WorkflowState, string> = Object.fromEntries(
  workflowStates.map((s) => [s.state, s.color])
) as Record<WorkflowState, string>;

export function workflowStateMeta(state: WorkflowState) {
  return workflowStates.find((s) => s.state === state) ?? workflowStates[0];
}

/** Valid forward transitions for the default workflow */
export const validTransitions: Record<WorkflowState, WorkflowState[]> = {
  backlog: ['assigned', 'development'],
  assigned: ['backlog', 'development'],
  development: ['backlog', 'assigned', 'pull_request'],
  pull_request: ['development', 'review'],
  review: ['development', 'pull_request', 'merged'],
  merged: ['review', 'released'],
  released: ['merged', 'completed'],
  completed: ['released'],
};

export function isValidTransition(from: WorkflowState, to: WorkflowState): boolean {
  if (from === to) return true;
  return validTransitions[from]?.includes(to) ?? false;
}

export const priorityMeta: Record<Priority, { label: string; color: string; weight: number }> = {
  none: { label: 'None', color: 'text-zinc-400', weight: 0 },
  low: { label: 'Low', color: 'text-zinc-500', weight: 1 },
  medium: { label: 'Medium', color: 'text-blue-500', weight: 2 },
  high: { label: 'High', color: 'text-amber-500', weight: 3 },
  urgent: { label: 'Urgent', color: 'text-red-500', weight: 4 },
};

export const issueTypeMeta: Record<IssueType, { label: string; icon: string }> = {
  bug: { label: 'Bug', icon: '🐛' },
  feature: { label: 'Feature', icon: '✨' },
  task: { label: 'Task', icon: '✅' },
  improvement: { label: 'Improvement', icon: '⬆️' },
};

export const labelColors: Record<string, string> = {
  auth: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
  onboarding: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  backend: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  analytics: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
  bug: 'bg-red-500/15 text-red-600 dark:text-red-400',
  critical: 'bg-red-500/20 text-red-700 dark:text-red-300',
  frontend: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
  design: 'bg-pink-500/15 text-pink-600 dark:text-pink-400',
  testing: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  performance: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
  ux: 'bg-teal-500/15 text-teal-600 dark:text-teal-400',
  security: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  infra: 'bg-slate-500/15 text-slate-600 dark:text-slate-400',
};

export function getLabelColor(label: string): string {
  return labelColors[label.toLowerCase()] ?? 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400';
}
