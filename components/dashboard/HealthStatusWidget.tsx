'use client';

import { Card, CardTitle } from '@/components/ui';
import { useHealthStatus } from '@/lib/hooks/useHealthStatus';

export default function HealthStatusWidget() {
  const { health, loading, error, healthy } = useHealthStatus();

  return (
    <Card padding="md">
      <div className="flex items-center justify-between">
        <CardTitle>System Health</CardTitle>
        {loading ? (
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 animate-pulse" />
        ) : error ? (
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
        ) : (
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              healthy ? 'bg-emerald-500' : 'bg-amber-500'
            } animate-pulse`}
          />
        )}
      </div>
      <div className="mt-3 space-y-2 text-sm">
        {loading && (
          <p className="text-[var(--muted-foreground)]">Checking status…</p>
        )}
        {error && (
          <p className="text-red-500">Unable to reach backend service</p>
        )}
        {!loading && !error && health && (
          <>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Status</span>
              <span className="font-medium capitalize">{health.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Version</span>
              <span className="font-mono">{health.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Uptime</span>
              <span className="font-medium">
                {Math.floor(health.uptime / 60)}m
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--muted-foreground)]">Memory</span>
              <span className="font-medium">{health.memory.heapUsed}</span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
