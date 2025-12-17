import React from 'react';
import { Layers } from 'lucide-react';

interface Props {
  showSurplus: boolean;
  setShowSurplus: (val: boolean) => void;
}

export const ViewSettings: React.FC<Props> = ({ showSurplus, setShowSurplus }) => (
  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
    <input
      type="checkbox"
      id="surplus-toggle"
      checked={showSurplus}
      onChange={(e) => setShowSurplus(e.target.checked)}
      className="w-5 h-5 accent-purple-600 cursor-pointer"
    />
    <label htmlFor="surplus-toggle" className="text-sm font-semibold text-slate-700 cursor-pointer select-none flex items-center gap-2">
      <Layers size={18} className="text-purple-600" /> Show Surplus
    </label>
  </div>
);