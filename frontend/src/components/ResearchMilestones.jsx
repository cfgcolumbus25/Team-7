export default function ResearchMilestones() {
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
            backgroundColor: '#22c55e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="white"/>
            </svg>
          </div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '500', color: '#475569' }}>
            Research Milestones
          </h3>
        </div>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>
            34
          </div>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            Major breakthroughs
          </div>
        </div>
      </div>
    );
  }