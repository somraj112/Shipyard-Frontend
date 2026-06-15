/**
 * Settings Page
 *
 * Organization and user settings management.
 */

export default function SettingsPage() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Settings
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Manage your organization, integrations, and preferences
      </p>

      <div style={{ maxWidth: '600px' }}>
        <section style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>GitHub Integration</h2>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Connect your GitHub organization to enable workflow synchronization.
          </p>
          <button style={{
            padding: '0.5rem 1rem',
            background: '#24292f',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}>
            Connect GitHub
          </button>
        </section>

        <section style={{ padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Organization</h2>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Organization settings will be available after authentication is implemented.
          </p>
        </section>
      </div>
    </main>
  );
}
