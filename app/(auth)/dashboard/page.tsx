'use client';

import StatCard from '@/components/dashboard/StatCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import HealthStatusWidget from '@/components/dashboard/HealthStatusWidget';
import TeamList from '@/components/dashboard/TeamList';
import WorkflowOverview from '@/components/dashboard/WorkflowOverview';
import { SkeletonCard, Skeleton } from '@/components/ui';
import { useDashboard } from '@/lib/hooks/useDashboard';

export default function DashboardPage() {
  const {
    activity,
    members,
    repos,
    issuesByState,
    openPRs,
    activeWorkflows,
    loading,
    error,
  } = useDashboard();

  if (error) {
    return (
      <div className="flex items-center justify-center py-20 text-red-500">
        Failed to load dashboard: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Engineering operations overview
        </p>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Active Workflows"
            value={activeWorkflows}
            hint="In progress or under review"
          />
          <StatCard label="Open PRs" value={openPRs} hint="Linked to issues" />
          <StatCard
            label="Team Members"
            value={members.length}
            hint="Active contributors"
          />
          <StatCard
            label="Repositories"
            value={repos.filter((r) => r.connected).length}
            hint={`${repos.length} total tracked`}
          />
        </div>
      )}

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {loading ? (
            <Skeleton className="h-40 w-full rounded-xl" />
          ) : (
            <WorkflowOverview counts={issuesByState} />
          )}

          {loading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : (
            <ActivityFeed activities={activity} />
          )}
        </div>

        <div className="space-y-6">
          <HealthStatusWidget />
          {loading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : (
            <TeamList members={members} />
          )}
        </div>
      </div>
    </div>
  );
}
