import React from 'react';

// --- Metric Card ---
interface MetricCardProps {
  label: string;
  value: number;
  color: string;
  bg: string;
}
export const MetricCard: React.FC<MetricCardProps> = ({ label, value, color, bg }) => (
  <div className={`${bg} p-4 rounded-lg border border-slate-100`}>
    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</div>
    <div className={`text-2xl font-bold ${color}`}>${value.toFixed(0)}</div>
  </div>
);

// --- Control Section Wrapper ---
interface ControlSectionProps {
  title: string;
  color: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}
export const ControlSection: React.FC<ControlSectionProps> = ({ title, color, icon, children }) => (
  <div className="space-y-4">
    <div className={`flex items-center gap-2 ${color} font-bold`}>
      {icon} {title}
    </div>
    {children}
  </div>
);

// --- Slider Input ---
interface SliderProps {
  label: string;
  val: number;
  set: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  color?: string;
}
export const Slider: React.FC<SliderProps> = ({ label, val, set, min, max, step = 1, color = 'accent-blue-600' }) => (
  <div>
    <div className="flex justify-between mb-1">
      <label className="text-xs font-semibold text-slate-500">{label}</label>
      <span className="text-xs font-mono text-slate-700">{val}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={val}
      onChange={(e) => set(Number(e.target.value))}
      className={`w-full ${color}`}
    />
  </div>
);