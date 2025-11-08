import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext.jsx';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleSignOut = () => {
    logout();
    // Redirect to home page
    navigate('/');
  };

  return (
    <header className="header">
      <div className="social-media-buttons">
        <a
          href="https://www.instagram.com/thelilabeanfoundation/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
          className="social-btn instagram"
          aria-label="Instagram"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="3"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
            <rect
              x="2"
              y="2"
              width="20"
              height="20"
              rx="5"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </a>

        <a
          href="https://open.spotify.com/show/1NJYQeTnJuJY0PgR4xFYF9"
          target="_blank"
          rel="noopener noreferrer"
          className="social-btn spotify"
          aria-label="Spotify"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 14.48c-.15.24-.48.32-.72.17-1.97-1.2-4.45-1.47-7.36-.81-.28.05-.56-.1-.61-.38-.05-.28.1-.56.38-.61 3.18-.72 5.93-.42 8.18.93.24.15.32.48.17.72zm1.08-2.28c-.19.3-.6.4-.9.2-2.25-1.37-5.68-1.77-8.35-.96-.33.08-.68-.08-.76-.41-.08-.33.08-.68.41-.76 3.05-.92 6.87-.47 9.45 1.11.3.19.4.6.2.9zm.09-2.37C15.24 9.48 9.92 9.3 6.97 10.25c-.37.11-.77-.05-.88-.42-.11-.37.05-.77.42-.88 3.36-1.02 9.05-.82 12.7 1.28.34.21.44.68.23 1.02-.21.33-.68.44-1.02.23z" />
          </svg>
        </a>

        <a
          href="https://www.youtube.com/@lilabeanfoundation9289"
          target="_blank"
          rel="noopener noreferrer"
          className="social-btn youtube"
          aria-label="YouTube"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </a>

        <a
          href="https://www.facebook.com/lilabeanfoundation"
          target="_blank"
          rel="noopener noreferrer"
          className="social-btn facebook"
          aria-label="Facebook"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>
      </div>

      <div className="header-logo">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img 
            src="/Lilabean-Logo-Transparent.png" 
            alt="Lilabean Foundation" 
            style={{ height: '80px', width: 'auto' }}
          />
        </Link>
      </div>

      <div className="header-actions">
        <Link to="/donate" style={{ textDecoration: 'none' }}>
          <button className="donate-btn">Donate</button>
        </Link>
        {user.isAuthenticated ? (
          <button className="sign-in-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        ) : (
          <Link to="/signin" style={{ textDecoration: 'none' }}>
            <button className="sign-in-btn">Sign In</button>
          </Link>
        )}
      </div>
    </header>
  );
}
