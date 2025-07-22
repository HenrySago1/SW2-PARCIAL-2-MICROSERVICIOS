import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
  };

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    const savedAuth = localStorage.getItem('isAuthenticated');

    if (savedUser && savedToken && savedAuth === 'true') {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        logout();
      }
    }
    setLoading(false);
  }, []); // Removemos la dependencia logout para evitar el error

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Forzar la actualización del estado
    setTimeout(() => {
      setIsAuthenticated(true);
    }, 100);
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    return user.rol === requiredRole;
  };

  const hasAnyRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.rol);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    hasRole,
    hasAnyRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 