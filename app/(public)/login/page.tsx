'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { exchangeGitHubCode } from '@/lib/api/client';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setLoading(true);
    setError(null);
    try {
      // Dummy OAuth code — real flow would redirect to GitHub and return a code
      await exchangeGitHubCode('dummy_oauth_code');
      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--sidebar)] p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-3 text-3xl">⚓</div>
          <h1 className="text-2xl font-bold">Shipyard</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Engineering operations and intelligence
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-8">
          <p className="mb-6 text-center text-sm text-[var(--muted-foreground)]">
            Sign in to your engineering workspace
          </p>

          <button
            onClick={handleSignIn}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2.5 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            {loading ? 'Signing in…' : 'Sign in with GitHub'}
          </button>

          {error && (
            <p className="mt-4 text-center text-xs text-red-500">
              {error}
            </p>
          )}

          <p className="mt-6 text-center text-xs text-[var(--muted-foreground)]">
            By signing in, you agree to the Shipyard Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  );
}
