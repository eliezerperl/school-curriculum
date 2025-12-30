import React from 'react';
import { Landmark, TrendingDown, TrendingUp } from 'lucide-react';
import { ControlSection, Slider } from '../../ui/EconomicsUI';

interface Props {
  showTax: boolean;
  setShowTax: (val: boolean) => void;
  tax: number;
  setTax: (val: number) => void;
  showSubsidy: boolean;
  setShowSubsidy: (val: boolean) => void;
  subsidy: number;
  setSubsidy: (val: number) => void;
  
  maxLimit: number; 
}

export const PolicySection: React.FC<Props> = ({
  showTax,
  setShowTax,
  tax,
  setTax,
  showSubsidy,
  setShowSubsidy,
  subsidy,
  setSubsidy,
  maxLimit,
}) => {
  
  // Ensure we don't crash if limit is 0, default to 100 just in case
  const safeLimit = maxLimit > 0 ? maxLimit : 100;

  return (
    <ControlSection title="Government Policy" color="text-orange-600" icon={<Landmark size={18} />}>
      
      {/* Tax Control */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <input 
            type="checkbox" 
            id="tax-toggle"
            checked={showTax}
            onChange={(e) => setShowTax(e.target.checked)}
            className="w-4 h-4 accent-orange-600 cursor-pointer"
          />
          <label htmlFor="tax-toggle" className="text-sm font-semibold text-slate-700 cursor-pointer flex items-center gap-1">
            <TrendingDown size={16} className="text-red-500" />
            Excise Tax
          </label>
        </div>
        
        <div className={showTax ? "opacity-100" : "opacity-40 pointer-events-none"}>
          <Slider
            label="Tax Amount ($)"
            val={tax}
            set={setTax}
            min={0}
            
            // === DYNAMIC MAX ===
            // This ensures Tax never exceeds the highest price on the graph
            max={safeLimit} 
            
            step={1}
            color="accent-orange-600"
          />
        </div>
      </div>

      {/* Subsidy Control */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <input 
            type="checkbox" 
            id="subsidy-toggle"
            checked={showSubsidy}
            onChange={(e) => setShowSubsidy(e.target.checked)}
            className="w-4 h-4 accent-purple-600 cursor-pointer"
          />
          <label htmlFor="subsidy-toggle" className="text-sm font-semibold text-slate-700 cursor-pointer flex items-center gap-1">
            <TrendingUp size={16} className="text-emerald-500" />
            Subsidy
          </label>
        </div>

        <div className={showSubsidy ? "opacity-100" : "opacity-40 pointer-events-none"}>
          <Slider
            label="Subsidy Amount ($)"
            val={subsidy}
            set={setSubsidy}
            min={0}
            
            // === DYNAMIC MAX ===
            max={safeLimit}
            
            step={1}
            color="accent-purple-600"
          />
        </div>
      </div>

    </ControlSection>
  );
};