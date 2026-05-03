import React from 'react';

const Input = React.forwardRef(({ label, error, className = '', containerClassName = '', icon, ...props }, ref) => {
  return (
    <div className={`relative ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-all
            ${error 
              ? 'border-red-400 focus:border-red-400 focus:ring-red-200 bg-red-50/30' 
              : 'border-gray-300 focus:border-[var(--color-secondary)] focus:ring-blue-200/50 bg-gray-50 focus:bg-white'}
            ${icon ? 'pr-10' : ''}
            text-[var(--color-text)] placeholder-gray-400
            ${className}
          `}
          {...props}
        />
        {icon && (
          <div className="absolute right-3 top-[10px] text-gray-400">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1.5">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
