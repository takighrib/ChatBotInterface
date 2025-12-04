import React from "react";

const TextArea = ({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 5,
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

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   focus:border-blue-500 transition resize-none"
        {...props}
      />
    </div>
  );
};

export default TextArea;
