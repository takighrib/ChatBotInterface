import React from 'react';
import { Link } from 'react-router-dom';
import { useUserProgress } from '@context/UserProgressContext';
import { ROUTES } from '@constants/routes';
import { 
  GitBranch, 
  TrendingUp, 
  Binary, 
  Brain,
  CheckCircle,
  Lock,
  ArrowRight
} from 'lucide-react';

const AlgorithmsPage = () => {
  const { progress } = useUserProgress();

  const algorithms = [
    {
      id: 'kmeans',
      name: 'K-Means Clustering',
      description: 'Algorithme de clustering non supervisé qui partitionne les données en k groupes',
      category: 'Clustering',
      difficulty: 'Débutant',
      icon: GitBranch,
      color: '#00f5ff',
      route: ROUTES.KMEANS,
      available: true,
      features: [
        'Visualisation step-by-step',
        'Manipulation interactive des centroïdes',
        'Métriques en temps réel',
        'Ajout de points personnalisés'
      ]
    },
    {
      id: 'linear-regression',
      name: 'Régression Linéaire',
      description: 'Modélise la relation entre une variable dépendante et une ou plusieurs variables indépendantes',
      category: 'Régression',
      difficulty: 'Débutant',
      icon: TrendingUp,
      color: '#ff00ff',
      route: ROUTES.LINEAR_REGRESSION,
      available: true,
      features: [
        'Gradient descent animé',
        'Courbe de loss function',
        'Ajustement des hyperparamètres',
        'Prédictions en temps réel'
      ]
    },
    {
      id: 'decision-tree',
      name: 'Arbre de Décision',
      description: 'Algorithme de classification et régression basé sur une structure arborescente',
      category: 'Classification',
      difficulty: 'Intermédiaire',
      icon: Binary,
      color: '#00ff88',
      route: ROUTES.DECISION_TREE,
      available: true,
      features: [
        'Construction visuelle de l\'arbre',
        'Métriques de gain d\'information',
        'Pruning interactif',
        'Analyse de feature importance'
      ]
    },
    {
      id: 'neural-network',
      name: 'Réseau de Neurones',
      description: 'Modèle inspiré du cerveau humain pour l\'apprentissage de patterns complexes',
      category: 'Deep Learning',
      difficulty: 'Avancé',
      icon: Brain,
      color: '#ffaa00',
      route: ROUTES.NEURAL_NETWORK,
      available: false,
      features: [
        'Architecture personnalisable',
        'Backpropagation visualisée',
        'Training en temps réel',
        'Visualisation des activations'
      ]
    }
  ];

  const isCompleted = (algorithmId) => {
    return progress.completedAlgorithms.includes(algorithmId);
  };

  const getQuizScore = (algorithmId) => {
    return progress.quizScores[algorithmId] || null;
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 200px)',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      padding: '3rem 2rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #00f5ff 0%, #ff00ff 50%, #00ff88 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
            fontFamily: "'Space Mono', monospace"
          }}>
            Bibliothèque d'Algorithmes
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#94a3b8',
            maxWidth: '700px',
            margin: '0 auto',
            fontFamily: "'Inter', sans-serif"
          }}>
            Explorez et maîtrisez les algorithmes de Machine Learning avec des visualisations interactives
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '1.5rem',
            border: '2px solid rgba(0, 245, 255, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#00f5ff',
              marginBottom: '0.5rem'
            }}>
              {progress.completedAlgorithms.length}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Algorithmes complétés
            </div>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '1.5rem',
            border: '2px solid rgba(255, 0, 255, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#ff00ff',
              marginBottom: '0.5rem'
            }}>
              {progress.experimentsCompleted}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Expériences réalisées
            </div>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: '15px',
            padding: '1.5rem',
            border: '2px solid rgba(0, 255, 136, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#00ff88',
              marginBottom: '0.5rem'
            }}>
              {Math.round(progress.totalTimeSpent)}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Minutes d'apprentissage
            </div>
          </div>
        </div>

        {/* Algorithms Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {algorithms.map(algorithm => {
            const Icon = algorithm.icon;
            const completed = isCompleted(algorithm.id);
            const score = getQuizScore(algorithm.id);

            return (
              <div
                key={algorithm.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '2rem',
                  border: `2px solid ${algorithm.color}40`,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = `0 10px 40px ${algorithm.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Status Badge */}
                {!algorithm.available && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(255, 170, 0, 0.2)',
                    color: '#ffaa00',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Lock size={14} />
                    Bientôt
                  </div>
                )}

                {completed && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(0, 255, 136, 0.2)',
                    color: '#00ff88',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <CheckCircle size={14} />
                    Complété
                  </div>
                )}

                {/* Icon */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '15px',
                  background: `${algorithm.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <Icon size={30} color={algorithm.color} />
                </div>

                {/* Content */}
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#e2e8f0',
                  marginBottom: '0.5rem',
                  fontFamily: "'Space Mono', monospace"
                }}>
                  {algorithm.name}
                </h3>

                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    color: '#94a3b8'
                  }}>
                    {algorithm.category}
                  </span>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    background: `${algorithm.color}20`,
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    color: algorithm.color
                  }}>
                    {algorithm.difficulty}
                  </span>
                </div>

                <p style={{
                  color: '#94a3b8',
                  fontSize: '0.95rem',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem'
                }}>
                  {algorithm.description}
                </p>

                {/* Features */}
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 1.5rem 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  {algorithm.features.map((feature, idx) => (
                    <li key={idx} style={{
                      color: '#cbd5e1',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <div style={{
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: algorithm.color
                      }} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Score */}
                {score !== null && (
                  <div style={{
                    padding: '0.75rem',
                    background: 'rgba(0, 255, 136, 0.1)',
                    borderRadius: '10px',
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>
                    <span style={{ color: '#00ff88', fontWeight: '700' }}>
                      Score du quiz: {score}%
                    </span>
                  </div>
                )}

                {/* Button */}
                {algorithm.available ? (
                  <Link to={algorithm.route} style={{ textDecoration: 'none' }}>
                    <button style={{
                      width: '100%',
                      padding: '1rem',
                      background: `linear-gradient(135deg, ${algorithm.color}, ${algorithm.color}cc)`,
                      color: '#000',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s',
                      fontFamily: "'Space Mono', monospace"
                    }}>
                      Commencer
                      <ArrowRight size={20} />
                    </button>
                  </Link>
                ) : (
                  <button style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#64748b',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '1rem',
                    cursor: 'not-allowed',
                    fontFamily: "'Space Mono', monospace"
                  }}>
                    Bientôt disponible
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmsPage;