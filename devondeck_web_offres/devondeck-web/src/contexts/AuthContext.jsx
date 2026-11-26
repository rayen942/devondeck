import { createContext, useContext, useEffect, useState } from 'react';
import { clearAuthSession, readAuthSession } from '../services/authSession.js';
import { logoutOrganisation } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readAuthSession);

  useEffect(() => {
    const handleSessionExpired = () => setSession(null);
    window.addEventListener('devondeck:session-expired', handleSessionExpired);
    return () => window.removeEventListener('devondeck:session-expired', handleSessionExpired);
  }, []);

  useEffect(() => {
    if (!session) return undefined;
    const timeout = window.setTimeout(
      () => {
        clearAuthSession();
        setSession(null);
      },
      Math.max(0, session.expiresAt - Date.now()),
    );
    return () => window.clearTimeout(timeout);
  }, [session]);

  const signOut = async () => {
    let logoutError = null;
    try {
      if (session?.role === 'ORGANISATION') await logoutOrganisation();
    } catch (error) {
      logoutError = error;
    } finally {
      clearAuthSession();
      setSession(null);
    }
    return logoutError;
  };

  return (
    <AuthContext.Provider value={{ session, setSession, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider.');
  return context;
}
