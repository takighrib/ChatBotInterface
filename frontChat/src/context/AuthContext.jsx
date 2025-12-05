import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@services/api/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    let isMounted = true;
    
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          try {
            const userData = await authService.getCurrentUser();
            if (isMounted) {
              setUser(userData);
            }
          } catch (err) {
            console.error('Failed to get user:', err);
            if (isMounted) {
              authService.logout();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        // Toujours mettre loading à false, même en cas d'erreur
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Timeout de sécurité pour éviter que loading reste à true indéfiniment
    const timeout = setTimeout(() => {
      if (isMounted && loading) {
        console.warn('Auth loading timeout, setting loading to false');
        setLoading(false);
      }
    }, 3000);

    initAuth();

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  const register = async (email, password) => {
    try {
      setError(null);
      const data = await authService.register(email, password);
      setUser({ email, user_id: data.user_id });
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const data = await authService.login(email, password);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    try {
      // 1. Nettoyer le service d'authentification (supprime le token)
      authService.logout();
      
      // 2. Réinitialiser complètement l'état utilisateur
      setUser(null);
      setError(null);
      setLoading(false);
      
      // 3. S'assurer que le body n'est pas bloqué
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'unset';
      }
      
      console.log('✅ Logout successful - User logged out');
    } catch (error) {
      console.error('Logout error:', error);
      // Même en cas d'erreur, nettoyer l'état local
      setUser(null);
      setError(null);
      setLoading(false);
      authService.logout(); // Forcer le nettoyage
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'unset';
      }
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
