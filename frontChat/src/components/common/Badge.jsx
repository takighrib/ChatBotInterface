import React from 'react';

const Badge = ({ children, className = '' }) => {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full bg-brand-mint/50 text-brand-slate text-sm font-semibold ${className}`}>
      {children}
    </span>
  );
};

export default Badge;