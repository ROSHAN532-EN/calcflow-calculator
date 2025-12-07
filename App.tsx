import React from 'react';
import Calculator from './components/Calculator';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 p-4">
      <Calculator />
      
      {/* Simple Footer Credit */}
      <div className="fixed bottom-4 text-slate-600 text-xs text-center w-full pointer-events-none">
        <p>CalcFlow &bull; React &bull; Tailwind &bull; Recharts</p>
      </div>
    </div>
  );
};

export default App;