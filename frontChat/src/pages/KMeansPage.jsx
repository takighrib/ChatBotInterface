import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@context/AppContext';
import { useUserProgress } from '@context/UserProgressContext';
import { ArrowLeft, BookOpen, HelpCircle, Award } from 'lucide-react';
import { ROUTES } from '@constants/routes';
import KMeansVisualizer from '@components/algorithms/KMeansVisualizer';

const KMeansPage = () => {
  const navigate = useNavigate();
  const { showSuccess } = useApp();
  const { markAlgorithmCompleted, updateQuizScore, incrementExperiments } = useUserProgress();
  
  const [showTheory, setShowTheory] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    // Incrémenter le compteur d'expériences
    incrementExperiments();
  }, []);

  const quizQuestions = [
    {
      id: 1,
      question: "Quel est l'objectif principal de l'algorithme K-means ?",
      options: [
        "Classifier des données supervisées",
        "Partitionner les données en k groupes similaires",
        "Prédire des valeurs continues",
        "Réduire la dimensionnalité"
      ],
      correct: 1
    },
    {
      id: 2,
      question: "Comment sont initialisés les centroïdes dans K-means ?",
      options: [
        "Toujours au centre du dataset",
        "De manière séquentielle",
        "Aléatoirement parmi les points existants",
        "Par gradient descent"
      ],
      correct: 2
    },
    {
      id: 3,
      question: "Quelle métrique est utilisée pour mesurer la distance dans K-means standard ?",
      options: [
        "Distance de Manhattan",
        "Distance euclidienne",
        "Distance de Hamming",
        "Cosine similarity"
      ],
      correct: 1
    },
    {
      id: 4,
      question: "Que représente l'inertie dans K-means ?",
      options: [
        "Le nombre d'itérations nécessaires",
        "La somme des distances au carré entre points et centroïdes",
        "Le nombre de clusters optimaux",
        "La vitesse de convergence"
      ],
      correct: 1
    },
    {
      id: 5,
      question: "Quelle est une limitation majeure de K-means ?",
      options: [
        "Il ne fonctionne que sur des données 2D",
        "Il nécessite de spécifier k à l'avance",
        "Il est trop lent pour de gros datasets",
        "Il ne peut gérer que des données numériques continues"
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
    updateQuizScore('kmeans', score);
    
    if (score >= 80) {
      markAlgorithmCompleted('kmeans');
      showSuccess(`Félicitations ! Score: ${score}%. Algorithme K-means complété !`);
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
        borderBottom: '2px solid rgba(0, 245, 255, 0.2)',
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
            background: 'linear-gradient(135deg, #00f5ff, #ff00ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: "'Space Mono', monospace"
          }}>
            K-Means Clustering
          </h1>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setShowTheory(!showTheory)}
              style={{
                padding: '0.75rem 1.25rem',
                background: showTheory ? 'rgba(0, 245, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                border: showTheory ? '2px solid #00f5ff' : '2px solid rgba(255, 255, 255, 0.1)',
                color: showTheory ? '#00f5ff' : '#cbd5e1',
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
                background: showQuiz ? 'rgba(255, 0, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                border: showQuiz ? '2px solid #ff00ff' : '2px solid rgba(255, 255, 255, 0.1)',
                color: showQuiz ? '#ff00ff' : '#cbd5e1',
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
              border: '2px solid rgba(0, 245, 255, 0.2)',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: '#00f5ff',
                marginBottom: '1.5rem',
                fontFamily: "'Space Mono', monospace"
              }}>
                📚 Comprendre K-Means
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
                    Qu'est-ce que K-Means ?
                  </h3>
                  <p>
                    K-Means est un algorithme de <strong style={{ color: '#00f5ff' }}>clustering non supervisé</strong> qui 
                    partitionne un ensemble de données en <strong style={{ color: '#00f5ff' }}>k groupes (clusters)</strong> distincts. 
                    Chaque cluster est représenté par son centroïde, qui est le point moyen de tous les points du cluster.
                  </p>
                </div>

                <div>
                  <h3 style={{ color: '#e2e8f0', marginBottom: '0.75rem' }}>
                    Comment ça fonctionne ?
                  </h3>
                  <ol style={{ paddingLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#ff00ff' }}>Initialisation :</strong> Placer k centroïdes de manière aléatoire
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#ff00ff' }}>Assignment :</strong> Assigner chaque point au centroïde le plus proche (distance euclidienne)
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#ff00ff' }}>Update :</strong> Recalculer la position de chaque centroïde comme la moyenne des points assignés
                    </li>
                    <li>
                      <strong style={{ color: '#ff00ff' }}>Répéter :</strong> Les étapes 2 et 3 jusqu'à convergence
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 style={{ color: '#e2e8f0', marginBottom: '0.75rem' }}>
                    Applications pratiques
                  </h3>
                  <ul style={{ paddingLeft: '1.5rem' }}>
                    <li>Segmentation de clients en marketing</li>
                    <li>Compression d'images</li>
                    <li>Détection d'anomalies</li>
                    <li>Analyse de documents et textes</li>
                    <li>Regroupement de données géographiques</li>
                  </ul>
                </div>

                <div>
                  <h3 style={{ color: '#e2e8f0', marginBottom: '0.75rem' }}>
                    Avantages et limitations
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
                        <li>Simple et rapide</li>
                        <li>Scalable pour gros datasets</li>
                        <li>Converge toujours</li>
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
                        <li>Nécessite de choisir k</li>
                        <li>Sensible aux outliers</li>
                        <li>Suppose des clusters sphériques</li>
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
              border: '2px solid rgba(255, 0, 255, 0.2)',
              marginBottom: '2rem'
            }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: '#ff00ff',
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
                                : isSelected ? 'rgba(255, 0, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                              border: showResult
                                ? (isCorrect ? '2px solid #00ff88' : isSelected ? '2px solid #ff3366' : '2px solid rgba(255, 255, 255, 0.1)')
                                : isSelected ? '2px solid #ff00ff' : '2px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '10px',
                              color: showResult 
                                ? (isCorrect ? '#00ff88' : isSelected ? '#ff3366' : '#cbd5e1')
                                : isSelected ? '#ff00ff' : '#cbd5e1',
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
                      : 'linear-gradient(135deg, #ff00ff, #ff00cc)',
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
          <KMeansVisualizer />
        </div>
      </div>
    </div>
  );
};

export default KMeansPage;