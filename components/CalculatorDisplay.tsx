import React from 'react';

interface CalculatorDisplayProps {
  value: string;
  expression: string;
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ value, expression }) => {
  // Format the display value to add commas for thousands, etc. if it's a valid number
  const formatValue = (val: string) => {
    if (val === 'Error') return 'Error';
    if (val.endsWith('.')) return val;
    
    // Check if it is scientific notation or just a long number
    const num = parseFloat(val);
    if (isNaN(num)) return val;

    // Use exponential for very large/small numbers to fit screen
    if (Math.abs(num) > 1e12 || (Math.abs(num) < 1e-7 && Math.abs(num) > 0)) {
      return num.toExponential(6);
    }
    
    // Use Intl for nice formatting but preserve trailing decimal point logic which is passed in raw 'val' usually
    // Simple localization often strips trailing zeros or decimals if we aren't careful.
    // So we just stick to raw string if it's being typed, or formatted string if it's a result.
    // For simplicity in this display component, we trust the parent's string, 
    // but we can add commas for better readability if it's a plain number.
    
    const parts = val.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
  };

  return (
    <div className="w-full bg-slate-800 rounded-3xl p-6 mb-6 flex flex-col justify-end items-end h-32 sm:h-40 shadow-inner border border-slate-700/50">
      <div className="text-slate-400 text-sm sm:text-base font-medium h-6 overflow-hidden w-full text-right truncate">
        {expression}
      </div>
      <div className="text-white text-4xl sm:text-6xl font-light tracking-tight w-full text-right truncate">
        {formatValue(value)}
      </div>
    </div>
  );
};

export default CalculatorDisplay;