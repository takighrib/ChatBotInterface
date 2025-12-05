import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Timeout de sécurité pour éviter que le loader reste affiché indéfiniment
  const [showLoader, setShowLoader] = React.useState(true);

  React.useEffect(() => {
    if (!loading) {
      setShowLoader(false);
    }
    // Timeout de sécurité : après 3 secondes, arrêter d'afficher le loader
    const timeout = setTimeout(() => {
      setShowLoader(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [loading]);

  if (loading && showLoader) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-paper">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent mx-auto mb-4"></div>
          <p className="text-text-secondary">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
