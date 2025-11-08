import { useState, useEffect } from 'react';

const HERO_STORIES = [
  {
    quote: "The Lilabean Foundation gave us hope when we needed it most. Their support helped our family through the darkest times, and the research they fund is saving lives every day.",
    author: "Jennifer Martinez",
    role: "Parent & Advocate",
  },
  {
    quote: "Thanks to Lilabean's funding, we've made breakthrough discoveries that are already improving treatment protocols. This partnership is transforming pediatric brain cancer research.",
    author: "Dr. David Chen",
    role: "Lead Researcher, CHOP",
  },
  {
    quote: "Being part of the Lilabean community showed me that even in grief, we can create meaningful change. Together, we're making sure no family faces this journey alone.",
    author: "Michael Thompson",
    role: "Volunteer & Monthly Donor",
  },
  {
    quote: "Every dollar donated goes directly to research that matters. The transparency and impact of Lilabean's work gives us confidence that we're truly making a difference.",
    author: "Sarah Williams",
    role: "Donor & Supporter",
  },
];

export default function HeroStoryCarousel({ stories = HERO_STORIES, autoRotateInterval = 8000 }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (stories.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length);
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [stories.length, autoRotateInterval, isPaused]);

  const goToStory = (index) => {
    setIsPaused(true);
    setCurrentIndex(index);
    // Resume auto-rotation after 10 seconds
    setTimeout(() => setIsPaused(false), 10000);
  };

  const goToPrevious = () => {
    setIsPaused(true);
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
    // Resume auto-rotation after 10 seconds
    setTimeout(() => setIsPaused(false), 10000);
  };

  const goToNext = () => {
    setIsPaused(true);
    setCurrentIndex((prev) => (prev + 1) % stories.length);
    // Resume auto-rotation after 10 seconds
    setTimeout(() => setIsPaused(false), 10000);
  };

  const currentStory = stories[currentIndex] || stories[0];

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '2rem',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
      marginBottom: '2rem',
      background: 'linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Navigation Arrows */}
      {stories.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              zIndex: 2,
              transition: 'all 0.2s',
              padding: 0,
              margin: 0,
              outline: 'none',
              borderStyle: 'solid',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              backgroundClip: 'padding-box',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
            aria-label="Previous story"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', background: 'transparent' }}>
              <polyline points="15 18 9 12 15 6" fill="none"></polyline>
            </svg>
          </button>
          <button
            onClick={goToNext}
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              zIndex: 2,
              transition: 'all 0.2s',
              padding: 0,
              margin: 0,
              outline: 'none',
              borderStyle: 'solid',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              backgroundClip: 'padding-box',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
            aria-label="Next story"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', background: 'transparent' }}>
              <polyline points="9 18 15 12 9 6" fill="none"></polyline>
            </svg>
          </button>
        </>
      )}
      
      <div style={{ maxWidth: '48rem', position: 'relative', zIndex: 1, margin: stories.length > 1 ? '0 3rem' : '0' }}>
        <p style={{ 
          fontSize: '1.25rem', 
          marginBottom: '0.5rem', 
          fontWeight: '500',
          lineHeight: '1.6',
          transition: 'opacity 0.3s ease-in-out',
        }}>
          "{currentStory.quote}"
        </p>
        <p style={{ 
          fontSize: '0.875rem', 
          color: 'rgba(255, 255, 255, 0.9)', 
          marginTop: '0.75rem',
          fontWeight: '500',
        }}>
          — {currentStory.author}
        </p>
        <p style={{ 
          fontSize: '0.75rem', 
          color: 'rgba(255, 255, 255, 0.7)', 
          marginTop: '0.25rem',
        }}>
          {currentStory.role}
        </p>
      </div>

      {/* Navigation dots */}
      {stories.length > 1 && (
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '1.5rem',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}>
          {stories.map((_, index) => (
            <button
              key={index}
              onClick={() => goToStory(index)}
              style={{
                width: currentIndex === index ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: currentIndex === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
              aria-label={`Go to story ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

