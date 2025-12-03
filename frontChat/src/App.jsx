import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@context/AppContext';
import { UserProgressProvider } from '@context/UserProgressContext';
import { ROUTES } from '@constants/routes';

// Layout components
import Header from '@components/common/Header';
import Footer from '@components/common/Footer';
import { NotificationContainer } from '@components/common/Notification';

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



// Hook pour les notifications
import { useApp } from '@context/AppContext';

const AppContent = () => {
  const { notifications, removeNotification } = useApp();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
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


          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        </Routes>
      </main>

      <Footer />

      {/* Système de notifications */}
      <NotificationContainer 
        notifications={notifications}
        onRemove={removeNotification}
      />
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