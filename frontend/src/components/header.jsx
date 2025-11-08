export default function Header() {
    return (
        <header className="header">
            <div className="header-logo">
                <h1>Lilabean Foundation Dashboard</h1>
            </div>
            
            <div className="social-media-buttons">
                <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-btn instagram"
                    aria-label="Instagram"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
                        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                </a>
                
                <a 
                    href="https://spotify.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-btn spotify"
                    aria-label="Spotify"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 14.48c-.15.24-.48.32-.72.17-1.97-1.2-4.45-1.47-7.36-.81-.28.05-.56-.1-.61-.38-.05-.28.1-.56.38-.61 3.18-.72 5.93-.42 8.18.93.24.15.32.48.17.72zm1.08-2.28c-.19.3-.6.4-.9.2-2.25-1.37-5.68-1.77-8.35-.96-.33.08-.68-.08-.76-.41-.08-.33.08-.68.41-.76 3.05-.92 6.87-.47 9.45 1.11.3.19.4.6.2.9zm.09-2.37C15.24 9.48 9.92 9.3 6.97 10.25c-.37.11-.77-.05-.88-.42-.11-.37.05-.77.42-.88 3.36-1.02 9.05-.82 12.7 1.28.34.21.44.68.23 1.02-.21.33-.68.44-1.02.23z"/>
                    </svg>
                </a>
                
                <a 
                    href="https://tiktok.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-btn tiktok"
                    aria-label="TikTok"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                </a>
            </div>
            
            <div className="header-actions">
                <button className="donate-btn">Donate</button>
                <button className="sign-in-btn">Sign In</button>
            </div>
        </header>
    )
}
