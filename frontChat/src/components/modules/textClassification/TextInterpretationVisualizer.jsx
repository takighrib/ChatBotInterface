import React, { useState, useEffect } from 'react';
import { Type, Brain, Sparkles, Network } from 'lucide-react';

const TextInterpretationVisualizer = ({ isActive, sampleText = "L'intelligence artificielle transforme notre monde" }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [tokens, setTokens] = useState([]);
  const [embeddings, setEmbeddings] = useState([]);

  const steps = [
    {
      name: 'Tokenisation',
      description: 'Découpage en mots',
      icon: Type,
      color: 'from-blue-400 to-cyan-600'
    },
    {
      name: 'Nettoyage',
      description: 'Normalisation du texte',
      icon: Sparkles,
      color: 'from-purple-400 to-pink-600'
    },
    {
      name: 'Embedding',
      description: 'Conversion en vecteurs',
      icon: Network,
      color: 'from-orange-400 to-red-600'
    },
    {
      name: 'Analyse',
      description: 'Extraction de sens',
      icon: Brain,
      color: 'from-green-400 to-emerald-600'
    }
  ];

  useEffect(() => {
    if (!isActive) return;

    // Create tokens from sample text
    const words = sampleText.split(' ');
    setTokens(words.map((word, idx) => ({
      id: idx,
      text: word,
      active: false
    })));

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isActive, sampleText, steps.length]);

  useEffect(() => {
    if (!isActive || activeStep !== 0) return;

    // Animate tokens
    tokens.forEach((_, idx) => {
      setTimeout(() => {
        setTokens(prev => prev.map((t, i) => 
          i === idx ? { ...t, active: true } : t
        ));
      }, idx * 200);
    });
  }, [isActive, activeStep, tokens]);

  useEffect(() => {
    if (!isActive || activeStep !== 2) return;

    // Generate random embeddings visualization
    const newEmbeddings = Array.from({ length: 8 }, (_, idx) => ({
      id: idx,
      values: Array.from({ length: 16 }, () => Math.random())
    }));
    setEmbeddings(newEmbeddings);
  }, [isActive, activeStep]);

  const renderTokenization = () => (
    <div className="flex flex-wrap gap-2 justify-center">
      {tokens.map((token) => (
        <div
          key={token.id}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm transition-all duration-500 transform
            ${token.active 
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white scale-105 shadow-lg' 
              : 'bg-white/10 text-gray-400 scale-95'
            }
          `}
        >
          {token.text}
        </div>
      ))}
    </div>
  );

  const renderCleaning = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4">
        <div className="text-gray-400 line-through">L'intelligence</div>
        <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
        <div className="text-white font-semibold">intelligence</div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-6">
        {['Lowercase', 'Remove accents', 'Remove punctuation', 'Stemming'].map((process, idx) => (
          <div
            key={idx}
            className="bg-white/10 rounded-lg p-3 text-center transform transition-all hover:scale-105"
            style={{
              animationDelay: `${idx * 150}ms`,
              animation: 'fadeIn 0.6s ease-out forwards'
            }}
          >
            <p className="text-xs text-purple-300 font-medium">{process}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmbedding = () => (
    <div className="space-y-3">
      <p className="text-center text-gray-300 text-sm mb-4">
        Chaque mot devient un vecteur numérique
      </p>
      <div className="grid grid-cols-4 gap-2">
        {embeddings.map((embedding) => (
          <div
            key={embedding.id}
            className="bg-white/5 rounded-lg p-2 space-y-1"
          >
            {embedding.values.slice(0, 4).map((value, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <div className="h-2 bg-gray-700 rounded-full flex-1 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-1000"
                    style={{ width: `${value * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400 w-10 text-right">
                  {value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Sentiment', value: 'Positif', color: 'from-green-500 to-emerald-500', percent: 85 },
          { label: 'Thème', value: 'Tech', color: 'from-blue-500 to-cyan-500', percent: 92 },
          { label: 'Confiance', value: 'Haute', color: 'from-purple-500 to-pink-500', percent: 88 }
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white/10 rounded-lg p-3 text-center transform transition-all hover:scale-105"
            style={{
              animationDelay: `${idx * 200}ms`,
              animation: 'slideUp 0.6s ease-out forwards'
            }}
          >
            <p className="text-xs text-gray-400 mb-1">{item.label}</p>
            <p className={`text-lg font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
              {item.value}
            </p>
            <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${item.color} transition-all duration-1000`}
                style={{ width: `${item.percent}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white/5 rounded-lg p-4 mt-4">
        <p className="text-sm text-gray-300 text-center">
          <Brain className="w-4 h-4 inline mr-2 text-green-400" />
          Le réseau de neurones a analysé le contexte sémantique et extrait le sens
        </p>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return renderTokenization();
      case 1:
        return renderCleaning();
      case 2:
        return renderEmbedding();
      case 3:
        return renderAnalysis();
      default:
        return null;
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 overflow-hidden min-h-[400px]">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
      </div>

      {/* Title */}
      <div className="relative z-10 mb-6">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Type className="w-6 h-6" />
          Comment l'IA comprend le texte
        </h3>
        <p className="text-gray-300 text-sm">
          Visualisation du traitement NLP étape par étape
        </p>
      </div>

      {/* Steps Flow */}
      <div className="relative z-10 flex items-center justify-between mb-8 overflow-x-auto pb-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === activeStep;
          
          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center min-w-[90px]">
                <div
                  className={`
                    relative w-14 h-14 rounded-xl flex items-center justify-center
                    transition-all duration-500 transform
                    ${isActive ? 'scale-110 shadow-2xl' : 'scale-100 opacity-60'}
                    bg-gradient-to-br ${step.color}
                  `}
                >
                  <Icon className="w-7 h-7 text-white" />
                  
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl animate-ping bg-white opacity-20"></div>
                  )}
                </div>
                
                <div className="mt-3 text-center">
                  <p className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-gray-400'} transition-colors`}>
                    {step.name}
                  </p>
                  <p className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-500'} transition-colors mt-0.5`}>
                    {step.description}
                  </p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex items-center mx-2">
                  <div className={`h-0.5 w-6 transition-all duration-500 ${
                    index < activeStep ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gray-600'
                  }`}></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 min-h-[200px]">
        {renderStepContent()}
      </div>

      {/* Progress Bar */}
      <div className="relative z-10 mt-6">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
          >
            <div className="h-full w-full bg-white/30 animate-pulse"></div>
          </div>
        </div>
        <p className="text-gray-400 text-xs mt-2 text-center">
          Étape: {activeStep + 1} / {steps.length}
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TextInterpretationVisualizer;
