import React from 'react';
import type { EconomicsParams, EconomicsSetters } from '../../types';

// Import Mini Modules
import { ViewSettings } from './controls/ViewSettings';
import { DemandSection } from './controls/DemandSection';
import { SupplySection } from './controls/SupplySection';
import { PolicySection } from './controls/PolicySection';

interface Props {
  params: EconomicsParams;
  setters: EconomicsSetters;
}

export const SupplyDemandControls: React.FC<Props> = ({ params, setters }) => {
  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-[68vh] overflow-y-auto custom-scrollbar">
      {/* 1. View Settings */}
      <ViewSettings
        showSurplus={params.showSurplus}
        setShowSurplus={setters.setShowSurplus}
      />

      {/* 2. Demand */}
      <DemandSection
        intercept={params.dIntercept}
        slope={params.dSlope}
        setIntercept={setters.setDIntercept}
        setSlope={setters.setDSlope}
      />

      {/* 3. Supply */}
      <SupplySection
        intercept={params.sIntercept}
        slope={params.sSlope}
        setIntercept={setters.setSIntercept}
        setSlope={setters.setSSlope}
      />

      {/* 4. Policy */}
      <PolicySection
        showTax={params.showTax}
        setShowTax={setters.setShowTax}
        tax={params.tax}
        setTax={setters.setTax}
        showSubsidy={params.showSubsidy}
        setShowSubsidy={setters.setShowSubsidy}
        subsidy={params.subsidy}
        setSubsidy={setters.setSubsidy}
      />
    </div>
  );
};
