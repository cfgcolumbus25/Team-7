export default function GoalProgress2025() {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
              <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="2"/>
              <circle cx="12" cy="12" r="2" fill="white"/>
            </svg>
          </div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '500', color: '#475569' }}>
            2025 Goal Progress
          </h3>
        </div>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>
            76%
          </div>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            $3M target
          </div>
        </div>
      </div>
    );
  }