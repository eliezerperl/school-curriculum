import React from 'react';
import { TrendingUp, Eye, EyeOff } from 'lucide-react';
import { Slider, ControlSection } from '../../ui/EconomicsUI';

interface Props {
  intercept: number;
  slope: number;
  show: boolean; // <--- Visibility Prop
  setIntercept: (val: number) => void;
  setSlope: (val: number) => void;
  setShow: (val: boolean) => void; // <--- Visibility Setter
}

export const DemandSection: React.FC<Props> = ({ 
  intercept, slope, show, setIntercept, setSlope, setShow 
}) => (
  <ControlSection title="Demand" color="text-blue-600" icon={<TrendingUp className="rotate-180" />}>
    
    {/* Visibility Checkbox */}
    <div className="flex items-center gap-2 mb-4 p-2 bg-blue-50 rounded-lg border border-blue-100">
      <input 
        type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)}
        className="w-4 h-4 accent-blue-600 cursor-pointer"
      />
      <label className="text-sm font-semibold text-blue-800 cursor-pointer flex-1 flex justify-between items-center" onClick={() => setShow(!show)}>
        Show Curve
        {show ? <Eye size={16} /> : <EyeOff size={16} className="text-blue-400" />}
      </label>
    </div>

    {/* Sliders */}
    <div className={show ? "opacity-100" : "opacity-50 pointer-events-none"}>
      <Slider label="Intercept" val={intercept} set={setIntercept} min={50} max={200} />
      <Slider label="Slope" val={slope} set={setSlope} min={0.5} max={3} step={0.1} />
    </div>
  </ControlSection>
);