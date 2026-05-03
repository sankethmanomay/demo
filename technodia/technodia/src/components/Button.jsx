import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ children, isLoading, className = '', variant = 'primary', ...props }) => {
  
  const baseStyles = "w-full font-medium py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex justify-center items-center relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[var(--color-primary)] hover:bg-[#152c6b] text-white",
    success: "bg-emerald-500 hover:bg-emerald-600 text-white",
    outline: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm hover:shadow",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;
