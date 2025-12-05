import React, { useEffect, useMemo, useState } from 'react';
import { MessageSquare, Info, BookOpen, Lightbulb, Sparkles } from 'lucide-react';
import ChatInterface from '@components/modules/chatbot/ChatInterface';
import ChatHistorySidebar from '@components/modules/chatbot/ChatHistorySidebar';
import { chatSessions } from '@services/storage/chatSessions';
import { storageService } from '@services/storage/localStorage';
import { STORAGE_KEYS } from '@constants/config';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import Modal from '@components/common/Modal';
import { chatbotAPI } from '@services/api/chatbotAPI';

const ChatbotPage = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [localChats, setLocalChats] = useState([]);
  const [remoteHistories, setRemoteHistories] = useState([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [historyView, setHistoryView] = useState(null);
  const [historyListLoading, setHistoryListLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  // Load sessions on mount
  useEffect(() => {
    setLocalChats(chatSessions.getAll());
    refreshHistoryList();
  }, []);

  const refreshHistoryList = async () => {
    setHistoryListLoading(true);
    const result = await chatbotAPI.listHistories();
    if (result.success) {
      setRemoteHistories(result.data);
    } else {
      console.error(result.message);
    }
    setHistoryListLoading(false);
  };

  const combinedChats = useMemo(() => {
    const remote = remoteHistories.map((entry) => ({
      id: entry.id,
      title: entry.topic || 'Sujet inconnu',
      topic: entry.topic,
      lastMessage: entry.lastMessage || entry.status || 'Historique sauvegardé',
      updatedAt: entry.timestamp,
      source: 'remote',
      sourceLabel: 'MongoDB'
    }));

    const locals = localChats.map((session) => ({
      id: session.id,
      title: session.title || 'Conversation locale',
      lastMessage: 'Session locale en cours',
      updatedAt: session.timestamp,
      source: 'local'
    }));

    return [...remote, ...locals];
  }, [remoteHistories, localChats]);

  const mapHistoryMessages = (history) => {
    const base = history.timestamp ? new Date(history.timestamp).getTime() : Date.now();
    return (history.messages || []).map((msg, index) => ({
      id: `${history.id}-${index}`,
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.message || '',
      timestamp: new Date(base + index * 60000).toISOString()
    }));
  };

  const handleNewChat = () => {
    // Prevent creating a new chat if current is empty (no user messages)
    if (selectedChatId) {
      const history = storageService.getItem(`${STORAGE_KEYS.CHAT_HISTORY}:${selectedChatId}`) || [];
      const hasUser = Array.isArray(history) && history.some((m) => m.role === 'user');
      if (!hasUser) return; // block creation
    }

    const session = chatSessions.create('Nouvelle conversation');
    setLocalChats(chatSessions.getAll());
    setSelectedChatId(session.id);
    setSelectedHistoryId(null);
    setHistoryView(null);
    setHistoryError(null);
  };

  const handleSelectChat = (id) => {
    const remote = remoteHistories.find((entry) => entry.id === id);
    if (remote) {
      setSelectedHistoryId(id);
      setSelectedChatId(null);
      setHistoryView({ id, topic: remote.topic, messages: [] });
      setHistoryError(null);
      loadHistory(id);
      return;
    }

    setSelectedHistoryId(null);
    setHistoryView(null);
    setHistoryError(null);
    setSelectedChatId(id);
    chatSessions.touch(id);
    setLocalChats(chatSessions.getAll());
  };

  const loadHistory = async (historyId) => {
    setHistoryError(null);
    setHistoryLoading(true);
    const result = await chatbotAPI.getHistoryById(historyId);
    if (result.success) {
      setHistoryView({
        id: historyId,
        topic: result.data.topic,
        messages: mapHistoryMessages(result.data)
      });
    } else {
      setHistoryView(null);
      setHistoryError(result.message);
    }
    setHistoryLoading(false);
  };

  const exitHistoryMode = () => {
    setSelectedHistoryId(null);
    setHistoryView(null);
    setHistoryError(null);
  };

  return (
    <div className="min-h-screen bg-brand-paper py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-brand-mint to-brand-accent p-3 rounded-xl shadow-lg">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
                  Chatbot Intelligent
                </h1>
                <p className="text-text-secondary mt-1">
                  Discute avec l'IA et découvre comment elle comprend tes questions
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

          {/* Conseils rapides */}
          <Card className="bg-brand-mint/20 border-l-4 border-brand-accent">
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-text-primary mb-2">💡 Conseils pour discuter</h3>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Pose des questions sur l'IA, le machine learning, ou les technologies</li>
                  <li>• Sois clair et précis dans tes questions</li>
                  <li>• N'hésite pas à demander des explications supplémentaires</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Interface du chat */}
        <div className="animate-slide-up">
          <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-220px)]">
            <div className="h-full">
              <ChatHistorySidebar
                chats={combinedChats}
                selectedChatId={selectedHistoryId || selectedChatId}
                onSelectChat={handleSelectChat}
                onNewChat={handleNewChat}
                loading={historyListLoading && combinedChats.length === 0}
                onRefreshHistory={refreshHistoryList}
                refreshing={historyListLoading}
              />
            </div>

            <div className="flex-1">
              <ChatInterface
                sessionId={selectedChatId}
                historyView={historyView}
                historyLoading={historyLoading}
                historyError={historyError}
                onExitHistory={exitHistoryMode}
              />
            </div>
          </div>
        </div>

        {/* Cartes d'information en bas */}
        <div className="grid md:grid-cols-3 gap-6 mt-8 animate-fade-in">
          <Card className="border-l-4 border-brand-mint">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-brand-mint/20 p-2 rounded-lg">
                <MessageSquare className="w-5 h-5 text-brand-slate" />
              </div>
              <h3 className="font-semibold text-text-primary">Traitement du langage</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Le chatbot utilise le NLP (Natural Language Processing) pour comprendre et générer du texte naturel.
            </p>
          </Card>

          <Card className="border-l-4 border-brand-accent">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-brand-accent/20 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-brand-accent" />
              </div>
              <h3 className="font-semibold text-text-primary">Apprentissage continu</h3>
            </div>
            <p className="text-sm text-text-secondary">
              L'IA s'améliore constamment grâce aux interactions et aux nouvelles données d'entraînement.
            </p>
          </Card>

          <Card className="border-l-4 border-brand-mint">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-brand-mint/20 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-brand-slate" />
              </div>
              <h3 className="font-semibold text-text-primary">Contexte conversationnel</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Le chatbot se souvient du contexte de la conversation pour donner des réponses cohérentes.
            </p>
          </Card>
        </div>
      </div>

      {/* Modal d'information */}
      <Modal
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        title="Comment fonctionne le Chatbot ?"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              🤖 Qu'est-ce qu'un chatbot ?
            </h3>
            <p className="text-text-secondary">
              Un chatbot est un programme informatique conçu pour simuler une conversation avec des utilisateurs humains. 
              Il utilise l'intelligence artificielle pour comprendre les questions et générer des réponses pertinentes.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              🧠 Comment ça fonctionne ?
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-text-secondary">
              <li>Tu poses une question ou fais une déclaration</li>
              <li>L'IA analyse ton message pour en comprendre le sens</li>
              <li>Elle recherche la meilleure réponse dans ses connaissances</li>
              <li>Elle génère une réponse naturelle et contextuelle</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              💡 Technologies utilisées
            </h3>
            <ul className="space-y-2 text-text-secondary">
              <li>• <strong>NLP</strong> : Traitement du langage naturel</li>
              <li>• <strong>Machine Learning</strong> : Apprentissage automatique</li>
              <li>• <strong>Réseaux de neurones</strong> : Pour la compréhension profonde</li>
            </ul>
          </div>

          <Card className="bg-brand-mint/20 border-l-4 border-brand-accent">
            <p className="text-sm text-text-secondary">
              <strong>Note :</strong> Ce chatbot est en mode démonstration. Dans une version complète, 
              il serait connecté à un modèle d'IA avancé comme GPT ou Claude pour des conversations plus riches.
            </p>
          </Card>
        </div>
      </Modal>
    </div>
  );
};

export default ChatbotPage;
