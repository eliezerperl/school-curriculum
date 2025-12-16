import React, { useState } from 'react';
import { Calculator, X, ChevronLeft } from 'lucide-react';
import { EconCalculator } from './EconCalculator';

export const Tools: React.FC = () => {
  // The state lives HERE now, not in the main page
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 1. The Trigger Button (Visible when closed) */}
      <div 
        className={`fixed right-0 top-1/12 z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-l-xl shadow-lg hover:bg-blue-700 flex flex-col items-center gap-2"
          title="Open Quick Tools"
        >
          <ChevronLeft size={20} />
          <Calculator size={24} />
          <span className="text-xs font-bold writing-vertical-lr py-2">
            TOOLS
          </span>
        </button>
      </div>

      {/* 2. The Overlay (Backdrop) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)} // Click outside to close
        />
      )}

      {/* 3. The Sidebar Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-auto bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
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

        {/* Content */}
        <div className="p-6 overflow-y-auto h-full pb-20">
           <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700 mb-6 border border-blue-100">
            <strong>Tip:</strong> Use this scratchpad to calculate values without resetting your graph.
          </div>
          
          {/* The Calculator itself */}
          <EconCalculator />
        </div>
      </div>
    </>
  );
};
