import React from "react";

const Button = ({ children, onClick, className = "", disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-xl font-semibold shadow-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
