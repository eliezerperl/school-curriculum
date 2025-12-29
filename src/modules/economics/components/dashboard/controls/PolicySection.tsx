import React from 'react';
import { DollarSign } from 'lucide-react';
import { Slider, ControlSection } from '../../ui/EconomicsUI';

interface Props {
  showTax: boolean;
  setShowTax: (val: boolean) => void;
  tax: number;
  setTax: (val: number) => void;

  showSubsidy: boolean;
  setShowSubsidy: (val: boolean) => void;
  subsidy: number;
  setSubsidy: (val: number) => void;
}

export const PolicySection: React.FC<Props> = ({
  showTax, setShowTax, tax, setTax,
  showSubsidy, setShowSubsidy, subsidy, setSubsidy
}) => {
  return (
    <ControlSection title="Policy" color="text-orange-600" icon={<DollarSign size={20} />}>
      
      {/* Policy Type Selection */}
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={showTax} 
            onChange={(e) => setShowTax(e.target.checked)} 
            className="w-4 h-4 accent-orange-500"
          />
          <span className="text-sm font-medium text-slate-700">Tax</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={showSubsidy} 
            onChange={(e) => setShowSubsidy(e.target.checked)} 
            className="w-4 h-4 accent-purple-600"
          />
          <span className="text-sm font-medium text-slate-700">Subsidy</span>
        </label>
      </div>

      {/* Conditional Sliders */}
      {showTax && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-100 mb-2">
            <p className="text-xs text-orange-800 font-semibold mb-2">Government Tax</p>
            <Slider label="Tax Amount ($)" val={tax} set={setTax} min={0} max={50} step={1} color="accent-orange-500" />
          </div>
        </div>
      )}

      {showSubsidy && (
        <div className="animate-in fade-in slide-in-from-top-2">
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 mb-2">
            <p className="text-xs text-purple-800 font-semibold mb-2">Government Subsidy</p>
            <Slider label="Subsidy Amount ($)" val={subsidy} set={setSubsidy} min={0} max={50} step={1} color="accent-purple-600" />
          </div>
        </div>
      )}

      {!showTax && !showSubsidy && (
        <p className="text-xs text-slate-400 italic text-center py-2">
          No active policy intervention
        </p>
      )}
    </ControlSection>
  );
};