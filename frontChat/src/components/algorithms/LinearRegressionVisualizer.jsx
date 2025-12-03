import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Plus, TrendingUp } from 'lucide-react';

const LinearRegressionVisualizer = () => {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [weights, setWeights] = useState({ w: 1, b: 0 });
  const [learningRate, setLearningRate] = useState(0.01);
  const [iteration, setIteration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [loss, setLoss] = useState(0);
  const [lossHistory, setLossHistory] = useState([]);
  const [addPointMode, setAddPointMode] = useState(false);
  const [step, setStep] = useState('initial');

  const width = 700;
  const height = 500;
  const padding = 50;

  // Générer des points aléatoires au démarrage
  useEffect(() => {
    generateRandomPoints();
  }, []);

  const generateRandomPoints = () => {
    const newPoints = [];
    const trueW = 2;
    const trueB = 50;
    
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 300 + 50;
      const noise = (Math.random() - 0.5) * 100;
      const y = trueW * (x - 50) + trueB + noise;
      newPoints.push({ x, y: Math.min(Math.max(y, padding), height - padding) });
    }
    
    setPoints(newPoints);
    reset();
  };

  const reset = () => {
    setWeights({ w: Math.random() * 2 - 1, b: Math.random() * 200 });
    setIteration(0);
    setLossHistory([]);
    setIsRunning(false);
    setStep('initial');
  };

  const predict = (x, w, b) => {
    // Normaliser x par rapport à padding
    const normalizedX = x - padding;
    return w * normalizedX + b;
  };

  const calculateLoss = (currentWeights) => {
    let totalLoss = 0;
    points.forEach(point => {
      const predicted = predict(point.x, currentWeights.w, currentWeights.b);
      const error = predicted - point.y;
      totalLoss += error * error;
    });
    return totalLoss / points.length;
  };

  const gradientDescentStep = () => {
    if (points.length === 0) return;

    let dw = 0;
    let db = 0;

    // Calculer les gradients
    points.forEach(point => {
      const predicted = predict(point.x, weights.w, weights.b);
      const error = predicted - point.y;
      const normalizedX = point.x - padding;
      
      dw += 2 * error * normalizedX;
      db += 2 * error;
    });

    dw /= points.length;
    db /= points.length;

    // Mise à jour des poids
    const newWeights = {
      w: weights.w - learningRate * dw,
      b: weights.b - learningRate * db
    };

    setWeights(newWeights);
    
    const currentLoss = calculateLoss(newWeights);
    setLoss(currentLoss);
    setLossHistory(prev => [...prev.slice(-49), currentLoss]);
    setIteration(prev => prev + 1);
    setStep('gradient_descent');
  };

  const handleCanvasClick = (e) => {
    if (!addPointMode) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (x > padding && x < width - padding && y > padding && y < height - padding) {
      setPoints([...points, { x, y }]);
    }
  };

  useEffect(() => {
    if (isRunning && points.length > 0) {
      const timer = setTimeout(() => {
        gradientDescentStep();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isRunning, iteration, weights, points]);

  // Dessiner sur le canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    // Fond avec grille
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = padding; i < width - padding; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, padding);
      ctx.lineTo(i, height - padding);
      ctx.stroke();
    }
    for (let i = padding; i < height - padding; i += 50) {
      ctx.beginPath();
      ctx.moveTo(padding, i);
      ctx.lineTo(width - padding, i);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(width - padding - 10, height - padding - 5);
    ctx.moveTo(width - padding, height - padding);
    ctx.lineTo(width - padding - 10, height - padding + 5);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(padding, padding);
    ctx.lineTo(padding - 5, padding + 10);
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding + 5, padding + 10);
    ctx.stroke();

    // Dessiner la ligne de régression
    if (step !== 'initial') {
      ctx.strokeStyle = '#ff00ff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const y1 = predict(padding, weights.w, weights.b);
      const y2 = predict(width - padding, weights.w, weights.b);
      ctx.moveTo(padding, y1);
      ctx.lineTo(width - padding, y2);
      ctx.stroke();

      // Ligne de gradient (petite flèche montrant la direction d'optimisation)
      if (isRunning && lossHistory.length > 1) {
        const prevLoss = lossHistory[lossHistory.length - 2];
        const currentLoss = lossHistory[lossHistory.length - 1];
        if (currentLoss < prevLoss) {
          ctx.strokeStyle = '#00ff88';
          ctx.fillStyle = '#00ff88';
        } else {
          ctx.strokeStyle = '#ff3366';
          ctx.fillStyle = '#ff3366';
        }
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 2;
        
        // Flèche au milieu de la ligne
        const midX = width / 2;
        const midY = predict(midX, weights.w, weights.b);
        const arrowSize = 15;
        
        ctx.beginPath();
        ctx.moveTo(midX, midY);
        ctx.lineTo(midX - arrowSize, midY - arrowSize);
        ctx.moveTo(midX, midY);
        ctx.lineTo(midX + arrowSize, midY - arrowSize);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    // Dessiner les résidus (lignes verticales)
    if (step !== 'initial') {
      points.forEach(point => {
        const predicted = predict(point.x, weights.w, weights.b);
        ctx.strokeStyle = 'rgba(255, 0, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(point.x, predicted);
        ctx.stroke();
      });
    }

    // Dessiner les points
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#00f5ff';
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

  }, [points, weights, step, lossHistory, isRunning]);

  const getStepExplanation = () => {
    if (step === 'initial') {
      return "Cliquez sur 'Initialiser' ou 'Play' pour commencer l'entraînement du modèle de régression.";
    }
    return `Itération ${iteration}: Gradient Descent minimise la loss en ajustant w=${weights.w.toFixed(3)} et b=${weights.b.toFixed(2)}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      color: '#e2e8f0',
      fontFamily: "'Space Mono', 'Courier New', monospace",
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #ff00ff 0%, #ff0099 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem',
            letterSpacing: '-0.05em'
          }}>
            RÉGRESSION LINÉAIRE
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#94a3b8',
            fontFamily: "'Inter', sans-serif"
          }}>
            Visualisation du Gradient Descent
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
          {/* Canvas Area */}
          <div>
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '1.5rem',
              border: '2px solid rgba(255, 0, 255, 0.2)',
              boxShadow: '0 0 40px rgba(255, 0, 255, 0.1)'
            }}>
              <canvas
                ref={canvasRef}
                width={width}
                height={height}
                onClick={handleCanvasClick}
                style={{
                  background: '#0a0f1e',
                  borderRadius: '12px',
                  cursor: addPointMode ? 'crosshair' : 'default',
                  border: addPointMode ? '2px solid #00ff88' : '2px solid rgba(255,255,255,0.1)'
                }}
              />
              
              {/* Explication */}
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'rgba(255, 0, 255, 0.1)',
                borderRadius: '10px',
                borderLeft: '4px solid #ff00ff'
              }}>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {getStepExplanation()}
                </p>
              </div>

              {/* Loss Graph */}
              {lossHistory.length > 0 && (
                <div style={{
                  marginTop: '1rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px solid rgba(255, 0, 255, 0.2)'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#ff00ff', fontSize: '0.9rem' }}>
                    📉 Évolution de la Loss
                  </h4>
                  <div style={{ 
                    height: '80px', 
                    display: 'flex', 
                    alignItems: 'flex-end', 
                    gap: '2px',
                    paddingTop: '0.5rem'
                  }}>
                    {lossHistory.slice(-50).map((l, idx) => {
                      const maxLoss = Math.max(...lossHistory);
                      const heightPercent = (l / maxLoss) * 100;
                      return (
                        <div
                          key={idx}
                          style={{
                            flex: 1,
                            height: `${heightPercent}%`,
                            background: `linear-gradient(to top, #ff00ff, #ff0099)`,
                            borderRadius: '2px 2px 0 0',
                            minWidth: '3px'
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Contrôles principaux */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '1.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => {
                  if (step === 'initial') setStep('gradient_descent');
                  setIsRunning(!isRunning);
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: isRunning ? '#ff3366' : 'linear-gradient(135deg, #ff00ff, #ff0099)',
                  color: isRunning ? '#fff' : '#000',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s',
                  fontFamily: "'Space Mono', monospace"
                }}
              >
                {isRunning ? <><Pause size={20} /> PAUSE</> : <><Play size={20} /> PLAY</>}
              </button>

              <button
                onClick={gradientDescentStep}
                disabled={isRunning || points.length === 0}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#e2e8f0',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  cursor: points.length === 0 || isRunning ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: points.length === 0 || isRunning ? 0.5 : 1,
                  transition: 'all 0.3s',
                  fontFamily: "'Space Mono', monospace"
                }}
              >
                <SkipForward size={20} /> STEP
              </button>

              <button
                onClick={reset}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(255, 51, 102, 0.2)',
                  color: '#ff3366',
                  border: '2px solid #ff3366',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s',
                  fontFamily: "'Space Mono', monospace"
                }}
              >
                <RotateCcw size={20} /> RESET
              </button>
            </div>
          </div>

          {/* Panneau de contrôle */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {/* Métriques */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '1.5rem',
              border: '2px solid rgba(255, 0, 255, 0.2)'
            }}>
              <h3 style={{
                margin: '0 0 1rem 0',
                fontSize: '1.2rem',
                color: '#ff00ff'
              }}>
                📊 MÉTRIQUES
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                    Itération
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ff00ff' }}>
                    {iteration}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                    Loss (MSE)
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#00ff88' }}>
                    {loss.toFixed(2)}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                    Poids (w)
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#00f5ff' }}>
                    {weights.w.toFixed(4)}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                    Biais (b)
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#ffaa00' }}>
                    {weights.b.toFixed(2)}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                    Points
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#e2e8f0' }}>
                    {points.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Paramètres */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '1.5rem',
              border: '2px solid rgba(0, 255, 136, 0.2)'
            }}>
              <h3 style={{
                margin: '0 0 1rem 0',
                fontSize: '1.2rem',
                color: '#00ff88'
              }}>
                ⚙️ HYPERPARAMÈTRES
              </h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  color: '#cbd5e1'
                }}>
                  Learning Rate : {learningRate.toFixed(4)}
                </label>
                <input
                  type="range"
                  min="0.0001"
                  max="0.1"
                  step="0.0001"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    accentColor: '#00ff88'
                  }}
                />
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: '#64748b', 
                  marginTop: '0.25rem' 
                }}>
                  Contrôle la vitesse d'apprentissage
                </div>
              </div>

              <button
                onClick={() => setAddPointMode(!addPointMode)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: addPointMode ? '#00ff88' : 'rgba(0, 255, 136, 0.2)',
                  color: addPointMode ? '#000' : '#00ff88',
                  border: '2px solid #00ff88',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                  fontFamily: "'Space Mono', monospace"
                }}
              >
                <Plus size={20} /> {addPointMode ? 'MODE AJOUT ACTIVÉ' : 'AJOUTER DES POINTS'}
              </button>

              <button
                onClick={generateRandomPoints}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(255, 170, 0, 0.2)',
                  color: '#ffaa00',
                  border: '2px solid #ffaa00',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  fontFamily: "'Space Mono', monospace"
                }}
              >
                GÉNÉRER NOUVEAUX POINTS
              </button>
            </div>

            {/* Info */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '1.5rem',
              border: '2px solid rgba(255, 170, 0, 0.2)'
            }}>
              <h3 style={{
                margin: '0 0 1rem 0',
                fontSize: '1.2rem',
                color: '#ffaa00'
              }}>
                💡 FORMULE
              </h3>
              
              <div style={{
                fontSize: '0.85rem',
                lineHeight: '1.8',
                color: '#cbd5e1',
                fontFamily: "'Inter', sans-serif"
              }}>
                <p style={{ marginTop: 0 }}>
                  <strong style={{ color: '#ff00ff' }}>Prédiction:</strong><br/>
                  y = w × x + b
                </p>
                <p>
                  <strong style={{ color: '#00ff88' }}>Loss (MSE):</strong><br/>
                  L = Σ(y_pred - y_true)² / n
                </p>
                <p style={{ marginBottom: 0 }}>
                  <strong style={{ color: '#00f5ff' }}>Gradient:</strong><br/>
                  ∂L/∂w, ∂L/∂b
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinearRegressionVisualizer;