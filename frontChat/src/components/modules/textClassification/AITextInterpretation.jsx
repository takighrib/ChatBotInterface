import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, MessageSquare, Cpu, Layers, Sparkles, Brain, Zap } from 'lucide-react';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import { TextArea } from '@components/common/Input';

const AITextInterpretation = () => {
  const [inputText, setInputText] = useState("Le renard brun et rapide saute par-dessus le chien paresseux");
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [embeddings, setEmbeddings] = useState([]);
  const [attentionWeights, setAttentionWeights] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [contextVector, setContextVector] = useState([]);
  const [interpretation, setInterpretation] = useState('');

  const steps = [
    { id: 0, name: 'Texte d\'Entrée', icon: MessageSquare, color: 'mint' },
    { id: 1, name: 'Tokenisation', icon: Layers, color: 'mint' },
    { id: 2, name: 'Embeddings', icon: Cpu, color: 'accent' },
    { id: 3, name: 'Self-Attention', icon: Brain, color: 'accent' },
    { id: 4, name: 'Contexte', icon: Zap, color: 'slate' },
    { id: 5, name: 'Interprétation', icon: Sparkles, color: 'slate' }
  ];

  useEffect(() => {
    processText();
  }, [inputText]);

  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  const processText = () => {
    // Step 1: Tokenization
    const words = inputText.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const tokenized = words.map((word, idx) => ({
      id: idx,
      text: word,
      original: inputText.split(/\s+/)[idx],
      subTokens: word.length > 5 ? [word.slice(0, 3), word.slice(3)] : [word]
    }));
    setTokens(tokenized);

    // Step 2: Create embeddings (simulated as random vectors)
    const embeds = tokenized.map(token => ({
      token: token.text,
      vector: Array(8).fill(0).map(() => Math.random() * 2 - 1)
    }));
    setEmbeddings(embeds);

    // Step 3: Generate attention weights
    const attention = tokenized.map((token, i) => 
      tokenized.map((_, j) => {
        const distance = Math.abs(i - j);
        const baseWeight = Math.exp(-distance * 0.3);
        const randomFactor = 0.5 + Math.random() * 0.5;
        return baseWeight * randomFactor;
      })
    );
    setAttentionWeights(attention);

    // Step 4: Context vectors
    const context = embeds.map((emb, i) => {
      const weights = attention[i];
      const weighted = emb.vector.map((val, dim) => 
        embeds.reduce((sum, e, j) => sum + e.vector[dim] * weights[j], 0)
      );
      return weighted;
    });
    setContextVector(context);

    // Step 5: Generate interpretation
    generateInterpretation(tokenized);
  };

  const generateInterpretation = (tokenized) => {
    const subjects = ['le renard', 'un animal', 'la créature'];
    const actions = ['se déplace rapidement', 'saute', 'bondit'];
    const objects = ['un autre animal', 'le chien', 'quelque chose'];
    
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const object = objects[Math.floor(Math.random() * objects.length)];
    
    setInterpretation(`Cette phrase décrit comment ${subject} ${action} par-dessus ${object}. L'IA identifie : les sujets, les actions, les relations spatiales et les adjectifs pour construire une compréhension sémantique.`);
  };

  const getStepColor = (stepId) => {
    const step = steps.find(s => s.id === stepId);
    return step ? step.color : 'gray';
  };

  const resetVisualization = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setSelectedToken(null);
  };

  const getStepColorClasses = (color, isCurrent, isActive) => {
    if (isCurrent) {
      if (color === 'mint') {
        return 'bg-gradient-to-br from-brand-mint to-brand-accent shadow-lg shadow-brand-mint/50 scale-110';
      } else if (color === 'accent') {
        return 'bg-gradient-to-br from-brand-accent to-brand-slate shadow-lg shadow-brand-accent/50 scale-110';
      } else {
        return 'bg-gradient-to-br from-brand-slate to-brand-mint shadow-lg shadow-brand-slate/50 scale-110';
      }
    } else if (isActive) {
      if (color === 'mint') {
        return 'bg-brand-mint/50';
      } else if (color === 'accent') {
        return 'bg-brand-accent/50';
      } else {
        return 'bg-brand-slate/50';
      }
    }
    return 'bg-brand-grey/30';
  };

  const renderTokenization = () => {
    if (currentStep < 1) return null;
    
    return (
      <Card className="bg-brand-mint/10 border-l-4 border-brand-mint">
        <h3 className="text-xl font-bold text-brand-slate mb-4 flex items-center gap-2">
          <Layers size={24} />
          Étape 1 : Tokenisation
        </h3>
        <p className="text-text-secondary text-sm mb-4">Découpage du texte en tokens (mots/sous-mots)</p>
        <div className="flex flex-wrap gap-3">
          {tokens.map((token, idx) => (
            <div
              key={idx}
              className="relative group cursor-pointer"
              onMouseEnter={() => setSelectedToken(idx)}
              onMouseLeave={() => setSelectedToken(null)}
            >
              <div className={`px-4 py-2 rounded-lg font-mono text-sm transition-all transform ${
                selectedToken === idx 
                  ? 'bg-brand-accent text-white scale-110 shadow-lg shadow-brand-accent/50' 
                  : 'bg-brand-mint/30 text-brand-slate hover:bg-brand-mint/50 border border-brand-mint/40'
              }`}>
                {token.original}
              </div>
              {token.subTokens.length > 1 && (
                <div className="absolute -bottom-8 left-0 right-0 flex gap-1 text-xs">
                  {token.subTokens.map((sub, i) => (
                    <span key={i} className="px-2 py-1 bg-brand-mint/50 rounded text-brand-slate border border-brand-mint/60">
                      {sub}
                    </span>
                  ))}
                </div>
              )}
              {selectedToken === idx && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-brand-slate px-2 py-1 rounded text-xs text-white whitespace-nowrap shadow-md">
                  Token #{idx}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const renderEmbeddings = () => {
    if (currentStep < 2) return null;
    
    return (
      <Card className="bg-brand-accent/10 border-l-4 border-brand-accent">
        <h3 className="text-xl font-bold text-brand-slate mb-4 flex items-center gap-2">
          <Cpu size={24} />
          Étape 2 : Embeddings Vectoriels
        </h3>
        <p className="text-text-secondary text-sm mb-4">Conversion des tokens en vecteurs numériques (8 dimensions)</p>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {embeddings.slice(0, 6).map((emb, idx) => (
            <div key={idx} className="bg-white/50 rounded-lg p-3 border border-brand-grey/40">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-sm text-brand-accent font-semibold">{emb.token}</span>
                <span className="text-xs text-text-secondary">Vecteur 8D</span>
              </div>
              <div className="flex gap-1">
                {emb.vector.map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded"
                    style={{
                      height: '40px',
                      background: `linear-gradient(to top, ${val > 0 ? '#D9822B' : '#BBD5D0'}, transparent)`,
                      opacity: Math.abs(val)
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1 text-xs text-text-secondary">
                {emb.vector.slice(0, 4).map((val, i) => (
                  <span key={i}>{val.toFixed(2)}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const renderAttention = () => {
    if (currentStep < 3) return null;
    
    return (
      <Card className="bg-brand-accent/10 border-l-4 border-brand-accent">
        <h3 className="text-xl font-bold text-brand-slate mb-4 flex items-center gap-2">
          <Brain size={24} />
          Étape 3 : Mécanisme de Self-Attention
        </h3>
        <p className="text-text-secondary text-sm mb-4">Calcul des relations entre tous les tokens</p>
        <div className="relative">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(tokens.length, 9)}, 1fr)` }}>
            {attentionWeights.slice(0, 9).map((row, i) => (
              <React.Fragment key={i}>
                {row.slice(0, 9).map((weight, j) => {
                  const normalized = weight / Math.max(...row);
                  return (
                    <div
                      key={`${i}-${j}`}
                      className="aspect-square rounded transition-all hover:scale-110 cursor-pointer relative group border border-brand-grey/20"
                      style={{
                        background: `rgba(217, 130, 43, ${normalized * 0.8})`,
                        boxShadow: normalized > 0.7 ? `0 0 10px rgba(217, 130, 43, ${normalized})` : 'none'
                      }}
                    >
                      {normalized > 0.7 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                        </div>
                      )}
                      <div className="hidden group-hover:block absolute -top-8 left-1/2 transform -translate-x-1/2 bg-brand-slate px-2 py-1 rounded text-xs text-white whitespace-nowrap z-10 shadow-md">
                        {tokens[i]?.text} → {tokens[j]?.text}: {normalized.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-xs text-text-secondary">
            <span>Tokens de requête →</span>
            <span>← Tokens clés</span>
          </div>
        </div>
      </Card>
    );
  };

  const renderContext = () => {
    if (currentStep < 4) return null;
    
    return (
      <Card className="bg-brand-slate/10 border-l-4 border-brand-slate">
        <h3 className="text-xl font-bold text-brand-slate mb-4 flex items-center gap-2">
          <Zap size={24} />
          Étape 4 : Compréhension Contextuelle
        </h3>
        <p className="text-text-secondary text-sm mb-4">Construction de représentations contextuelles</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tokens.slice(0, 6).map((token, idx) => (
            <div key={idx} className="bg-white/50 rounded-lg p-4 border border-brand-grey/40">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-brand-slate font-semibold">{token.original}</span>
                <div className="flex gap-1">
                  {attentionWeights[idx]?.slice(0, 9).map((w, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-6 rounded"
                      style={{
                        background: `rgba(47, 79, 79, ${w / Math.max(...attentionWeights[idx])})`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="text-xs text-text-secondary">
                Contexte enrichi avec : {attentionWeights[idx]
                  ?.map((w, i) => ({ w, i }))
                  .sort((a, b) => b.w - a.w)
                  .slice(0, 3)
                  .filter(item => item.i !== idx)
                  .map(item => tokens[item.i]?.text)
                  .join(', ')}
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const renderInterpretation = () => {
    if (currentStep < 5) return null;
    
    return (
      <Card className="bg-brand-slate/10 border-l-4 border-brand-slate">
        <h3 className="text-xl font-bold text-brand-slate mb-4 flex items-center gap-2">
          <Sparkles size={24} />
          Étape 5 : Interprétation Sémantique
        </h3>
        <p className="text-text-secondary text-sm mb-4">Compréhension finale du sens du texte</p>
        <div className="bg-gradient-to-r from-brand-mint/30 to-brand-accent/20 rounded-lg p-6 border border-brand-mint/40">
          <div className="text-text-primary leading-relaxed">
            {interpretation}
          </div>
          <div className="mt-4 pt-4 border-t border-brand-grey/40">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-brand-accent font-semibold">Entités :</span>
                <span className="text-text-secondary ml-2">renard, chien</span>
              </div>
              <div>
                <span className="text-brand-accent font-semibold">Action :</span>
                <span className="text-text-secondary ml-2">saute par-dessus</span>
              </div>
              <div>
                <span className="text-brand-accent font-semibold">Attributs :</span>
                <span className="text-text-secondary ml-2">rapide, brun, paresseux</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="w-full py-8">
      <Card className="border-l-4 border-brand-mint bg-white/95 backdrop-blur-sm">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-brand-mint to-brand-accent rounded-xl shadow-md">
              <Brain size={36} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-text-primary">
                Compréhension du Texte par l'IA
              </h2>
              <p className="text-text-secondary mt-1">Comment l'IA traite et interprète le langage</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant={isPlaying ? "secondary" : "primary"}
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={currentStep >= steps.length - 1}
              icon={isPlaying ? <Pause size={20} /> : <Play size={20} />}
            >
              {isPlaying ? 'Pause' : 'Lancer'}
            </Button>
            <Button
              variant="outline"
              onClick={resetVisualization}
              icon={<RotateCcw size={20} />}
            >
              Réinitialiser
            </Button>
          </div>
        </div>

        {/* Input */}
        <div className="mb-6">
          <TextArea
            label="Texte d'entrée :"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setCurrentStep(0);
              setIsPlaying(false);
            }}
            placeholder="Entrez un texte à analyser..."
            rows={3}
            className="w-full"
          />
        </div>

        {/* Progress Steps */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            const isActive = currentStep >= step.id;
            const isCurrent = currentStep === step.id;
            
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-xl transition-all transform hover:scale-110 flex items-center justify-center ${getStepColorClasses(step.color, isCurrent, isActive)}`}
                  >
                    <StepIcon 
                      size={24} 
                      className={isActive ? 'text-white' : 'text-text-secondary'} 
                    />
                  </button>
                  <span className={`text-xs md:text-sm font-medium text-center max-w-[80px] ${
                    isActive ? 'text-text-primary' : 'text-text-secondary'
                  }`}>
                    {step.name}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 rounded transition-all min-w-[20px] ${
                    currentStep > step.id 
                      ? 'bg-gradient-to-r from-brand-mint to-brand-accent' 
                      : 'bg-brand-grey/40'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Visualization Panels */}
        <div className="space-y-6">
          {renderTokenization()}
          {renderEmbeddings()}
          {renderAttention()}
          {renderContext()}
          {renderInterpretation()}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="bg-brand-mint/20 border-l-4 border-brand-mint">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="text-brand-accent" size={20} />
              <span className="text-brand-slate font-semibold">Tokens</span>
            </div>
            <div className="text-3xl font-bold text-text-primary">{tokens.length}</div>
            <div className="text-text-secondary text-sm">Unités traitées</div>
          </Card>
          
          <Card className="bg-brand-accent/20 border-l-4 border-brand-accent">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="text-brand-accent" size={20} />
              <span className="text-brand-slate font-semibold">Embeddings</span>
            </div>
            <div className="text-3xl font-bold text-text-primary">8D</div>
            <div className="text-text-secondary text-sm">Dimensions vectorielles</div>
          </Card>
          
          <Card className="bg-brand-slate/20 border-l-4 border-brand-slate">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="text-brand-accent" size={20} />
              <span className="text-brand-slate font-semibold">Attention</span>
            </div>
            <div className="text-3xl font-bold text-text-primary">{tokens.length * tokens.length}</div>
            <div className="text-text-secondary text-sm">Relations calculées</div>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default AITextInterpretation;
