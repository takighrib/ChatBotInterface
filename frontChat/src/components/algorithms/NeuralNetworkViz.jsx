import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Zap, Brain, Activity, Layers, Info } from 'lucide-react';
import Card from '@components/common/Card';
import Button from '@components/common/Button';

const NeuralNetworkViz = () => {
  const [layers, setLayers] = useState([5, 8, 8, 6, 3]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showWeights, setShowWeights] = useState(true);
  const [colorScheme, setColorScheme] = useState('mint');
  const [particles, setParticles] = useState([]);
  const [activations, setActivations] = useState([]);
  const [pulseIntensity, setPulseIntensity] = useState(0);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const canvasWidth = 1000;
  const canvasHeight = 650;
  const padding = 100;

  // Schémas de couleurs adaptés au design system
  const colorSchemes = {
    mint: { 
      primary: '#BBD5D0',    // brand-mint
      secondary: '#D9822B',  // brand-accent (orange)
      accent: '#2F4F4F'      // brand-slate
    },
    accent: { 
      primary: '#D9822B',    // brand-accent
      secondary: '#BBD5D0',  // brand-mint
      accent: '#2F4F4F'      // brand-slate
    },
    slate: { 
      primary: '#2F4F4F',    // brand-slate
      secondary: '#D9822B',  // brand-accent
      accent: '#BBD5D0'      // brand-mint
    },
    warm: { 
      primary: '#D9822B',    // brand-accent
      secondary: '#E8A87C',  // orange clair
      accent: '#2F4F4F'      // brand-slate
    }
  };

  const colors = colorSchemes[colorScheme];

  useEffect(() => {
    initializeNetwork();
  }, [layers]);

  useEffect(() => {
    if (isAnimating) {
      animationRef.current = setInterval(() => {
        updateNetwork();
      }, 50 / speed);
    }
    return () => clearInterval(animationRef.current);
  }, [isAnimating, speed, layers]);

  const initializeNetwork = () => {
    const newActivations = layers.map(size => 
      Array(size).fill(0).map(() => ({
        value: Math.random(),
        lastActivation: 0
      }))
    );
    setActivations(newActivations);
    setParticles([]);
  };

  const updateNetwork = () => {
    setActivations(prev => {
      const newActivations = prev.map((layer, layerIdx) => 
        layer.map((neuron, nodeIdx) => {
          let newValue;
          if (layerIdx === 0) {
            newValue = Math.sin(Date.now() / 1000 + nodeIdx) * 0.5 + 0.5;
          } else {
            const prevLayer = prev[layerIdx - 1];
            const weighted = prevLayer.reduce((sum, n) => sum + n.value, 0) / prevLayer.length;
            newValue = Math.tanh(weighted + (Math.random() - 0.5) * 0.3);
          }
          return {
            value: newValue,
            lastActivation: neuron.value
          };
        })
      );
      return newActivations;
    });

    setPulseIntensity(prev => (prev + 0.1) % (Math.PI * 2));

    if (Math.random() > 0.7) {
      createParticles();
    }

    setParticles(prev => 
      prev.filter(p => p.life > 0).map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        life: p.life - 0.02
      }))
    );
  };

  const createParticles = () => {
    const layerIdx = Math.floor(Math.random() * (layers.length - 1));
    const nodeIdx = Math.floor(Math.random() * layers[layerIdx]);
    const pos = getNodePosition(layerIdx, nodeIdx, layers[layerIdx]);
    
    const newParticles = Array(5).fill(0).map(() => ({
      x: pos.x,
      y: pos.y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 1,
      size: Math.random() * 3 + 1
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  const getNodePosition = (layerIndex, nodeIndex, totalNodes) => {
    const x = padding + (layerIndex * (canvasWidth - 2 * padding)) / (layers.length - 1);
    const layerHeight = canvasHeight - 2 * padding;
    const spacing = layerHeight / (totalNodes + 1);
    const y = padding + spacing * (nodeIndex + 1);
    return { x, y };
  };

  const getConnectionWeight = (layer1, node1, layer2, node2) => {
    const seed = layer1 * 1000 + node1 * 100 + layer2 * 10 + node2;
    return (Math.sin(seed) + 1) / 2;
  };

  const renderConnections = () => {
    const connections = [];
    
    layers.forEach((layerSize, layerIdx) => {
      if (layerIdx === layers.length - 1) return;
      const nextLayerSize = layers[layerIdx + 1];
      
      for (let i = 0; i < layerSize; i++) {
        const start = getNodePosition(layerIdx, i, layerSize);
        const activation1 = activations[layerIdx]?.[i]?.value || 0;
        
        for (let j = 0; j < nextLayerSize; j++) {
          const end = getNodePosition(layerIdx + 1, j, nextLayerSize);
          const weight = getConnectionWeight(layerIdx, i, layerIdx + 1, j);
          const activation2 = activations[layerIdx + 1]?.[j]?.value || 0;
          
          const isActive = isAnimating && activation1 > 0.3 && activation2 > 0.3;
          const strength = (activation1 + activation2) / 2;
          
          const opacity = isActive ? strength * 0.9 : (showWeights ? weight * 0.3 : 0.1);
          const width = isActive ? 2.5 : (showWeights ? 1 + weight : 0.5);
          
          connections.push(
            <line
              key={`${layerIdx}-${i}-${j}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={isActive ? colors.accent : colors.primary}
              strokeWidth={width}
              opacity={opacity}
              className="transition-all duration-200"
              style={{
                filter: isActive ? `drop-shadow(0 0 ${strength * 8}px ${colors.accent})` : 'none'
              }}
            />
          );
          
          if (showWeights && !isAnimating && weight > 0.7) {
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;
            connections.push(
              <text
                key={`w-${layerIdx}-${i}-${j}`}
                x={midX}
                y={midY}
                fontSize="9"
                fill={colors.accent}
                textAnchor="middle"
                opacity="0.6"
              >
                {weight.toFixed(2)}
              </text>
            );
          }
        }
      }
    });
    
    return connections;
  };

  const renderNeurons = () => {
    const neurons = [];
    
    layers.forEach((layerSize, layerIdx) => {
      for (let i = 0; i < layerSize; i++) {
        const { x, y } = getNodePosition(layerIdx, i, layerSize);
        const neuron = activations[layerIdx]?.[i];
        const activation = neuron?.value || 0;
        const isActive = isAnimating && activation > 0.4;
        
        const baseRadius = 15;
        const radius = isActive ? baseRadius + Math.sin(pulseIntensity) * 3 : baseRadius;
        const glowRadius = radius + 8;
        
        if (isActive) {
          neurons.push(
            <circle
              key={`glow-${layerIdx}-${i}`}
              cx={x}
              cy={y}
              r={glowRadius}
              fill={colors.secondary}
              opacity={activation * 0.3}
              filter="blur(8px)"
            />
          );
        }
        
        neurons.push(
          <g key={`neuron-${layerIdx}-${i}`}>
            <defs>
              <radialGradient id={`grad-${layerIdx}-${i}`}>
                <stop offset="0%" stopColor={colors.primary} stopOpacity={isActive ? 1 : 0.8} />
                <stop offset="70%" stopColor={colors.accent} stopOpacity={isActive ? 0.9 : 0.6} />
                <stop offset="100%" stopColor={colors.secondary} stopOpacity={isActive ? 0.8 : 0.4} />
              </radialGradient>
            </defs>
            
            <circle
              cx={x}
              cy={y}
              r={radius}
              fill={`url(#grad-${layerIdx}-${i})`}
              stroke={isActive ? colors.secondary : colors.primary}
              strokeWidth={isActive ? 3 : 2}
              className="transition-all duration-300"
              style={{
                filter: isActive ? `drop-shadow(0 0 ${activation * 15}px ${colors.secondary})` : 'none'
              }}
            />
            
            <circle
              cx={x}
              cy={y}
              r={radius * 0.5}
              fill="white"
              opacity={activation * 0.7}
            />
            
            {isActive && (
              <circle
                cx={x}
                cy={y}
                r={radius * 1.3}
                fill="none"
                stroke={colors.secondary}
                strokeWidth="1.5"
                opacity={0.4}
                className="animate-ping"
                style={{ animationDuration: '1s' }}
              />
            )}
          </g>
        );
      }
    });
    
    return neurons;
  };

  const renderParticles = () => {
    return particles.map((p, idx) => (
      <circle
        key={`particle-${idx}`}
        cx={p.x}
        cy={p.y}
        r={p.size}
        fill={colors.secondary}
        opacity={p.life * 0.8}
        filter="blur(1px)"
      />
    ));
  };

  const renderLayerLabels = () => {
    return layers.map((size, idx) => {
      const { x } = getNodePosition(idx, 0, size);
      const labels = ['Couche d\'Entrée', 'Couche Cachée 1', 'Couche Cachée 2', 'Couche Cachée 3', 'Couche de Sortie'];
      const label = idx === 0 ? labels[0] : idx === layers.length - 1 ? labels[4] : labels[Math.min(idx, 3)];
      
      return (
        <g key={`label-${idx}`}>
          <text
            x={x}
            y={40}
            textAnchor="middle"
            fill={colors.accent}
            fontSize="15"
            fontWeight="700"
            letterSpacing="1"
          >
            {label}
          </text>
          <text
            x={x}
            y={60}
            textAnchor="middle"
            fill={colors.primary}
            fontSize="12"
          >
            {size} neurones
          </text>
        </g>
      );
    });
  };

  const presetArchitectures = [
    { name: 'Simple', layers: [3, 5, 2] },
    { name: 'Profond', layers: [4, 8, 8, 6, 3] },
    { name: 'Large', layers: [5, 12, 12, 4] },
    { name: 'Pyramidal', layers: [10, 8, 6, 4, 2] }
  ];

  return (
    <div className="w-full py-8 px-4">
      <Card className="border-l-4 border-brand-mint bg-white/95 backdrop-blur-sm">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-brand-mint to-brand-accent rounded-xl shadow-md">
              <Brain size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-text-primary">
                Réseau de Neurones Profond
              </h2>
              <p className="text-text-secondary mt-1">Visualisation en temps réel</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant={isAnimating ? "secondary" : "primary"}
              onClick={() => setIsAnimating(!isAnimating)}
              icon={isAnimating ? <Pause size={20} /> : <Play size={20} />}
            >
              {isAnimating ? 'Pause' : 'Démarrer'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsAnimating(false);
                initializeNetwork();
              }}
              icon={<RotateCcw size={20} />}
            >
              Réinitialiser
            </Button>
          </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="md:col-span-2 bg-brand-mint/10 border-l-4 border-brand-mint">
            <div className="flex items-center gap-2 mb-3">
              <Layers size={18} className="text-brand-accent" />
              <h3 className="text-text-primary font-semibold">Architectures Prédéfinies</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {presetArchitectures.map(preset => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setLayers(preset.layers);
                    setIsAnimating(false);
                  }}
                  className="px-3 py-2 bg-brand-mint/30 hover:bg-brand-mint/50 text-brand-slate rounded-lg transition text-sm font-medium border border-brand-mint/40"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </Card>

          <Card className="bg-brand-mint/10 border-l-4 border-brand-accent">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={18} className="text-brand-accent" />
              <h3 className="text-text-primary font-semibold">Vitesse: {speed}x</h3>
            </div>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.5"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-brand-accent"
            />
          </Card>

          <Card className="bg-brand-mint/10 border-l-4 border-brand-slate">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={18} className="text-brand-accent" />
              <h3 className="text-text-primary font-semibold">Thème</h3>
            </div>
            <select
              value={colorScheme}
              onChange={(e) => setColorScheme(e.target.value)}
              className="w-full bg-white border border-brand-grey rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-mint"
            >
              <option value="mint">Mint</option>
              <option value="accent">Accent</option>
              <option value="slate">Slate</option>
              <option value="warm">Warm</option>
            </select>
          </Card>
        </div>

        {/* Canvas */}
        <Card className="bg-white border-2 border-brand-mint/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-mint/5 via-brand-accent/5 to-brand-mint/5 animate-pulse" />
          <svg 
            ref={canvasRef}
            width={canvasWidth} 
            height={canvasHeight} 
            className="w-full h-auto relative z-10"
          >
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {renderLayerLabels()}
            {renderConnections()}
            {renderParticles()}
            {renderNeurons()}
          </svg>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Card className="bg-gradient-to-br from-brand-mint/30 to-brand-mint/10 border-l-4 border-brand-mint">
            <p className="text-brand-slate text-sm font-medium mb-1">Couches Totales</p>
            <p className="text-text-primary text-3xl font-bold">{layers.length}</p>
          </Card>
          <Card className="bg-gradient-to-br from-brand-accent/30 to-brand-accent/10 border-l-4 border-brand-accent">
            <p className="text-brand-slate text-sm font-medium mb-1">Neurones Totaux</p>
            <p className="text-text-primary text-3xl font-bold">{layers.reduce((a, b) => a + b, 0)}</p>
          </Card>
          <Card className="bg-gradient-to-br from-brand-slate/30 to-brand-slate/10 border-l-4 border-brand-slate">
            <p className="text-brand-slate text-sm font-medium mb-1">Connexions</p>
            <p className="text-text-primary text-3xl font-bold">
              {layers.slice(0, -1).reduce((sum, size, idx) => sum + size * layers[idx + 1], 0)}
            </p>
          </Card>
          <Card className="bg-gradient-to-br from-brand-mint/30 to-brand-accent/10 border-l-4 border-brand-accent">
            <p className="text-brand-slate text-sm font-medium mb-1">Particules Actives</p>
            <p className="text-text-primary text-3xl font-bold">{particles.length}</p>
          </Card>
        </div>

        {/* Options */}
        <div className="mt-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={showWeights}
              onChange={(e) => setShowWeights(e.target.checked)}
              className="w-5 h-5 accent-brand-accent"
            />
            <span className="text-sm font-medium">Afficher les poids des connexions</span>
          </label>
          
          <div className="flex-1 flex items-center gap-2 text-text-secondary text-sm">
            <Info size={16} />
            <span>Cliquez sur "Démarrer" pour voir l'activation se propager dans le réseau</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NeuralNetworkViz;

