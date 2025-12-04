import React from "react";

const LoadingSpinner = ({ size = 32, className = "" }) => {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 ${className}`}
      style={{
        width: size,
        height: size,
      }}
    />
  );
};

export default LoadingSpinner;
