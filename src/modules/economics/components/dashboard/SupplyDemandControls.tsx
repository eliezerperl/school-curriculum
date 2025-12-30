import React from 'react';
import type {
  CustomCurve,
  EconomicsParams,
  EconomicsSetters,
} from '../../types';
import { ViewSettings } from './controls/ViewSettings';
import { DemandSection } from './controls/DemandSection';
import { SupplySection } from './controls/SupplySection';
import { PolicySection } from './controls/PolicySection';
import { CustomCurveSection } from './controls/CustomCurveSection';

interface Props {
  params: EconomicsParams;
  setters: EconomicsSetters;
  customCurves: CustomCurve[];
  addCurve: (c: CustomCurve) => void;
  removeCurve: (id: string) => void;
  updateCurve: (
    id: string,
    field: keyof CustomCurve,
    value: number | boolean
  ) => void;

  naturalEqP: number;
}

export const SupplyDemandControls: React.FC<Props> = ({
  params,
  setters,
  customCurves,
  addCurve,
  removeCurve,
  updateCurve,
  naturalEqP,
}) => {
  return (
    // Responsive: h-auto on mobile, fixed height on desktop
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-auto xl:h-[68vh] xl:overflow-y-auto custom-scrollbar">
      <ViewSettings
        showSurplus={params.showSurplus}
        setShowSurplus={setters.setShowSurplus}
        manualPrice={params.manualPrice}
        setManualPrice={setters.setManualPrice}
        naturalEqP={naturalEqP}

        isTheoretical={params.isTheoretical}
        setIsTheoretical={setters.setIsTheoretical}
      />

      <CustomCurveSection
        curves={customCurves}
        addCurve={addCurve}
        removeCurve={removeCurve}
        updateCurve={updateCurve}
        currentSupplySlope={params.sSlope}
        currentDemandSlope={params.dSlope * -1}
      />

      <DemandSection
        intercept={params.dIntercept}
        slope={params.dSlope}
        show={params.showDemand} // <--- Pass State
        setShow={setters.setShowDemand} // <--- Pass Setter
        setIntercept={setters.setDIntercept}
        setSlope={setters.setDSlope}
      />

      <SupplySection
        intercept={params.sIntercept}
        slope={params.sSlope}
        show={params.showSupply} // <--- Pass State
        setShow={setters.setShowSupply} // <--- Pass Setter
        setIntercept={setters.setSIntercept}
        setSlope={setters.setSSlope}
      />

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
