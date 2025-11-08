import { useState, useEffect } from 'react';

const QUICK_AMOUNTS = [10, 25, 50, 100, 250, 500];

export default function DonationForm({ type = 'individual', onSuccess, onError }) {
  const [donorName, setDonorName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [selectedQuickAmount, setSelectedQuickAmount] = useState(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Reset team name when type changes
  useEffect(() => {
    if (type === 'individual') {
      setTeamName('');
    }
  }, [type]);

  // Calculate total amount (selected quick amount or custom amount)
  const getTotalAmount = () => {
    if (selectedQuickAmount !== null) {
      return selectedQuickAmount;
    }
    return customAmount ? parseFloat(customAmount) : 0;
  };

  const handleQuickAmountSelect = (value) => {
    setSelectedQuickAmount(value);
    setCustomAmount('');
    if (errors.amount) {
      setErrors({ ...errors, amount: null });
    }
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    setSelectedQuickAmount(null);
    setAmount(value);
    if (errors.amount) {
      setErrors({ ...errors, amount: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!donorName.trim()) {
      newErrors.donorName = 'Name is required';
    }
    
    const totalAmount = getTotalAmount();
    if (!totalAmount || totalAmount <= 0) {
      newErrors.amount = 'Please select or enter a valid donation amount';
    } else if (totalAmount < 1) {
      newErrors.amount = 'Minimum donation is $1';
    }
    
    if (type === 'team' && !teamName.trim()) {
      newErrors.teamName = 'Team name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    // Mock success - no actual API call
    const totalAmount = getTotalAmount();
    const mockResult = {
      amount: totalAmount,
      type,
      donorName: donorName.trim(),
      isRecurring,
      ...(type === 'team' && { teamName: teamName.trim() }),
    };
    
    // Reset form
    setDonorName('');
    setTeamName('');
    setAmount('');
    setCustomAmount('');
    setSelectedQuickAmount(null);
    setIsRecurring(false);
    setMessage('');
    
    // Show success message
    if (onSuccess) {
      onSuccess(mockResult);
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
      boxSizing: 'border-box',
      width: '100%',
    }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>
        Make a Donation
      </h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Recurring Donation Toggle */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: '500' }}>
            Donation Frequency
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.25rem' }}>
            <button
              type="button"
              onClick={() => setIsRecurring(false)}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: !isRecurring ? '#1E88E5' : 'transparent',
                color: !isRecurring ? 'white' : '#64748b',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              One Time
            </button>
            <button
              type="button"
              onClick={() => setIsRecurring(true)}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: isRecurring ? '#1E88E5' : 'transparent',
                color: isRecurring ? 'white' : '#64748b',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Ongoing
            </button>
          </div>
        </div>

        {/* Quick Select Amounts */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: '500' }}>
            Choose Your Gift <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            marginBottom: '0.5rem',
          }}>
            {QUICK_AMOUNTS.map((quickAmount) => (
              <button
                key={quickAmount}
                type="button"
                onClick={() => handleQuickAmountSelect(quickAmount)}
                style={{
                  padding: '0.75rem',
                  border: selectedQuickAmount === quickAmount ? '2px solid #1E88E5' : '1px solid #e2e8f0',
                  borderRadius: '6px',
                  backgroundColor: selectedQuickAmount === quickAmount ? '#f0f7ff' : 'white',
                  color: selectedQuickAmount === quickAmount ? '#1E88E5' : '#1e293b',
                  fontSize: '0.9375rem',
                  fontWeight: selectedQuickAmount === quickAmount ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                ${quickAmount}
              </button>
            ))}
          </div>
          
          {/* Custom Amount Input */}
          <div style={{ position: 'relative' }}>
            <span style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b',
              fontSize: '1rem',
              zIndex: 1,
            }}>$</span>
            <input
              id="customAmount"
              type="number"
              min="1"
              step="0.01"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: errors.amount ? '1px solid #ef4444' : (selectedQuickAmount === null && customAmount ? '2px solid #1E88E5' : '1px solid #e2e8f0'),
                borderRadius: '6px',
                padding: '0.75rem 0.75rem 0.75rem 2rem',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
                backgroundColor: selectedQuickAmount === null && customAmount ? '#f0f7ff' : 'white',
              }}
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="Other amount"
            />
          </div>
          {errors.amount && (
            <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
              {errors.amount}
            </p>
          )}
        </div>

        {/* Monthly Impact Banner */}
        {!isRecurring && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#f0f7ff',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: '#1E88E5',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            <span>Multiply your impact. Make it Monthly!</span>
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '500' }} htmlFor="donorName">
            Name <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="donorName"
            type="text"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              border: errors.donorName ? '1px solid #ef4444' : '1px solid #e2e8f0',
              borderRadius: '4px',
              padding: '0.5rem',
              fontSize: '1rem',
              transition: 'border-color 0.2s',
            }}
            value={donorName}
            onChange={(e) => {
              setDonorName(e.target.value);
              if (errors.donorName) {
                setErrors({ ...errors, donorName: null });
              }
            }}
            placeholder="Enter your name"
          />
          {errors.donorName && (
            <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
              {errors.donorName}
            </p>
          )}
        </div>

        {type === 'team' && (
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '500' }} htmlFor="teamName">
              Team Name <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              id="teamName"
              type="text"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: errors.teamName ? '1px solid #ef4444' : '1px solid #e2e8f0',
                borderRadius: '4px',
                padding: '0.5rem',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
              }}
              value={teamName}
              onChange={(e) => {
                setTeamName(e.target.value);
                if (errors.teamName) {
                  setErrors({ ...errors, teamName: null });
                }
              }}
              placeholder="Enter your team name"
            />
            {errors.teamName && (
              <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
                {errors.teamName}
              </p>
            )}
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem', fontWeight: '500' }} htmlFor="message">
            Attach a Message (Optional)
          </label>
          <textarea
            id="message"
            rows="3"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              padding: '0.5rem',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical',
              transition: 'border-color 0.2s',
            }}
            placeholder="Share a note with your donation…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
          />
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', textAlign: 'right' }}>
            {message.length}/500
          </p>
        </div>

        {errors.submit && (
          <div style={{
            padding: '0.75rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '4px',
            color: '#dc2626',
            fontSize: '0.875rem',
          }}>
            {errors.submit}
          </div>
        )}

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
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#1565C0';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#1E88E5';
          }}
        >
          {(() => {
            const total = getTotalAmount();
            const amountText = total > 0 ? total.toFixed(2) : '0.00';
            return isRecurring ? `Give Monthly $${amountText}` : `Give $${amountText}`;
          })()}
        </button>
      </form>
    </div>
  );
}

