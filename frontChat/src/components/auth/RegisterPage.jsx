import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { UserPlus, Mail, Lock, Sparkles, BookOpen, CheckCircle } from 'lucide-react';
import { ROUTES } from '@constants/routes';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import Input from '@components/common/Input';
import Badge from '@components/common/Badge';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      await register(email, password);
      navigate(ROUTES.HOME);
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = password.length > 0 ? (
    password.length < 6 ? 'weak' : 
    password.length < 10 ? 'medium' : 'strong'
  ) : null;

  return (
    <div className="min-h-screen bg-brand-paper flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header avec logo et badge */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-gradient-to-br from-brand-accent to-brand-slate p-4 rounded-2xl shadow-lg">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">
            Inscription
          </h1>
          <p className="text-text-secondary">
            Créez votre compte pour commencer votre parcours d'apprentissage
          </p>
        </div>

        {/* Carte d'inscription */}
        <Card className="border-l-4 border-brand-accent animate-slide-up">
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
                minLength={6}
                icon={<Lock className="w-5 h-5" />}
              />
              {passwordStrength && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-brand-grey/40 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          passwordStrength === 'weak' ? 'bg-red-500 w-1/3' :
                          passwordStrength === 'medium' ? 'bg-yellow-500 w-2/3' :
                          'bg-green-500 w-full'
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength === 'weak' ? 'text-red-600' :
                      passwordStrength === 'medium' ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrength === 'weak' ? 'Faible' :
                       passwordStrength === 'medium' ? 'Moyen' :
                       'Fort'}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    Minimum 6 caractères
                  </p>
                </div>
              )}
            </div>

            <div>
              <Input
                type="password"
                label="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                icon={<Lock className="w-5 h-5" />}
              />
              {confirmPassword && password === confirmPassword && (
                <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Les mots de passe correspondent</span>
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading || password !== confirmPassword || password.length < 6}
              loading={loading}
              icon={<UserPlus className="w-5 h-5" />}
              className="w-full"
            >
              {loading ? 'Inscription...' : "S'inscrire"}
            </Button>
          </form>

          {/* Lien vers la connexion */}
          <div className="mt-6 pt-6 border-t border-brand-grey/40">
            <p className="text-center text-sm text-text-secondary">
              Déjà un compte ?{' '}
              <Link 
                to={ROUTES.LOGIN} 
                className="text-brand-accent font-semibold hover:text-brand-slate hover:underline transition"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </Card>

        {/* Avantages de l'inscription */}
        <Card className="mt-6 bg-brand-mint/20 border-l-4 border-brand-accent animate-fade-in">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-text-primary mb-2">✨ Avantages de l'inscription</h3>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Accès à tous les modules d'apprentissage</li>
                <li>• Suivi de votre progression</li>
                <li>• Historique de vos conversations</li>
                <li>• Badges et réalisations</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
