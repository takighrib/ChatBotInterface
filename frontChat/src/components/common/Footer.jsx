import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Github, Mail, Heart } from 'lucide-react';
import { ROUTES } from '@constants/routes';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-text-secondary mt-auto border-t border-brand-grey/60">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Left section */}
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-brand-mint p-2 rounded-lg shadow-card">
                <Sparkles className="w-5 h-5 text-brand-slate" />
              </div>
              <span className="text-xl font-bold text-text-primary">IA Jeunes</span>
            </div>
            <p className="max-w-md">
              Une plateforme pédagogique inspirée des carnets d'étudiants, pour apprendre l'IA avec clarté et sérénité.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-text-primary transition"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@iajeunes.tn"
                className="text-text-secondary hover:text-text-primary transition"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right quick links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">Navigation</h3>
              <ul className="space-y-2">
                <li><Link to={ROUTES.HOME} className="hover:text-text-primary">Accueil</Link></li>
                <li><Link to={ROUTES.DOCUMENTATION} className="hover:text-text-primary">Documentation</Link></li>
                <li><Link to={ROUTES.EXPERIMENTATION} className="hover:text-text-primary">Mes Projets</Link></li>
                <li><Link to={ROUTES.ABOUT} className="hover:text-text-primary">À propos</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">Modules IA</h3>
              <ul className="space-y-2">
                <li><Link to={ROUTES.CHATBOT} className="hover:text-text-primary">Chatbot</Link></li>
                <li><Link to={ROUTES.IMAGE_RECOGNITION} className="hover:text-text-primary">Reconnaissance d'Image</Link></li>
                <li><Link to={ROUTES.TEXT_CLASSIFICATION} className="hover:text-text-primary">Classification de Texte</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-grey mt-8 pt-6 text-left">
          <p className="flex items-center text-sm">
            © {currentYear} IA Jeunes — Fait avec <Heart className="w-4 h-4 mx-1 text-red-500" /> pour les étudiants
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;