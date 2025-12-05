import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { LogIn, Mail, Lock, Sparkles, BookOpen } from 'lucide-react';
import { ROUTES } from '@constants/routes';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import Input from '@components/common/Input';
import Badge from '@components/common/Badge';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(ROUTES.HOME);
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-paper flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header avec logo et badge */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-brand-mint to-brand-accent p-4 rounded-2xl shadow-lg">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            Connexion
          </h1>
          <p className="text-text-secondary">
            Connectez-vous à votre compte pour continuer votre apprentissage
          </p>
        </div>

        {/* Carte de connexion */}
        <Card className="border-l-4 border-brand-mint animate-slide-up">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                icon={<Mail className="w-5 h-5" />}
              />
            </div>

            <div>
              <Input
                type="password"
                label="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                icon={<Lock className="w-5 h-5" />}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              loading={loading}
              icon={<LogIn className="w-5 h-5" />}
              className="w-full"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          {/* Lien vers l'inscription */}
          <div className="mt-6 pt-6 border-t border-brand-grey/40">
            <p className="text-center text-sm text-text-secondary">
              Pas encore de compte ?{' '}
              <Link 
                to={ROUTES.REGISTER} 
                className="text-brand-accent font-semibold hover:text-brand-slate hover:underline transition"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </Card>

        {/* Conseils */}
        <Card className="mt-6 bg-brand-mint/20 border-l-4 border-brand-accent animate-fade-in">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-text-primary mb-1">💡 Astuce</h3>
              <p className="text-sm text-text-secondary">
                Utilisez votre email et mot de passe pour accéder à tous les modules d'apprentissage.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
