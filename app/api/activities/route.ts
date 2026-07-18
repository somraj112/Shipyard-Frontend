import { NextResponse } from 'next/server';
import type { Activity } from '@/types';

const dummyActivities: Activity[] = [
  {
    id: 'act_1',
    type: 'state_change',
    issue: { id: 'SHIP-3', title: 'Fix workflow state transition validation bug' },
    user: { id: 'usr_4', name: 'Taylor Smith', email: 'taylor@shipyard.dev', role: 'manager' },
    from: 'Review',
    to: 'Pull Request',
    timestamp: '2026-07-17T11:30:00Z',
  },
  {
    id: 'act_2',
    type: 'pr_opened',
    issue: { id: 'SHIP-2', title: 'Build dashboard stats aggregation endpoint' },
    user: { id: 'usr_2', name: 'Maya Patel', email: 'maya@shipyard.dev', role: 'engineer' },
    timestamp: '2026-07-17T09:15:00Z',
  },
  {
    id: 'act_3',
    type: 'state_change',
    issue: { id: 'SHIP-4', title: 'Design Kanban board UI components' },
    user: { id: 'usr_2', name: 'Maya Patel', email: 'maya@shipyard.dev', role: 'engineer' },
    from: 'Review',
    to: 'Merged',
    timestamp: '2026-07-16T17:00:00Z',
  },
  {
    id: 'act_4',
    type: 'pr_merged',
    issue: { id: 'SHIP-7', title: 'Optimize database queries for workflow listing' },
    user: { id: 'usr_2', name: 'Maya Patel', email: 'maya@shipyard.dev', role: 'engineer' },
    timestamp: '2026-07-12T08:00:00Z',
  },
  {
    id: 'act_5',
    type: 'assigned',
    issue: { id: 'SHIP-5', title: 'Write integration tests for PR webhook handler' },
    user: { id: 'usr_3', name: 'Jordan Kim', email: 'jordan@shipyard.dev', role: 'engineer' },
    timestamp: '2026-07-16T09:00:00Z',
  },
];

export async function GET() {
  return NextResponse.json(dummyActivities);
}