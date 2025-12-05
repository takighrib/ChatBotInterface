import React, { useState, useEffect } from 'react';
import { Layers, Zap, Grid3x3, Brain } from 'lucide-react';

const ImageInterpretationVisualizer = ({ isActive }) => {
  const [activeLayer, setActiveLayer] = useState(0);
  const [featureAnimations, setFeatureAnimations] = useState([]);

  const layers = [
    {
      name: 'Input Layer',
      description: 'Image brute (pixels)',
      icon: Grid3x3,
      color: 'from-blue-400 to-blue-600',
      features: ['Pixels RGB', 'Résolution', 'Dimensions']
    },
    {
      name: 'Convolution 1',
      description: 'Détection des contours',
      icon: Layers,
      color: 'from-purple-400 to-purple-600',
      features: ['Bords horizontaux', 'Bords verticaux', 'Diagonales']
    },
    {
      name: 'Convolution 2',
      description: 'Formes simples',
      icon: Zap,
      color: 'from-pink-400 to-pink-600',
      features: ['Cercles', 'Lignes', 'Coins']
    },
    {
      name: 'Convolution 3',
      description: 'Textures complexes',
      icon: Brain,
      color: 'from-orange-400 to-orange-600',
      features: ['Motifs', 'Textures', 'Patterns']
    },
    {
      name: 'Output Layer',
      description: 'Classification finale',
      icon: Brain,
      color: 'from-green-400 to-green-600',
      features: ['Probabilités', 'Classes', 'Prédiction']
    }
  ];

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setActiveLayer((prev) => (prev + 1) % layers.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, layers.length]);

  useEffect(() => {
    if (!isActive) return;

    const animInterval = setInterval(() => {
      const newFeature = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100,
      };
      setFeatureAnimations((prev) => [...prev, newFeature]);

      setTimeout(() => {
        setFeatureAnimations((prev) => prev.filter((f) => f.id !== newFeature.id));
      }, 2000);
    }, 400);

    return () => clearInterval(animInterval);
  }, [isActive]);

  return (
    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 overflow-hidden min-h-[400px]">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
      </div>

      {/* Title */}
      <div className="relative z-10 mb-6">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Layers className="w-6 h-6" />
          Comment l'IA voit l'image
        </h3>
        <p className="text-gray-300 text-sm">
          Visualisation du traitement par couches (CNN)
        </p>
      </div>

      {/* Layers Flow */}
      <div className="relative z-10 flex items-center justify-between mb-8 overflow-x-auto pb-4">
        {layers.map((layer, index) => {
          const Icon = layer.icon;
          const isActive = index === activeLayer;
          
          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center min-w-[100px]">
                <div
                  className={`
                    relative w-16 h-16 rounded-xl flex items-center justify-center
                    transition-all duration-500 transform
                    ${isActive ? 'scale-110 shadow-2xl' : 'scale-100 opacity-60'}
                    bg-gradient-to-br ${layer.color}
                  `}
                >
                  <Icon className="w-8 h-8 text-white" />
                  
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl animate-ping bg-white opacity-20"></div>
                  )}
                </div>
                
                <div className="mt-3 text-center">
                  <p className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-gray-400'} transition-colors`}>
                    {layer.name}
                  </p>
                  <p className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-500'} transition-colors mt-1`}>
                    {layer.description}
                  </p>
                </div>
              </div>
              
              {index < layers.length - 1 && (
                <div className="flex items-center mx-2">
                  <div className={`h-0.5 w-8 transition-all duration-500 ${
                    index < activeLayer ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gray-600'
                  }`}>
                    {index < activeLayer && (
                      <div className="h-full w-2 bg-white animate-pulse"></div>
                    )}
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Active Layer Details */}
      <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          Caractéristiques détectées
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {layers[activeLayer].features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/10 rounded px-3 py-2 text-xs text-white text-center transform transition-all duration-300 hover:scale-105 hover:bg-white/20"
              style={{
                animationDelay: `${idx * 100}ms`,
                animation: 'fadeInUp 0.5s ease-out forwards'
              }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Floating Feature Detectors */}
      {isActive && featureAnimations.map((feature) => (
        <div
          key={feature.id}
          className="absolute w-2 h-2 rounded-full bg-cyan-400 animate-ping"
          style={{
            left: `${feature.x}%`,
            top: `${feature.y}%`,
            animationDuration: '2s'
          }}
        ></div>
      ))}

      {/* Progress Bar */}
      <div className="relative z-10 mt-6">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${((activeLayer + 1) / layers.length) * 100}%` }}
          >
            <div className="h-full w-full bg-white/30 animate-pulse"></div>
          </div>
        </div>
        <p className="text-gray-400 text-xs mt-2 text-center">
          Traitement: {activeLayer + 1} / {layers.length} couches
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
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

export default ImageInterpretationVisualizer;
