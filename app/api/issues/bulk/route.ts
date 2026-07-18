import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';
import type { BulkUpdatePayload } from '@/types/kanban';

export async function PATCH(request: Request) {
  const body = (await request.json()) as BulkUpdatePayload;

  if (!body.issueIds?.length || !body.updates) {
    return NextResponse.json(
      { error: 'issueIds and updates are required' },
      { status: 400 }
    );
  }

  const updated = mockStore.bulkUpdateIssue(body.issueIds, body.updates);
  return NextResponse.json(updated);
}
