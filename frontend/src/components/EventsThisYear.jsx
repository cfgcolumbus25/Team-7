export default function EventsThisYear() {
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
          backgroundColor: '#9333ea',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '500', color: '#475569' }}>
          Events This Year
        </h3>
      </div>
      <div>
        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>
          28
        </div>
        <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
          15,420 participants
        </div>
      </div>
    </div>
  );
}