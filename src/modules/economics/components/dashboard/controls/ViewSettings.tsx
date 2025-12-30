import React from 'react';
import { Layers, RotateCcw, DollarSign, BookOpen } from 'lucide-react';
import { Slider } from '../../ui/EconomicsUI';

interface Props {
  showSurplus: boolean;
  setShowSurplus: (val: boolean) => void;
  // New Props
  manualPrice: number | null;
  setManualPrice: (val: number | null) => void;
  naturalEqP: number; 
  isTheoretical: boolean;
  setIsTheoretical: (val: boolean) => void;
}

export const ViewSettings: React.FC<Props> = ({
  showSurplus,
  setShowSurplus,
  manualPrice,
  setManualPrice,
  naturalEqP,
  isTheoretical,
  setIsTheoretical
}) => {
  // If manualPrice is null, use the natural price for the slider position
  const sliderValue = manualPrice ?? naturalEqP;

  const handleReset = () => {
    setManualPrice(null); // This snaps it back to "Optimal"
  };

  return (
    <div className="space-y-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
      {/* 1. Show Surplus Toggle (Existing) */}
      <div className="flex items-center gap-3 mb-2">
        <input
          id="surplus-toggle"
          type="checkbox"
          checked={showSurplus}
          onChange={(e) => setShowSurplus(e.target.checked)}
          className="w-5 h-5 accent-purple-600 cursor-pointer"
        />
        <label
          htmlFor="surplus-toggle"
          className="text-sm font-semibold text-slate-700 cursor-pointer select-none flex items-center gap-2">
          <Layers size={18} className="text-purple-600" />
          Show Surplus Areas
        </label>
      </div>

      {/* === THEORETICAL MODE TOGGLE === */}
      <div className="flex items-center gap-3">
          <input 
            id="theory-toggle"
            type="checkbox" 
            checked={isTheoretical}
            onChange={(e) => setIsTheoretical(e.target.checked)}
            className="w-5 h-5 accent-indigo-600 cursor-pointer"
          />
          <label htmlFor="theory-toggle" className="text-sm font-semibold text-slate-700 cursor-pointer select-none flex items-center gap-2">
            <BookOpen size={18} className="text-indigo-600" />
            Textbook Mode (Variables)
          </label>
        </div>

      <hr className="border-slate-200" />

      {/* 2. Manual Price Control */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
            <DollarSign size={14} />
            Market Price Control
          </label>

          {/* RESET BUTTON - Only shows if we are in Manual Mode */}
          {manualPrice !== null && (
            <button
            onClick={handleReset}
            title="Reset Curves"
            className="text-gray-400 hover:text-indigo-600 hover:rotate-180 transition-all duration-300">
            <RotateCcw size={14} />
          </button>
          )}
        </div>

        <div className={manualPrice !== null ? 'opacity-100' : 'opacity-80'}>
          <Slider
            label={manualPrice !== null ? 'Manual Price' : 'Optimal Price'}
            val={sliderValue}
            set={(val) => setManualPrice(val)} // Dragging sets the Manual Price
            min={0}
            max={200}
            step={1}
            color={
              manualPrice !== null ? 'accent-orange-500' : 'accent-slate-400'
            }
          />
        </div>

        {manualPrice === null && (
          <p className="text-[10px] text-slate-400 italic">
            Drag slider to set Monopoly/Fixed price
          </p>
        )}
      </div>
    </div>
  );
};
