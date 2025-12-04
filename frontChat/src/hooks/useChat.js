import { useState, useEffect } from 'react';
import { chatbotAPI } from '@services/api/chatbotAPI';
import { storageService } from '@services/storage/localStorage';
import { STORAGE_KEYS } from '@constants/config';
import { chatSessions } from '@services/storage/chatSessions';

/**
 * Hook personnalisé pour gérer le chatbot
 */
export const useChat = (sessionId = null) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const historyKey = sessionId ? `${STORAGE_KEYS.CHAT_HISTORY}:${sessionId}` : STORAGE_KEYS.CHAT_HISTORY;

  const [currentSessionId, setCurrentSessionId] = useState(sessionId);

  // Charger l'historique au montage
  useEffect(() => {
    const savedHistory = storageService.getItem(historyKey);
    if (savedHistory) {
      setMessages(savedHistory);
    } else {
      // Message de bienvenue initial
      setMessages([
        {
          id: Date.now(),
          role: 'assistant',
          content: 'Bonjour ! Je suis ton assistant IA. Quel sujet veux-tu apprendre aujourd\'hui ? 🤖',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [historyKey]);

  // Sauvegarder l'historique à chaque changement
  useEffect(() => {
    if (messages.length > 0) {
      storageService.setItem(historyKey, messages);
    }
  }, [messages, historyKey]);

  /**
   * Envoie un message au chatbot
   */
  const sendMessage = async (content) => {
    if (!content.trim()) return;

    setError(null);
    
    // Ajouter le message utilisateur
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    const hadUserBefore = messages.some(m => m.role === 'user');
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      // Utiliser le vrai API
      // Note: Si c'est le premier message, currentSessionId est null, l'API créera une session
      const response = await chatbotAPI.sendMessageReal(content, currentSessionId);
      
      if (response.success) {
        // Mettre à jour l'ID de session si nouveau
        if (response.data.sessionId && response.data.sessionId !== currentSessionId) {
          setCurrentSessionId(response.data.sessionId);
        }

        const botMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: response.data.message,
          timestamp: response.data.timestamp,
          confidence: response.data.confidence,
          // Stocker les données supplémentaires de l'agent
          agentData: {
            sessionId: response.data.sessionId,
            state: response.data.state,
            plan: response.data.plan,
            segments: response.data.segments
          }
        };
        
        setMessages(prev => [...prev, botMessage]);

        if (sessionId) {
          if (!hadUserBefore) {
            const current = chatSessions.getById(sessionId);
            const base = (response.data.topic || content).trim();
            const title = base.length > 40 ? base.slice(0, 40) + '…' : base || 'Discussion';
            if (current && (!current.title || current.title === 'Nouvelle conversation' || current.title === 'New chat')) {
              chatSessions.rename(sessionId, title);
            }
          }
          chatSessions.touch(sessionId);
        }
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Une erreur est survenue. Le backend est-il lancé ? (cd agent; uvicorn server:app --reload)');
      console.error('Erreur chat:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Réinitialise la conversation
   */
  const clearMessages = () => {
    const welcomeMessage = {
      id: Date.now(),
      role: 'assistant',
      content: 'Conversation réinitialisée ! Que veux-tu savoir sur l\'IA ? 🚀',
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
    setError(null);
  };

  /**
   * Supprime un message spécifique
   */
  const deleteMessage = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
    deleteMessage
  };
};