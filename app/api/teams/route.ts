import { NextResponse } from 'next/server';
import type { User } from '@/types';

const dummyUsers: User[] = [
  { id: 'usr_1', email: 'alex@shipyard.dev', name: 'Alex Chen', role: 'engineer' },
  { id: 'usr_2', email: 'maya@shipyard.dev', name: 'Maya Patel', role: 'engineer' },
  { id: 'usr_3', email: 'jordan@shipyard.dev', name: 'Jordan Kim', role: 'engineer' },
  { id: 'usr_4', email: 'taylor@shipyard.dev', name: 'Taylor Smith', role: 'manager' },
  { id: 'usr_5', email: 'admin@shipyard.dev', name: 'Sam Rivera', role: 'org_admin' },
];

export async function GET() {
  return NextResponse.json(dummyUsers);
}