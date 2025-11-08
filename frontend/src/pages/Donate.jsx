import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Donate() {
  const navigate = useNavigate();
  // Template state only (no side effects)
  const [type, setType] = useState('individual'); // 'individual' | 'team'
  const [donorName, setDonorName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleDonationSuccess = (result) => {
    setSuccessMessage(
      `Thank you for your generous donation of $${parseFloat(result.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}! Your support makes a real difference.`
    );
    setShowSuccess(true);
    
    // Hide success message after 8 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 8000);
  };

  const handleDonationError = (error) => {
    console.error('Donation error:', error);
    // Error is already handled in DonationForm component
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Back to Overview button */}
      <div style={{ position: "absolute", top: 0, left: 0, zIndex: 10 }}>
        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            background: "#fff",
            border: "1px solid #e0e0e0",
            color: "#000000",
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 8,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.2s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f5f5f5";
            e.currentTarget.style.borderColor = "#d0d0d0";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.borderColor = "#e0e0e0";
          }}
        >
          <span>←</span>
          <span>Back to Overview</span>
        </button>
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          marginBottom: '0.5rem', 
          color: '#1e293b',
          lineHeight: '1.2',
        }}>
          Support Our Mission
        </h1>
        <p style={{ 
          color: '#64748b', 
          fontSize: '1.125rem',
          lineHeight: '1.6',
          maxWidth: '700px',
        }}>
          Your donation directly funds groundbreaking pediatric brain cancer research. 
          Every contribution brings us closer to better treatments and brighter futures for children and families.
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div style={{
          marginBottom: '2rem',
          padding: '1rem 1.5rem',
          backgroundColor: '#f0fdf4',
          border: '2px solid #86efac',
          borderRadius: '8px',
          color: '#166534',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          animation: 'slideDown 0.3s ease-out',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              style={{ flexShrink: 0 }}
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p style={{ margin: 0, fontWeight: '500' }}>{successMessage}</p>
          </div>
          <button
            onClick={() => setShowSuccess(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#166534',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              fontSize: '1.25rem',
            }}
            aria-label="Close success message"
          >
            ×
          </button>
        </div>
      )}

      {/* Hero Story Carousel */}
      <HeroStoryCarousel />

      {/* Options + Form */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem', 
        marginBottom: '2rem' 
      }}>
        <DonationTypeSelector 
          type={donationType} 
          onChange={setDonationType} 
        />
        
        <DonationForm 
          type={donationType}
          onSuccess={handleDonationSuccess}
          onError={handleDonationError}
        />
      </div>

      {/* Impact Statistics */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem',
      }}>
        <h3 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          marginBottom: '1.5rem', 
          color: '#1e293b',
          textAlign: 'center',
        }}>
          Your Impact
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          textAlign: 'center',
        }}>
          <div>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#1E88E5',
              marginBottom: '0.5rem',
            }}>
              $2.29M
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Raised in 2024
            </div>
          </div>
          <div>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#1E88E5',
              marginBottom: '0.5rem',
            }}>
              100%
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Goes to Research
            </div>
          </div>
          <div>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#1E88E5',
              marginBottom: '0.5rem',
            }}>
              50+
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Research Projects Funded
            </div>
          </div>
          <div>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#1E88E5',
              marginBottom: '0.5rem',
            }}>
              1,000+
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Families Supported
            </div>
          </div>
        </div>
      </div>

      {/* Live Donations Feed */}
      <LiveDonationsFeed limit={10} />

      {/* Additional Information */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
      }}>
        <h4 style={{ 
          fontSize: '1.125rem', 
          fontWeight: '600', 
          marginBottom: '0.75rem', 
          color: '#1e293b',
        }}>
          Questions About Donating?
        </h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1rem',
          fontSize: '0.875rem',
          color: '#64748b',
          lineHeight: '1.6',
        }}>
          <div>
            <strong style={{ color: '#1e293b', display: 'block', marginBottom: '0.25rem' }}>
              Tax Deductible
            </strong>
            All donations are tax-deductible to the full extent allowed by law. You'll receive a receipt for your records.
          </div>
          <div>
            <strong style={{ color: '#1e293b', display: 'block', marginBottom: '0.25rem' }}>
              Secure & Safe
            </strong>
            Your payment information is encrypted and secure. We never store your credit card details.
          </div>
          <div>
            <strong style={{ color: '#1e293b', display: 'block', marginBottom: '0.25rem' }}>
              Direct Impact
            </strong>
            100% of your donation goes directly to funding pediatric brain cancer research and supporting families.
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
