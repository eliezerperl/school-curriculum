import React from 'react';
import { Settings, Sliders } from 'lucide-react';

interface Props {
  expression: string;
  setExpression: (val: string) => void;
  variables: Record<string, number>;
  setVariable: (key: string, val: number) => void;
}

export const CalculusControls: React.FC<Props> = ({ 
  expression, 
  setExpression, 
  variables, 
  setVariable 
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden">
      
      {/* 1. Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
        <Settings className="text-slate-500" size={20} />
        <h2 className="font-semibold text-slate-700">Control Panel</h2>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        
        {/* 2. Function Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Function f(x)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-slate-400">f(x)=</span>
            <input 
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className="w-full pl-14 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <p className="text-xs text-slate-400">
            Try: <span className="font-mono text-blue-500">a*x^2 + b</span> or <span className="font-mono text-blue-500">sin(a*x)</span>
          </p>
        </div>

        <hr className="border-slate-100" />

        {/* 3. Variable Sliders */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sliders size={16} className="text-slate-400" />
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Variables
            </label>
          </div>

          {/* Loop through variables (a, b, c) and create sliders */}
          {Object.entries(variables).map(([key, val]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-mono font-bold text-slate-600">{key}</span>
                <span className="text-slate-500">{val.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={-10}
                max={10}
                step={0.1}
                value={val}
                onChange={(e) => setVariable(key, parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};