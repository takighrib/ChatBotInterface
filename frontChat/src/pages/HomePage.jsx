import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MessageSquare, Image, FileText, BookOpen, Lightbulb, ArrowRight, Brain, TrendingUp, Users, Award, Flame, Edit3 } from 'lucide-react';
import { ROUTES } from '@constants/routes';
import Button from '@components/common/Button';
import Badge from '@components/common/Badge';
import ProgressBar from '@components/common/ProgressBar';
import { useUserProgress } from '@context/UserProgressContext';

// Import Card components - Fixed import
import Card from '@components/common/Card';
import { InteractiveCard } from '@components/common/Card';

// Illustration SVG d'étudiant améliorée
const StudentIllustration = () => (
  <svg viewBox="0 0 400 400" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    {/* Étudiant */}
    <g transform="translate(200, 200)">
      {/* Tête */}
      <circle cx="0" cy="-80" r="40" fill="#F4D1AE" stroke="#2F4F4F" strokeWidth="2"/>
      {/* Cheveux */}
      <path d="M -35 -110 Q -40 -130 -25 -120 Q -10 -130 0 -120 Q 10 -130 25 -120 Q 40 -130 35 -110" 
            fill="#2F4F4F" stroke="#2F4F4F" strokeWidth="1"/>
      {/* Corps */}
      <rect x="-35" y="-35" width="70" height="90" rx="12" fill="#BBD5D0" stroke="#2F4F4F" strokeWidth="2"/>
      {/* Bras gauche */}
      <rect x="-55" y="-25" width="22" height="60" rx="11" fill="#F4D1AE" stroke="#2F4F4F" strokeWidth="2"/>
      {/* Bras droit tenant un livre */}
      <g transform="translate(35, -15)">
        <rect x="0" y="0" width="18" height="50" rx="9" fill="#F4D1AE" stroke="#2F4F4F" strokeWidth="2"/>
        <rect x="18" y="5" width="25" height="40" rx="4" fill="#FFFFFF" stroke="#2F4F4F" strokeWidth="2"/>
        <line x1="23" y1="15" x2="38" y2="15" stroke="#2F4F4F" strokeWidth="1.5"/>
        <line x1="23" y1="22" x2="38" y2="22" stroke="#2F4F4F" strokeWidth="1.5"/>
        <line x1="23" y1="29" x2="35" y2="29" stroke="#2F4F4F" strokeWidth="1.5"/>
      </g>
      {/* Jambes */}
      <rect x="-28" y="55" width="24" height="60" rx="12" fill="#2F4F4F" stroke="#2F4F4F" strokeWidth="2"/>
      <rect x="4" y="55" width="24" height="60" rx="12" fill="#2F4F4F" stroke="#2F4F4F" strokeWidth="2"/>
      {/* Lunettes */}
      <circle cx="-15" cy="-70" r="10" fill="none" stroke="#2F4F4F" strokeWidth="2"/>
      <circle cx="15" cy="-70" r="10" fill="none" stroke="#2F4F4F" strokeWidth="2"/>
      <line x1="-5" y1="-70" x2="5" y2="-70" stroke="#2F4F4F" strokeWidth="2"/>
      {/* Sourire */}
      <path d="M -12 -55 Q 0 -50 12 -55" stroke="#2F4F4F" strokeWidth="2" fill="none"/>
    </g>
    {/* Bulles de pensée avec IA */}
    <g transform="translate(120, 70)">
      <circle cx="0" cy="0" r="30" fill="#FFFFFF" stroke="#BBD5D0" strokeWidth="2" opacity="0.95"/>
      <circle cx="-10" cy="-8" r="4" fill="#D9822B"/>
      <circle cx="10" cy="-8" r="4" fill="#D9822B"/>
      <circle cx="0" cy="8" r="3" fill="#D9822B"/>
      <path d="M -6 12 Q 0 16 6 12" stroke="#D9822B" strokeWidth="2" fill="none"/>
    </g>
    {/* Étoiles flottantes */}
    <g className="animate-pulse" style={{ animationDuration: '2s' }}>
      <path d="M 50 50 L 55 65 L 70 60 L 55 55 L 50 50" fill="#D9822B" opacity="0.7"/>
      <path d="M 350 100 L 355 115 L 370 110 L 355 105 L 350 100" fill="#BBD5D0" opacity="0.7"/>
      <path d="M 80 300 L 85 315 L 100 310 L 85 305 L 80 300" fill="#D9822B" opacity="0.7"/>
    </g>
  </svg>
);

