'use client';

import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import KanbanColumn from '@/components/workflows/KanbanColumn';
import { columnColors } from '@/lib/utils/workflow';
import type { Issue, WorkflowState } from '@/types';
import type { Board } from '@/types/kanban';

export default function KanbanBoard({
  board,
  issues,
  selectedIds,
  onMoveIssue,
  onReorder,
  onIssueClick,
  onIssueSelect,
}: {
  board: Board;
  issues: Issue[];
  selectedIds: Set<string>;
  onMoveIssue: (id: string, state: WorkflowState, columnOrder?: number) => void;
  onReorder: (state: WorkflowState, orderedIds: string[]) => void;
  onIssueClick: (id: string) => void;
  onIssueSelect: (id: string, multi: boolean) => void;
}) {
  const columns = [...board.columns].sort((a, b) => a.order - b.order);

  function handleDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const destState = destination.droppableId as WorkflowState;
    const sourceState = source.droppableId as WorkflowState;

    if (destState === sourceState && destination.index === source.index) return;

    if (destState !== sourceState) {
      onMoveIssue(draggableId, destState, destination.index);
    }

    const destIssues = issues
      .filter((i) => i.state === destState && i.id !== draggableId)
      .sort((a, b) => (a.columnOrder ?? 0) - (b.columnOrder ?? 0));

    const reordered = [...destIssues];
    const movedIssue = issues.find((i) => i.id === draggableId);
    if (movedIssue) {
      reordered.splice(destination.index, 0, { ...movedIssue, state: destState });
    }

    onReorder(
      destState,
      reordered.map((i) => i.id)
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
        {columns.map((col) => {
          const colIssues = issues
            .filter((i) => i.state === col.state)
            .sort((a, b) => (a.columnOrder ?? 0) - (b.columnOrder ?? 0));

          return (
            <div key={col.id} className="snap-start">
              <KanbanColumn
                state={col.state}
                label={col.label}
                issues={colIssues}
                color={columnColors[col.state]}
                wipLimit={col.wipLimit}
                selectedIds={selectedIds}
                onIssueClick={onIssueClick}
                onIssueSelect={onIssueSelect}
              />
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
