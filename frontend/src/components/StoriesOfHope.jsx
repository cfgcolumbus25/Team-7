export default function StoriesOfHope() {
  const stories = [
    {
      quote: "The Lilabean Foundation gave us hope when we needed it most. Their support helped our family through the darkest times, and the research they fund is saving lives every day.",
      author: "Jennifer Martinez",
      role: "Parent & Advocate"
    },
    {
      quote: "Thanks to Lilabean's funding, we've made breakthrough discoveries that are already improving treatment protocols. This partnership is transforming pediatric brain cancer research.",
      author: "Dr. David Chen",
      role: "Lead Researcher, CHOP"
    },
    {
      quote: "Being part of the Lilabean community showed me that even in grief, we can create meaningful change. Together, we're making sure no family faces this journey alone.",
      author: "Michael Thompson",
      role: "Volunteer & Monthly Donor"
    },
    {
      quote: "Every dollar donated goes directly to research that matters. The transparency and impact of Lilabean's work gives us confidence that we're truly making a difference.",
      author: "Sarah Williams",
      role: "Donor & Supporter"
    },
    {
      quote: "The foundation's commitment to pediatric brain cancer research has accelerated our work in ways we never imagined. Their support is changing the future for children everywhere.",
      author: "Dr. Emily Rodriguez",
      role: "Research Director, St. Jude"
    },
    {
      quote: "When our daughter was diagnosed, Lilabean was there. Not just with funding, but with a community that understood our journey. That support was everything.",
      author: "Robert Kim",
      role: "Parent & Fundraiser"
    }
  ];

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '2rem auto',
      backgroundColor: 'white'
    }}>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: '700',
        color: '#000',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        Stories of Hope & Impact
      </h2>
      
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        overflowX: 'auto',
        paddingBottom: '1rem',
        scrollbarWidth: 'thin',
        scrollbarColor: '#c8dbf8 transparent',
        WebkitOverflowScrolling: 'touch'
      }}
      onWheel={(e) => {
        if (e.deltaY !== 0) {
          e.currentTarget.scrollLeft += e.deltaY;
          e.preventDefault();
        }
      }}
      >
        {stories.map((story, index) => (
          <div
            key={index}
            style={{
              minWidth: '320px',
              maxWidth: '380px',
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            <div style={{
              fontSize: '4rem',
              fontWeight: '700',
              color: '#000',
              lineHeight: '1',
              marginBottom: '1rem',
              fontFamily: 'Georgia, serif'
            }}>
              "
            </div>
            <p style={{
              fontSize: '1rem',
              lineHeight: '1.6',
              color: '#1e293b',
              marginBottom: '1.5rem',
              flex: 1
            }}>
              {story.quote}
            </p>
            <div>
              <div style={{
                fontWeight: '600',
                fontSize: '1rem',
                color: '#000',
                marginBottom: '0.25rem'
              }}>
                {story.author}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#64748b'
              }}>
                {story.role}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        div::-webkit-scrollbar {
          height: 8px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: #c8dbf8;
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #1e88e5;
        }
      `}</style>
    </div>
  );
}

