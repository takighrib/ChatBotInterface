import { apiClient, handleApiError } from './config';

/**
 * Service API pour le module Chatbot
 */
export const chatbotAPI = {
  /**
   * Envoie un message au chatbot
   * @param {string} message - Le message de l'utilisateur
   * @param {Array} history - Historique de la conversation
   * @returns {Promise<Object>} Réponse du chatbot
   */
  sendMessage: async (message, history = []) => {
    try {
      const response = await apiClient.post('/chatbot/message', {
        message,
        history
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtient une explication du raisonnement du chatbot
   * @param {string} message - Le message original
   * @param {string} response - La réponse du chatbot
   * @returns {Promise<Object>} Explication
   */
  getExplanation: async (message, response) => {
    try {
      const result = await apiClient.post('/chatbot/explain', {
        message,
        response
      });
      return {
        success: true,
        data: result.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Réinitialise la conversation
   * @returns {Promise<Object>} Confirmation
   */
  resetConversation: async () => {
    try {
      const response = await apiClient.post('/chatbot/reset');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Envoie un message au chatbot (Real Backend)
   * @param {string} message - Le message de l'utilisateur
   * @param {string} sessionId - ID de session (optionnel)
   * @returns {Promise<Object>} Réponse du chatbot
   */
  sendMessageReal: async (message, sessionId = null) => {
    try {
      let response;
      
      // Si pas de session ou message de démarrage, on initialise
      if (!sessionId && (message.toLowerCase().includes('start') || message.toLowerCase().includes('commencer'))) {
        response = await apiClient.post('/chat/start', {
          topic: message
        });
      } else {
        // Sinon on envoie un message normal
        // Si pas de session, on en crée une implicitement avec un topic par défaut si nécessaire
        if (!sessionId) {
           response = await apiClient.post('/chat/start', {
            topic: message
          });
        } else {
          response = await apiClient.post('/chat/message', {
            message,
            sessionId
          });
        }
      }

      return {
        success: true,
        data: {
          message: response.data.message,
          timestamp: new Date().toISOString(),
          confidence: 1.0,
          sessionId: response.data.sessionId,
          state: response.data.state,
          topic: response.data.topic,
          plan: response.data.plan,
          segments: response.data.segments
        }
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Récupère la liste des conversations sauvegardées dans MongoDB
   */
  listHistories: async () => {
    try {
      const response = await apiClient.get('/chat/history');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Récupère une conversation sauvegardée complète
   * @param {string} historyId - Identifiant MongoDB
   */
  getHistoryById: async (historyId) => {
    try {
      const response = await apiClient.get(`/chat/history/${historyId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * MODE DÉMO : Simule une réponse du chatbot (sans backend)
   */
  sendMessageDemo: async (message) => {
    // Simulation d'un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));

    const responses = {
      'bonjour': 'Bonjour ! Je suis un chatbot IA. Comment puis-je t\'aider aujourd\'hui ?',
      'comment ça va': 'Je vais bien, merci ! En tant qu\'IA, je suis toujours prêt à discuter avec toi.',
      'qu\'est-ce que l\'ia': 'L\'Intelligence Artificielle est la capacité d\'une machine à imiter l\'intelligence humaine. Je suis un exemple d\'IA !',
      'default': 'C\'est une question intéressante ! En tant qu\'IA pédagogique, je suis ici pour t\'aider à comprendre l\'intelligence artificielle.'
    };

    const messageKey = message.toLowerCase();
    const botResponse = responses[messageKey] || responses['default'];

    return {
      success: true,
      data: {
        message: botResponse,
        timestamp: new Date().toISOString(),
        confidence: 0.85
      }
    };
  }
};