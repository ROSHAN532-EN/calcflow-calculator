import React from 'react';
import { HistoryItem } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, Trash2 } from 'lucide-react';

interface HistoryPanelProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onHistoryItemClick: (item: HistoryItem) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onClearHistory, onHistoryItemClick }) => {
  // Prepare data for the chart - take last 10 items
  const chartData = history.slice(0, 10).map((item, index) => ({
    name: index + 1,
    value: item.result,
    expression: item.expression
  })).reverse();

  // Determine if we have data
  const hasHistory = history.length > 0;

  return (
    <div className="flex flex-col h-full bg-slate-800/50 backdrop-blur-md rounded-3xl border border-slate-700/50 overflow-hidden">
      <div className="p-4 border-b border-slate-700/50 flex justify-between items-center">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <Clock size={18} />
          <span>History & Analysis</span>
        </div>
        {hasHistory && (
          <button 
            onClick={onClearHistory}
            className="text-slate-500 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-slate-700/50"
            title="Clear History"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {!hasHistory ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
          <p className="mb-2 text-lg">No calculations yet</p>
          <p className="text-sm opacity-60">Start calculating to see your history and analytics.</p>
        </div>
      ) : (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Chart Section */}
          <div className="h-40 w-full p-4 border-b border-slate-700/30">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#94a3b8' }}
                  formatter={(value: number) => [value.toLocaleString(), 'Result']}
                  labelStyle={{ display: 'none' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#6366f1' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* List Section */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            <div className="space-y-2">
              {history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onHistoryItemClick(item)}
                  className="w-full text-right p-3 rounded-xl hover:bg-slate-700/50 transition-colors group flex flex-col items-end border border-transparent hover:border-slate-600/50"
                >
                  <span className="text-slate-400 text-sm mb-1 group-hover:text-slate-300">{item.expression}</span>
                  <span className="text-slate-100 font-medium text-lg">{item.result.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;