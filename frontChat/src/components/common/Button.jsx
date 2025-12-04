import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Composant Button réutilisable
 * @param {string} variant - primary | secondary | outline | danger
 * @param {string} size - sm | md | lg
 * @param {boolean} loading - Affiche un loader
 * @param {boolean} disabled - Désactive le bouton
 * @param {React.ReactNode} children - Contenu du bouton
 * @param {React.ReactNode} icon - Icône optionnelle
 * @param {string} className - Classes CSS supplémentaires
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-brand-accent text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 focus:ring-brand-accent',
    secondary: 'bg-white text-brand-slate border border-brand-slate/40 hover:bg-brand-mint/20 focus:ring-brand-slate',
    outline: 'bg-transparent border border-brand-slate/30 text-brand-slate hover:bg-brand-mint/10 focus:ring-brand-slate',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-brand-mint text-brand-slate hover:shadow-md focus:ring-brand-mint'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none';

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${(disabled || loading) ? disabledStyles : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Chargement...
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;