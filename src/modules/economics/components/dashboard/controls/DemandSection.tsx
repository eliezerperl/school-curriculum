import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Slider, ControlSection } from '../../ui/EconomicsUI';

interface Props {
  intercept: number;
  slope: number;
  setIntercept: (val: number) => void;
  setSlope: (val: number) => void;
}

export const DemandSection: React.FC<Props> = ({ intercept, slope, setIntercept, setSlope }) => (
  <ControlSection title="Demand" color="text-blue-600" icon={<TrendingUp className="rotate-180" />}>
    <Slider label="Intercept" val={intercept} set={setIntercept} min={50} max={200} />
    <Slider label="Slope" val={slope} set={setSlope} min={0.5} max={3} step={0.1} />
  </ControlSection>
);