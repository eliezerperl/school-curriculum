import React, { useState } from 'react';
import { Calculator, X, ChevronLeft, TrendingUp } from 'lucide-react';
import { EconCalculator } from './EconCalculator';
import { CurveShifter } from './CurveShifter';

export const Tools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 1. Trigger Button */}
      <div 
        className={`fixed right-0 top-1/12 z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-l-xl shadow-lg hover:bg-blue-700 flex flex-col items-center gap-2"
        >
          <ChevronLeft size={20} />
          <Calculator size={24} />
          <span className="text-xs font-bold writing-vertical-lr py-2">
            TOOLS
          </span>
        </button>
      </div>

      {/* 2. Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 3. Sidebar Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-auto bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Calculator size={20} className="text-blue-600"/>
            Quick Tools
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-200 rounded-full text-gray-500 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content - SCROLLABLE */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          
          {/* Section 1: The Intuition Builder */}
          <section>
             <div className="flex items-center gap-2 mb-2 text-slate-800 font-semibold">
                <TrendingUp size={16} /> 
                <span>Intuition Sandbox</span>
             </div>
             <CurveShifter />
          </section>

          <hr className="border-gray-100"/>

          {/* Section 2: The Calculator */}
          <section>
            <div className="flex items-center gap-2 mb-2 text-slate-800 font-semibold">
                <Calculator size={16} /> 
                <span>Math Helper</span>
             </div>
            <EconCalculator />
          </section>

        </div>
      </div>
    </>
  );
};