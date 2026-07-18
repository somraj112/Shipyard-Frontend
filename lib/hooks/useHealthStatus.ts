'use client';

import { useEffect, useState } from 'react';
import { getHealth } from '@/lib/api/client';
import type { DetailedHealthResponse } from '@/types';

export function useHealthStatus() {
  const [health, setHealth] = useState<DetailedHealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function check() {
      try {
        const data = await getHealth();
        if (active) {
          setHealth(data);
          setError(null);
        }
      } catch (err) {
        if (active) setError((err as Error).message);
      } finally {
        if (active) setLoading(false);
      }
    }

    check();
    const interval = setInterval(check, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const healthy = health?.status === 'ok';

  return { health, loading, error, healthy };
}
