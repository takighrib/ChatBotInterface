import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@context/AppContext';
import { useUserProgress } from '@context/UserProgressContext';
import { ArrowLeft, BookOpen, HelpCircle, Award, TrendingUp } from 'lucide-react';
import { ROUTES } from '@constants/routes';
import LinearRegressionVisualizer from '@components/algorithms/LinearRegressionVisualizer';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';

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
    <div className="min-h-screen bg-brand-paper py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
      {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-purple-400 to-pink-500 p-3 rounded-xl shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
            Régression Linéaire
          </h1>
                <p className="text-text-secondary mt-1">
                  Modélisation de relations linéaires entre variables
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
          <Card className="mb-6 border-l-4 border-purple-500 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-400/20 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary">
                Comprendre la Régression Linéaire
              </h2>
            </div>

            <div className="space-y-6 text-text-secondary">
                <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Qu'est-ce que la Régression Linéaire ?
                  </h3>
                  <p>
                  La régression linéaire est un algorithme d'<strong className="text-purple-600">apprentissage supervisé</strong> qui 
                    modélise la relation entre une variable dépendante (y) et une ou plusieurs variables indépendantes (x) 
                  par une <strong className="text-purple-600">équation linéaire</strong>. L'objectif est de trouver la droite 
                    qui s'ajuste le mieux aux données.
                  </p>
                </div>

                <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Équation du modèle
                  </h3>
                <Card className="bg-purple-50 border-l-4 border-purple-500">
                  <div className="text-center font-mono text-xl font-bold text-purple-700 py-2">
                    y = w × x + b
                  </div>
                </Card>
                <ul className="list-disc list-inside space-y-1 mt-3 ml-2">
                  <li><strong className="text-green-600">w (poids)</strong> : pente de la droite</li>
                  <li><strong className="text-green-600">b (biais)</strong> : ordonnée à l'origine</li>
                  <li><strong className="text-green-600">x</strong> : variable d'entrée</li>
                  <li><strong className="text-green-600">y</strong> : prédiction</li>
                  </ul>
                </div>

                <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Gradient Descent : Comment ça marche ?
                  </h3>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>
                    <strong className="text-brand-accent">Initialisation :</strong> Commencer avec des poids aléatoires (w, b)
                    </li>
                  <li>
                    <strong className="text-brand-accent">Calcul de la Loss :</strong> Mesurer l'erreur avec MSE = Σ(y_pred - y_true)² / n
                    </li>
                  <li>
                    <strong className="text-brand-accent">Calcul des Gradients :</strong> Dérivées partielles ∂L/∂w et ∂L/∂b
                    </li>
                    <li>
                    <strong className="text-brand-accent">Mise à jour :</strong> w = w - α × ∂L/∂w (α = learning rate)
                    </li>
                  </ol>
                </div>

                <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Applications pratiques
                  </h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Prédiction de prix (immobilier, actions)</li>
                    <li>Analyse des ventes et tendances</li>
                    <li>Prévisions météorologiques</li>
                    <li>Estimation de coûts</li>
                    <li>Modélisation de relations scientifiques</li>
                  </ul>
                </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-green-50 border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-700 mb-2">✅ Avantages</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-green-600 ml-2">
                        <li>Simple et interprétable</li>
                        <li>Rapide à entraîner</li>
                        <li>Peu de paramètres</li>
                        <li>Efficace sur données linéaires</li>
                      </ul>
                </Card>
                <Card className="bg-red-50 border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-700 mb-2">⚠️ Limitations</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-600 ml-2">
                        <li>Suppose une relation linéaire</li>
                        <li>Sensible aux outliers</li>
                        <li>Ne capture pas la complexité</li>
                        <li>Peut sous-ajuster (underfitting)</li>
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
        <Card className="border-l-4 border-purple-500">
          <LinearRegressionVisualizer />
        </Card>
      </div>
    </div>
  );
};

export default LinearRegressionPage;
