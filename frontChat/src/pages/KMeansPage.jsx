import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@context/AppContext';
import { useUserProgress } from '@context/UserProgressContext';
import { ArrowLeft, BookOpen, HelpCircle, Award, GitBranch, Sparkles } from 'lucide-react';
import { ROUTES } from '@constants/routes';
import KMeansVisualizer from '@components/algorithms/KMeansVisualizer';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';

const KMeansPage = () => {
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
    <div className="min-h-screen bg-brand-paper py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
      {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-3 rounded-xl shadow-lg">
                <GitBranch className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
            K-Means Clustering
          </h1>
                <p className="text-text-secondary mt-1">
                  Algorithme de clustering non supervisé
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={showTheory ? "primary" : "outline"}
              onClick={() => setShowTheory(!showTheory)}
                icon={<BookOpen className="w-5 h-5" />}
              >
              Théorie
              </Button>
              <Button
                variant={showQuiz ? "primary" : "outline"}
              onClick={() => setShowQuiz(!showQuiz)}
                icon={<HelpCircle className="w-5 h-5" />}
              >
                Quiz
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.ALGORITHMS)}
                icon={<ArrowLeft className="w-5 h-5" />}
            >
                Retour
              </Button>
          </div>
        </div>
      </div>

          {/* Theory Section */}
          {showTheory && (
          <Card className="mb-6 border-l-4 border-cyan-400 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-cyan-400/20 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-cyan-600" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary">
                Comprendre K-Means
              </h2>
            </div>

            <div className="space-y-6 text-text-secondary">
                <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Qu'est-ce que K-Means ?
                  </h3>
                  <p>
                  K-Means est un algorithme de <strong className="text-cyan-600">clustering non supervisé</strong> qui 
                  partitionne un ensemble de données en <strong className="text-cyan-600">k groupes (clusters)</strong> distincts. 
                    Chaque cluster est représenté par son centroïde, qui est le point moyen de tous les points du cluster.
                  </p>
                </div>

                <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Comment ça fonctionne ?
                  </h3>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>
                    <strong className="text-brand-accent">Initialisation :</strong> Placer k centroïdes de manière aléatoire
                    </li>
                  <li>
                    <strong className="text-brand-accent">Assignment :</strong> Assigner chaque point au centroïde le plus proche (distance euclidienne)
                    </li>
                  <li>
                    <strong className="text-brand-accent">Update :</strong> Recalculer la position de chaque centroïde comme la moyenne des points assignés
                    </li>
                    <li>
                    <strong className="text-brand-accent">Répéter :</strong> Les étapes 2 et 3 jusqu'à convergence
                    </li>
                  </ol>
                </div>

                <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Applications pratiques
                  </h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Segmentation de clients en marketing</li>
                    <li>Compression d'images</li>
                    <li>Détection d'anomalies</li>
                    <li>Analyse de documents et textes</li>
                    <li>Regroupement de données géographiques</li>
                  </ul>
                </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-green-50 border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-700 mb-2">✅ Avantages</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-green-600 ml-2">
                        <li>Simple et rapide</li>
                        <li>Scalable pour gros datasets</li>
                        <li>Converge toujours</li>
                      </ul>
                </Card>
                <Card className="bg-red-50 border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-700 mb-2">⚠️ Limitations</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-600 ml-2">
                        <li>Nécessite de choisir k</li>
                        <li>Sensible aux outliers</li>
                        <li>Suppose des clusters sphériques</li>
                      </ul>
                </Card>
              </div>
            </div>
          </Card>
          )}

          {/* Quiz Section */}
          {showQuiz && (
          <Card className="mb-6 border-l-4 border-brand-accent animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand-accent/20 p-2 rounded-lg">
                <Award className="w-6 h-6 text-brand-accent" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary">
                Testez vos connaissances
              </h2>
            </div>

            <div className="space-y-4">
                {quizQuestions.map((q, idx) => (
                <Card key={q.id} className="bg-white border-l-4 border-brand-mint">
                  <h3 className="text-lg font-semibold text-text-primary mb-3">
                      {idx + 1}. {q.question}
                    </h3>

                  <div className="space-y-2">
                      {q.options.map((option, optIdx) => {
                        const isSelected = quizAnswers[q.id] === optIdx;
                        const isCorrect = optIdx === q.correct;
                        const showResult = quizSubmitted;

                        return (
                          <button
                            key={optIdx}
                            onClick={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })}
                            disabled={quizSubmitted}
                          className={`w-full text-left p-3 rounded-lg transition-all ${
                            showResult
                              ? isCorrect
                                ? 'bg-green-100 border-2 border-green-500 text-green-700'
                                : isSelected
                                ? 'bg-red-100 border-2 border-red-500 text-red-700'
                                : 'bg-white border-2 border-brand-grey text-text-secondary'
                              : isSelected
                              ? 'bg-brand-mint/20 border-2 border-brand-mint text-brand-slate'
                              : 'bg-white border-2 border-brand-grey text-text-secondary hover:border-brand-mint'
                          } ${quizSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            {option}
                            {showResult && isCorrect && ' ✓'}
                          </button>
                        );
                      })}
                    </div>
                </Card>
                ))}
              </div>

              {!quizSubmitted ? (
              <Button
                variant="primary"
                size="lg"
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                className="w-full mt-6"
                >
                  Soumettre le quiz
              </Button>
              ) : (
              <Button
                variant="secondary"
                size="lg"
                  onClick={() => {
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                  }}
                className="w-full mt-6"
                >
                  Réessayer
              </Button>
              )}
          </Card>
          )}

          {/* Visualizer */}
        <Card className="border-l-4 border-cyan-400">
          <KMeansVisualizer />
        </Card>
      </div>
    </div>
  );
};

export default KMeansPage;
