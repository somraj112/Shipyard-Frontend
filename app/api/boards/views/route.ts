import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const boardId = searchParams.get('boardId') ?? undefined;
  return NextResponse.json(mockStore.getSavedViews(boardId));
}
