'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, Button, Badge } from '@/components/ui';
import { useRepositories } from '@/lib/hooks/useRepositories';

export default function SettingsPage() {
  const { repos, loading, error } = useRepositories();
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(true);

  function handleConnect() {
    setConnecting(true);
    // Dummy GitHub OAuth start — real flow would redirect to GitHub
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 1200);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Manage organization, integrations, and preferences
        </p>
      </div>

      {/* GitHub Integration */}
      <Card>
        <CardHeader>
          <CardTitle>GitHub Integration</CardTitle>
          {connected ? (
            <Badge variant="green">Connected</Badge>
          ) : (
            <Badge variant="neutral">Not connected</Badge>
          )}
        </CardHeader>

        <p className="text-sm text-[var(--muted-foreground)]">
          Connect your GitHub organization to sync pull requests, branches, and
          workflow state across repositories.
        </p>

        <div className="mt-4">
          {connected ? (
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={() => setConnected(false)}>
                Disconnect
              </Button>
              <span className="text-xs text-[var(--muted-foreground)]">
                Connected as <span className="font-medium">shipyard-org</span>
              </span>
            </div>
          ) : (
            <Button
              onClick={handleConnect}
              disabled={connecting}
              variant="primary"
            >
              {connecting ? 'Connecting…' : 'Connect GitHub'}
            </Button>
          )}
        </div>
      </Card>

      {/* Repositories */}
      <Card>
        <CardHeader>
          <CardTitle>Repositories</CardTitle>
          <span className="text-xs text-[var(--muted-foreground)]">
            {repos.filter((r) => r.connected).length}/{repos.length} connected
          </span>
        </CardHeader>

        {loading && (
          <p className="text-sm text-[var(--muted-foreground)]">Loading…</p>
        )}
        {error && (
          <p className="text-sm text-red-500">Failed to load repositories</p>
        )}

        {!loading && !error && (
          <div className="space-y-2">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3"
              >
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-[var(--muted-foreground)]">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium">{repo.fullName}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      default branch: {repo.defaultBranch}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {repo.connected ? (
                    <>
                      <Badge variant="green">Connected</Badge>
                      <Button variant="ghost" size="sm">
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <>
                      <Badge variant="neutral">Available</Badge>
                      <Button variant="secondary" size="sm">
                        Connect
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Organization */}
      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Organization Name</label>
            <input
              defaultValue="Shipyard"
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Slug</label>
            <input
              defaultValue="shipyard"
              placeholder="slug"
              className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            />
          </div>
          <Button>Save Changes</Button>
        </div>
      </Card>
    </div>
  );
}
