'use client';

import { useEffect, useState } from 'react';
import { getRepositories } from '@/lib/api/client';
import type { Repository } from '@/types';

export function useRepositories() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getRepositories()
      .then((data) => active && setRepos(data))
      .catch((err: Error) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { repos, loading, error };
}
