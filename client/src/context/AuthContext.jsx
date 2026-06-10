import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('shopstack_user');
    return u ? JSON.parse(u) : null;
  });

  const login = (userData, token) => {
    localStorage.setItem('shopstack_user', JSON.stringify(userData));
    localStorage.setItem('shopstack_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('shopstack_user');
    localStorage.removeItem('shopstack_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
