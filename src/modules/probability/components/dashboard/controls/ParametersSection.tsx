import React from 'react';
import { Sliders } from 'lucide-react';
import { ControlSection, Slider } from '../../../../economics/components/ui/EconomicsUI';

interface Props {
  viewMode: '2D' | '3D';
  distType: 'normal' | 'binomial';
  
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

export const ParametersSection: React.FC<Props> = ({
  viewMode, distType,
  mean, setMean, stdDev, setStdDev, n, setN, p, setP,
  meanY, setMeanY, stdY, setStdY, nY, setNY, pY, setPY, correlation, setCorrelation
}) => {
  
  return (
    <ControlSection title="Variables" color="text-emerald-700" icon={<Sliders size={18} />}>
      
      {/* --- NORMAL DISTRIBUTION CONTROLS --- */}
      {distType === 'normal' && (
        <div className="space-y-4">
          {/* Variable X */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 space-y-3">
            <div className="text-xs font-bold text-blue-700 uppercase flex justify-between">
              Variable X
              {viewMode === '3D' && <span className="text-[10px] bg-white px-2 py-0.5 rounded text-blue-400">Horizontal</span>}
            </div>
            <Slider label="Mean (μ)" val={mean} set={setMean} min={-4} max={4} step={0.5} />
            <Slider label="Std Dev (σ)" val={stdDev} set={setStdDev} min={0.5} max={3} step={0.1} />
          </div>

          {/* Variable Y (3D Only) */}
          {viewMode === '3D' && (
            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 space-y-3">
              <div className="text-xs font-bold text-indigo-700 uppercase flex justify-between">
                Variable Y
                <span className="text-[10px] bg-white px-2 py-0.5 rounded text-indigo-400">Depth</span>
              </div>
              <Slider label="Mean (μ)" val={meanY} set={setMeanY} min={-4} max={4} step={0.5} color="accent-indigo-600" />
              <Slider label="Std Dev (σ)" val={stdY} set={setStdY} min={0.5} max={3} step={0.1} color="accent-indigo-600" />
              
              <div className="pt-2 border-t border-indigo-200">
                <Slider label="Correlation (ρ)" val={correlation} set={setCorrelation} min={-0.9} max={0.9} step={0.1} color="accent-pink-600" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- BINOMIAL DISTRIBUTION CONTROLS --- */}
      {distType === 'binomial' && (
        <div className="space-y-4">
          {/* Variable X */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 space-y-3">
             <div className="text-xs font-bold text-blue-700 uppercase">Variable X</div>
            <Slider label="Trials (n)" val={n} set={setN} min={5} max={20} step={1} />
            <Slider label="Prob (p)" val={p} set={setP} min={0.1} max={0.9} step={0.1} />
          </div>

          {/* Variable Y (3D Only) */}
          {viewMode === '3D' && (
            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 space-y-3">
               <div className="text-xs font-bold text-indigo-700 uppercase">Variable Y</div>
              <Slider label="Trials (n)" val={nY} set={setNY} min={5} max={20} step={1} color="accent-indigo-600" />
              <Slider label="Prob (p)" val={pY} set={setPY} min={0.1} max={0.9} step={0.1} color="accent-indigo-600" />
            </div>
          )}
        </div>
      )}

    </ControlSection>
  );
};