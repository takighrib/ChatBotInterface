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
          ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
          : 'bg-gradient-to-r from-purple-600 to-pink-600'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[75%] ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="text-sm md:text-base whitespace-pre-wrap break-words">
            {message.content}
          </p>

          {planItems.length > 0 && (
            <div className="mt-3 rounded-xl border border-gray-200 bg-white/70 p-3 text-left">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Plan d'apprentissage</div>
              <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-gray-800">
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
          <span className="text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>

          {!isUser && message.confidence && (
            <span className="text-xs text-gray-500">
              • Confiance: {(message.confidence * 100).toFixed(0)}%
            </span>
          )}

          {!isUser && (
            <>
              <button
                onClick={handleCopy}
                className="text-gray-400 hover:text-gray-600 transition"
                title="Copier le message"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`transition ${showDetails ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                title="Voir les détails techniques"
              >
                <Info className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Technical Details Panel */}
        {showDetails && !isUser && (
          <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-600 overflow-x-auto animate-fade-in">
            <div className="font-semibold mb-1 text-gray-700">Résultat de l'agent :</div>
            <pre>{JSON.stringify(message, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;