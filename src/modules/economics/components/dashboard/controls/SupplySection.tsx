import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Slider, ControlSection } from '../../ui/EconomicsUI';

interface Props {
  intercept: number;
  slope: number;
  setIntercept: (val: number) => void;
  setSlope: (val: number) => void;
}

export const SupplySection: React.FC<Props> = ({ intercept, slope, setIntercept, setSlope }) => (
  <ControlSection title="Supply" color="text-emerald-600" icon={<TrendingUp />}>
    <Slider label="Intercept" val={intercept} set={setIntercept} min={0} max={50} />
    <Slider label="Slope" val={slope} set={setSlope} min={0.5} max={3} step={0.1} />
  </ControlSection>
);