import React from 'react';

/**
 * Composant Card réutilisable
 * @param {string} title - Titre de la carte
 * @param {string} description - Description
 * @param {React.ReactNode} icon - Icône
 * @param {React.ReactNode} children - Contenu de la carte
 * @param {Function} onClick - Fonction au clic
 * @param {string} className - Classes CSS supplémentaires
 * @param {boolean} hover - Active l'effet hover
 */
const Card = ({
  title,
  description,
  icon,
  children,
  onClick,
  className = '',
  hover = true
}) => {
  return (
    <div
      className={`
        card
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {icon && (
        <div className="mb-4">
          {icon}
        </div>
      )}
      
      {title && (
        <h3 className="text-xl font-bold text-text-primary mb-2">
          {title}
        </h3>
      )}
      
      {description && (
        <p className="text-text-secondary mb-4">
          {description}
        </p>
      )}
      
      {children}
    </div>
  );
};

/**
 * Variante de carte avec gradient
 */
export const GradientCard = ({
  title,
  description,
  icon,
  children,
  gradient = 'from-brand-mint to-brand-surface',
  className = ''
}) => {
  return (
    <div className={`bg-gradient-to-r ${gradient} rounded-xl shadow-card p-6 text-text-primary ${className}`}>
      {icon && (
        <div className="mb-4">
          {icon}
        </div>
      )}
      
      {title && (
        <h3 className="text-xl font-bold mb-2">
          {title}
        </h3>
      )}
      
      {description && (
        <p className="text-text-secondary mb-4">
          {description}
        </p>
      )}
      
      {children}
    </div>
  );
};

/**
 * Variante de carte interactive
 */
export const InteractiveCard = ({
  title,
  description,
  icon,
  buttonText = 'Découvrir',
  onButtonClick,
  className = ''
}) => {
  return (
    <div className={`card ${className}`}>
      {icon && (
        <div className="bg-brand-mint w-16 h-16 rounded-lg flex items-center justify-center text-brand-slate mb-4 shadow-sm">
          {icon}
        </div>
      )}
      
      {title && (
        <h4 className="text-xl font-bold text-text-primary mb-3">
          {title}
        </h4>
      )}
      
      {description && (
        <p className="text-text-secondary mb-4">
          {description}
        </p>
      )}
      
      <button
        onClick={onButtonClick}
        className="text-brand-accent font-semibold hover:opacity-90 flex items-center transition"
      >
        {buttonText} →
      </button>
    </div>
  );
};

export default Card;