const HomePage = () => {
  const navigate = useNavigate();
  
  // Récupération du contexte - le hook doit être appelé inconditionnellement
  const { progress } = useUserProgress();
  
  // Valeurs par défaut si progress n'est pas défini
  const streak = progress?.streak || 1;
  const totalExperiments = progress?.totalExperiments || 0;
  
  // Calcul du pourcentage de progression
  const overallProgress = Math.min(100, totalExperiments * 10);

  const modules = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Chatbot Intelligent",
      description: "Discute avec une IA et découvre comment elle comprend tes questions",
      route: ROUTES.CHATBOT
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Algorithmes ML",
      description: "Explore les algorithmes de machine learning avec des visualisations interactives",
      route: ROUTES.ALGORITHMS
    },
    {
      icon: <Image className="w-8 h-8" />,
      title: "Reconnaissance d'Image",
      description: "Télécharge des images et vois comment l'IA les identifie",
      route: ROUTES.IMAGE_RECOGNITION
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Classification de Texte",
      description: "Analyse des textes et comprends comment l'IA les classe",
      route: ROUTES.TEXT_CLASSIFICATION
    }
  ];

  const features = [
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Apprentissage Ludique",
      description: "Des exercices interactifs et amusants pour comprendre l'IA en s'amusant"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Documentation Claire",
      description: "Des explications simples et détaillées pour chaque concept"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Expérimentation",
      description: "Teste et modifie les paramètres pour voir l'impact en temps réel"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Suivi de Progression",
      description: "Sauvegarde tes expériences et observe tes progrès"
    }
  ];

  return (
    <div className="min-h-screen bg-brand-paper">
      {/* Hero Section - Modèle amélioré */}
      <section className="relative overflow-hidden max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Bouton Quick Notes en haut à droite */}
        <div className="absolute top-4 right-4 z-20">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm border-brand-mint/40 hover:bg-brand-mint/20"
            icon={<Edit3 className="w-4 h-4" />}
          >
            Quick notes
          </Button>
        </div>

        {/* Background décoratif subtil */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-64 h-64 bg-brand-mint/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-48 h-48 bg-brand-accent/10 rounded-full blur-3xl" />
          </div>

        <div className="grid lg:grid-cols-3 gap-12 items-center relative z-10 pt-8">
          {/* Contenu texte - 2/3 */}
          <div className="lg:col-span-2 text-center lg:text-left animate-slide-up">
            <Badge variant="mint" size="lg" className="mb-6 inline-flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Student-first learning platform
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary mb-6 leading-tight">
              Apprends plus intelligemment.
              <span className="block text-brand-slate mt-2">Comprends les algorithmes clairement.</span>
          </h1>

            <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Un espace calme et convivial inspiré du cahier d'étudiant pour explorer les concepts d'IA 
              à travers des explications claires et des visualisations interactives.
          </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(ROUTES.CHATBOT)}
              icon={<ArrowRight className="w-5 h-5" />}
            >
                Commencer l'apprentissage
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate(ROUTES.DOCUMENTATION)}
                icon={<BookOpen className="w-5 h-5" />}
            >
                Explorer la documentation
            </Button>
            </div>

            {/* Tip Section */}
            <Card className="bg-brand-mint/20 border-l-4 border-brand-accent mb-6 inline-block">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-brand-accent" />
                <p className="text-sm font-medium text-text-primary">
                  Astuce : Petits pas, progression régulière.
                </p>
              </div>
            </Card>

            {/* Progress Section */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="mint" size="sm" className="flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  Série : {streak} jour{streak > 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary font-medium">Ta progression globale</span>
                  <span className="text-brand-slate font-semibold">{overallProgress}%</span>
                </div>
                <ProgressBar value={overallProgress} className="h-2" />
              </div>
            </div>
          </div>

          {/* Illustration - 1/3 */}
          <div className="hidden lg:block relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-mint/30 to-brand-accent/20 rounded-3xl transform rotate-6 blur-2xl" />
              <Card className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-brand-mint">
                <StudentIllustration />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-slide-up">
          <Badge variant="accent" size="md" className="mb-4">
            Modules interactifs
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Nos Modules IA
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Choisis un module pour commencer ton apprentissage. Chaque module est conçu pour être interactif et éducatif.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module, index) => (
            <div
              key={index}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <InteractiveCard
                icon={module.icon}
                title={module.title}
                description={module.description}
                buttonText="Découvrir"
                onButtonClick={() => navigate(module.route)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Card className="bg-white rounded-xl shadow-card p-8 md:p-12 animate-fade-in border-l-4 border-brand-mint relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-mint/10 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <div className="relative z-10">
            <div className="text-center mb-12">
              <Badge variant="mint" size="md" className="mb-4">
                Pourquoi nous choisir ?
              </Badge>
              <h3 className="text-3xl font-bold text-text-primary mb-4">
                Une expérience d'apprentissage unique
          </h3>
            </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
                <div key={index} className="flex space-x-4 group hover:bg-brand-mint/10 p-4 rounded-lg transition-all duration-200">
                <div className="flex-shrink-0">
                    <div className="bg-brand-mint p-3 rounded-lg text-brand-slate group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200">
                    {feature.icon}
                  </div>
                </div>
                <div>
                    <h4 className="text-lg font-semibold text-text-primary mb-2">
                    {feature.title}
                  </h4>
                    <p className="text-text-secondary">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Card className="bg-gradient-to-r from-brand-mint via-brand-mint/80 to-brand-surface rounded-xl shadow-card p-8 md:p-12 text-center animate-fade-in border-l-4 border-brand-accent relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl -ml-48 -mt-48" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-mint/20 rounded-full blur-3xl -mr-48 -mb-48" />
          
          <div className="relative z-10">
            <Sparkles className="w-12 h-12 text-brand-accent mx-auto mb-4 animate-pulse" />
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">
            Prêt à explorer l'IA ?
          </h3>
            <p className="text-xl mb-8 text-text-secondary max-w-2xl mx-auto">
              Commence dès maintenant ton aventure dans le monde de l'intelligence artificielle. 
              C'est gratuit et adapté à tous les niveaux !
          </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
                variant="primary"
            size="lg"
            onClick={() => navigate(ROUTES.CHATBOT)}
            icon={<Sparkles className="w-5 h-5" />}
          >
            Démarrer maintenant
          </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate(ROUTES.ALGORITHMS)}
                icon={<Brain className="w-5 h-5" />}
              >
                Voir les algorithmes
              </Button>
            </div>
        </div>
        </Card>
      </section>
    </div>
  );
};

export default HomePage;
