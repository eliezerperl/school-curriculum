import React from 'react';
import { DollarSign } from 'lucide-react';
import { Slider, ControlSection } from '../../ui/EconomicsUI'; // Import ControlSection

interface Props {
  showTax: boolean;
  setShowTax: (val: boolean) => void;
  tax: number;
  setTax: (val: number) => void;
}

export const PolicySection: React.FC<Props> = ({
  showTax,
  setShowTax,
  tax,
  setTax,
}) => (
  <ControlSection
    title="Policy"
    color="text-orange-600"
    icon={<DollarSign size={20} />}>
    {/* 1. The Toggle Switch */}
    <div className="flex items-center gap-2 mb-4">
      <input
        type="checkbox"
        id="tax-toggle"
        checked={showTax}
        onChange={(e) => setShowTax(e.target.checked)}
        className="w-4 h-4 accent-orange-500 cursor-pointer"
      />
      <label
        htmlFor="tax-toggle"
        className="text-sm font-medium text-slate-700 cursor-pointer select-none">
        Apply Tax
      </label>
    </div>

    {/* 2. The Slider (Conditional) */}
    {showTax && (
      <div className="animate-in fade-in slide-in-from-top-2 duration-200">
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
  </ControlSection>
);
