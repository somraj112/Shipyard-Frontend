'use client';

import { Droppable, Draggable } from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';
import IssueCard from '@/components/workflows/IssueCard';
import type { Issue, WorkflowState } from '@/types';

export default function KanbanColumn({
  state,
  label,
  issues,
  color,
  wipLimit,
  selectedIds,
  onIssueClick,
  onIssueSelect,
}: {
  state: WorkflowState;
  label: string;
  issues: Issue[];
  color: string;
  wipLimit?: number;
  selectedIds: Set<string>;
  onIssueClick: (id: string) => void;
  onIssueSelect: (id: string, multi: boolean) => void;
}) {
  const isOverLimit = wipLimit !== undefined && issues.length > wipLimit;

  return (
    <div
      className={cn(
        'flex w-72 shrink-0 flex-col rounded-xl border border-[var(--border)] border-l-4 bg-[var(--sidebar)]',
        color
      )}
    >
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">{label}</h3>
          {wipLimit && (
            <span className="text-[10px] text-[var(--muted-foreground)]">
              WIP {wipLimit}
            </span>
          )}
        </div>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-xs font-medium',
            isOverLimit
              ? 'bg-red-500/15 text-red-600 dark:text-red-400'
              : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
          )}
        >
          {issues.length}
        </span>
      </div>

      <Droppable droppableId={state}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 space-y-2 overflow-y-auto p-2 pt-0 min-h-[280px] transition-colors duration-200',
              snapshot.isDraggingOver && 'bg-blue-500/5 rounded-b-xl'
            )}
          >
            {issues.map((issue, index) => (
              <Draggable key={issue.id} draggableId={issue.id} index={index}>
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    style={{
                      ...dragProvided.draggableProps.style,
                      transform: dragSnapshot.isDragging
                        ? `${dragProvided.draggableProps.style?.transform ?? ''} translateZ(0)`
                        : dragProvided.draggableProps.style?.transform,
                    }}
                  >
                    <IssueCard
                      issue={issue}
                      selected={selectedIds.has(issue.id)}
                      isDragging={dragSnapshot.isDragging}
                      onClick={() => onIssueClick(issue.id)}
                      onSelect={() => onIssueSelect(issue.id, true)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {issues.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-[var(--border)] text-xs text-[var(--muted-foreground)]">
                Drop here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
