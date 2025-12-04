import React from 'react';

const ProgressBar = ({ value = 0, className = '' }) => {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={`w-full h-3 bg-brand-grey/40 rounded-lg overflow-hidden ${className}`} aria-label="Progression">
      <div
        className="h-full bg-brand-mint"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default ProgressBar;