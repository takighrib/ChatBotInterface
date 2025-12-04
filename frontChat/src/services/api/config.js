import axios from 'axios';
import { APP_CONFIG, API_TIMEOUT } from '@constants/config';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim() ||
  'http://127.0.0.1:8000'; // no /api suffix

// Instance Axios principale
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT || 20000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur de requête
apiClient.interceptors.request.use(
  (config) => {
    // Vous pouvez ajouter un token d'authentification ici si nécessaire
    // const token = localStorage.getItem('auth_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gestion centralisée des erreurs
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      console.error('Erreur API:', error.response.status, error.response.data);
    } else if (error.request) {
      // La requête a été faite mais pas de réponse
      console.error('Pas de réponse du serveur:', error.request);
    } else {
      // Erreur lors de la configuration de la requête
      console.error('Erreur de configuration:', error.message);
    }
    return Promise.reject(error);
  }
);

// Helper pour gérer les erreurs
export const handleApiError = (error) => {
  if (error.response) {
    return {
      success: false,
      message: error.response.data.message || 'Une erreur est survenue',
      status: error.response.status
    };
  } else if (error.request) {
    return {
      success: false,
      message: 'Impossible de contacter le serveur. Vérifie ta connexion.',
      status: 0
    };
  } else {
    return {
      success: false,
      message: error.message || 'Une erreur inattendue est survenue',
      status: -1
    };
  }
};