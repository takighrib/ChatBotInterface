import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X, LogOut, User } from 'lucide-react';
import { NAV_ITEMS } from '@constants/routes';
import { useAuth } from '@context/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const onHome = location.pathname === '/';
  const headerClasses = onHome && !isScrolled
    ? 'bg-transparent'
    : 'bg-white/95 backdrop-blur border-b border-brand-grey/60 shadow-sm';

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-colors ${headerClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-brand-mint p-2 rounded-lg group-hover:shadow-md transition">
              <Sparkles className="w-6 h-6 text-brand-slate" />
            </div>
            <span className="text-2xl font-bold text-brand-slate">
              IA Jeunes
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  isActive(item.path)
                    ? 'bg-brand-mint text-text-primary'
                    : 'text-text-secondary hover:bg-brand-mint/40'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* User Menu Desktop */}
            {isAuthenticated ? (
              <div className="relative ml-4">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-brand-mint/20 hover:bg-brand-mint/40 transition"
                >
                  <User className="w-5 h-5 text-brand-slate" />
                  <span className="text-sm font-medium text-text-primary">
                    {user?.email?.split('@')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-brand-grey/20 py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-brand-grey/20">
                      <p className="text-sm font-medium text-text-primary">
                        {user?.email}
                      </p>
                      <p className="text-xs text-text-secondary">
                        Membre
                      </p>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg font-medium text-text-secondary hover:bg-brand-mint/40 transition"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg font-medium bg-brand-mint text-text-primary hover:shadow-md transition"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </nav>

          {/* Bouton Menu Mobile */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-brand-mint/30 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-brand-slate" />
            ) : (
              <Menu className="w-6 h-6 text-brand-slate" />
            )}
          </button>
        </div>

        {/* Navigation Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-brand-grey animate-fade-in">
            <nav className="flex flex-col space-y-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium transition ${
                    isActive(item.path)
                      ? 'bg-brand-mint text-text-primary'
                      : 'text-text-secondary hover:bg-brand-mint/40'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* User Menu Mobile */}
              {isAuthenticated ? (
                <div className="pt-4 mt-4 border-t border-brand-grey/20">
                  <div className="px-4 py-2 mb-2">
                    <p className="text-sm font-medium text-text-primary">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition flex items-center space-x-2"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 mt-4 border-t border-brand-grey/20 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg font-medium text-text-secondary hover:bg-brand-mint/40 transition"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg font-medium bg-brand-mint text-text-primary hover:shadow-md transition"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Fermer le menu utilisateur si on clique ailleurs */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;