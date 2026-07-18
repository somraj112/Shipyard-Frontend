import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';
import type { IssueUpdatePayload } from '@/types/kanban';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const issue = mockStore.getIssue(id);

  if (!issue) {
    return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
  }

  return NextResponse.json(issue);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as IssueUpdatePayload;

  const updated = mockStore.updateIssue(id, body);

  if (!updated) {
    return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = mockStore.deleteIssue(id);

  if (!deleted) {
    return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
