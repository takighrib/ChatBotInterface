import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@context/AppContext';
import { useUserProgress } from '@context/UserProgressContext';
import { ArrowLeft, BookOpen, HelpCircle, Award } from 'lucide-react';
import { ROUTES } from '@constants/routes';
import DecisionTreeVisualizer from '@components/algorithms/DecisionTreeVisualizer';

const DecisionTreePage = () => {
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
      question: "Quelle métrique est utilisée pour mesurer l'impureté dans un arbre de décision ?",
      options: [
        "MSE (Mean Squared Error)",
        "Entropie et Gain d'Information",
        "Accuracy",
        "Précision"
      ],
      correct: 1
    },
    {
      id: 2,
      question: "Que représente un nœud feuille dans un arbre de décision ?",
      options: [
        "Une condition de split",
        "Une classe finale (prédiction)",
        "Un hyperparamètre",
        "Une métrique d'évaluation"
      ],
      correct: 1
    },
    {
      id: 3,
      question: "Quel est le rôle de la profondeur maximale (max_depth) ?",
      options: [
        "Augmenter l'accuracy",
        "Contrôler le surapprentissage (overfitting)",
        "Augmenter la vitesse d'entraînement",
        "Réduire le nombre de features"
      ],
      correct: 1
    },
    {
      id: 4,
      question: "Comment l'algorithme choisit-il le meilleur split ?",
      options: [
        "Au hasard",
        "En maximisant le gain d'information",
        "En minimisant le nombre de nœuds",
        "En augmentant la profondeur"
      ],
      correct: 1
    },
    {
      id: 5,
      question: "Quelle est une limitation des arbres de décision ?",
      options: [
        "Ils sont trop lents",
        "Ils ne fonctionnent qu'avec des données numériques",
        "Ils ont tendance à overfitter sur les données d'entraînement",
        "Ils nécessitent beaucoup de données"
      ],
      correct: 2
    }
  ];

  const handleQuizSubmit = () => {
    const correctAnswers = quizQuestions.filter(
      q => quizAnswers[q.id] === q.correct
    ).length;
    const score = Math.round((correctAnswers / quizQuestions.length) * 100);
    
    setQuizSubmitted(true);
    updateQuizScore('decision-tree', score);
    
    if (score >= 80) {
      markAlgorithmCompleted('decision-tree');
      showSuccess(`Félicitations ! Score: ${score}%. Arbre de Décision complété !`);
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
        <div style={{ maxWidth: '1500px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
            background: 'linear-gradient(135deg, #00f5ff, #00ff88)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: "'Space Mono', monospace"
          }}>
            Arbre de Décision
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
                📚 Comprendre les Arbres de Décision
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
                    Qu'est-ce qu'un Arbre de Décision ?
                  </h3>
                  <p>
                    Un arbre de décision est un algorithme d'<strong style={{ color: '#00f5ff' }}>apprentissage supervisé</strong> qui 
                    utilise une structure arborescente pour prendre des décisions. Il partitionne récursivement l'espace des 
                    features en régions, où chaque région est assignée à une classe. C'est comme un <strong style={{ color: '#00f5ff' }}>
                    flowchart</strong> de questions qui mène à une décision finale.
                  </p>
                </div>

                <div>
                  <h3 style={{ color: '#e2e8f0', marginBottom: '0.75rem' }}>
                    Structure de l'Arbre
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{
                      background: 'rgba(0, 245, 255, 0.1)',
                      padding: '1rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(0, 245, 255, 0.3)'
                    }}>
                      <h4 style={{ color: '#00f5ff', marginBottom: '0.5rem' }}>🔵 Nœuds Internes</h4>
                      <p style={{ fontSize: '0.9rem', margin: 0 }}>
                        Contiennent une condition de test (ex: x &lt; 100). Divisent les données en deux sous-ensembles.
                      </p>
                    </div>
                    <div style={{
                      background: 'rgba(0, 255, 136, 0.1)',
                      padding: '1rem',
                      borderRadius: '10px',
                      border: '1px solid rgba(0, 255, 136, 0.3)'
                    }}>
                      <h4 style={{ color: '#00ff88', marginBottom: '0.5rem' }}>🟢 Feuilles</h4>
                      <p style={{ fontSize: '0.9rem', margin: 0 }}>
                        Représentent la classe finale. Aucune division supplémentaire n'est effectuée.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ color: '#e2e8f0', marginBottom: '0.75rem' }}>
                    Algorithme de Construction
                  </h3>
                  <ol style={{ paddingLeft: '1.5rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#00ff88' }}>Sélection du meilleur split :</strong> Pour chaque feature, 
                      tester tous les seuils possibles et calculer le gain d'information
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#00ff88' }}>Division :</strong> Séparer les données selon le split optimal
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#00ff88' }}>Récursion :</strong> Répéter le processus pour chaque sous-ensemble
                    </li>
                    <li>
                      <strong style={{ color: '#00ff88' }}>Arrêt :</strong> Quand profondeur max atteinte ou données pures
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 style={{ color: '#e2e8f0', marginBottom: '0.75rem' }}>
                    Entropie et Gain d'Information
                  </h3>
                  <div style={{
                    background: 'rgba(0, 245, 255, 0.1)',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(0, 245, 255, 0.3)'
                  }}>
                    <p style={{ margin: '0 0 0.75rem 0' }}>
                      <strong style={{ color: '#00f5ff' }}>Entropie</strong> mesure l'impureté d'un ensemble :
                    </p>
                    <div style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '1.1rem',
                      textAlign: 'center',
                      padding: '0.5rem',
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '5px'
                    }}>
                      H(S) = -Σ p<sub>i</sub> × log₂(p<sub>i</sub>)
                    </div>
                    <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.9rem' }}>
                      <strong style={{ color: '#00ff88' }}>Gain d'Information</strong> = Entropie(parent) - Moyenne pondérée(Entropie(enfants))
                    </p>
                  </div>
                </div>

                <div>
                  <h3 style={{ color: '#e2e8f0', marginBottom: '0.75rem' }}>
                    Applications pratiques
                  </h3>
                  <ul style={{ paddingLeft: '1.5rem' }}>
                    <li>Diagnostic médical (décisions basées sur symptômes)</li>
                    <li>Approbation de crédits bancaires</li>
                    <li>Recommandation de produits</li>
                    <li>Détection de fraude</li>
                    <li>Classification d'emails (spam/non-spam)</li>
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
                        <li>Facile à comprendre et visualiser</li>
                        <li>Peu de préparation des données</li>
                        <li>Gère données numériques et catégorielles</li>
                        <li>Capture interactions non-linéaires</li>
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
                        <li>Tendance à overfitter</li>
                        <li>Instable (petits changements → grands effets)</li>
                        <li>Biais vers features dominantes</li>
                        <li>Moins performant que Random Forests</li>
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
          <DecisionTreeVisualizer />
        </div>
      </div>
    </div>
  );
};

export default DecisionTreePage;