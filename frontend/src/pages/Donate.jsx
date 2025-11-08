import { useState } from 'react';

export default function Donate() {
  // Template state only (no side effects)
  const [type, setType] = useState('individual'); // 'individual' | 'team'
  const [donorName, setDonorName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  // Template submit (no persistence). Teammates will implement real logic.
  function onSubmit(e) {
    e.preventDefault();
    console.log('DONATION_SUBMIT_TEMPLATE', {
      donorName,
      amount,
      type,
      teamName: type === 'team' ? teamName : undefined,
      message,
    });
    // TODO(team): add validation, API/localStorage, success UI, and error states.
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>
          Donate
        </h2>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          Template: choose an option, read a story, see a live feed, and donate with a message.
        </p>
      </div>

      {/* Options + Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Donation Options (template) */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>
            Donation Options
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="dtype"
                value="individual"
                checked={type === 'individual'}
                onChange={() => setType('individual')}
                style={{ cursor: 'pointer' }}
              />
              <span>Individual Donor</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="dtype"
                value="team"
                checked={type === 'team'}
                onChange={() => setType('team')}
                style={{ cursor: 'pointer' }}
              />
              <span>Fundraising Team</span>
            </label>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
              Template only — no behavior yet.
            </p>
          </div>
        </div>

        {/* Donation Form (template) */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>
            Make a Donation
          </h3>
          <form onSubmit={onSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }} htmlFor="donorName">
                Name
              </label>
              <input
                id="donorName"
                type="text"
                style={{
                  width: '100%',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  padding: '0.5rem',
                  fontSize: '1rem',
                }}
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }} htmlFor="amount">
                Amount (USD)
              </label>
              <input
                id="amount"
                type="number"
                min="1"
                style={{
                  width: '100%',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  padding: '0.5rem',
                  fontSize: '1rem',
                }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {type === 'team' && (
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }} htmlFor="teamName">
                  Team Name
                </label>
                <input
                  id="teamName"
                  type="text"
                  style={{
                    width: '100%',
                    border: '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '0.5rem',
                    fontSize: '1rem',
                  }}
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>
            )}

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }} htmlFor="message">
                Attach a Message
              </label>
              <textarea
                id="message"
                rows="3"
                style={{
                  width: '100%',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  padding: '0.5rem',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                }}
                placeholder="Share a note with your donation…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#1E88E5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1565C0'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#1E88E5'}
              >
                Donate (Template)
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Hero Stories / Quotes (template) */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)',
        color: 'white',
      }}>
        <div style={{ maxWidth: '48rem' }}>
          <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '500' }}>
            "This is a sample hero story/quote for the donation page."
          </p>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)', marginTop: '0.5rem' }}>
            — Placeholder Author, Role
          </p>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '0.5rem' }}>
            Template only — teammates can add a carousel later.
          </p>
        </div>
      </div>

      {/* Live Donations Feed (template) */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>
          Recent Donations (Template)
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '6px',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <strong style={{ color: '#1e293b' }}>Alex R.</strong>
                <span style={{
                  backgroundColor: '#1E88E5',
                  color: 'white',
                  fontSize: '0.75rem',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '12px',
                  fontWeight: '500',
                }}>
                  Individual
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                "Keep up the great work!"
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '600', color: '#1E88E5', fontSize: '1rem' }}>$100</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Just now</div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '6px',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <strong style={{ color: '#1e293b' }}>Team Bright Stars</strong>
                <span style={{
                  backgroundColor: '#1E88E5',
                  color: 'white',
                  fontSize: '0.75rem',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '12px',
                  fontWeight: '500',
                }}>
                  Team
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                "From our team with love."
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '600', color: '#1E88E5', fontSize: '1rem' }}>$1,250</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>2 min ago</div>
            </div>
          </div>

          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
            Template list — teammates will replace with real-time feed or storage later.
          </p>
        </div>
      </div>
    </div>
  );
}

