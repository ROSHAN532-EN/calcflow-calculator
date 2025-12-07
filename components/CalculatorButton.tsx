import React from 'react';

interface CalculatorButtonProps {
  label: string;
  onClick: (label: string) => void;
  className?: string;
  variant?: 'default' | 'operator' | 'action' | 'featured';
  doubleWidth?: boolean;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ 
  label, 
  onClick, 
  className = '', 
  variant = 'default',
  doubleWidth = false
}) => {
  
  const baseStyles = "h-16 sm:h-20 rounded-2xl text-2xl font-medium transition-all duration-150 active:scale-95 flex items-center justify-center select-none shadow-lg";
  
  const variants = {
    default: "bg-slate-700 text-slate-100 hover:bg-slate-600 active:bg-slate-500", // Numbers
    operator: "bg-amber-500 text-white hover:bg-amber-400 active:bg-amber-600", // +, -, /, *
    action: "bg-slate-500 text-slate-100 hover:bg-slate-400 active:bg-slate-300", // AC, +/-, %
    featured: "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700" // =
  };

  const widthClass = doubleWidth ? "col-span-2 w-full" : "w-full";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      onClick={() => onClick(label)}
      type="button"
      aria-label={label}
    >
      {label}
    </button>
  );
};

export default CalculatorButton;