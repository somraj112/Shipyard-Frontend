'use client';

import { useEffect, useState } from 'react';
import { getActivity, getIssues, getTeamMembers, getRepositories } from '@/lib/api/client';
import type { Activity, Issue, User, Repository, WorkflowState } from '@/types';

const emptyState: Record<WorkflowState, number> = {
  backlog: 0,
  assigned: 0,
  development: 0,
  pull_request: 0,
  review: 0,
  merged: 0,
  released: 0,
  completed: 0,
};

export function useDashboard() {
  const [activity, setActivity] = useState<Activity[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([getActivity(), getIssues(), getTeamMembers(), getRepositories()])
      .then(([a, i, m, r]) => {
        if (!active) return;
        setActivity(a);
        setIssues(i);
        setMembers(m);
        setRepos(r);
      })
      .catch((err: Error) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const issuesByState = issues.reduce<Record<WorkflowState, number>>(
    (acc, issue) => {
      acc[issue.state] = (acc[issue.state] || 0) + 1;
      return acc;
    },
    { ...emptyState }
  );

  const openPRs = issues.filter(
    (issue) => issue.pullRequest && issue.pullRequest.state === 'open'
  ).length;

  const activeWorkflows = issues.filter(
    (issue) =>
      !['backlog', 'merged', 'released', 'completed'].includes(issue.state)
  ).length;

  return {
    activity,
    issues,
    members,
    repos,
    issuesByState,
    openPRs,
    activeWorkflows,
    loading,
    error,
  };
}
