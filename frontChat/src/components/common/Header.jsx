import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Menu, X, LogOut, User, Brain, ChevronDown } from 'lucide-react';
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
    : 'bg-white/95 backdrop-blur-md border-b border-brand-grey/60 shadow-sm';

  // Logo SVG personnalisé - Cahier avec IA
  const LogoIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cahier */}
      <rect x="4" y="6" width="20" height="24" rx="2" fill="#BBD5D0" stroke="#2F4F4F" strokeWidth="1.5"/>
      {/* Lignes du cahier */}
      <line x1="8" y1="12" x2="20" y2="12" stroke="#2F4F4F" strokeWidth="1" opacity="0.6"/>
      <line x1="8" y1="16" x2="20" y2="16" stroke="#2F4F4F" strokeWidth="1" opacity="0.6"/>
      <line x1="8" y1="20" x2="18" y2="20" stroke="#2F4F4F" strokeWidth="1" opacity="0.6"/>
      {/* Spirale */}
      <path d="M4 6 Q4 4 6 4 Q8 4 8 6" stroke="#2F4F4F" strokeWidth="1.5" fill="none"/>
      <path d="M4 10 Q4 8 6 8 Q8 8 8 10" stroke="#2F4F4F" strokeWidth="1.5" fill="none"/>
      {/* Icône IA (cercles connectés) */}
      <circle cx="18" cy="14" r="2.5" fill="#D9822B"/>
      <circle cx="22" cy="18" r="2" fill="#D9822B"/>
      <circle cx="20" cy="22" r="1.5" fill="#D9822B"/>
      <line x1="19.5" y1="15.5" x2="21" y2="17.5" stroke="#D9822B" strokeWidth="1.5"/>
      <line x1="21.5" y1="19" x2="20.5" y2="21" stroke="#D9822B" strokeWidth="1.5"/>
    </svg>
  );

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${headerClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo amélioré */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="bg-brand-mint p-2 rounded-xl group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 border-2 border-brand-mint/50">
                <LogoIcon />
              </div>
              {/* Effet de brillance au hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-brand-slate group-hover:text-brand-accent transition-colors duration-300">
                EduAI
              </span>
              <span className="text-xs text-text-secondary -mt-1 font-medium">
                Apprendre l'IA
            </span>
            </div>
          </Link>

          {/* Navigation Desktop améliorée */}
          <nav className="hidden lg:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${isActive(item.path)
                    ? 'bg-brand-mint text-brand-slate shadow-sm'
                    : 'text-text-secondary hover:text-brand-slate hover:bg-brand-mint/30'
                  }
                  group
                `}
              >
                <span className="relative z-10">{item.name}</span>
                {/* Indicateur actif animé */}
                {isActive(item.path) && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-brand-accent rounded-full animate-pulse" />
                )}
                {/* Effet hover */}
                <span className="absolute inset-0 bg-brand-mint/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200 opacity-0 group-hover:opacity-100" />
              </Link>
            ))}

            {/* User Menu Desktop amélioré */}
            {isAuthenticated ? (
              <div className="relative ml-4">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-brand-mint/20 hover:bg-brand-mint/40 transition-all duration-200 hover:shadow-md group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-accent to-brand-slate flex items-center justify-center text-white font-semibold text-sm">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-text-primary hidden xl:block">
                    {user?.email?.split('@')[0] || 'Utilisateur'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-brand-slate transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu amélioré */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-brand-grey/20 py-2 animate-fade-in overflow-hidden">
                    <div className="px-4 py-3 border-b border-brand-grey/20 bg-gradient-to-r from-brand-mint/10 to-transparent">
                      <p className="text-sm font-semibold text-text-primary">
                        {user?.email}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Membre actif
                      </p>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center space-x-2 group"
                    >
                      <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg font-medium text-text-secondary hover:bg-brand-mint/40 hover:text-brand-slate transition-all duration-200"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg font-semibold bg-brand-accent text-white hover:bg-brand-accent/90 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </nav>

          {/* Bouton Menu Mobile amélioré */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-brand-mint/30 transition-all duration-200 active:scale-95"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-brand-slate" />
            ) : (
              <Menu className="w-6 h-6 text-brand-slate" />
            )}
          </button>
        </div>

        {/* Navigation Mobile améliorée */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-brand-grey animate-slide-up bg-white/98 backdrop-blur-md">
            <nav className="flex flex-col space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    px-4 py-3 rounded-lg font-medium transition-all duration-200
                    ${isActive(item.path)
                      ? 'bg-brand-mint text-brand-slate shadow-sm'
                      : 'text-text-secondary hover:bg-brand-mint/40'
                    }
                  `}
                >
                  {item.name}
                </Link>
              ))}

              {/* User Menu Mobile */}
              {isAuthenticated ? (
                <div className="pt-4 mt-4 border-t border-brand-grey/20">
                  <div className="px-4 py-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-accent to-brand-slate flex items-center justify-center text-white font-semibold">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {user?.email?.split('@')[0] || 'Utilisateur'}
                        </p>
                        <p className="text-xs text-text-secondary">
                      {user?.email}
                    </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center space-x-2"
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
                    className="block px-4 py-3 rounded-lg font-medium text-text-secondary hover:bg-brand-mint/40 transition-all duration-200"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg font-semibold bg-brand-accent text-white hover:bg-brand-accent/90 hover:shadow-md transition-all duration-200 text-center"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Overlay pour fermer le menu utilisateur */}
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
