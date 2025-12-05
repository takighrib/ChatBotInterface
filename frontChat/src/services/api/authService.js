const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const authService = {
  async register(email, password) {
    // ❌ AVANT: fetch(`${API_BASE_URL}/api/auth/register`)
    // ✅ APRÈS: fetch(`${API_BASE_URL}/auth/register`)
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    return data;
  },

  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username: email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    return data;
  },

  logout() {
    // Supprimer le token
    localStorage.removeItem('token');
    
    // Nettoyer toutes les données d'authentification
    // Note: On garde les autres données (settings, progress) pour permettre la réutilisation
    // Si vous voulez tout nettoyer, décommentez les lignes suivantes :
    // localStorage.removeItem('user_settings');
    // localStorage.removeItem('user_progress');
    // localStorage.removeItem('chat_history');
    // localStorage.removeItem('chat_sessions');
  },

  async getCurrentUser() {
    const token = this.getToken();
    if (!token) throw new Error('No token found');

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Failed to get user');
    return response.json();
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};
