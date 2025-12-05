import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@context/AppContext';
import { UserProgressProvider } from '@context/UserProgressContext';
import { AuthProvider } from '@context/AuthContext';
import { ROUTES } from '@constants/routes';

// Layout
import Header from '@components/common/Header';
import Footer from '@components/common/Footer';
import { NotificationContainer } from '@components/common/Notification';
import OnboardingModal from '@components/onboarding/OnboardingModal';

// Auth components
import LoginPage from '@components/auth/LoginPage';
import RegisterPage from '@components/auth/RegisterPage';
import ProtectedRoute from '@components/auth/ProtectedRoute';

// Pages
import HomePage from '@pages/HomePage';
import ChatbotPage from '@pages/ChatbotPage';
import ImageRecognitionPage from '@pages/ImageRecognitionPage';
import TextClassificationPage from '@pages/TextClassificationPage';
import DocumentationPage from '@pages/DocumentationPage';
import ExperimentationPage from '@pages/ExperimentationPage';
import AlgorithmsPage from '@pages/AlgorithmsPage';
import AboutPage from '@pages/AboutPage';
import DecisionTreePage from '@pages/DecisionTreePage';
import KMeansPage from '@pages/KMeansPage';
import LinearRegressionPage from '@pages/LinearRegressionPage';
import NeuralNetworkPage from '@pages/NeuralNetworkPage';
import BlogPage from '@pages/BlogPage';
import BlogCreatePage from '@pages/BlogCreatePage';
import BlogArticlePage from '@pages/BlogArticlePage';
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
          {/* Routes publiques */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          
          {/* Routes Blog - publiques */}
          <Route path={ROUTES.BLOG} element={<BlogPage />} />
          <Route path={ROUTES.BLOG_ARTICLE} element={<BlogArticlePage />} />
          <Route path={ROUTES.BLOG_CREATE} element={
            <ProtectedRoute><BlogCreatePage /></ProtectedRoute>
          } />
          <Route path={ROUTES.BLOG_EDIT} element={
            <ProtectedRoute><BlogCreatePage /></ProtectedRoute>
          } />

          {/* Routes protégées */}
          <Route path={ROUTES.HOME} element={
            <ProtectedRoute><HomePage /></ProtectedRoute>
          } />
          <Route path={ROUTES.CHATBOT} element={
            <ProtectedRoute><ChatbotPage /></ProtectedRoute>
          } />
          <Route path={ROUTES.IMAGE_RECOGNITION} element={
            <ProtectedRoute><ImageRecognitionPage /></ProtectedRoute>
          } />
          <Route path={ROUTES.TEXT_CLASSIFICATION} element={
            <ProtectedRoute><TextClassificationPage /></ProtectedRoute>
          } />
          <Route path={ROUTES.DOCUMENTATION} element={
            <ProtectedRoute><DocumentationPage /></ProtectedRoute>
          } />
          <Route path={ROUTES.ALGORITHMS} element={
            <ProtectedRoute><AlgorithmsPage /></ProtectedRoute>
          } />
          <Route path={ROUTES.LINEAR_REGRESSION} element={
            <ProtectedRoute><LinearRegressionPage /></ProtectedRoute>
          } />
          <Route path={ROUTES.EXPERIMENTATION} element={
            <ProtectedRoute><ExperimentationPage /></ProtectedRoute>
          } />
          <Route path={ROUTES.DECISION_TREE} element={
            <ProtectedRoute><DecisionTreePage /></ProtectedRoute>
          } />
          <Route path={ROUTES.KMEANS} element={
            <ProtectedRoute><KMeansPage /></ProtectedRoute>
          } />
          <Route path={ROUTES.NEURAL_NETWORK} element={
            <ProtectedRoute><NeuralNetworkPage /></ProtectedRoute>
          } />
        </Routes>
      </main>

      <Footer />
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
      <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <UserProgressProvider>
            <AppContent />
          </UserProgressProvider>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;