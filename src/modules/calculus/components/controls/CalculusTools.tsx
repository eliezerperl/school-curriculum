import { useState } from 'react';
import { Wrench, X, Calculator, Book, Sigma } from 'lucide-react';

export const CalculusTools = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<'calc' | 'rules'>('calc');

  return (
    <>
      {/* 1. FLOATING ACTION BUTTON (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-4 rounded-full shadow-xl transition-all duration-300 ${
            isOpen 
              ? 'bg-slate-800 text-white rotate-90' 
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-110'
          }`}
        >
          {isOpen ? <X size={24} /> : <Wrench size={24} />}
        </button>
      </div>

      {/* 2. THE POPUP PANEL */}
      <div
        className={`fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 transition-all duration-300 origin-bottom-right z-40 overflow-hidden ${
          isOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Header / Tabs */}
        <div className="bg-slate-50 border-b border-slate-100 p-2 flex gap-2">
          <button
            onClick={() => setActiveTool('calc')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors ${
              activeTool === 'calc' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Calculator size={14} />
            Calculator
          </button>
          <button
            onClick={() => setActiveTool('rules')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors ${
              activeTool === 'rules' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Book size={14} />
            Rules
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 h-80 overflow-y-auto">
          
          {/* TOOL 1: SIMPLE CALCULATOR */}
          {activeTool === 'calc' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-700">Quick Calc</h3>
              <div className="grid grid-cols-4 gap-2">
                {['7','8','9','/', '4','5','6','*', '1','2','3','-', '0','.','=','+'].map(btn => (
                  <button key={btn} className="p-2 bg-slate-50 rounded hover:bg-slate-100 text-sm font-mono font-bold text-slate-600">
                    {btn}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 text-center mt-2">
                (Visual placeholder)
              </p>
            </div>
          )}

          {/* TOOL 2: DERIVATIVE RULES CHEAT SHEET */}
          {activeTool === 'rules' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Sigma size={16} className="text-purple-500"/>
                Power Rules
              </h3>
              
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-slate-500">f(x) = x^n</span>
                  <span className="font-mono font-bold text-slate-800">nx^(n-1)</span>
                </div>
                <div className="h-px bg-slate-200"></div>
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-slate-500">f(x) = sin(x)</span>
                  <span className="font-mono font-bold text-slate-800">cos(x)</span>
                </div>
                <div className="h-px bg-slate-200"></div>
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-slate-500">f(x) = ln(x)</span>
                  <span className="font-mono font-bold text-slate-800">1/x</span>
                </div>
                 <div className="h-px bg-slate-200"></div>
                <div className="flex justify-between text-xs">
                  <span className="font-mono text-slate-500">f(x) = e^x</span>
                  <span className="font-mono font-bold text-slate-800">e^x</span>
                </div>
              </div>

              <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 text-xs text-orange-800">
                <strong>Chain Rule:</strong><br/>
                f'(g(x)) * g'(x)
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};