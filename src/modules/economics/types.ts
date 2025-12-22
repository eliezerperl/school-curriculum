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
}

export interface EconomicsParams {
  dIntercept: number;
  dSlope: number;
  sIntercept: number;
  sSlope: number;
  tax: number;
  showTax: boolean;
  subsidy: number;
  showSubsidy: boolean;
  showSurplus: boolean;
}

export interface EconomicsSetters {
  setDIntercept: (val: number) => void;
  setDSlope: (val: number) => void;
  setSIntercept: (val: number) => void;
  setSSlope: (val: number) => void;
  setTax: (val: number) => void;
  setShowTax: (val: boolean) => void;
  setSubsidy: (val: number) => void;
  setShowSubsidy: (val: boolean) => void;
  setShowSurplus: (val: boolean) => void;
}
