export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(90deg, #1565C0 0%, #1E88E5 100%)',
      color: 'white',
      padding: '3rem 2rem 1.5rem',
      marginTop: 'auto',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      {/* Main Content Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '3rem',
        marginBottom: '2rem'
      }}>
        {/* Left Column - Branding */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/>
            </svg>
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
              Lilabean Foundation
            </h3>
          </div>
          <p style={{ 
            margin: 0, 
            fontSize: '0.95rem', 
            lineHeight: '1.6',
            color: 'rgba(255, 255, 255, 0.9)'
          }}>
            Dedicated to funding pediatric brain cancer research and supporting families through their journey with compassion, hope, and action.
          </p>
        </div>

        {/* Middle Column - Quick Links */}
        <div>
          <h4 style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '1.1rem', 
            fontWeight: '600' 
          }}>
            Quick Links
          </h4>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {[
              { name: 'About Us', href: '#' },
              { name: 'Research Projects', href: '#' },
              { name: 'Get Involved', href: '#' },
              { name: 'Resources for Families', href: '#' }
            ].map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="10" height="10" rx="2" stroke="white" strokeWidth="1.5" fill="none"/>
                    <path d="M6 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column - Contact Us */}
        <div>
          <h4 style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '1.1rem', 
            fontWeight: '600' 
          }}>
            Contact Us
          </h4>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="white" strokeWidth="2" fill="none"/>
                <polyline points="22,6 12,13 2,6" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
              <a 
                href="mailto:info@lilabeanfoundation.org"
                style={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                info@lilabeanfoundation.com
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
              <span style={{ fontSize: '0.95rem' }}>(301) 404-3566</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginTop: '2px' }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="white" strokeWidth="2" fill="none"/>
                <circle cx="12" cy="10" r="3" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
              <span style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                105 Rockdale Dr <br />
                Silver Spring, MD 20901
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        margin: '2rem 0 1.5rem',
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }} />

      {/* Bottom Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        fontSize: '0.875rem',
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: '1.6'
      }}>
        <div style={{ marginBottom: '0.5rem' }}>
          © 2025 Lilabean Foundation. All rights reserved. | 501(c)(3) Nonprofit Organization | EIN: #45-4877388
        </div>
        <div style={{ fontWeight: '500' }}>
          Together, we're creating a future where no child loses their battle with brain cancer.
        </div>
      </div>
    </footer>
  );
}

