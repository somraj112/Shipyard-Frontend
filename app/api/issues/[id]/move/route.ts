import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';
import type { WorkflowState } from '@/types';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const { state, columnOrder } = body as {
    state: WorkflowState;
    columnOrder?: number;
  };

  if (!state) {
    return NextResponse.json({ error: 'Missing state' }, { status: 400 });
  }

  const updated = mockStore.moveIssue(id, state, columnOrder);

  if (!updated) {
    return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}
