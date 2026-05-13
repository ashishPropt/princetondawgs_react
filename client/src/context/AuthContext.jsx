import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken]   = useState(() => sessionStorage.getItem('pd_token') || null);
  const [player, setPlayer] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('pd_player') || 'null'); } catch { return null; }
  });

  const login = useCallback((tok, playerData) => {
    setToken(tok);
    setPlayer(playerData);
    sessionStorage.setItem('pd_token', tok);
    sessionStorage.setItem('pd_player', JSON.stringify(playerData));
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setToken(null);
    setPlayer(null);
    sessionStorage.removeItem('pd_token');
    sessionStorage.removeItem('pd_player');
  }, []);

  return (
    <AuthContext.Provider value={{ token, player, login, logout, isAdmin: player?.is_admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
