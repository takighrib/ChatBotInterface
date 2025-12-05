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
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import Button from '@components/common/Button';

const AlgorithmsPage = () => {
  // Récupération du contexte avec valeurs par défaut
  let progress = {};
  try {
    const { progress: userProgress } = useUserProgress();
    progress = userProgress || {};
  } catch (error) {
    // Si le contexte n'est pas disponible, utiliser des valeurs par défaut
    console.warn('UserProgressContext not available, using defaults');
    progress = {
      completedAlgorithms: [],
      experimentsCompleted: 0,
      totalExperiments: 0,
      totalTimeSpent: 0,
      quizScores: {}
    };
  }

  // Valeurs par défaut pour éviter les erreurs
  const completedAlgorithms = progress.completedAlgorithms || [];
  const experimentsCompleted = progress.experimentsCompleted || progress.totalExperiments || 0;
  const totalTimeSpent = progress.totalTimeSpent || 0;
  const quizScores = progress.quizScores || {};

  const algorithms = [
    {
      id: 'kmeans',
      name: 'K-Means Clustering',
      description: 'Algorithme de clustering non supervisé qui partitionne les données en k groupes',
      category: 'Clustering',
      difficulty: 'Débutant',
      icon: GitBranch,
      color: 'from-cyan-400 to-blue-500',
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
      color: 'from-purple-400 to-pink-500',
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
      color: 'from-green-400 to-emerald-500',
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
      color: 'from-orange-400 to-amber-500',
      route: ROUTES.NEURAL_NETWORK,
      available: true,
      features: [
        'Architecture personnalisable',
        'Backpropagation visualisée',
        'Training en temps réel',
        'Visualisation des activations'
      ]
    }
  ];

  const isCompleted = (algorithmId) => {
    return completedAlgorithms.includes(algorithmId);
  };

  const getQuizScore = (algorithmId) => {
    return quizScores[algorithmId] || null;
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Débutant': return 'success';
      case 'Intermédiaire': return 'accent';
      case 'Avancé': return 'danger';
      default: return 'mint';
    }
  };

  return (
    <div className="min-h-screen bg-brand-paper py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header amélioré */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="bg-brand-mint/30 p-3 rounded-full">
              <Brain className="w-12 h-12 text-brand-accent" />
            </div>
          </div>
          <Badge variant="mint" size="lg" className="mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Bibliothèque d'Algorithmes
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4">
            Explorez les Algorithmes ML
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Découvrez et maîtrisez les algorithmes de Machine Learning avec des visualisations interactives 
            et des explications détaillées adaptées à tous les niveaux.
          </p>
        </div>

        {/* Stats améliorées */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border-l-4 border-cyan-400">
            <div className="text-4xl font-extrabold text-cyan-500 mb-2">
              {completedAlgorithms.length}
            </div>
            <div className="text-text-secondary font-medium">
              Algorithmes complétés
            </div>
          </Card>

          <Card className="text-center border-l-4 border-purple-400">
            <div className="text-4xl font-extrabold text-purple-500 mb-2">
              {experimentsCompleted}
            </div>
            <div className="text-text-secondary font-medium">
              Expériences réalisées
            </div>
          </Card>

          <Card className="text-center border-l-4 border-green-400">
            <div className="text-4xl font-extrabold text-green-500 mb-2">
              {Math.round(totalTimeSpent)}
            </div>
            <div className="text-text-secondary font-medium">
              Minutes d'apprentissage
            </div>
          </Card>
        </div>

        {/* Algorithms Grid amélioré */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {algorithms.map((algorithm, index) => {
            const Icon = algorithm.icon;
            const completed = isCompleted(algorithm.id);
            const score = getQuizScore(algorithm.id);

            return (
              <Card
                key={algorithm.id}
                className="relative overflow-hidden hover:shadow-xl transition-all duration-300 group border-l-4"
                style={{
                  borderLeftColor: algorithm.available 
                    ? (algorithm.color.includes('cyan') ? '#22d3ee' : 
                       algorithm.color.includes('purple') ? '#a855f7' : 
                       algorithm.color.includes('green') ? '#4ade80' : '#f97316')
                    : '#9ca3af'
                }}
              >
                {/* Background gradient subtil */}
                <div className={`absolute inset-0 bg-gradient-to-br ${algorithm.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />

                <div className="relative z-10">
                {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {!algorithm.available ? (
                      <Badge variant="slate" size="sm" className="flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                    Bientôt
                      </Badge>
                    ) : completed ? (
                      <Badge variant="success" size="sm" className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Complété
                      </Badge>
                    ) : null}
                  </div>

                  {/* Icon avec gradient */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${algorithm.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                  {algorithm.name}
                </h3>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="mint" size="sm">
                    {algorithm.category}
                    </Badge>
                    <Badge variant={getDifficultyColor(algorithm.difficulty)} size="sm">
                    {algorithm.difficulty}
                    </Badge>
                </div>

                  <p className="text-text-secondary mb-4 text-sm leading-relaxed">
                  {algorithm.description}
                </p>

                {/* Features */}
                  <ul className="space-y-2 mb-4">
                  {algorithm.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-text-secondary">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${algorithm.color} mt-2 mr-2 flex-shrink-0`} />
                        <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Score */}
                  {score !== null && score !== undefined && (
                    <div className={`mb-4 p-3 rounded-lg bg-gradient-to-r ${algorithm.color} bg-opacity-10 border border-opacity-20 text-center`}>
                      <span className="text-sm font-semibold" style={{ 
                        color: algorithm.color.includes('cyan') ? '#06b6d4' : 
                               algorithm.color.includes('purple') ? '#9333ea' : 
                               algorithm.color.includes('green') ? '#10b981' : '#f97316'
                      }}>
                      Score du quiz: {score}%
                    </span>
                  </div>
                )}

                {/* Button */}
                {algorithm.available ? (
                    <Link to={algorithm.route} className="block">
                      <Button
                        variant="primary"
                        className="w-full bg-gradient-to-r from-brand-accent to-brand-accent/80 hover:from-brand-accent/90 hover:to-brand-accent/70"
                        icon={<ArrowRight className="w-4 h-4" />}
                      >
                      Commencer
                      </Button>
                  </Link>
                ) : (
                    <Button
                      variant="outline"
                      disabled
                      className="w-full opacity-50 cursor-not-allowed"
                    >
                    Bientôt disponible
                    </Button>
                )}
              </div>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-brand-mint to-brand-surface border-l-4 border-brand-accent">
            <h3 className="text-2xl font-bold text-text-primary mb-2">
              Prêt à commencer ?
            </h3>
            <p className="text-text-secondary mb-6">
              Choisissez un algorithme ci-dessus pour commencer votre apprentissage interactif
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="primary"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Voir les algorithmes
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmsPage;
