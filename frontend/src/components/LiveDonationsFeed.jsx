// Placeholder donations data
const PLACEHOLDER_DONATIONS = [
  {
    id: 1,
    donorName: 'Alex R.',
    type: 'individual',
    amount: 100,
    message: 'Keep up the great work!',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    teamName: 'Team Bright Stars',
    type: 'team',
    amount: 1250,
    message: 'From our team with love.',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    donorName: 'Sarah M.',
    type: 'individual',
    amount: 50,
    message: 'Thank you for all you do!',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    teamName: 'Hope Warriors',
    type: 'team',
    amount: 500,
    message: 'Together we can make a difference.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    donorName: 'Michael T.',
    type: 'individual',
    amount: 250,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

function formatTimeAgo(timestamp) {
  if (!timestamp) return 'Just now';
  
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now - time) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
}

function DonationItem({ donation }) {
  const displayName = donation.teamName || donation.donorName || 'Anonymous';
  const type = donation.type || 'individual';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: '1rem',
      backgroundColor: '#f8fafc',
      borderRadius: '6px',
      transition: 'background-color 0.2s',
    }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
    >
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
          <strong style={{ color: '#1e293b', fontSize: '0.9375rem' }}>{displayName}</strong>
          <span style={{
            backgroundColor: '#1E88E5',
            color: 'white',
            fontSize: '0.75rem',
            padding: '0.125rem 0.5rem',
            borderRadius: '12px',
            fontWeight: '500',
            textTransform: 'capitalize',
          }}>
            {type}
          </span>
        </div>
        {donation.message && (
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#64748b', 
            marginTop: '0.25rem',
            fontStyle: 'italic',
            lineHeight: '1.5',
          }}>
            "{donation.message}"
          </p>
        )}
      </div>
      <div style={{ textAlign: 'right', marginLeft: '1rem' }}>
        <div style={{ 
          fontWeight: '600', 
          color: '#1E88E5', 
          fontSize: '1rem',
          marginBottom: '0.25rem',
        }}>
          ${parseFloat(donation.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
          {formatTimeAgo(donation.createdAt || donation.created_at)}
        </div>
      </div>
    </div>
  );
}

export default function LiveDonationsFeed({ limit = 10 }) {
  // Use placeholder data instead of fetching from API
  const donations = PLACEHOLDER_DONATIONS.slice(0, limit);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
          Recent Donations
        </h3>
      </div>

      {donations.length === 0 ? (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          color: '#64748b',
          fontSize: '0.875rem',
        }}>
          No donations yet. Be the first to make a difference!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {donations.map((donation, index) => (
            <DonationItem key={donation.id || donation._id || index} donation={donation} />
          ))}
        </div>
      )}
    </div>
  );
}

