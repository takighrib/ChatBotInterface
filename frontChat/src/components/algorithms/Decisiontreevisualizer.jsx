import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Plus, Binary } from 'lucide-react';

const DecisionTreeVisualizer = () => {
  const canvasRef = useRef(null);
  const treeCanvasRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [maxDepth, setMaxDepth] = useState(3);
  const [currentDepth, setCurrentDepth] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [tree, setTree] = useState(null);
  const [step, setStep] = useState('initial');
  const [addPointMode, setAddPointMode] = useState(false);
  const [selectedClass, setSelectedClass] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  const width = 700;
  const height = 500;
  const classes = ['Rouge', 'Bleu', 'Vert'];
  const colors = ['#ff3366', '#00f5ff', '#00ff88'];

  useEffect(() => {
    generateRandomPoints();
  }, []);

  const generateRandomPoints = () => {
    const newPoints = [];
    
    // Cluster 1 (Rouge) - En haut à gauche
    for (let i = 0; i < 15; i++) {
      newPoints.push({
        x: Math.random() * 200 + 50,
        y: Math.random() * 150 + 50,
        class: 0
      });
    }
    
    // Cluster 2 (Bleu) - En bas à droite
    for (let i = 0; i < 15; i++) {
      newPoints.push({
        x: Math.random() * 200 + 400,
        y: Math.random() * 150 + 300,
        class: 1
      });
    }
    
    // Cluster 3 (Vert) - Au milieu
    for (let i = 0; i < 15; i++) {
      newPoints.push({
        x: Math.random() * 200 + 250,
        y: Math.random() * 150 + 175,
        class: 2
      });
    }
    
    setPoints(newPoints);
    reset();
  };

  const reset = () => {
    setTree(null);
    setCurrentDepth(0);
    setIsRunning(false);
    setStep('initial');
    setAccuracy(0);
  };

  const calculateEntropy = (pointsSubset) => {
    if (pointsSubset.length === 0) return 0;
    
    const classCounts = [0, 0, 0];
    pointsSubset.forEach(p => classCounts[p.class]++);
    
    let entropy = 0;
    classCounts.forEach(count => {
      if (count > 0) {
        const prob = count / pointsSubset.length;
        entropy -= prob * Math.log2(prob);
      }
    });
    
    return entropy;
  };

  const findBestSplit = (pointsSubset) => {
    if (pointsSubset.length < 2) return null;
    
    let bestGain = -1;
    let bestSplit = null;
    const parentEntropy = calculateEntropy(pointsSubset);
    
    // Essayer des splits sur x
    for (let i = 100; i < 600; i += 50) {
      const left = pointsSubset.filter(p => p.x < i);
      const right = pointsSubset.filter(p => p.x >= i);
      
      if (left.length === 0 || right.length === 0) continue;
      
      const leftEntropy = calculateEntropy(left);
      const rightEntropy = calculateEntropy(right);
      const weightedEntropy = (left.length * leftEntropy + right.length * rightEntropy) / pointsSubset.length;
      const gain = parentEntropy - weightedEntropy;
      
      if (gain > bestGain) {
        bestGain = gain;
        bestSplit = { axis: 'x', value: i, gain };
      }
    }
    
    // Essayer des splits sur y
    for (let i = 100; i < 400; i += 50) {
      const left = pointsSubset.filter(p => p.y < i);
      const right = pointsSubset.filter(p => p.y >= i);
      
      if (left.length === 0 || right.length === 0) continue;
      
      const leftEntropy = calculateEntropy(left);
      const rightEntropy = calculateEntropy(right);
      const weightedEntropy = (left.length * leftEntropy + right.length * rightEntropy) / pointsSubset.length;
      const gain = parentEntropy - weightedEntropy;
      
      if (gain > bestGain) {
        bestGain = gain;
        bestSplit = { axis: 'y', value: i, gain };
      }
    }
    
    return bestSplit;
  };

  const getMajorityClass = (pointsSubset) => {
    const classCounts = [0, 0, 0];
    pointsSubset.forEach(p => classCounts[p.class]++);
    return classCounts.indexOf(Math.max(...classCounts));
  };

  const buildTreeStep = () => {
    if (points.length === 0) return;
    
    const buildNode = (pointsSubset, depth) => {
      if (depth >= maxDepth || pointsSubset.length < 2) {
        return {
          type: 'leaf',
          class: getMajorityClass(pointsSubset),
          points: pointsSubset.length,
          depth
        };
      }
      
      const split = findBestSplit(pointsSubset);
      
      if (!split || split.gain < 0.01) {
        return {
          type: 'leaf',
          class: getMajorityClass(pointsSubset),
          points: pointsSubset.length,
          depth
        };
      }
      
      const leftPoints = pointsSubset.filter(p => 
        split.axis === 'x' ? p.x < split.value : p.y < split.value
      );
      const rightPoints = pointsSubset.filter(p => 
        split.axis === 'x' ? p.x >= split.value : p.y >= split.value
      );
      
      return {
        type: 'split',
        split,
        left: buildNode(leftPoints, depth + 1),
        right: buildNode(rightPoints, depth + 1),
        points: pointsSubset.length,
        depth
      };
    };
    
    const newTree = buildNode(points, 0);
    setTree(newTree);
    setStep('built');
    
    // Calculer l'accuracy
    let correct = 0;
    points.forEach(point => {
      const predicted = predictClass(point, newTree);
      if (predicted === point.class) correct++;
    });
    setAccuracy((correct / points.length) * 100);
  };

  const predictClass = (point, node) => {
    if (!node || node.type === 'leaf') {
      return node ? node.class : 0;
    }
    
    const goLeft = node.split.axis === 'x' ? 
      point.x < node.split.value : 
      point.y < node.split.value;
    
    return goLeft ? 
      predictClass(point, node.left) : 
      predictClass(point, node.right);
  };

  const handleCanvasClick = (e) => {
    if (!addPointMode) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPoints([...points, { x, y, class: selectedClass }]);
  };

  useEffect(() => {
    if (isRunning && !tree) {
      const timer = setTimeout(() => {
        buildTreeStep();
        setIsRunning(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isRunning, tree, points]);

  // Dessiner les régions de décision et les points
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    // Dessiner les régions de décision si l'arbre existe
    if (tree) {
      const drawRegions = (node, x1, y1, x2, y2) => {
        if (node.type === 'leaf') {
          ctx.fillStyle = colors[node.class] + '20';
          ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
          return;
        }
        
        if (node.split.axis === 'x') {
          // Ligne verticale
          ctx.strokeStyle = colors[node.class] + '60';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(node.split.value, y1);
          ctx.lineTo(node.split.value, y2);
          ctx.stroke();
          ctx.setLineDash([]);
          
          drawRegions(node.left, x1, y1, node.split.value, y2);
          drawRegions(node.right, node.split.value, y1, x2, y2);
        } else {
          // Ligne horizontale
          ctx.strokeStyle = colors[node.class] + '60';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(x1, node.split.value);
          ctx.lineTo(x2, node.split.value);
          ctx.stroke();
          ctx.setLineDash([]);
          
          drawRegions(node.left, x1, y1, x2, node.split.value);
          drawRegions(node.right, x1, node.split.value, x2, y2);
        }
      };
      
      drawRegions(tree, 0, 0, width, height);
    }

    // Dessiner les points
    points.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 7, 0, 2 * Math.PI);
      ctx.fillStyle = colors[point.class];
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

  }, [points, tree]);

  // Dessiner l'arbre
  useEffect(() => {
    const canvas = treeCanvasRef.current;
    if (!canvas || !tree) return;
    
    const ctx = canvas.getContext('2d');
    const treeWidth = 700;
    const treeHeight = 400;
    ctx.clearRect(0, 0, treeWidth, treeHeight);

    const drawNode = (node, x, y, width, depth) => {
      const nodeRadius = 30;
      const verticalSpacing = 80;
      
      if (node.type === 'leaf') {
        // Feuille
        ctx.beginPath();
        ctx.rect(x - nodeRadius, y - nodeRadius/2, nodeRadius * 2, nodeRadius);
        ctx.fillStyle = colors[node.class] + '40';
        ctx.fill();
        ctx.strokeStyle = colors[node.class];
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 12px Space Mono';
        ctx.textAlign = 'center';
        ctx.fillText(classes[node.class], x, y);
        ctx.font = '10px Space Mono';
        ctx.fillText(`(${node.points})`, x, y + 12);
      } else {
        // Noeud de décision
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.fill();
        ctx.strokeStyle = '#00f5ff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.fillStyle = '#00f5ff';
        ctx.font = 'bold 11px Space Mono';
        ctx.textAlign = 'center';
        ctx.fillText(`${node.split.axis.toUpperCase()} < ${Math.round(node.split.value)}`, x, y - 2);
        ctx.font = '9px Space Mono';
        ctx.fillText(`gain: ${node.split.gain.toFixed(2)}`, x, y + 10);
        
        // Dessiner les branches
        const childWidth = width / 2;
        const leftX = x - width / 4;
        const rightX = x + width / 4;
        const childY = y + verticalSpacing;
        
        // Branche gauche
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - nodeRadius * 0.7, y + nodeRadius * 0.7);
        ctx.lineTo(leftX, childY - nodeRadius);
        ctx.stroke();
        
        ctx.fillStyle = '#00ff88';
        ctx.font = '10px Space Mono';
        ctx.fillText('OUI', x - width / 8, y + verticalSpacing / 2);
        
        // Branche droite
        ctx.beginPath();
        ctx.moveTo(x + nodeRadius * 0.7, y + nodeRadius * 0.7);
        ctx.lineTo(rightX, childY - nodeRadius);
        ctx.stroke();
        
        ctx.fillStyle = '#ff3366';
        ctx.fillText('NON', x + width / 8, y + verticalSpacing / 2);
        
        // Dessiner récursivement
        drawNode(node.left, leftX, childY, childWidth, depth + 1);
        drawNode(node.right, rightX, childY, childWidth, depth + 1);
      }
    };
    
    drawNode(tree, treeWidth / 2, 40, treeWidth * 0.8, 0);
  }, [tree]);

  const getStepExplanation = () => {
    if (step === 'initial') {
      return "Cliquez sur 'Build Tree' pour construire l'arbre de décision qui va séparer les classes.";
    }
    return `Arbre construit avec succès! Les lignes pointillées montrent les frontières de décision.`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      color: '#e2e8f0',
      fontFamily: "'Space Mono', 'Courier New', monospace",
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1500px', margin: '0 auto' }}>
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #00f5ff 0%, #00ff88 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem',
            letterSpacing: '-0.05em'
          }}>
            ARBRE DE DÉCISION
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: '#94a3b8',
            fontFamily: "'Inter', sans-serif"
          }}>
            Classification par partitionnement récursif
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', marginBottom: '2rem' }}>
          {/* Canvas principal */}
          <div>
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '1.5rem',
              border: '2px solid rgba(0, 245, 255, 0.2)',
              boxShadow: '0 0 40px rgba(0, 245, 255, 0.1)'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#00f5ff' }}>🎯 Espace de Classification</h3>
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

            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '1.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => {
                  buildTreeStep();
                }}
                disabled={isRunning || points.length === 0}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, #00f5ff, #00ff88)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: points.length === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: '700',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: points.length === 0 ? 0.5 : 1,
                  fontFamily: "'Space Mono', monospace"
                }}
              >
                <Binary size={20} /> BUILD TREE
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
                  fontFamily: "'Space Mono', monospace"
                }}
              >
                <RotateCcw size={20} /> RESET
              </button>
            </div>
          </div>

          {/* Panneau de contrôle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '1.5rem',
              border: '2px solid rgba(0, 255, 136, 0.2)'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: '#00ff88' }}>
                📊 MÉTRIQUES
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                    Accuracy
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#00ff88' }}>
                    {accuracy.toFixed(1)}%
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                    Profondeur Max
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#00f5ff' }}>
                    {maxDepth}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                    Points Totaux
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '700', color: '#ffaa00' }}>
                    {points.length}
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '1.5rem',
              border: '2px solid rgba(255, 0, 255, 0.2)'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: '#ff00ff' }}>
                ⚙️ PARAMÈTRES
              </h3>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  color: '#cbd5e1'
                }}>
                  Profondeur maximale : {maxDepth}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={maxDepth}
                  onChange={(e) => {
                    setMaxDepth(parseInt(e.target.value));
                    reset();
                  }}
                  style={{ width: '100%', accentColor: '#ff00ff' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  color: '#cbd5e1'
                }}>
                  Classe à ajouter
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {classes.map((className, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedClass(idx)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: selectedClass === idx ? colors[idx] : 'rgba(255,255,255,0.1)',
                        color: selectedClass === idx ? '#000' : colors[idx],
                        border: `2px solid ${colors[idx]}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontSize: '0.85rem'
                      }}
                    >
                      {className}
                    </button>
                  ))}
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
          </div>
        </div>

        {/* Visualisation de l'arbre */}
        {tree && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '1.5rem',
            border: '2px solid rgba(0, 245, 255, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#00f5ff' }}>🌳 Structure de l'Arbre</h3>
            <canvas
              ref={treeCanvasRef}
              width={700}
              height={400}
              style={{
                background: '#0a0f1e',
                borderRadius: '12px',
                width: '100%',
                border: '2px solid rgba(255,255,255,0.1)'
              }}
            />
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'rgba(0, 255, 136, 0.1)',
              borderRadius: '10px',
              fontSize: '0.9rem',
              color: '#cbd5e1'
            }}>
              <strong style={{ color: '#00ff88' }}>Légende:</strong> Les cercles représentent les nœuds de décision, 
              les rectangles les feuilles (classes finales). Le gain d'information indique la qualité du split.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionTreeVisualizer;