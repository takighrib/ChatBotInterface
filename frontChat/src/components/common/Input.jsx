import React from 'react';

/**
 * Composant Input réutilisable
 */
const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-text-secondary mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-3 border rounded-lg transition duration-200
            focus:outline-none focus:ring-2 focus:ring-brand-slate focus:border-transparent
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500' : 'border-brand-grey'}
            ${disabled ? 'bg-brand-paper cursor-not-allowed' : 'bg-white'}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * Composant TextArea
 */
export const TextArea = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  rows = 4,
  maxLength,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-text-secondary mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-3 border rounded-lg transition duration-200
          focus:outline-none focus:ring-2 focus:ring-brand-slate focus:border-transparent
          resize-none
          ${error ? 'border-red-500' : 'border-brand-grey'}
          ${disabled ? 'bg-brand-paper cursor-not-allowed' : 'bg-white'}
        `}
        {...props}
      />
      
      <div className="flex items-center justify-between mt-1">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <div></div>
        )}
        
        {maxLength && (
          <p className="text-sm text-gray-500">
            {value?.length || 0} / {maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

export default Input;