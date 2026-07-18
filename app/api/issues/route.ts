import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';
import type { CreateIssuePayload } from '@/types/kanban';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const boardId = searchParams.get('boardId') ?? undefined;
  const issues = mockStore.getIssues({ boardId });
  return NextResponse.json(issues);
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateIssuePayload;

  if (!body.title || !body.repositoryId) {
    return NextResponse.json(
      { error: 'Title and repositoryId are required' },
      { status: 400 }
    );
  }

  const issue = mockStore.createIssue(body);
  return NextResponse.json(issue, { status: 201 });
}
