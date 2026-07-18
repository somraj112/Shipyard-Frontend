'use client';

import DropdownMenu from '@/components/ui/DropdownMenu';

export default function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-6">
      {/* Breadcrumb / page title */}
      <div>
        <h1 className="text-sm font-medium text-[var(--muted-foreground)]">
          Engineering Operations
        </h1>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Quick create */}
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-[var(--accent-foreground)] hover:opacity-90 transition-opacity cursor-pointer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Issue
        </button>

        {/* User dropdown */}
        <DropdownMenu
          align="right"
          trigger={
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-medium text-white ring-2 ring-[var(--border)] cursor-pointer">
              MK
            </span>
          }
          items={[
            { label: 'Profile', onClick: () => {} },
            { label: 'Settings', onClick: () => {} },
            { label: 'Sign out', onClick: () => {}, danger: true },
          ]}
        />
      </div>
    </header>
  );
}