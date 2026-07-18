import { NextResponse } from 'next/server';
import type { Repository } from '@/types';

const dummyRepos: Repository[] = [
  {
    id: 'repo_1',
    name: 'shipyard-backend',
    fullName: 'shipyard-org/shipyard-backend',
    owner: 'shipyard-org',
    url: 'https://github.com/shipyard-org/shipyard-backend',
    defaultBranch: 'main',
    connected: true,
    createdAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'repo_2',
    name: 'shipyard-frontend',
    fullName: 'shipyard-org/shipyard-frontend',
    owner: 'shipyard-org',
    url: 'https://github.com/shipyard-org/shipyard-frontend',
    defaultBranch: 'main',
    connected: true,
    createdAt: '2026-06-15T00:00:00Z',
  },
  {
    id: 'repo_3',
    name: 'docs',
    fullName: 'shipyard-org/docs',
    owner: 'shipyard-org',
    url: 'https://github.com/shipyard-org/docs',
    defaultBranch: 'main',
    connected: false,
    createdAt: '2026-05-20T00:00:00Z',
  },
];

export async function GET() {
  return NextResponse.json(dummyRepos);
}
