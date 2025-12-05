import React from 'react';

const ProgressBar = ({ value = 0, className = '', showLabel = false }) => {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={`w-full ${className}`} aria-label="Progression">
      {showLabel && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-text-secondary">Progression</span>
          <span className="text-sm font-semibold text-brand-slate">{pct}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-brand-grey/40 rounded-full overflow-hidden">
      <div
          className="h-full bg-gradient-to-r from-brand-mint to-brand-accent transition-all duration-500 ease-out rounded-full"
        style={{ width: `${pct}%` }}
      />
      </div>
    </div>
  );
};

export default ProgressBar;