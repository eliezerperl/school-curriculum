import React from 'react';
import { DollarSign } from 'lucide-react';
import { Slider, ControlSection } from '../../ui/EconomicsUI'; // Import ControlSection

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
  showTax,
  setShowTax,
  tax,
  setTax,
  showSubsidy,
  setShowSubsidy,
  subsidy,
  setSubsidy,
}) => (
  <ControlSection
    title="Policy"
    color="text-orange-600"
    icon={<DollarSign size={20} />}>
    {/* 1. Policy Selector */}
    <div className="flex gap-4 mb-4">
      {/* Tax Checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showTax}
          onChange={(e) => setShowTax(e.target.checked)}
          className="w-4 h-4 accent-orange-500"
        />
        <span className="text-sm font-medium text-slate-700">Tax</span>
      </div>

      {/* Subsidy Checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showSubsidy}
          onChange={(e) => setShowSubsidy(e.target.checked)}
          className="w-4 h-4 accent-purple-600" // Purple for Subsidy
        />
        <span className="text-sm font-medium text-slate-700">Subsidy</span>
      </div>
    </div>

    {/* 2. Sliders */}
    {showTax && (
      <div className="animate-in fade-in slide-in-from-top-2">
        <Slider
          label="Tax Amount"
          val={tax}
          set={setTax}
          min={0}
          max={50}
          color="accent-orange-500"
        />
      </div>
    )}

    {showSubsidy && (
      <div className="animate-in fade-in slide-in-from-top-2">
        <Slider
          label="Subsidy Amount"
          val={subsidy}
          set={setSubsidy}
          min={0}
          max={50}
          color="accent-purple-600"
        />
      </div>
    )}
  </ControlSection>
);
