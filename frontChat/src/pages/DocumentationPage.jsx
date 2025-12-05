import React, { useState } from 'react';
import { BookOpen, Brain, Network, MessageCircle, Eye, FolderTree, ChevronRight, Sparkles } from 'lucide-react';
import { AI_CONCEPTS } from '@constants/aiConcepts';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import Modal from '@components/common/Modal';

const DocumentationPage = () => {
  const [selectedConcept, setSelectedConcept] = useState(null);

  const iconMap = {
    Brain: Brain,
    Network: Network,
    MessageCircle: MessageCircle,
    Eye: Eye,
    FolderTree: FolderTree
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'débutant':
        return 'success';
      case 'intermédiaire':
        return 'accent';
      case 'avancé':
        return 'danger';
      default:
        return 'mint';
    }
  };

  return (
    <div className="min-h-screen bg-brand-paper py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="bg-brand-mint/30 p-4 rounded-full">
              <BookOpen className="w-16 h-16 text-brand-accent" />
            </div>
          </div>
          <Badge variant="mint" size="lg" className="mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Documentation IA
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4">
            Apprends les Concepts IA
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Découvre les concepts fondamentaux de l'intelligence artificielle à travers des explications simples et illustrées
          </p>
        </div>

        {/* Section Introduction */}
        <Card className="mb-8 border-l-4 border-brand-mint animate-slide-up">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            🚀 Qu'est-ce que l'Intelligence Artificielle ?
          </h2>
          <p className="text-text-secondary mb-4">
            L'Intelligence Artificielle (IA) est la capacité d'une machine à imiter l'intelligence humaine. 
            Elle permet aux ordinateurs d'apprendre, de raisonner, de résoudre des problèmes et de prendre des décisions.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <Card className="bg-brand-mint/20 border-l-4 border-brand-mint">
              <h3 className="font-semibold text-text-primary mb-2">Apprentissage</h3>
              <p className="text-sm text-text-secondary">L'IA peut apprendre à partir de données et d'expériences</p>
            </Card>
            <Card className="bg-brand-accent/10 border-l-4 border-brand-accent">
              <h3 className="font-semibold text-text-primary mb-2">Adaptation</h3>
              <p className="text-sm text-text-secondary">Elle s'améliore avec le temps et s'adapte à de nouvelles situations</p>
            </Card>
            <Card className="bg-brand-mint/20 border-l-4 border-brand-mint">
              <h3 className="font-semibold text-text-primary mb-2">Autonomie</h3>
              <p className="text-sm text-text-secondary">Elle peut prendre des décisions sans intervention humaine constante</p>
            </Card>
          </div>
        </Card>

        {/* Concepts IA */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-6 animate-fade-in">
            📚 Concepts Clés
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AI_CONCEPTS.map((concept, index) => {
              const IconComponent = iconMap[concept.icon];
              
              return (
                <Card
                  key={concept.id}
                  className="h-full cursor-pointer hover:shadow-xl transition-all duration-300 border-l-4 border-brand-mint animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedConcept(concept)}
                  >
                    <div className="flex items-start justify-between mb-4">
                    <div className="bg-brand-mint p-3 rounded-lg">
                      {IconComponent && <IconComponent className="w-6 h-6 text-brand-slate" />}
                      </div>
                    <Badge variant={getLevelColor(concept.level)} size="sm">
                        {concept.level}
                    </Badge>
                    </div>
                    
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                      {concept.title}
                    </h3>
                    
                  <p className="text-text-secondary mb-4 text-sm">
                      {concept.description}
                    </p>
                    
                  <div className="flex items-center text-brand-accent font-semibold text-sm">
                      En savoir plus
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </Card>
              );
            })}
          </div>
        </div>

        {/* Ressources supplémentaires */}
        <Card className="bg-gradient-to-r from-brand-mint to-brand-surface border-l-4 border-brand-accent animate-fade-in">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            🎓 Ressources d'apprentissage
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-white/60 backdrop-blur-sm border-l-4 border-brand-mint">
              <h3 className="font-semibold text-text-primary mb-2">Tutoriels interactifs</h3>
              <p className="text-sm text-text-secondary">
                Des guides pas à pas pour chaque module avec des exemples concrets
              </p>
            </Card>
            <Card className="bg-white/60 backdrop-blur-sm border-l-4 border-brand-accent">
              <h3 className="font-semibold text-text-primary mb-2">Vidéos explicatives</h3>
              <p className="text-sm text-text-secondary">
                Des vidéos courtes qui expliquent les concepts complexes simplement
              </p>
            </Card>
            <Card className="bg-white/60 backdrop-blur-sm border-l-4 border-brand-mint">
              <h3 className="font-semibold text-text-primary mb-2">Exercices pratiques</h3>
              <p className="text-sm text-text-secondary">
                Mets en pratique ce que tu as appris avec nos modules interactifs
              </p>
            </Card>
            <Card className="bg-white/60 backdrop-blur-sm border-l-4 border-brand-accent">
              <h3 className="font-semibold text-text-primary mb-2">Quiz et évaluations</h3>
              <p className="text-sm text-text-secondary">
                Teste tes connaissances et suis ta progression (bientôt disponible)
              </p>
            </Card>
          </div>
        </Card>
      </div>

      {/* Modal de détail du concept */}
      {selectedConcept && (
        <Modal
          isOpen={!!selectedConcept}
          onClose={() => setSelectedConcept(null)}
          title={selectedConcept.title}
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant={getLevelColor(selectedConcept.level)} size="sm">
                Niveau: {selectedConcept.level}
              </Badge>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Description
              </h3>
              <p className="text-text-secondary">
                {selectedConcept.content}
              </p>
            </div>

            <Card className="bg-brand-mint/20 border-l-4 border-brand-accent">
              <h4 className="font-semibold text-text-primary mb-2">
                💡 En pratique
              </h4>
              <p className="text-sm text-text-secondary">
                Tu peux voir ce concept en action dans nos modules interactifs. 
                Essaie-les pour mieux comprendre !
              </p>
            </Card>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DocumentationPage;
