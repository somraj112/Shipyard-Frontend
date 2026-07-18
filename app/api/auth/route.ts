import { NextResponse } from 'next/server';

// Dummy GitHub OAuth callback handler.
// In production this would exchange the code for a GitHub access token.
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { code } = body;

  if (!code) {
    return NextResponse.json(
      { error: 'Missing authorization code' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    accessToken: 'gho_dummy_token_12345',
    user: {
      id: 'usr_1',
      email: 'alex@shipyard.dev',
      name: 'Alex Chen',
      role: 'engineer',
    },
  });
}

export async function DELETE() {
  return NextResponse.json({ ok: true });
}
