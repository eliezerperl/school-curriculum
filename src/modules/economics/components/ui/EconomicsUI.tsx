import { ChevronDown, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

// --- Metric Card ---
interface MetricCardProps {
  label: string;
  value: number | string;
  color: string;
  bg: string;
}
export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  color,
  bg,
}) => (
  <div className={`${bg} p-4 rounded-lg border border-slate-100`}>
    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
      {label}
    </div>
    <div className={`text-2xl font-bold ${color}`}>
      {
        typeof value === 'number'
          ? `$${value.toFixed(2)}` // If number: Format with $ and decimals
          : value // If string: Show text (e.g. "CS") directly
      }
    </div>
  </div>
);

// --- Control Section Wrapper ---
interface ControlSectionProps {
  title: string;
  color: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}
export const ControlSection: React.FC<ControlSectionProps> = ({
  title,
  color,
  icon,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-100 rounded-lg overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-slate-50 p-3 hover:bg-slate-100 transition-colors">
        <div className={`flex items-center gap-2 font-bold ${color}`}>
          {icon}
          <span>{title}</span>
        </div>

        <div className="text-slate-400">
          {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </div>
      </button>

      <div
        className={`bg-white px-3 transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 py-3 opacity-100' : 'max-h-0 py-0 opacity-0'
        }`}>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};

interface SliderProps {
  label: string;
  val: number;
  set: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  color?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  val,
  set,
  min,
  max,
  step = 1,
  color = 'accent-blue-600',
}) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <label className="text-xs font-semibold text-slate-500">{label}</label>

      {/* This INPUT replaces the old <span ...>{val}</span> 
        It allows typing any number, even outside the slider range.
      */}
      <input
        type="number"
        value={val}
        step={step}
        onChange={(e) => {
          // Allow the user to type; convert empty string to 0 or handle logic
          const num = parseFloat(e.target.value);
          set(isNaN(num) ? 0 : num);
        }}
        className="w-16 text-right text-xs font-mono font-bold text-slate-700 border border-slate-200 rounded px-1 py-0.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
      />
    </div>

    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={val}
      onChange={(e) => set(Number(e.target.value))}
      className={`w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer ${color}`}
    />
  </div>
);
