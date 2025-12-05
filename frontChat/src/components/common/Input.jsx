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
            input-field
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${disabled ? 'bg-brand-paper cursor-not-allowed opacity-50' : ''}
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
          input-field
          resize-none
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${disabled ? 'bg-brand-paper cursor-not-allowed opacity-50' : ''}
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