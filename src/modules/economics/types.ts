export interface CustomLabelProps {
  x?: number | string;
  y?: number | string;
  stroke?: string;
  index?: number;
  value?: string | number | boolean | null | undefined;
}

export interface CustomCurve {
  id: string;
  name: string;
  intercept: number;
  slope: number;
  color: string;
  isDashed: boolean;
  type: 'supply' | 'demand';
}

export interface GraphPoint {
  q: number;
  demand: number;
  supply: number;
  supplyTax: number | null;
  supplySubsidy: number | null;
  csFill: number[] | null;
  psFill: number[] | null;
  taxFill: number[] | null;
  subsidyFill: number[] | null;
  // Allow dynamic keys for custom curves
  [key: string]: number | number[] | null | undefined;
}

export interface EconomicsParams {
  dIntercept: number;
  dSlope: number;
  showDemand: boolean; // <--- Added

  sIntercept: number;
  sSlope: number;
  showSupply: boolean; // <--- Added

  tax: number;
  showTax: boolean;
  subsidy: number;
  showSubsidy: boolean;
  showSurplus: boolean;
  
  // App state
  maxQ: number;
  maxP: number;
  calcMode: 'findP' | 'findQ';
  calcInput: number;
}

export interface EconomicsSetters {
  setDIntercept: (val: number) => void;
  setDSlope: (val: number) => void;
  setShowDemand: (val: boolean) => void; // <--- Added

  setSIntercept: (val: number) => void;
  setSSlope: (val: number) => void;
  setShowSupply: (val: boolean) => void; // <--- Added

  setTax: (val: number) => void;
  setShowTax: (val: boolean) => void;
  setSubsidy: (val: number) => void;
  setShowSubsidy: (val: boolean) => void;
  setShowSurplus: (val: boolean) => void;
  
  // App state setters
  setMaxQ: (val: number) => void;
  setMaxP: (val: number) => void;
  setCalcMode: (val: 'findP' | 'findQ') => void;
  setCalcInput: (val: number) => void;
}