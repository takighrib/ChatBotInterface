import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '@constants/routes';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
          <nav className="hidden md:flex space-x-1">
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
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;