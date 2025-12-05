import React from 'react';
import { Bot, User, Copy, Check, Info } from 'lucide-react';
import { useState } from 'react';

const MessageBubble = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const isUser = message.role === 'user';
  const planItems = !isUser && Array.isArray(message?.agentData?.plan)
    ? message.agentData.plan.filter(item => typeof item === 'string' && item.trim().length > 0)
    : [];

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''} animate-slide-up`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-brand-mint/40 text-brand-slate' 
          : 'bg-brand-slate text-white'
      }`}>
        {isUser ? (
          <User className="w-5 h-5" />
        ) : (
          <Bot className="w-5 h-5" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[75%] ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-brand-mint/40 text-text-primary' 
            : 'bg-white text-text-primary shadow-card'
        }`}>
          <p className="text-sm md:text-base whitespace-pre-wrap break-words">
            {message.content}
          </p>

          {planItems.length > 0 && (
            <div className="mt-3 rounded-xl border border-brand-mint/40 bg-brand-paper p-3 text-left">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-slate">Plan d'apprentissage</div>
              <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-text-primary">
                {planItems.map((item, index) => (
                  <li key={`${message.id}-plan-${index}`}>
                    {item.replace(/^\d+\.?\s*/, '') || item}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center space-x-2 mt-1 px-2">
          <span className="text-xs text-text-secondary">
            {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>

          {!isUser && message.confidence && (
            <span className="text-xs text-text-secondary">
              • Confiance: {(message.confidence * 100).toFixed(0)}%
            </span>
          )}

          {!isUser && (
            <>
              <button
                onClick={handleCopy}
                className="text-text-secondary hover:text-brand-slate transition duration-200"
                title="Copier le message"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-brand-mint" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`transition duration-200 ${showDetails ? 'text-brand-accent' : 'text-text-secondary hover:text-brand-slate'}`}
                title="Voir les détails techniques"
              >
                <Info className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Technical Details Panel */}
        {showDetails && !isUser && (
          <div className="mt-2 p-3 bg-brand-paper border border-brand-grey rounded-lg text-xs font-mono text-text-secondary overflow-x-auto animate-fade-in">
            <div className="font-semibold mb-1 text-text-primary">Résultat de l'agent :</div>
            <pre className="text-text-secondary">{JSON.stringify(message, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;