import React, { useRef, useState } from 'react';
import { Info, Loader as LoaderIcon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@components/common/Button';
import Modal from '@components/common/Modal';
import { ROUTES } from '@constants/routes';

const NeuralNetworkVisualizer = () => {
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [error, setError] = useState(null);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setError('Failed to load neural network visualization');
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      color: '#e2e8f0',
      fontFamily: "'Inter', sans-serif",
      padding: '2rem',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '1800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          marginBottom: '2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.HOME)}
              icon={<ArrowLeft className="w-5 h-5" />}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#e2e8f0',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                padding: '0.75rem',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
            </Button>
            <div>
              <h1 style={{
                fontSize: '3rem',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #00f5ff 0%, #ff00ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem',
                letterSpacing: '-0.05em'
              }}>
                NEURAL NETWORK VISUALIZATION
              </h1>
              <p style={{
                fontSize: '1.1rem',
                color: '#94a3b8',
              }}>
                Interactive MNIST MLP – Watch the network process handwritten digits in real-time
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowInfo(true)}
            icon={<Info className="w-5 h-5" />}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#e2e8f0',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            How it works
          </Button>
        </div>

        {/* Visualization Container */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '1rem',
          border: '2px solid rgba(0, 245, 255, 0.2)',
          boxShadow: '0 0 40px rgba(0, 245, 255, 0.1)',
          position: 'relative',
          height: 'calc(100vh - 200px)',
          minHeight: '600px'
        }}>
          {loading && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              zIndex: 10
            }}>
              <LoaderIcon className="w-12 h-12 animate-spin" style={{ color: '#00f5ff', margin: '0 auto' }} />
              <p style={{ marginTop: '1rem', color: '#94a3b8' }}>Loading visualization...</p>
            </div>
          )}

          {error && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              padding: '2rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '2px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px'
            }}>
              <p style={{ color: '#ef4444', fontSize: '1.1rem' }}>{error}</p>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src="/neural-network/index.html"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '12px',
              background: '#0a0f1e',
              display: loading ? 'none' : 'block'
            }}
            title="Neural Network Visualization"
          />
        </div>
      </div>

      {/* Info Modal */}
      <Modal
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        title="Neural Network Visualization - How it Works"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🧠 What is this?
            </h3>
            <p className="text-gray-600">
              This is an interactive visualization of a Multi-Layer Perceptron (MLP) neural network 
              trained on the MNIST dataset to recognize handwritten digits (0-9). You can see how the 
              network processes information layer by layer in real-time 3D.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ✏️ How to Use
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li><strong>Draw:</strong> Click and drag on the grid to draw a digit</li>
              <li><strong>Erase:</strong> Right-click and drag to erase</li>
              <li><strong>Rotate:</strong> Left click + drag on the 3D view to rotate</li>
              <li><strong>Pan:</strong> Right click + drag on the 3D view to pan</li>
              <li><strong>Zoom:</strong> Use scroll wheel to zoom in/out</li>
              <li><strong>Reset:</strong> Click the ✖ button to clear the canvas</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🎨 Understanding the Visualization
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>Nodes (Spheres):</strong> Represent neurons, colored by activation strength</li>
              <li>• <strong>Connections (Lines):</strong> Show weights between neurons</li>
              <li>• <strong>Warm Colors:</strong> Strong positive contributions</li>
              <li>• <strong>Cool Colors:</strong> Negative influences</li>
              <li>• <strong>Prediction Chart:</strong> Shows the network's confidence for each digit</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🔬 Network Architecture
            </h3>
            <p className="text-gray-600">
              The network consists of:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 mt-2">
              <li><strong>Input Layer:</strong> 784 neurons (28×28 pixel image)</li>
              <li><strong>Hidden Layers:</strong> Multiple layers of neurons processing features</li>
              <li><strong>Output Layer:</strong> 10 neurons (one for each digit 0-9)</li>
            </ul>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-800">
              <strong>Educational Tip:</strong> Try drawing different digits and observe how the 
              network's internal activations change. Notice how certain neurons "light up" for 
              specific features of each digit!
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NeuralNetworkVisualizer;