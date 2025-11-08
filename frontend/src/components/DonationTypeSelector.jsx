export default function DonationTypeSelector({ type, onChange }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
    }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>
        Donation Type
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          cursor: 'pointer',
          padding: '0.75rem',
          borderRadius: '6px',
          border: type === 'individual' ? '2px solid #1E88E5' : '2px solid #e2e8f0',
          backgroundColor: type === 'individual' ? '#f0f7ff' : 'transparent',
          transition: 'all 0.2s',
        }}>
          <input
            type="radio"
            name="dtype"
            value="individual"
            checked={type === 'individual'}
            onChange={() => onChange('individual')}
            style={{ cursor: 'pointer', width: '18px', height: '18px' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
              Individual Donor
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Make a personal donation to support our mission
            </div>
          </div>
        </label>
        
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          cursor: 'pointer',
          padding: '0.75rem',
          borderRadius: '6px',
          border: type === 'team' ? '2px solid #1E88E5' : '2px solid #e2e8f0',
          backgroundColor: type === 'team' ? '#f0f7ff' : 'transparent',
          transition: 'all 0.2s',
        }}>
          <input
            type="radio"
            name="dtype"
            value="team"
            checked={type === 'team'}
            onChange={() => onChange('team')}
            style={{ cursor: 'pointer', width: '18px', height: '18px' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
              Fundraising Team
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Join or create a team to fundraise together
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}

