import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/mock/store';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const board = mockStore.getBoard(id);

  if (!board) {
    return NextResponse.json({ error: 'Board not found' }, { status: 404 });
  }

  return NextResponse.json(board);
}
