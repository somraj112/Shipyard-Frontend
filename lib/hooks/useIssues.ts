'use client';

import { useEffect, useState } from 'react';
import { IssueService } from '@/lib/services/issue.service';
import type { Issue, WorkflowState } from '@/types';

export function useIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    IssueService.getAll()
      .then((data) => {
        if (active) setIssues(data);
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  async function updateState(id: string, state: WorkflowState) {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id
          ? { ...issue, state, updatedAt: new Date().toISOString() }
          : issue
      )
    );
    try {
      await IssueService.move(id, state);
    } catch {
      // Optimistic update already applied
    }
  }

  return { issues, loading, error, updateState };
}
