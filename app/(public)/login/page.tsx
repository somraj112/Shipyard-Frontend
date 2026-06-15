/**
 * Login Page (Public)
 *
 * Authentication entry point for the Shipyard platform.
 */

export default function LoginPage() {
  return (
    <main style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      background: '#f9fafb',
    }}>
      <div style={{
        padding: '2.5rem',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          ⚓ Shipyard
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '2rem' }}>
          Sign in to your engineering workspace
        </p>

        <button style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          width: '100%',
          padding: '0.75rem',
          background: '#24292f',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '0.95rem',
          fontWeight: 500,
        }}>
          Sign in with GitHub
        </button>

        <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
          Authentication will be implemented in a future sprint.
        </p>
      </div>
    </main>
  );
}
