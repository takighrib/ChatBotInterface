import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@context/AppContext';
import { useUserProgress } from '@context/UserProgressContext';
import { ArrowLeft, BookOpen, HelpCircle, Award } from 'lucide-react';
import { ROUTES } from '@constants/routes';
import LinearRegressionVisualizer from '@components/algorithms/LinearRegressionVisualizer';

const LinearRegressionPage = () => {
  const navigate = useNavigate();
  const { showSuccess } = useApp();
  const { markAlgorithmCompleted, updateQuizScore, incrementExperiments } = useUserProgress();
  
  const [showTheory, setShowTheory] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    incrementExperiments();
  }, []);

  const quizQuestions = [
    {
      id: 1,
      question: "Quelle est l'équation de la régression linéaire simple ?",
      options: [
        "y = w × x + b",
        "y = x² + c",
        "y = log(x) + b",
        "y = e^x + c"
      ],
      correct: 0
    },
    {
      id: 2,
      question: "Que représente le learning rate dans le gradient descent ?",
      options: [
        "La vitesse à laquelle les poids sont mis à jour",
        "Le nombre d'itérations nécessaires",
        "La précision du modèle",
        "Le nombre de paramètres"
      ],
      correct: 0
    },
    {
      id: 3,
      question: "Quelle fonction de coût utilise-t-on généralement pour la régression linéaire ?",
      options: [
        "Cross-Entropy",
        "Mean Squared Error (MSE)",
        "Hinge Loss",
        "Log Loss"
      ],
      correct: 1
    },
    {
      id: 4,
      question: "Que se passe-t-il si le learning rate est trop élevé ?",
      options: [
        "La convergence est plus rapide et stable",
        "L'algorithme peut diverger ou osciller",
        "La précision augmente automatiquement",
        "Rien de particulier"
      ],
      correct: 1
    },
    {
      id: 5,
      question: "Quel est le but du gradient descent ?",
      options: [
        "Augmenter la loss function",
        "Minimiser la loss function en ajustant les poids",
        "Maximiser le nombre d'itérations",
        "Augmenter le learning rate"
      ],
      correct: 1
    }
  ];

  const handleQuizSubmit = () => {
    const correctAnswers = quizQuestions.filter(
      q => quizAnswers[q.id] === q.correct
    ).length;
    const score = Math.round((correctAnswers / quizQuestions.length) * 100);
    
    setQuizSubmitted(true);
    updateQuizScore('linear-regression', score);
    
    if (score >= 80) {
      markAlgorithmCompleted('linear-regression');
      showSuccess(`Félicitations ! Score: ${score}%. Régression Linéaire complétée !`);
    } else {
      showSuccess(`Score: ${score}%. Continuez à pratiquer !`);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      color: '#e2e8f0'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        borderBottom: '2px solid rgba(255, 0, 255, 0.2)',
        padding: '1.5rem 2rem'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate(ROUTES.ALGORITHMS)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#cbd5e1',
              padding: '0.75rem',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '800',
            margin: 0,
            background: 'linear-gradient(135deg, #ff00ff, #ff0099)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: "'Space Mono', monospace"
          }}>
            Régression Linéaire
          </h1>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setShowTheory(!showTheory)}
              style={{
                padding: '0.75rem 1.25rem',
                background: showTheory ? 'rgba(255, 0, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                border: showTheory ? '2px solid #ff00ff' : '2px solid rgba(255, 255, 255, 0.1)',
                color: showTheory ? '#ff00ff' : '#cbd5e1',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}
            >
              <BookOpen size={18} />
              Théorie
            </button>

            <button
              onClick={() => setShowQuiz(!showQuiz)}
              style={{
                padding: '0.75rem 1.25rem',
                background: showQuiz ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                border: showQuiz ? '2px solid #00ff88' : '2px solid rgba(255, 255, 255, 0.1)',
                color: showQuiz ? '#00ff88' : '#cbd5e1',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}
            >
              <HelpCircle size={18} />
              Quiz
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          {/* Theory Section */}
          {showTheory && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '2rem',
              border: '2px solid rgba(255, 0, 255, 0.2)',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: '#ff00ff',
                marginBottom: '1.5rem',
                fontFamily: "'Space Mono', monospace"
              }}>
                📚 Comprendre la Régression Linéaire
              </h2>

              <div style={{
                display: 'grid',
                gap: '1.5rem',
                color: '#cbd5e1',
                fontSize: '1rem',
                lineHeight: '1.8'
              }}>
                <div>
                  <h3 style={{ color: '#e2e8f0', marginBottom: '0.75rem' }}>
                    Qu'est-ce que la Régression Linéaire ?
                  </h3>
                  <p>
                    La régression linéaire est un algorithme d'<strong style={{ color: '#ff00ff' }}>apprentissage supervisé</strong> qui 
                    modélise la relation entre une variable dépendante (y) et une ou plusieurs variables indépendantes (x) 
                    par une <strong style={{ color: '#ff00ff' }}>équation linéaire</strong>. L'objectif est de trouver la droite 
                    qui s'ajuste le mieux aux données.
                  </p>
                </div>

                <div>
                  <h3 style={{ color: '#e2e8f0', marginBottom: '0.75rem' }}>
                    Équation du modèle
                  </h3>
                  <div style={{
                    background: 'rgba(255, 0, 255, 0.1)',
                    padding: '1rem',
                    borderRadius: '10px',
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '1.2rem',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 0, 255, 0.3)'
                  }}>
                    y = w × x + b
                  </div>
                  <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
                    <li><strong style={{ color: '#00ff88' }}>w (poids)</strong> : pente de la droite</li>
                    <li><strong style={{ color: '#00ff88' }}>b (biais)</strong> : ordonnée à l'origine</li>
                    <li><strong style={{ color: '#00ff88' }}>x</strong> : variable d'entrée</li>
                    <li><strong style={{ color: '#00ff88' }}>y</strong> : prédiction</li>
                  </ul>
                </div>

                <div>
                  <h3 style={{ color: '#e2e8f0', marginBottom: '0.75rem' }}>
                    Gradient Descent : Comment ça marche ?
                  </h3>
                  <ol style={{ paddingLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#00f5ff' }}>Initialisation :</strong> Commencer avec des poids aléatoires (w, b)
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#00f5ff' }}>Calcul de la Loss :</strong> Mesurer l'erreur avec MSE = Σ(y_pred - y_true)² / n
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#00f5ff' }}>Calcul des Gradients :</strong> Dérivées partielles ∂L/∂w et ∂L/∂b
                    </li>
                    <li>
                      <strong style={{ color: '#00f5ff' }}>Mise à jour :</strong> w = w - α × ∂L/∂w (α = learning rate)
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 style={{ color: '#e2e8f0', marginBottom: '0.75rem' }}>
                    Applications pratiques
                  </h3>
                  <ul style={{ paddingLeft: '1.5rem' }}>
                    <li>Prédiction de prix (immobilier, actions)</li>
                    <li>Analyse des ventes et tendances</li>
                    <li>Prévisions météorologiques</li>
                    <li>Estimation de coûts</li>
                    <li>Modélisation de relations scientifiques</li>
                  </ul>
                </div>

                <div>
                  <h3 style={{ color: '#e2e8f0', marginBottom: '0.75rem' }}>
                    Avantages et Limitations
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{
                      background: 'rgba(0, 255, 136, 0.1)',
                      padding: '1rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(0, 255, 136, 0.3)'
                    }}>
                      <h4 style={{ color: '#00ff88', marginBottom: '0.5rem' }}>✅ Avantages</h4>
                      <ul style={{ paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                        <li>Simple et interprétable</li>
                        <li>Rapide à entraîner</li>
                        <li>Peu de paramètres</li>
                        <li>Efficace sur données linéaires</li>
                      </ul>
                    </div>
                    <div style={{
                      background: 'rgba(255, 51, 102, 0.1)',
                      padding: '1rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 51, 102, 0.3)'
                    }}>
                      <h4 style={{ color: '#ff3366', marginBottom: '0.5rem' }}>⚠️ Limitations</h4>
                      <ul style={{ paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                        <li>Suppose une relation linéaire</li>
                        <li>Sensible aux outliers</li>
                        <li>Ne capture pas la complexité</li>
                        <li>Peut sous-ajuster (underfitting)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Section */}
          {showQuiz && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '2rem',
              border: '2px solid rgba(0, 255, 136, 0.2)',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: '#00ff88',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontFamily: "'Space Mono', monospace"
              }}>
                <Award size={32} />
                Testez vos connaissances
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {quizQuestions.map((q, idx) => (
                  <div key={q.id} style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '1.5rem',
                    borderRadius: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <h3 style={{
                      color: '#e2e8f0',
                      marginBottom: '1rem',
                      fontSize: '1.1rem'
                    }}>
                      {idx + 1}. {q.question}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {q.options.map((option, optIdx) => {
                        const isSelected = quizAnswers[q.id] === optIdx;
                        const isCorrect = optIdx === q.correct;
                        const showResult = quizSubmitted;

                        return (
                          <button
                            key={optIdx}
                            onClick={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })}
                            disabled={quizSubmitted}
                            style={{
                              padding: '1rem',
                              background: showResult 
                                ? (isCorrect ? 'rgba(0, 255, 136, 0.2)' : isSelected ? 'rgba(255, 51, 102, 0.2)' : 'rgba(255, 255, 255, 0.05)')
                                : isSelected ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                              border: showResult
                                ? (isCorrect ? '2px solid #00ff88' : isSelected ? '2px solid #ff3366' : '2px solid rgba(255, 255, 255, 0.1)')
                                : isSelected ? '2px solid #00ff88' : '2px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '10px',
                              color: showResult 
                                ? (isCorrect ? '#00ff88' : isSelected ? '#ff3366' : '#cbd5e1')
                                : isSelected ? '#00ff88' : '#cbd5e1',
                              cursor: quizSubmitted ? 'not-allowed' : 'pointer',
                              textAlign: 'left',
                              transition: 'all 0.3s',
                              fontWeight: isSelected || isCorrect ? '600' : '400'
                            }}
                          >
                            {option}
                            {showResult && isCorrect && ' ✓'}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                  style={{
                    marginTop: '2rem',
                    padding: '1rem 2rem',
                    background: Object.keys(quizAnswers).length < quizQuestions.length
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'linear-gradient(135deg, #00ff88, #00cc66)',
                    color: Object.keys(quizAnswers).length < quizQuestions.length ? '#64748b' : '#000',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    cursor: Object.keys(quizAnswers).length < quizQuestions.length ? 'not-allowed' : 'pointer',
                    width: '100%',
                    fontFamily: "'Space Mono', monospace"
                  }}
                >
                  Soumettre le quiz
                </button>
              ) : (
                <button
                  onClick={() => {
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                  }}
                  style={{
                    marginTop: '2rem',
                    padding: '1rem 2rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#cbd5e1',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    width: '100%',
                    fontFamily: "'Space Mono', monospace"
                  }}
                >
                  Réessayer
                </button>
              )}
            </div>
          )}

          {/* Visualizer */}
          <LinearRegressionVisualizer />
        </div>
      </div>
    </div>
  );
};

export default LinearRegressionPage;