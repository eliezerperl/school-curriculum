import React from 'react';
import { TrendingUp, Eye, EyeOff } from 'lucide-react';
import { Slider, ControlSection } from '../../ui/EconomicsUI';

interface Props {
  intercept: number;
  slope: number;
  show: boolean;
  setIntercept: (val: number) => void;
  setSlope: (val: number) => void;
  setShow: (val: boolean) => void;
}

export const SupplySection: React.FC<Props> = ({ 
  intercept, slope, show, setIntercept, setSlope, setShow 
}) => (
  <ControlSection title="Supply" color="text-emerald-600" icon={<TrendingUp />}>
    
    {/* Visibility Toggle */}
    <div className="flex items-center gap-2 mb-4 p-2 bg-emerald-50 rounded-lg border border-emerald-100">
      <input 
        type="checkbox" 
        checked={show} 
        onChange={(e) => setShow(e.target.checked)}
        className="w-4 h-4 accent-emerald-600 cursor-pointer"
        id="show-supply"
      />
      <label htmlFor="show-supply" className="text-sm font-semibold text-emerald-800 cursor-pointer flex-1 flex justify-between items-center">
        Show Curve
        {show ? <Eye size={16} /> : <EyeOff size={16} className="text-emerald-400" />}
      </label>
    </div>

    {/* Sliders (Disabled if hidden) */}
    <div className={show ? "opacity-100 transition-opacity" : "opacity-50 pointer-events-none transition-opacity"}>
      <Slider label="Intercept" val={intercept} set={setIntercept} min={0} max={100} step={1} color="accent-emerald-600" />
      <Slider label="Slope" val={slope} set={setSlope} min={0.5} max={5} step={0.1} color="accent-emerald-600" />
    </div>
  </ControlSection>
);