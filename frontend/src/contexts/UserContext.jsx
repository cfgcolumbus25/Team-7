import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  // Initialize state from localStorage if available
  const [user, setUser] = useState(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const username = localStorage.getItem('username') || '';
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    return {
      isAuthenticated,
      username,
      isAdmin,
    };
  });

  // Sync with localStorage changes (e.g., from other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      const username = localStorage.getItem('username') || '';
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      
      setUser({
        isAuthenticated,
        username,
        isAdmin,
      });
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (username, isAdmin) => {
    const userData = {
      isAuthenticated: true,
      username,
      isAdmin,
    };
    
    // Update localStorage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('username', username);
    localStorage.setItem('isAdmin', isAdmin.toString());
    
    // Update state
    setUser(userData);
    
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    
    // Update state
    setUser({
      isAuthenticated: false,
      username: '',
      isAdmin: false,
    });
    
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

