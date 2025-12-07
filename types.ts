export type Operator = '+' | '-' | '×' | '÷' | null;

export interface HistoryItem {
  id: string;
  expression: string;
  result: number;
  timestamp: number;
}

export interface CalculatorState {
  displayValue: string;
  firstOperand: number | null;
  operator: Operator;
  waitingForSecondOperand: boolean;
}
