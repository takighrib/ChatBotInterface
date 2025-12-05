import React from 'react';

/**
 * Composant Badge réutilisable
 * @param {string} variant - mint | accent | slate | success | danger
 * @param {string} size - sm | md | lg
 */
const Badge = ({ 
  children, 
  variant = 'mint',
  size = 'md',
  className = '' 
}) => {
  const variants = {
    mint: 'bg-brand-mint/50 text-brand-slate',
    accent: 'bg-brand-accent/20 text-brand-accent',
    slate: 'bg-brand-slate/10 text-brand-slate',
    success: 'bg-green-100 text-green-700',
    danger: 'bg-red-100 text-red-700'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span className={`
      inline-flex items-center rounded-full font-semibold
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}>
      {children}
    </span>
  );
};

export default Badge;