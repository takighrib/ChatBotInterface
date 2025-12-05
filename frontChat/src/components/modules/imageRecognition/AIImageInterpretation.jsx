import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Image, Layers, Grid, Eye, Sparkles, Upload } from 'lucide-react';
import Card from '@components/common/Card';
import Button from '@components/common/Button';

const AIImageInterpretation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedImage, setSelectedImage] = useState('cat');
  const [pixels, setPixels] = useState([]);
  const [convFeatures, setConvFeatures] = useState([]);
  const [pooledFeatures, setPooledFeatures] = useState([]);
  const [attentionMap, setAttentionMap] = useState([]);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [classification, setClassification] = useState({});
  const canvasRef = useRef(null);

  const steps = [
    { id: 0, name: 'Image d\'Entrée', icon: Image, color: 'mint' },
    { id: 1, name: 'Matrice Pixels', icon: Grid, color: 'mint' },
    { id: 2, name: 'Filtres Conv', icon: Layers, color: 'accent' },
    { id: 3, name: 'Cartes Features', icon: Grid, color: 'accent' },
    { id: 4, name: 'Attention', icon: Eye, color: 'slate' },
    { id: 5, name: 'Reconnaissance', icon: Sparkles, color: 'slate' }
  ];

  const sampleImages = {
    cat: {
      name: 'Chat',
      colors: ['#F4A460', '#8B4513', '#FFE4B5', '#000000'],
      objects: [
        { name: 'Visage de Chat', confidence: 0.98, x: 35, y: 30, w: 30, h: 35 },
        { name: 'Yeux', confidence: 0.95, x: 40, y: 35, w: 20, h: 8 },
        { name: 'Moustaches', confidence: 0.89, x: 38, y: 50, w: 24, h: 5 }
      ],
      classification: { chat: 0.98, chien: 0.01, oiseau: 0.005, autre: 0.005 }
    },
    dog: {
      name: 'Chien',
      colors: ['#8B4513', '#D2691E', '#FFFFFF', '#000000'],
      objects: [
        { name: 'Visage de Chien', confidence: 0.96, x: 30, y: 25, w: 40, h: 45 },
        { name: 'Nez', confidence: 0.94, x: 45, y: 55, w: 10, h: 8 },
        { name: 'Oreilles', confidence: 0.92, x: 32, y: 28, w: 36, h: 15 }
      ],
      classification: { chien: 0.96, chat: 0.02, loup: 0.01, autre: 0.01 }
    },
    bird: {
      name: 'Oiseau',
      colors: ['#4169E1', '#FFD700', '#FF6347', '#FFFFFF'],
      objects: [
        { name: 'Corps d\'Oiseau', confidence: 0.94, x: 35, y: 35, w: 30, h: 30 },
        { name: 'Bec', confidence: 0.91, x: 55, y: 45, w: 12, h: 8 },
        { name: 'Ailes', confidence: 0.88, x: 32, y: 42, w: 36, h: 18 }
      ],
      classification: { oiseau: 0.94, perroquet: 0.03, aigle: 0.02, autre: 0.01 }
    }
  };

  useEffect(() => {
    processImage();
  }, [selectedImage]);

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
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  const processImage = () => {
    const img = sampleImages[selectedImage];
    
    // Step 1: Generate pixel matrix
    const pixelData = [];
    for (let i = 0; i < 16; i++) {
      const row = [];
      for (let j = 0; j < 16; j++) {
        const colorIdx = Math.floor((i + j) % img.colors.length);
        row.push({
          r: parseInt(img.colors[colorIdx].slice(1, 3), 16),
          g: parseInt(img.colors[colorIdx].slice(3, 5), 16),
          b: parseInt(img.colors[colorIdx].slice(5, 7), 16),
          intensity: Math.random()
        });
      }
      pixelData.push(row);
    }
    setPixels(pixelData);

    // Step 2: Simulate convolutional features
    const filters = ['contours', 'coins', 'textures', 'couleurs', 'formes', 'motifs'];
    const convData = filters.map(filter => ({
      name: filter,
      map: Array(12).fill(0).map(() => 
        Array(12).fill(0).map(() => Math.random())
      )
    }));
    setConvFeatures(convData);

    // Step 3: Pooled features
    const pooled = convData.map(conv => ({
      name: conv.name,
      map: Array(6).fill(0).map(() => 
        Array(6).fill(0).map(() => Math.random())
      )
    }));
    setPooledFeatures(pooled);

    // Step 4: Attention map
    const attention = Array(16).fill(0).map((_, i) => 
      Array(16).fill(0).map((_, j) => {
        const dx = j - 8;
        const dy = i - 8;
        const dist = Math.sqrt(dx*dx + dy*dy);
        return Math.exp(-dist / 4) * (0.5 + Math.random() * 0.5);
      })
    );
    setAttentionMap(attention);

    // Step 5: Object detection
    setDetectedObjects(img.objects);
    setClassification(img.classification);
  };

  const drawCanvas = (ctx, width, height) => {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, width, height);
    const img = sampleImages[selectedImage];
    
    // Draw simple representation
    ctx.fillStyle = img.colors[0];
    ctx.fillRect(width * 0.3, height * 0.25, width * 0.4, height * 0.5);
    
    // Add details
    img.colors.forEach((color, idx) => {
      ctx.fillStyle = color;
      const x = width * (0.2 + idx * 0.15);
      const y = height * (0.3 + Math.sin(idx) * 0.2);
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      drawCanvas(ctx, canvas.width, canvas.height);
    }
  }, [selectedImage]);

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

  const renderInputImage = () => {
    return (
      <Card className="bg-brand-mint/10 border-l-4 border-brand-mint">
        <h3 className="text-xl font-bold text-brand-slate mb-4 flex items-center gap-2">
          <Image size={24} />
          Étape 0 : Image d'Entrée
        </h3>
        <p className="text-text-secondary text-sm mb-4">Image originale fournie au réseau de neurones</p>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <canvas 
              ref={canvasRef}
              width={300}
              height={300}
              className="w-full bg-white rounded-lg border-2 border-brand-mint/30"
            />
          </div>
          <div className="flex-1 space-y-3">
            <div className="bg-white/50 rounded-lg p-4 border border-brand-grey/40">
              <div className="text-text-secondary text-sm mb-2 font-semibold">Propriétés de l'Image :</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Dimensions :</span>
                  <span className="text-text-primary font-semibold">224 × 224 px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Canaux :</span>
                  <span className="text-text-primary font-semibold">RGB (3)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Format :</span>
                  <span className="text-text-primary font-semibold">Tensor</span>
                </div>
              </div>
            </div>
            <div className="bg-white/50 rounded-lg p-4 border border-brand-grey/40">
              <div className="text-text-secondary text-sm mb-2 font-semibold">Palette de Couleurs :</div>
              <div className="flex gap-2 flex-wrap">
                {sampleImages[selectedImage].colors.map((color, idx) => (
                  <div
                    key={idx}
                    className="w-12 h-12 rounded-lg border-2 border-brand-grey/40 shadow-sm"
                    style={{ background: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderPixelMatrix = () => {
    if (currentStep < 1) return null;
    
    return (
      <Card className="bg-brand-mint/10 border-l-4 border-brand-mint">
        <h3 className="text-xl font-bold text-brand-slate mb-4 flex items-center gap-2">
          <Grid size={24} />
          Étape 1 : Matrice de Pixels (Valeurs RGB)
        </h3>
        <p className="text-text-secondary text-sm mb-4">Conversion de l'image en valeurs numériques de pixels</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-brand-accent mb-2 font-semibold">Représentation Visuelle</div>
            <div className="grid gap-0.5 border border-brand-grey/40 rounded-lg p-2 bg-white/50" style={{ gridTemplateColumns: `repeat(16, 1fr)` }}>
              {pixels.map((row, i) => 
                row.map((pixel, j) => (
                  <div
                    key={`${i}-${j}`}
                    className="aspect-square transition-all hover:scale-150 hover:z-10 cursor-pointer rounded-sm"
                    style={{
                      background: `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`
                    }}
                    title={`RGB(${pixel.r}, ${pixel.g}, ${pixel.b})`}
                  />
                ))
              )}
            </div>
          </div>
          <div>
            <div className="text-sm text-brand-accent mb-2 font-semibold">Exemples de Valeurs de Pixels</div>
            <div className="bg-white/50 rounded-lg p-4 space-y-2 font-mono text-xs border border-brand-grey/40">
              {pixels.slice(0, 4).map((row, i) => (
                <div key={i} className="text-text-secondary">
                  Ligne {i}: [
                  {row.slice(0, 3).map((p, j) => (
                    <span key={j} className="text-brand-accent">
                      ({p.r},{p.g},{p.b})
                      {j < 2 ? ', ' : ''}
                    </span>
                  ))}...]
                </div>
              ))}
            </div>
            <div className="mt-4 bg-white/50 rounded-lg p-4 border border-brand-grey/40">
              <div className="text-sm text-text-secondary mb-2">Total Pixels :</div>
              <div className="text-2xl font-bold text-text-primary">50,176</div>
              <div className="text-sm text-text-secondary mt-1">(Image 224×224)</div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderConvFilters = () => {
    if (currentStep < 2) return null;
    
    return (
      <Card className="bg-brand-accent/10 border-l-4 border-brand-accent">
        <h3 className="text-xl font-bold text-brand-slate mb-4 flex items-center gap-2">
          <Layers size={24} />
          Étape 2 : Filtres Convolutifs
        </h3>
        <p className="text-text-secondary text-sm mb-4">Détection des contours, textures et motifs</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {convFeatures.slice(0, 6).map((feature, idx) => (
            <div key={idx} className="bg-white/50 rounded-lg p-3 border border-brand-grey/40">
              <div className="text-sm text-brand-accent font-semibold mb-2 capitalize">{feature.name}</div>
              <div className="grid gap-0.5 border border-brand-grey/20 rounded p-1 bg-white/30" style={{ gridTemplateColumns: `repeat(12, 1fr)` }}>
                {feature.map.map((row, i) => 
                  row.map((val, j) => (
                    <div
                      key={`${i}-${j}`}
                      className="aspect-square rounded-sm"
                      style={{
                        background: `rgba(217, 130, 43, ${val * 0.8})`,
                        boxShadow: val > 0.8 ? '0 0 4px rgba(217, 130, 43, 0.8)' : 'none'
                      }}
                    />
                  ))
                )}
              </div>
              <div className="mt-2 text-xs text-text-secondary">
                Activation : {(feature.map.flat().reduce((a, b) => a + b, 0) / (12 * 12)).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const renderFeatureMaps = () => {
    if (currentStep < 3) return null;
    
    return (
      <Card className="bg-brand-accent/10 border-l-4 border-brand-accent">
        <h3 className="text-xl font-bold text-brand-slate mb-4 flex items-center gap-2">
          <Grid size={24} />
          Étape 3 : Cartes de Features Poolées
        </h3>
        <p className="text-text-secondary text-sm mb-4">Réduction d'échelle et extraction des caractéristiques clés</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {pooledFeatures.slice(0, 6).map((feature, idx) => (
            <div key={idx} className="bg-white/50 rounded-lg p-3 border border-brand-grey/40">
              <div className="text-sm text-brand-accent font-semibold mb-2 capitalize">{feature.name}</div>
              <div className="relative">
                <div className="grid gap-1 border border-brand-grey/20 rounded p-1 bg-white/30" style={{ gridTemplateColumns: `repeat(6, 1fr)` }}>
                  {feature.map.map((row, i) => 
                    row.map((val, j) => (
                      <div
                        key={`${i}-${j}`}
                        className="aspect-square rounded transition-all hover:scale-110"
                        style={{
                          background: `rgba(217, 130, 43, ${val * 0.8})`,
                          boxShadow: val > 0.7 ? `0 0 8px rgba(217, 130, 43, ${val})` : 'none'
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
              <div className="mt-2 flex justify-between text-xs">
                <span className="text-text-secondary">6×6 poolé</span>
                <span className="text-brand-accent">
                  {(feature.map.flat().filter(v => v > 0.5).length / 36 * 100).toFixed(0)}% actif
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const renderAttention = () => {
    if (currentStep < 4) return null;
    
    return (
      <Card className="bg-brand-slate/10 border-l-4 border-brand-slate">
        <h3 className="text-xl font-bold text-brand-slate mb-4 flex items-center gap-2">
          <Eye size={24} />
          Étape 4 : Carte d'Attention Visuelle
        </h3>
        <p className="text-text-secondary text-sm mb-4">Où l'IA "regarde" dans l'image</p>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="relative">
              <canvas 
                ref={canvasRef}
                width={300}
                height={300}
                className="w-full bg-white rounded-lg border border-brand-grey/40"
              />
              <div className="absolute inset-0 grid gap-0 rounded-lg" style={{ gridTemplateColumns: `repeat(16, 1fr)`, pointerEvents: 'none' }}>
                {attentionMap.map((row, i) => 
                  row.map((val, j) => (
                    <div
                      key={`${i}-${j}`}
                      className="aspect-square"
                      style={{
                        background: `rgba(47, 79, 79, ${val * 0.6})`,
                        backdropFilter: 'blur(2px)'
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="bg-white/50 rounded-lg p-4 space-y-3 border border-brand-grey/40">
              <div>
                <div className="text-sm text-text-secondary mb-2 font-semibold">Points d'Attention :</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-brand-slate animate-pulse" />
                    <span className="text-sm text-text-primary">Région Centrale (Élevée)</span>
                    <span className="ml-auto text-brand-accent text-sm font-semibold">87%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-brand-mint" />
                    <span className="text-sm text-text-primary">Zone Supérieure (Moyenne)</span>
                    <span className="ml-auto text-brand-accent text-sm font-semibold">65%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-brand-grey" />
                    <span className="text-sm text-text-primary">Bords (Faible)</span>
                    <span className="ml-auto text-brand-accent text-sm font-semibold">32%</span>
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-brand-grey/40">
                <div className="text-sm text-text-secondary mb-2 font-semibold">Stratégie de Focus :</div>
                <div className="text-sm text-text-primary">
                  Le modèle se concentre sur les régions centrales où se trouvent généralement les caractéristiques importantes.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderRecognition = () => {
    if (currentStep < 5) return null;
    
    return (
      <Card className="bg-brand-slate/10 border-l-4 border-brand-slate">
        <h3 className="text-xl font-bold text-brand-slate mb-4 flex items-center gap-2">
          <Sparkles size={24} />
          Étape 5 : Reconnaissance et Classification d'Objets
        </h3>
        <p className="text-text-secondary text-sm mb-4">Compréhension finale du contenu de l'image</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Object Detection */}
          <div className="bg-white/50 rounded-lg p-4 border border-brand-grey/40">
            <h4 className="text-lg font-semibold text-brand-slate mb-3">Objets Détectés</h4>
            <div className="space-y-3">
              {detectedObjects.map((obj, idx) => (
                <div key={idx} className="bg-brand-mint/20 rounded-lg p-3 border border-brand-mint/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-primary font-semibold">{obj.name}</span>
                    <span className="text-brand-accent text-sm font-semibold">{(obj.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-brand-grey/40 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-brand-accent to-brand-slate h-2 rounded-full transition-all"
                      style={{ width: `${obj.confidence * 100}%` }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-text-secondary">
                    Position : ({obj.x}, {obj.y}) | Taille : {obj.w}×{obj.h}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Classification */}
          <div className="bg-white/50 rounded-lg p-4 border border-brand-grey/40">
            <h4 className="text-lg font-semibold text-brand-slate mb-3">Résultats de Classification</h4>
            <div className="space-y-3">
              {Object.entries(classification).map(([label, prob], idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-text-primary capitalize font-semibold">{label}</span>
                    <span className="text-brand-accent text-sm font-semibold">{(prob * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-brand-grey/40 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-3 rounded-full transition-all"
                      style={{ 
                        width: `${prob * 100}%`,
                        background: idx === 0 
                          ? 'linear-gradient(to right, #BBD5D0, #D9822B)' 
                          : 'rgba(187, 213, 208, 0.5)'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-brand-grey/40">
              <div className="bg-gradient-to-r from-brand-mint/30 to-brand-accent/20 rounded-lg p-3 border border-brand-mint/40">
                <div className="text-sm text-brand-slate font-semibold mb-1">Prédiction Finale :</div>
                <div className="text-xl text-text-primary font-bold">
                  {Object.entries(classification).sort((a, b) => b[1] - a[1])[0][0].toUpperCase()}
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  Confiance : {(Object.entries(classification).sort((a, b) => b[1] - a[1])[0][1] * 100).toFixed(1)}%
                </div>
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
              <Eye size={36} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-text-primary">
                Compréhension d'Image par l'IA
              </h2>
              <p className="text-text-secondary mt-1">Comment la vision par ordinateur traite et interprète les images</p>
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
              onClick={() => {
                setCurrentStep(0);
                setIsPlaying(false);
              }}
              icon={<RotateCcw size={20} />}
            >
              Réinitialiser
            </Button>
          </div>
        </div>

        {/* Image Selector */}
        <div className="mb-6">
          <label className="block text-text-primary font-semibold mb-3">Sélectionner une Image Exemple :</label>
          <div className="flex flex-wrap gap-3">
            {Object.keys(sampleImages).map(key => (
              <button
                key={key}
                onClick={() => {
                  setSelectedImage(key);
                  setCurrentStep(0);
                  setIsPlaying(false);
                }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 capitalize ${
                  selectedImage === key
                    ? 'bg-gradient-to-r from-brand-mint to-brand-accent text-white shadow-lg'
                    : 'bg-white border border-brand-grey/40 text-text-primary hover:bg-brand-mint/20'
                }`}
              >
                {sampleImages[key].name}
              </button>
            ))}
          </div>
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
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-xl transition-all transform hover:scale-110 flex items-center justify-center relative ${getStepColorClasses(step.color, isCurrent, isActive)}`}
                  >
                    <StepIcon 
                      size={24} 
                      className={isActive ? 'text-white' : 'text-text-secondary'} 
                    />
                    {isCurrent && (
                      <div className="absolute inset-0 rounded-xl border-2 border-white animate-ping opacity-75" />
                    )}
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
          {renderInputImage()}
          {renderPixelMatrix()}
          {renderConvFilters()}
          {renderFeatureMaps()}
          {renderAttention()}
          {renderRecognition()}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Card className="bg-brand-mint/20 border-l-4 border-brand-mint">
            <div className="flex items-center gap-2 mb-2">
              <Grid className="text-brand-accent" size={20} />
              <span className="text-brand-slate text-sm font-semibold">Taille Entrée</span>
            </div>
            <div className="text-2xl font-bold text-text-primary">224×224</div>
            <div className="text-xs text-text-secondary mt-1">150,528 valeurs</div>
          </Card>
          
          <Card className="bg-brand-accent/20 border-l-4 border-brand-accent">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="text-brand-accent" size={20} />
              <span className="text-brand-slate text-sm font-semibold">Filtres Conv</span>
            </div>
            <div className="text-2xl font-bold text-text-primary">{convFeatures.length}</div>
            <div className="text-xs text-text-secondary mt-1">Détecteurs de features</div>
          </Card>
          
          <Card className="bg-brand-slate/20 border-l-4 border-brand-slate">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="text-brand-accent" size={20} />
              <span className="text-brand-slate text-sm font-semibold">Attention</span>
            </div>
            <div className="text-2xl font-bold text-text-primary">
              {attentionMap.length > 0 ? (attentionMap.flat().reduce((a, b) => a + b, 0) / (16 * 16) * 100).toFixed(0) : 0}%
            </div>
            <div className="text-xs text-text-secondary mt-1">Focus moyen</div>
          </Card>
          
          <Card className="bg-brand-mint/20 border-l-4 border-brand-accent">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-brand-accent" size={20} />
              <span className="text-brand-slate text-sm font-semibold">Objets Trouvés</span>
            </div>
            <div className="text-2xl font-bold text-text-primary">{detectedObjects.length}</div>
            <div className="text-xs text-text-secondary mt-1">Éléments détectés</div>
          </Card>
        </div>
      </Card>
    </div>
  );
};

export default AIImageInterpretation;

