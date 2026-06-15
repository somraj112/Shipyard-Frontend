/**
 * Workflows Page
 *
 * Visualizes the Engineering Workflow State Machine.
 */

export default function WorkflowsPage() {
  const states = [
    { name: 'Backlog', emoji: '📋', color: '#6b7280' },
    { name: 'In Progress', emoji: '🔨', color: '#3b82f6' },
    { name: 'In Review', emoji: '👀', color: '#f59e0b' },
    { name: 'Approved', emoji: '✅', color: '#10b981' },
    { name: 'Merged', emoji: '🔀', color: '#8b5cf6' },
    { name: 'Released', emoji: '🚀', color: '#ef4444' },
  ];

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Workflow Pipeline
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Engineering Workflow State Machine — Backlog → Release
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {states.map((state, i) => (
          <div key={state.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              padding: '1rem 1.25rem',
              borderRadius: '10px',
              border: `2px solid ${state.color}`,
              background: `${state.color}10`,
              textAlign: 'center',
              minWidth: '120px',
            }}>
              <div style={{ fontSize: '1.5rem' }}>{state.emoji}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '0.25rem', color: state.color }}>
                {state.name}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem' }}>0</div>
            </div>
            {i < states.length - 1 && (
              <span style={{ fontSize: '1.25rem', color: '#d1d5db' }}>→</span>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
