import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';
import type { WorkflowState } from '@/types';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { state, orderedIds } = body as {
    state: WorkflowState;
    orderedIds: string[];
  };

  if (!state || !orderedIds) {
    return NextResponse.json(
      { error: 'state and orderedIds are required' },
      { status: 400 }
    );
  }

  mockStore.reorderIssues(state, orderedIds);
  return NextResponse.json({ ok: true });
}
