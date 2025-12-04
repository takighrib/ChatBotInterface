import React from "react";

const Select = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Sélectionner...",
  className = "",
  ...props
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   focus:border-blue-500 transition bg-white"
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
