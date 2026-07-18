import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { body: commentBody, authorId } = body as {
    body: string;
    authorId: string;
  };

  const url = new URL(request.url);
  const segments = url.pathname.split('/');
  const issueId = segments[segments.indexOf('issues') + 1];

  if (!commentBody || !authorId) {
    return NextResponse.json(
      { error: 'body and authorId are required' },
      { status: 400 }
    );
  }

  const updated = mockStore.addComment(issueId, commentBody, authorId);

  if (!updated) {
    return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}
