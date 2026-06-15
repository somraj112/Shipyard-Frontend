/**
 * Dashboard Page
 *
 * Main intelligence dashboard — displays workflow metrics,
 * recent activity, and system health status.
 */

export default function DashboardPage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        ⚓ Shipyard Dashboard
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Engineering Operations & Intelligence
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#f9fafb' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Workflows
          </h2>
          <p style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>—</p>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Connect GitHub to get started</p>
        </div>

        <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#f9fafb' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Open PRs
          </h2>
          <p style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>—</p>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Sync engine pending</p>
        </div>

        <div style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#f9fafb' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Team Members
          </h2>
          <p style={{ fontSize: '2rem', fontWeight: 700, marginTop: '0.5rem' }}>—</p>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Auth system pending</p>
        </div>
      </div>
    </main>
  );
}
