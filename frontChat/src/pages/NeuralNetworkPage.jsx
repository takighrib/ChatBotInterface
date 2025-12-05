import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft, Info, Sparkles } from 'lucide-react';
import { ROUTES } from '@constants/routes';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import Modal from '@components/common/Modal';
import NeuralNetworkViz from '@components/algorithms/NeuralNetworkViz';

const NeuralNetworkPage = () => {
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="min-h-screen bg-brand-paper">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-brand-grey/60 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-3 rounded-xl shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
                  Réseau de Neurones
                </h1>
                <p className="text-text-secondary text-sm mt-1">
                  Visualisation interactive MNIST MLP en temps réel
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowInfo(true)}
                icon={<Info className="w-5 h-5" />}
              >
                Comment ça marche ?
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
      </div>

      {/* Visualisation Interactive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NeuralNetworkViz />
      </div>

      {/* Modal d'information */}
      <Modal
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        title="Réseau de Neurones - Visualisation Interactive"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              🧠 Qu'est-ce que cette visualisation ?
            </h3>
            <p className="text-text-secondary">
              Cette application montre un Multi-Layer Perceptron (MLP) compact entraîné sur le dataset MNIST. 
              Dessinez un chiffre et observez les activations se propager à travers toutes les couches connectées en temps réel 3D.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              ✏️ Comment utiliser
            </h3>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li><strong>Dessiner :</strong> Cliquez et glissez sur la grille 2D (en haut à gauche) pour dessiner un chiffre</li>
              <li><strong>Effacer :</strong> Clic droit et glissez pour effacer</li>
              <li><strong>Observer :</strong> Regardez votre dessin traverser les couches du réseau en 3D</li>
              <li><strong>Prédiction :</strong> Vérifiez la probabilité pour chaque chiffre (0-9) dans le graphique (en haut à droite)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              🎨 Architecture du Réseau
            </h3>
            <ul className="list-disc list-inside space-y-1 text-text-secondary">
              <li><strong>Couche d'entrée :</strong> Grille de 28×28 pixels (votre dessin)</li>
              <li><strong>Couche Dense 1 :</strong> 784 → 64 neurones avec ReLU</li>
              <li><strong>Couche Dense 2 :</strong> 64 → 32 neurones avec ReLU</li>
              <li><strong>Couche de sortie :</strong> 32 → 10 logits → Probabilités Softmax</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              🎮 Contrôles 3D
            </h3>
            <ul className="list-disc list-inside space-y-1 text-text-secondary">
              <li><strong>Rotation :</strong> Maintenez le bouton gauche de la souris et glissez</li>
              <li><strong>Déplacement :</strong> Maintenez le bouton droit de la souris et glissez</li>
              <li><strong>Zoom :</strong> Utilisez la molette de la souris</li>
              <li><strong>Réinitialiser :</strong> Cliquez sur le bouton ✖ pour effacer le canvas</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              🎨 Codage des couleurs
            </h3>
            <ul className="list-disc list-inside space-y-1 text-text-secondary">
              <li><strong>Nœuds (Sphères) :</strong> La couleur indique la force d'activation (bleus foncés pour valeurs faibles/négatives, coraux vifs pour activations positives fortes)</li>
              <li><strong>Connexions (Lignes) :</strong> Les couleurs chaudes indiquent des contributions positives fortes, les tons froids des influences négatives, les lignes atténuées près de zéro</li>
              <li><strong>Graphique de prédiction :</strong> Affiche la confiance du réseau pour chaque chiffre</li>
            </ul>
          </div>

          <Card className="bg-brand-mint/20 border-l-4 border-brand-accent">
            <p className="text-sm text-text-secondary">
              <strong>💡 Astuce pédagogique :</strong> Essayez de dessiner différents chiffres et observez comment 
              les activations internes du réseau changent. Remarquez comment certains neurones "s'allument" pour 
              des caractéristiques spécifiques de chaque chiffre !
            </p>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

export default NeuralNetworkPage;
