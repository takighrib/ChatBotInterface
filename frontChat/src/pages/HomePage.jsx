import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MessageSquare, Image, FileText, BookOpen, Lightbulb, ArrowRight } from 'lucide-react';
import { ROUTES } from '@constants/routes';
import { InteractiveCard } from '@components/common/Card';
import Button from '@components/common/Button';
import KMeansPage from '@pages/KMeansPage';

const HomePage = () => {
  const navigate = useNavigate();

  const modules = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Chatbot Intelligent",
      description: "Discute avec une IA et découvre comment elle comprend tes questions",
      color: "from-blue-500 to-cyan-500",
      route: ROUTES.CHATBOT
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Clustering K-Means",
      description: "Visualise comment K-Means regroupe les données en clusters",
      color: "from-orange-500 to-yellow-500",
      route: ROUTES.KMeansPage
    },

    {
      icon: <Image className="w-8 h-8" />,
      title: "Reconnaissance d'Image",
      description: "Télécharge des images et vois comment l'IA les identifie",
      color: "from-purple-500 to-pink-500",
      route: ROUTES.IMAGE_RECOGNITION
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Classification de Texte",
      description: "Analyse des textes et comprends comment l'IA les classe",
      color: "from-green-500 to-teal-500",
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
      icon: <FileText className="w-6 h-6" />,
      title: "Suivi de Progression",
      description: "Sauvegarde tes expériences et observe tes progrès"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-semibold text-gray-700">Plateforme d'apprentissage IA</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Découvre l'Intelligence
            <span className="block gradient-text">Artificielle</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Explore, expérimente et apprends comment fonctionne l'IA à travers des modules interactifs et ludiques !
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(ROUTES.CHATBOT)}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Commencer l'aventure
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate(ROUTES.DOCUMENTATION)}
            >
              En savoir plus
            </Button>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Modules IA
          </h2>
          <p className="text-lg text-gray-600">
            Choisis un module pour commencer ton apprentissage
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
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
      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 animate-fade-in">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Pourquoi apprendre avec nous ?
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                    {feature.icon}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à explorer l'IA ?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Commence dès maintenant ton aventure dans le monde de l'intelligence artificielle
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate(ROUTES.CHATBOT)}
            icon={<Sparkles className="w-5 h-5" />}
          >
            Démarrer maintenant
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;