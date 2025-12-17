import React from 'react';
import { TrendingUp, DollarSign, Layers } from 'lucide-react';
import { Slider, ControlSection } from '../ui/EconomicsUI';
import type { EconomicsParams, EconomicsSetters } from '../../types';

interface Props {
  params: EconomicsParams;
  setters: EconomicsSetters;
}

export const SupplyDemandControls: React.FC<Props> = ({ params, setters }) => {
  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-h-[65vh] overflow-y-auto">
      {/* Demand */}
      <ControlSection
        title="Demand"
        color="text-blue-600"
        icon={<TrendingUp className="rotate-180" />}>
        <Slider
          label="Intercept"
          val={params.dIntercept}
          set={setters.setDIntercept}
          min={50}
          max={200}
        />
        <Slider
          label="Slope"
          val={params.dSlope}
          set={setters.setDSlope}
          min={0.5}
          max={3}
          step={0.1}
        />
      </ControlSection>

      {/* Supply */}
      <ControlSection
        title="Supply"
        color="text-emerald-600"
        icon={<TrendingUp />}>
        <Slider
          label="Intercept"
          val={params.sIntercept}
          set={setters.setSIntercept}
          min={0}
          max={50}
        />
        <Slider
          label="Slope"
          val={params.sSlope}
          set={setters.setSSlope}
          min={0.5}
          max={3}
          step={0.1}
        />
      </ControlSection>

      {/* Policy */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-600 font-bold">
            <DollarSign size={20} /> Policy
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={params.showTax}
              onChange={(e) => setters.setShowTax(e.target.checked)}
              className="w-4 h-4 accent-orange-500"
            />
            <span className="text-sm">Tax</span>
          </div>
        </div>

        {params.showTax && (
          <Slider
            label="Tax Amount"
            val={params.tax}
            set={setters.setTax}
            min={0}
            max={50}
            color="accent-orange-500"
          />
        )}

        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
          <input
            type="checkbox"
            checked={params.showSurplus}
            onChange={(e) => setters.setShowSurplus(e.target.checked)}
            className="w-4 h-4 accent-purple-500"
          />
          <span className="text-sm font-medium flex items-center gap-2">
            <Layers size={16} /> Show Surplus Areas
          </span>
        </div>
      </div>
    </div>
  );
};
