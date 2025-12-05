import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@context/AppContext';
import { useUserProgress } from '@context/UserProgressContext';
import { ArrowLeft, BookOpen, HelpCircle, Award, Binary } from 'lucide-react';
import { ROUTES } from '@constants/routes';
import DecisionTreeVisualizer from '@components/algorithms/DecisionTreeVisualizer';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';

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
    <div className="min-h-screen bg-brand-paper py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
      {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-xl shadow-lg">
                <Binary className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
            Arbre de Décision
          </h1>
                <p className="text-text-secondary mt-1">
                  Classification et régression par structure arborescente
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
          <Card className="mb-6 border-l-4 border-green-500 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-400/20 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary">
                Comprendre les Arbres de Décision
              </h2>
            </div>

            <div className="space-y-6 text-text-secondary">
                <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Qu'est-ce qu'un Arbre de Décision ?
                  </h3>
                  <p>
                  Un arbre de décision est un algorithme d'<strong className="text-green-600">apprentissage supervisé</strong> qui 
                    utilise une structure arborescente pour prendre des décisions. Il partitionne récursivement l'espace des 
                  features en régions, où chaque région est assignée à une classe. C'est comme un <strong className="text-green-600">
                    flowchart</strong> de questions qui mène à une décision finale.
                  </p>
                </div>

                <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Structure de l'Arbre
                  </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-cyan-50 border-l-4 border-cyan-500">
                    <h4 className="font-semibold text-cyan-700 mb-2">🔵 Nœuds Internes</h4>
                    <p className="text-sm text-cyan-600">
                        Contiennent une condition de test (ex: x &lt; 100). Divisent les données en deux sous-ensembles.
                      </p>
                  </Card>
                  <Card className="bg-green-50 border-l-4 border-green-500">
                    <h4 className="font-semibold text-green-700 mb-2">🟢 Feuilles</h4>
                    <p className="text-sm text-green-600">
                        Représentent la classe finale. Aucune division supplémentaire n'est effectuée.
                      </p>
                  </Card>
                  </div>
                </div>

                <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Algorithme de Construction
                  </h3>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>
                    <strong className="text-brand-accent">Sélection du meilleur split :</strong> Pour chaque feature, 
                      tester tous les seuils possibles et calculer le gain d'information
                    </li>
                  <li>
                    <strong className="text-brand-accent">Division :</strong> Séparer les données selon le split optimal
                    </li>
                  <li>
                    <strong className="text-brand-accent">Récursion :</strong> Répéter le processus pour chaque sous-ensemble
                    </li>
                    <li>
                    <strong className="text-brand-accent">Arrêt :</strong> Quand profondeur max atteinte ou données pures
                    </li>
                  </ol>
                </div>

                <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Entropie et Gain d'Information
                  </h3>
                <Card className="bg-green-50 border-l-4 border-green-500">
                  <p className="mb-2">
                    <strong className="text-green-700">Entropie</strong> mesure l'impureté d'un ensemble :
                    </p>
                  <div className="font-mono text-center text-lg font-bold text-green-700 py-2 bg-white rounded">
                      H(S) = -Σ p<sub>i</sub> × log₂(p<sub>i</sub>)
                  </div>
                  <p className="mt-2 text-sm">
                    <strong className="text-green-700">Gain d'Information</strong> = Entropie(parent) - Moyenne pondérée(Entropie(enfants))
                  </p>
                </Card>
                </div>

                <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Applications pratiques
                  </h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Diagnostic médical (décisions basées sur symptômes)</li>
                    <li>Approbation de crédits bancaires</li>
                    <li>Recommandation de produits</li>
                    <li>Détection de fraude</li>
                    <li>Classification d'emails (spam/non-spam)</li>
                  </ul>
                </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-green-50 border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-700 mb-2">✅ Avantages</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-green-600 ml-2">
                        <li>Facile à comprendre et visualiser</li>
                        <li>Peu de préparation des données</li>
                        <li>Gère données numériques et catégorielles</li>
                        <li>Capture interactions non-linéaires</li>
                      </ul>
                </Card>
                <Card className="bg-red-50 border-l-4 border-red-500">
                  <h4 className="font-semibold text-red-700 mb-2">⚠️ Limitations</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-600 ml-2">
                        <li>Tendance à overfitter</li>
                        <li>Instable (petits changements → grands effets)</li>
                        <li>Biais vers features dominantes</li>
                        <li>Moins performant que Random Forests</li>
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
        <Card className="border-l-4 border-green-500">
          <DecisionTreeVisualizer />
        </Card>
      </div>
    </div>
  );
};

export default DecisionTreePage;
