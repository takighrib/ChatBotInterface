import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip } from 'lucide-react';

const InputArea = ({ onSend, loading, disabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !loading && !disabled) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-brand-grey/40 bg-white p-4">
      <div className="flex items-end space-x-3">
        {/* Bouton d'attachement (optionnel - désactivé pour le moment) */}
        <button
          type="button"
          className="flex-shrink-0 p-3 text-text-secondary hover:text-brand-slate hover:bg-brand-mint/20 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={true}
          title="Fonctionnalité bientôt disponible"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Zone de saisie */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pose ta question sur l'IA..."
            disabled={loading || disabled}
            rows={1}
            className="w-full px-4 py-3 pr-12 border-2 border-brand-grey rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand-mint focus:border-brand-mint transition disabled:bg-brand-grey/20 disabled:cursor-not-allowed bg-white text-text-primary placeholder:text-text-secondary"
            style={{ maxHeight: '150px' }}
          />
        </div>

        {/* Bouton vocal (optionnel - désactivé pour le moment) */}
        <button
          type="button"
          className="flex-shrink-0 p-3 text-text-secondary hover:text-brand-slate hover:bg-brand-mint/20 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={true}
          title="Fonctionnalité bientôt disponible"
        >
          <Mic className="w-5 h-5" />
        </button>

        {/* Bouton d'envoi */}
        <button
          type="submit"
          disabled={!message.trim() || loading || disabled}
          className="flex-shrink-0 p-3 bg-gradient-to-r from-brand-mint to-brand-accent text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {/* Indicateur de saisie */}
      <div className="mt-2 px-2">
        <p className="text-xs text-text-secondary">
          Appuie sur <kbd className="px-2 py-1 bg-brand-paper border border-brand-grey rounded text-xs">Entrée</kbd> pour envoyer, 
          <kbd className="px-2 py-1 bg-brand-paper border border-brand-grey rounded text-xs ml-1">Shift + Entrée</kbd> pour une nouvelle ligne
        </p>
      </div>
    </form>
  );
};

export default InputArea;
