import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Plus } from 'lucide-react';

const KMeansVisualizer = () => {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [centroids, setCentroids] = useState([]);
  const [k, setK] = useState(3);
  const [iteration, setIteration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [step, setStep] = useState('initial');
  const [assignments, setAssignments] = useState([]);
  const [history, setHistory] = useState([]);
  const [inertia, setInertia] = useState(0);
  const [addPointMode, setAddPointMode] = useState(false);

  const colors = ['#00f5ff', '#ff00ff', '#00ff88', '#ffaa00', '#ff3366', '#7700ff'];
  const width = 700;
  const height = 500;

  // Générer des points aléatoires au démarrage
  useEffect(() => {
    generateRandomPoints();
  }, []);

  const generateRandomPoints = () => {
    const newPoints = [];
    const numClusters = 3;
    for (let i = 0; i < numClusters; i++) {
      const centerX = Math.random() * (width - 100) + 50;
      const centerY = Math.random() * (height - 100) + 50;
      for (let j = 0; j < 20; j++) {
        newPoints.push({
          x: centerX + (Math.random() - 0.5) * 100,
          y: centerY + (Math.random() - 0.5) * 100
        });
      }
    }
    setPoints(newPoints);
    reset();
  };

  const reset = () => {
    setIteration(0);
    setCentroids([]);
    setAssignments([]);
    setHistory([]);
    setStep('initial');
    setIsRunning(false);
    setInertia(0);
  };

  const initializeCentroids = () => {
    const newCentroids = [];
    for (let i = 0; i < k; i++) {
      const randomPoint = points[Math.floor(Math.random() * points.length)];
      newCentroids.push({ ...randomPoint });
    }
    setCentroids(newCentroids);
    setStep('assign');
    return newCentroids;
  };

  const distance = (p1, p2) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };

  const assignPointsToCentroids = (currentCentroids) => {
    const newAssignments = points.map(point => {
      let minDist = Infinity;
      let cluster = 0;
      currentCentroids.forEach((centroid, idx) => {
        const dist = distance(point, centroid);
        if (dist < minDist) {
          minDist = dist;
          cluster = idx;
        }
      });
      return cluster;
    });
    setAssignments(newAssignments);
    
    // Calculer l'inertie
    const totalInertia = points.reduce((sum, point, idx) => {
      return sum + Math.pow(distance(point, currentCentroids[newAssignments[idx]]), 2);
    }, 0);
    setInertia(totalInertia);
    
    setStep('update');
    return newAssignments;
  };

  const updateCentroids = (currentAssignments) => {
    const newCentroids = centroids.map((_, clusterIdx) => {
      const clusterPoints = points.filter((_, idx) => currentAssignments[idx] === clusterIdx);
      if (clusterPoints.length === 0) return centroids[clusterIdx];
      
      const sumX = clusterPoints.reduce((sum, p) => sum + p.x, 0);
      const sumY = clusterPoints.reduce((sum, p) => sum + p.y, 0);
      return {
        x: sumX / clusterPoints.length,
        y: sumY / clusterPoints.length
      };
    });
    
    setCentroids(newCentroids);
    setHistory([...history, { centroids: newCentroids, assignments: currentAssignments, inertia }]);
    setStep('assign');
    return newCentroids;
  };

  const stepForward = () => {
    if (step === 'initial') {
      const newCentroids = initializeCentroids();
      setIteration(1);
    } else if (step === 'assign') {
      assignPointsToCentroids(centroids);
    } else if (step === 'update') {
      const newCentroids = updateCentroids(assignments);
      setIteration(iteration + 1);
    }
  };

  const handleCanvasClick = (e) => {
    if (!addPointMode) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPoints([...points, { x, y }]);
    reset();
  };

  useEffect(() => {
    if (isRunning) {
      const timer = setTimeout(() => {
        stepForward();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isRunning, step, iteration]);

  // Dessiner sur le canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);
    
    // Dessiner les connexions entre points et centroïdes
    if (step !== 'initial' && assignments.length > 0) {
      points.forEach((point, idx) => {
        const centroid = centroids[assignments[idx]];
        if (centroid) {
          ctx.beginPath();
          ctx.strokeStyle = colors[assignments[idx]] + '20';
          ctx.lineWidth = 1;
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(centroid.x, centroid.y);
          ctx.stroke();
        }
      });
    }
    
    // Dessiner les points
    points.forEach((point, idx) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, 2 * Math.PI);
      if (step !== 'initial' && assignments.length > 0) {
        ctx.fillStyle = colors[assignments[idx]];
      } else {
        ctx.fillStyle = '#6b7280';
      }
      ctx.fill();
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    
    // Dessiner les centroïdes
    centroids.forEach((centroid, idx) => {
      // Halo extérieur
      ctx.beginPath();
      ctx.arc(centroid.x, centroid.y, 20, 0, 2 * Math.PI);
      const gradient = ctx.createRadialGradient(centroid.x, centroid.y, 0, centroid.x, centroid.y, 20);
      gradient.addColorStop(0, colors[idx] + '40');
      gradient.addColorStop(1, colors[idx] + '00');
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Centroïde principal
      ctx.beginPath();
      ctx.arc(centroid.x, centroid.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = colors[idx];
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Croix au centre
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centroid.x - 5, centroid.y);
      ctx.lineTo(centroid.x + 5, centroid.y);
      ctx.moveTo(centroid.x, centroid.y - 5);
      ctx.lineTo(centroid.x, centroid.y + 5);
      ctx.stroke();
    });
  }, [points, centroids, assignments, step]);

  const getStepExplanation = () => {
    switch(step) {
      case 'initial':
        return "Cliquez sur 'Initialiser' pour placer les centroïdes initiaux de façon aléatoire.";
      case 'assign':
        return `Itération ${iteration}: Assignation de chaque point au centroïde le plus proche (calcul de distance euclidienne).`;
      case 'update':
        return `Itération ${iteration}: Mise à jour des centroïdes en calculant la moyenne des points assignés à chaque cluster.`;
      default:
        return "";
    }
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
            background: 'linear-gradient(135deg, #00f5ff 0%, #ff00ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem',
            letterSpacing: '-0.05em'
          }}>
            K-MEANS
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#94a3b8',
            fontFamily: "'Inter', sans-serif"
          }}>
            Visualisation interactive de l'algorithme de clustering
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
              border: '2px solid rgba(0, 245, 255, 0.2)',
              boxShadow: '0 0 40px rgba(0, 245, 255, 0.1)'
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
              
              {/* Explication de l'étape courante */}
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'rgba(0, 245, 255, 0.1)',
                borderRadius: '10px',
                borderLeft: '4px solid #00f5ff'
              }}>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {getStepExplanation()}
                </p>
              </div>
            </div>

            {/* Contrôles principaux */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '1.5rem',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => {
                  if (step === 'initial') {
                    stepForward();
                  }
                  setIsRunning(!isRunning);
                }}
                disabled={step === 'initial' && centroids.length === 0}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: isRunning ? '#ff3366' : 'linear-gradient(135deg, #00f5ff, #0099ff)',
                  color: '#000',
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
                onClick={stepForward}
                disabled={isRunning}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#e2e8f0',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
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
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#00f5ff' }}>
                    {iteration}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                    Inertie (somme des distances²)
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#00ff88' }}>
                    {inertia.toFixed(2)}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                    Points totaux
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffaa00' }}>
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
                ⚙️ PARAMÈTRES
              </h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  color: '#cbd5e1'
                }}>
                  Nombre de clusters (k) : {k}
                </label>
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={k}
                  onChange={(e) => {
                    setK(parseInt(e.target.value));
                    reset();
                  }}
                  style={{
                    width: '100%',
                    accentColor: '#00ff88'
                  }}
                />
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

            {/* Info pédagogique */}
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
                💡 COMMENT ÇA MARCHE ?
              </h3>
              
              <div style={{
                fontSize: '0.85rem',
                lineHeight: '1.6',
                color: '#cbd5e1'
              }}>
                <p style={{ marginTop: 0 }}>
                  <strong style={{ color: '#00f5ff' }}>1. Initialisation :</strong> Placer k centroïdes aléatoirement
                </p>
                <p>
                  <strong style={{ color: '#ff00ff' }}>2. Assignment :</strong> Assigner chaque point au centroïde le plus proche
                </p>
                <p style={{ marginBottom: 0 }}>
                  <strong style={{ color: '#00ff88' }}>3. Update :</strong> Recalculer la position des centroïdes (moyenne des points)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KMeansVisualizer;