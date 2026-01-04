import React from 'react';
import { AnalysisSection } from './controls/AnalysisSection';
import { ModelSection } from './controls/ModelSection';
import { ParametersSection } from './controls/ParametersSection';

interface Props {
  viewMode: '2D' | '3D';
  setViewMode: (mode: '2D' | '3D') => void;
  distType: 'normal' | 'binomial';
  setDistType: (type: 'normal' | 'binomial') => void;
  showCDF: boolean;
  setShowCDF: (show: boolean) => void;

  // 2D Stats
  mean: number; setMean: (v: number) => void;
  stdDev: number; setStdDev: (v: number) => void;
  n: number; setN: (v: number) => void;
  p: number; setP: (v: number) => void;

  // 3D Stats
  meanY: number; setMeanY: (v: number) => void;
  stdY: number; setStdY: (v: number) => void;
  nY: number; setNY: (v: number) => void;
  pY: number; setPY: (v: number) => void;
  correlation: number; setCorrelation: (v: number) => void;
}

export const ProbabilityControls: React.FC<Props> = (props) => {
  return (
				// <div className="space-y-6    shadow-sm border border-slate-200 h-auto xl:h-[68vh] xl:overflow-y-auto custom-scrollbar"></div>
			<div className="w-full lg:w-80 p-6 bg-white rounded-xl shrink-0 h-full overflow-y-auto pr-2 custom-scrollbar space-y-6">
      
      {/* 1. Analysis Mode (2D/3D & CDF) */}
      <AnalysisSection 
        viewMode={props.viewMode} 
        setViewMode={props.setViewMode}
        showCDF={props.showCDF}
        setShowCDF={props.setShowCDF}
      />

      {/* 2. Model Selection (Normal/Binomial) */}
      <ModelSection 
        distType={props.distType} 
        setDistType={props.setDistType} 
      />

      {/* 3. Variables (Sliders) */}
      <ParametersSection {...props} />

    </div>
  );
};