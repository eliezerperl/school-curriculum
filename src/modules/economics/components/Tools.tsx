import React, { useState } from 'react';
import {
  Calculator,
  X,
  TrendingUp,
  ChevronLeft,
  ArrowLeft,
} from 'lucide-react';
import { EconCalculator } from './tools/EconCalculator';
import { CurveShifter } from './tools/CurveShifter';

// Define the possible views
type ToolView = 'menu' | 'intuition' | 'calculator';

export const Tools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ToolView>('menu');

  // Helper to close sidebar and reset view
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setCurrentView('menu'), 300); // Reset after animation
  };

  return (
    <>
      {/* 1. TRIGGER BUTTON (Hamburger Icon) */}
      <div className="fixed top-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-white p-3 rounded-full shadow-lg border border-gray-200 text-slate-700 hover:bg-slate-50 transition-all hover:scale-105"
            title="Open Tools">
            <Calculator size={24} />
          </button>
        )}
      </div>

      {/* 2. OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={handleClose}
        />
      )}

      {/* 3. SIDEBAR DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-auto min-w-88 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-200 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          {/* Dynamic Header: Show "Back" button if inside a tool */}
          <div className="flex items-center gap-2">
            {currentView !== 'menu' && (
              <button
                onClick={() => setCurrentView('menu')}
                className="mr-1 hover:bg-gray-200 p-1 rounded transition">
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="font-bold text-slate-800 text-lg">
              {currentView === 'menu'
                ? 'Quick Tools'
                : currentView === 'intuition'
                ? 'Intuition Sandbox'
                : 'Calculator'}
            </h2>
          </div>

          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition">
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* VIEW 1: THE MENU (List of Buttons) */}
          {currentView === 'menu' && (
            <div className="space-y-3">
              <p className="text-sm text-slate-500 mb-4">
                Select a tool to use:
              </p>

              <button
                onClick={() => setCurrentView('intuition')}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">
                    Intuition Sandbox
                  </h3>
                  <p className="text-xs text-slate-500">
                    Visualize shifts in Supply & Demand
                  </p>
                </div>
                <ChevronLeft
                  className="ml-auto rotate-180 text-slate-300"
                  size={20}
                />
              </button>

              <button
                onClick={() => setCurrentView('calculator')}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group text-left">
                <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Calculator size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Math Helper</h3>
                  <p className="text-xs text-slate-500">
                    Quick crunch numbers for assignments
                  </p>
                </div>
                <ChevronLeft
                  className="ml-auto rotate-180 text-slate-300"
                  size={20}
                />
              </button>
            </div>
          )}

          {/* VIEW 2: CURVE SHIFTER */}
          {currentView === 'intuition' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <CurveShifter />
            </div>
          )}

          {/* VIEW 3: CALCULATOR */}
          {currentView === 'calculator' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <EconCalculator />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
