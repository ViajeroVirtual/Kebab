import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('algekebab_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('algekebab_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Verificar validez del token en el servidor al cargar
  useEffect(() => {
    async function verifySession() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem('algekebab_user', JSON.stringify(data.user));
        } else {
          // Token inválido o expirado
          logout();
        }
      } catch (err) {
        console.warn('No se pudo verificar la sesión en el servidor:', err);
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, [token]);

  const login = async (username, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Error al iniciar sesión');
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('algekebab_user', JSON.stringify(data.user));
    localStorage.setItem('algekebab_token', data.token);
    return data.user;
  };

  const register = async (username, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Error al crear la cuenta');
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('algekebab_user', JSON.stringify(data.user));
    localStorage.setItem('algekebab_token', data.token);
    return data.user;
  };

  const updateProfile = async ({ new_username, new_password, current_password, avatar_color, avatar_url }) => {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ new_username, new_password, current_password, avatar_color, avatar_url })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Error al actualizar el perfil');
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('algekebab_user', JSON.stringify(data.user));
    localStorage.setItem('algekebab_token', data.token);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('algekebab_user');
    localStorage.removeItem('algekebab_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
