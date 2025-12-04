import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@context/AppContext';
import { UserProgressProvider } from '@context/UserProgressContext';
import { ROUTES } from '@constants/routes';

// Layout components
import Header from '@components/common/Header';
import Footer from '@components/common/Footer';
import { NotificationContainer } from '@components/common/Notification';
import OnboardingModal from '@components/onboarding/OnboardingModal';

// Pages
import HomePage from '@pages/HomePage';
import ChatbotPage from '@pages/ChatbotPage';
import ImageRecognitionPage from '@pages/ImageRecognitionPage';
import TextClassificationPage from '@pages/TextClassificationPage';
import DocumentationPage from '@pages/DocumentationPage';
import ExperimentationPage from '@pages/ExperimentationPage';
import AboutPage from '@pages/AboutPage';
import DecisionTreePage from '@pages/DecisionTreePage';
import KMeansPage from '@pages/KMeansPage';
import LinearRegressionPage from '@pages/LinearRegressionPage';
import NeuralNetworkPage from '@pages/NeuralNetworkPage';



// Hook pour les notifications
import { useApp } from '@context/AppContext';

const AppContent = () => {
  const { notifications, removeNotification, user, updateUserSettings } = useApp();
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  React.useEffect(() => {
    if (!user || !user.onboarded) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    updateUserSettings && updateUserSettings({ onboarded: true });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-16">
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.CHATBOT} element={<ChatbotPage />} />
          <Route path={ROUTES.IMAGE_RECOGNITION} element={<ImageRecognitionPage />} />
          <Route path={ROUTES.TEXT_CLASSIFICATION} element={<TextClassificationPage />} />
          <Route path={ROUTES.DOCUMENTATION} element={<DocumentationPage />} />
          <Route path={ROUTES.LinearRegressionPage} element={<LinearRegressionPage />} />

          <Route path={ROUTES.EXPERIMENTATION} element={<ExperimentationPage />} />
          <Route path={ROUTES.DecisionTreePage} element={<DecisionTreePage />} />
          <Route path={ROUTES.KMeansPage} element={<KMeansPage />} />
          <Route path={ROUTES.NeuralNetworkPage} element={<NeuralNetworkPage />} />


          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        </Routes>
      </main>

      <Footer />

      {/* Système de notifications */}
      <NotificationContainer 
        notifications={notifications}
        onRemove={removeNotification}
      />

      {/* Onboarding */}
      <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppProvider>
        <UserProgressProvider>
          <AppContent />
        </UserProgressProvider>
      </AppProvider>
    </Router>
  );
};

export default App;