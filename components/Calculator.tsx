import React, { useState, useEffect, useCallback } from 'react';
import CalculatorButton from './CalculatorButton';
import CalculatorDisplay from './CalculatorDisplay';
import HistoryPanel from './HistoryPanel';
import { Operator, CalculatorState, HistoryItem } from '../types';
import { History } from 'lucide-react';

const Calculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    displayValue: '0',
    firstOperand: null,
    operator: null,
    waitingForSecondOperand: false,
  });

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false); // Mobile toggle

  // --- Logic ---

  const inputDigit = (digit: string) => {
    const { displayValue, waitingForSecondOperand } = state;

    if (waitingForSecondOperand) {
      setState({
        ...state,
        displayValue: digit,
        waitingForSecondOperand: false,
      });
    } else {
      setState({
        ...state,
        displayValue: displayValue === '0' ? digit : displayValue + digit,
      });
    }
  };

  const inputDecimal = () => {
    const { displayValue, waitingForSecondOperand } = state;

    if (waitingForSecondOperand) {
      setState({
        ...state,
        displayValue: '0.',
        waitingForSecondOperand: false,
      });
      return;
    }

    if (!displayValue.includes('.')) {
      setState({
        ...state,
        displayValue: displayValue + '.',
      });
    }
  };

  const clear = () => {
    setState({
      displayValue: '0',
      firstOperand: null,
      operator: null,
      waitingForSecondOperand: false,
    });
  };

  const toggleSign = () => {
    const { displayValue } = state;
    const newValue = parseFloat(displayValue) * -1;
    setState({
      ...state,
      displayValue: String(newValue),
    });
  };

  const inputPercent = () => {
    const { displayValue } = state;
    const currentValue = parseFloat(displayValue);
    
    if (currentValue === 0) return;

    const fixedDigits = displayValue.replace(/^-?\d*\.?/, '');
    const newValue = parseFloat(displayValue) / 100;
    
    setState({
      ...state,
      displayValue: String(newValue.toFixed(fixedDigits.length + 2)),
    });
  };

  const performOperation = (nextOperator: Operator) => {
    const { displayValue, firstOperand, operator } = state;
    const inputValue = parseFloat(displayValue);

    if (state.firstOperand === null) {
      setState({
        ...state,
        firstOperand: inputValue,
        operator: nextOperator,
        waitingForSecondOperand: true,
      });
    } else if (operator) {
      const currentValue = firstOperand || 0;
      const result = calculate(currentValue, inputValue, operator);

      // Add to history if it was a calculation (not just changing operator)
      if (!state.waitingForSecondOperand) {
        addToHistory(currentValue, inputValue, operator, result);
      }

      setState({
        ...state,
        displayValue: String(result),
        firstOperand: result,
        operator: nextOperator,
        waitingForSecondOperand: true,
      });
    } else {
       // Just setting an operator after equals or initial state
       setState({
         ...state,
         firstOperand: inputValue,
         operator: nextOperator,
         waitingForSecondOperand: true,
       });
    }
  };

  const calculate = (first: number, second: number, op: Operator): number => {
    let result = 0;
    switch (op) {
      case '+':
        result = first + second;
        break;
      case '-':
        result = first - second;
        break;
      case '×':
        result = first * second;
        break;
      case '÷':
        if (second === 0) return 0; // Handle division by zero nicely
        result = first / second;
        break;
      default:
        return second;
    }
    
    // Fix floating point precision issues (e.g., 0.1 + 0.2)
    return parseFloat(result.toPrecision(15));
  };

  const addToHistory = (first: number, second: number, op: string, result: number) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      expression: `${first} ${op} ${second} =`,
      result: result,
      timestamp: Date.now(),
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const handleEquals = () => {
    const { firstOperand, displayValue, operator } = state;
    
    if (!operator || firstOperand === null) return;

    const secondOperand = parseFloat(displayValue);
    const result = calculate(firstOperand, secondOperand, operator);

    addToHistory(firstOperand, secondOperand, operator, result);

    setState({
      ...state,
      displayValue: String(result),
      firstOperand: null,
      operator: null,
      waitingForSecondOperand: true,
    });
  };

  const handleBackspace = () => {
      if (state.waitingForSecondOperand) return;
      if (state.displayValue.length === 1) {
          setState({...state, displayValue: '0'});
      } else {
          setState({...state, displayValue: state.displayValue.slice(0, -1)});
      }
  };

  // --- Keyboard Support ---

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key;

    if (/\d/.test(key)) {
      event.preventDefault();
      inputDigit(key);
    } else if (key === '.') {
      event.preventDefault();
      inputDecimal();
    } else if (key === '+' || key === '-') {
      event.preventDefault();
      performOperation(key as Operator);
    } else if (key === '*') {
      event.preventDefault();
      performOperation('×');
    } else if (key === '/') {
      event.preventDefault();
      performOperation('÷');
    } else if (key === 'Enter' || key === '=') {
      event.preventDefault();
      handleEquals();
    } else if (key === 'Backspace') {
      event.preventDefault();
      handleBackspace();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
      event.preventDefault();
      clear();
    }
  }, [state]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // --- Helpers ---

  const getExpressionDisplay = () => {
    if (state.operator && state.firstOperand !== null) {
      return `${state.firstOperand} ${state.operator}`;
    }
    return '';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl w-full mx-auto p-4 md:p-8 h-[90vh] lg:h-auto">
      
      {/* Main Calculator Unit */}
      <div className="flex-1 bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-slate-800 flex flex-col max-w-md mx-auto w-full lg:max-w-md relative z-10">
        
        {/* Mobile History Toggle */}
        <button 
          className="lg:hidden absolute top-6 left-6 text-slate-500 hover:text-slate-300"
          onClick={() => setShowHistory(!showHistory)}
        >
          <History size={24} />
        </button>

        <CalculatorDisplay 
          value={state.displayValue} 
          expression={getExpressionDisplay()} 
        />
        
        <div className="grid grid-cols-4 gap-3 sm:gap-4 flex-1">
          {/* Row 1 */}
          <CalculatorButton label="AC" onClick={clear} variant="action" />
          <CalculatorButton label="+/-" onClick={toggleSign} variant="action" />
          <CalculatorButton label="%" onClick={inputPercent} variant="action" />
          <CalculatorButton label="÷" onClick={() => performOperation('÷')} variant="operator" />

          {/* Row 2 */}
          <CalculatorButton label="7" onClick={inputDigit} />
          <CalculatorButton label="8" onClick={inputDigit} />
          <CalculatorButton label="9" onClick={inputDigit} />
          <CalculatorButton label="×" onClick={() => performOperation('×')} variant="operator" />

          {/* Row 3 */}
          <CalculatorButton label="4" onClick={inputDigit} />
          <CalculatorButton label="5" onClick={inputDigit} />
          <CalculatorButton label="6" onClick={inputDigit} />
          <CalculatorButton label="-" onClick={() => performOperation('-')} variant="operator" />

          {/* Row 4 */}
          <CalculatorButton label="1" onClick={inputDigit} />
          <CalculatorButton label="2" onClick={inputDigit} />
          <CalculatorButton label="3" onClick={inputDigit} />
          <CalculatorButton label="+" onClick={() => performOperation('+')} variant="operator" />

          {/* Row 5 */}
          <CalculatorButton label="0" onClick={inputDigit} doubleWidth className="rounded-l-2xl" />
          <CalculatorButton label="." onClick={inputDecimal} />
          <CalculatorButton label="=" onClick={handleEquals} variant="featured" />
        </div>
      </div>

      {/* History Panel - Desktop: Side, Mobile: Overlay/Modal-ish */}
      <div className={`
        fixed inset-0 z-20 p-4 lg:p-0 bg-black/80 lg:bg-transparent lg:static lg:flex-1 lg:max-w-sm
        transition-all duration-300 ease-in-out
        ${showHistory ? 'opacity-100 visible' : 'opacity-0 invisible lg:opacity-100 lg:visible'}
      `}>
         <div className="h-full w-full max-w-md mx-auto lg:max-w-none relative">
            {/* Close button for mobile */}
            <button 
              className="lg:hidden absolute top-4 right-4 z-30 text-white bg-slate-700 rounded-full p-2"
              onClick={() => setShowHistory(false)}
            >
              ✕
            </button>
            <HistoryPanel 
              history={history} 
              onClearHistory={() => setHistory([])}
              onHistoryItemClick={(item) => {
                setState({
                  ...state,
                  displayValue: String(item.result),
                  waitingForSecondOperand: true,
                  firstOperand: null,
                  operator: null
                });
                setShowHistory(false);
              }}
            />
         </div>
      </div>

    </div>
  );
};

export default Calculator;