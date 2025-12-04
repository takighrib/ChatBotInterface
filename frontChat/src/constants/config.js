export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'IA Jeunes',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    chatbot: import.meta.env.VITE_CHATBOT_API_URL || 'http://localhost:8000/api/chatbot',
    image: import.meta.env.VITE_IMAGE_API_URL || 'http://localhost:8000/api/image',
    text: import.meta.env.VITE_TEXT_API_URL || 'http://localhost:8000/api/text'
  },
  features: {
    chatbot: import.meta.env.VITE_ENABLE_CHATBOT === 'true',
    imageRecognition: import.meta.env.VITE_ENABLE_IMAGE_RECOGNITION === 'true',
    textClassification: import.meta.env.VITE_ENABLE_TEXT_CLASSIFICATION === 'true'
  }
};

export const STORAGE_KEYS = {
  USER_PROGRESS: 'user_progress',
  CHAT_HISTORY: 'chat_history',
  PROJECTS: 'user_projects',
  SETTINGS: 'user_settings',
  CHAT_SESSIONS: 'chat_sessions'
};

export const API_TIMEOUT = 30000; // 30 seconds

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

export const MAX_TEXT_LENGTH = 5000;