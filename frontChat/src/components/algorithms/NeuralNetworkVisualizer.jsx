import React, { useRef, useState, useEffect } from 'react';
import { Loader as LoaderIcon } from 'lucide-react';
import Card from '@components/common/Card';

const NeuralNetworkVisualizer = () => {
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Vérifier si le fichier existe après un court délai
    const timer = setTimeout(() => {
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        iframe.onload = () => {
    setLoading(false);
          setError(null);
  };
        iframe.onerror = () => {
          setError('Impossible de charger la visualisation. Vérifiez que tous les fichiers sont présents.');
    setLoading(false);
  };
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full" style={{ minHeight: 'calc(100vh - 200px)' }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-paper z-10">
          <div className="text-center">
            <LoaderIcon className="w-12 h-12 animate-spin text-brand-accent mx-auto mb-4" />
            <p className="text-text-secondary">Chargement de la visualisation...</p>
          </div>
            </div>
          )}

          {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-paper z-10">
          <Card className="bg-red-50 border-l-4 border-red-500 p-6 max-w-md">
            <p className="text-red-700 font-semibold mb-2">Erreur de chargement</p>
            <p className="text-red-600 text-sm">{error}</p>
          </Card>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src="/neural-network/index.html"
            style={{
              width: '100%',
          height: 'calc(100vh - 200px)',
          minHeight: '800px',
              border: 'none',
          display: loading || error ? 'none' : 'block'
            }}
            title="Neural Network Visualization"
        allow="fullscreen"
      />
    </div>
  );
};

export default NeuralNetworkVisualizer;
