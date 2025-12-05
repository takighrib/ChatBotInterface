import React, { useState } from 'react';
import { FileText, Info, Brain, TrendingUp, Target, Sparkles } from 'lucide-react';
import TextInput from '@components/modules/textClassification/TextInput';
import ClassificationResult from '@components/modules/textClassification/ClassificationResult';
import TextInterpretationVisualizer from '@components/modules/textClassification/TextInterpretationVisualizer';
import { useTextClassification } from '@hooks/useTextClassification';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import Modal from '@components/common/Modal';
import Notification from '@components/common/Notification';

const TextClassificationPage = () => {
  const {
    text,
    setText,
    sentimentResult,
    themeResult,
    loading,
    error,
    analyzeComplete,
    reset
  } = useTextClassification();

  const [showInfo, setShowInfo] = useState(false);

  const handleAnalyze = async () => {
    await analyzeComplete();
  };

  return (
    <div className="min-h-screen bg-brand-paper py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-brand-mint p-3 rounded-xl shadow-lg">
                <FileText className="w-8 h-8 text-brand-slate" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
                  Classification de Texte
                </h1>
                <p className="text-text-secondary mt-1">
                  Analyse le sentiment et les thèmes de n'importe quel texte
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowInfo(true)}
              icon={<Info className="w-5 h-5" />}
            >
              Comment ça marche ?
            </Button>
          </div>
        </div>

        {/* Notification d'erreur */}
        {error && (
          <div className="mb-6">
            <Notification type="error" message={error} />
          </div>
        )}

        {/* Contenu principal */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Colonne gauche - Input */}
          <div className="space-y-6 animate-slide-up">
            <Card className="border-l-4 border-brand-mint">
              <TextInput
                text={text}
                onChange={(e) => setText(e.target.value)}
                onAnalyze={handleAnalyze}
                loading={loading}
              />
            </Card>

            {(sentimentResult || themeResult) && (
              <Card className="border-l-4 border-brand-grey">
                <Button
                  variant="outline"
                  onClick={reset}
                  className="w-full"
                >
                  Analyser un autre texte
                </Button>
              </Card>
            )}

            {/* Info rapide */}
            <Card className="bg-brand-mint/20 border-l-4 border-brand-accent">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">
                    💡 Ce que l'IA analyse
                  </h3>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• <strong>Sentiment</strong> : Positif, négatif ou neutre</li>
                    <li>• <strong>Thèmes</strong> : Catégories principales du texte</li>
                    <li>• <strong>Mots-clés</strong> : Termes importants identifiés</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Colonne droite - Résultats */}
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            {loading && (
              <Card className="text-center border-l-4 border-brand-mint">
                <div className="inline-block bg-brand-mint p-4 rounded-full mb-4 animate-pulse">
                  <Brain className="w-12 h-12 text-brand-slate" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Analyse en cours...
                </h3>
                <p className="text-text-secondary">
                  L'IA examine ton texte
                </p>
              </Card>
            )}

            {!loading && !sentimentResult && !themeResult && (
              <Card className="text-center border-l-4 border-brand-grey">
                <FileText className="w-16 h-16 text-brand-grey mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  Aucun texte analysé
                </h3>
                <p className="text-text-secondary">
                  Entre un texte et clique sur "Analyser" pour voir les résultats
                </p>
              </Card>
            )}

            {(sentimentResult || themeResult) && (
              <Card className="border-l-4 border-brand-accent">
                <ClassificationResult
                  sentimentResult={sentimentResult}
                  themeResult={themeResult}
                />
              </Card>
            )}
          </div>
        </div>

        {/* AI Interpretation Visualizer */}
        <div className="mt-8 animate-fade-in">
          <TextInterpretationVisualizer isActive={true} sampleText={text || "L'intelligence artificielle transforme notre monde"} />
        </div>

        {/* Cartes d'information en bas */}
        <div className="grid md:grid-cols-3 gap-6 mt-8 animate-fade-in">
          <Card className="border-l-4 border-brand-mint">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-brand-mint p-2 rounded-lg">
                <Brain className="w-5 h-5 text-brand-slate" />
              </div>
              <h3 className="font-semibold text-text-primary">NLP - Traitement du langage</h3>
            </div>
            <p className="text-sm text-text-secondary">
              L'IA utilise le traitement du langage naturel pour comprendre le sens et le contexte du texte.
            </p>
          </Card>

          <Card className="border-l-4 border-brand-accent">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-brand-accent/20 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-brand-accent" />
              </div>
              <h3 className="font-semibold text-text-primary">Analyse de sentiment</h3>
            </div>
            <p className="text-sm text-text-secondary">
              L'IA détecte les émotions exprimées dans le texte : joie, tristesse, colère, neutralité.
            </p>
          </Card>

          <Card className="border-l-4 border-brand-mint">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-brand-mint p-2 rounded-lg">
                <Target className="w-5 h-5 text-brand-slate" />
              </div>
              <h3 className="font-semibold text-text-primary">Classification thématique</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Le texte est catégorisé selon son contenu : technologie, sport, politique, etc.
            </p>
          </Card>
        </div>
      </div>

      {/* Modal d'information */}
      <Modal
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        title="Comment fonctionne la classification de texte ?"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              📝 Traitement du Langage Naturel (NLP)
            </h3>
            <p className="text-text-secondary">
              Le NLP permet aux machines de comprendre, interpréter et manipuler le langage humain. 
              C'est une branche de l'IA qui combine linguistique et informatique.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              🔄 Processus d'analyse
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-text-secondary">
              <li>Le texte est tokenisé (découpé en mots/phrases)</li>
              <li>Chaque mot est analysé et contextualisé</li>
              <li>L'IA identifie les patterns linguistiques</li>
              <li>Les émotions et thèmes sont extraits</li>
              <li>Un score de confiance est calculé</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              🎯 Types d'analyse
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-text-primary mb-1">Analyse de sentiment</h4>
                <p className="text-sm text-text-secondary">
                  Détermine si le texte exprime une opinion positive, négative ou neutre. 
                  Utile pour analyser des avis, des commentaires ou des retours clients.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-1">Classification thématique</h4>
                <p className="text-sm text-text-secondary">
                  Catégorise le texte selon son sujet principal (sport, technologie, politique, etc.). 
                  Permet d'organiser automatiquement de grandes quantités de textes.
                </p>
              </div>
            </div>
          </div>

          <Card className="bg-brand-mint/20 border-l-4 border-brand-accent">
            <p className="text-sm text-text-secondary">
              <strong>Note :</strong> Les modèles de NLP sont entraînés sur d'énormes corpus de textes 
              pour apprendre les nuances du langage, l'ironie, le sarcasme et les expressions idiomatiques.
            </p>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

export default TextClassificationPage;
