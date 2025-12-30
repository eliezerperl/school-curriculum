import { useState, useMemo } from 'react';
import type { GraphPoint, EconomicsParams, EconomicsSetters } from '../types';

export const useSupplyDemandLogic = () => {
  // --- 1. STATE ---

  const [maxP, setMaxP] = useState(200);
  const [calcMode, setCalcMode] = useState<'findP' | 'findQ'>('findP');
  const [calcInput, setCalcInput] = useState<number>(0);

  const [dIntercept, setDIntercept] = useState(70);
  const [dSlope, setDSlope] = useState(1);
  const [showDemand, setShowDemand] = useState(true);

  const [sIntercept, setSIntercept] = useState(10);
  const [sSlope, setSSlope] = useState(1);
  const [showSupply, setShowSupply] = useState(true);

  const [tax, setTax] = useState(0);
  const [showTax, setShowTax] = useState(false);
  const [subsidy, setSubsidy] = useState(20);
  const [showSubsidy, setShowSubsidy] = useState(false);
  const [showSurplus, setShowSurplus] = useState(true);

  const [manualPrice, setManualPrice] = useState<number | null>(null);
  const [isTheoretical, setIsTheoretical] = useState(true);

  // --- 2. TOGGLE LOGIC ---
  const handleSetShowTax = (val: boolean) => {
    setShowTax(val);
    if (val) setShowSubsidy(false);
  };

  const handleSetShowSubsidy = (val: boolean) => {
    setShowSubsidy(val);
    if (val) setShowTax(false);
  };

  // --- 3. MATH ENGINE ---
  const graphData = useMemo(() => {
    const data: GraphPoint[] = [];

    // --- A. CALCULATE EQUILIBRIUM ---
    const naturalEqQ = (dIntercept - sIntercept) / (dSlope + sSlope);
    const naturalEqP = dIntercept - dSlope * naturalEqQ;

    // --- B. AUTO-SCALE LOGIC (NEW) ---
    // 1. Where does Demand hit Price = 0? (Maximum meaningful quantity)
    const demandMaxQ = dSlope !== 0 ? dIntercept / dSlope : 50;

    // 2. Base our scale on the larger of: Equilibrium OR Max Demand
    // We add 15% padding so the lines don't touch the very edge
    const calculatedMaxQ = Math.max(naturalEqQ, demandMaxQ) * 1.15;

    // 3. Safety Clamps:
    // Minimum 20 (so graph doesn't vanish if numbers are 0)
    // Maximum 500 (so browser doesn't freeze if slope is 0.001)
    const dynamicMaxQ = Math.max(20, Math.min(calculatedMaxQ, 500));

    // --- C. CALCULATE ACTUAL METRICS ---
    let eqQ = naturalEqQ;
    let priceConsumersPay = naturalEqP;
    let priceSuppliersKeep = naturalEqP;

    if (manualPrice !== null) {
      priceConsumersPay = manualPrice;
      priceSuppliersKeep = manualPrice;
      const qd = (dIntercept - manualPrice) / dSlope;
      const qs = (manualPrice - sIntercept) / sSlope;
      eqQ = Math.max(0, Math.min(qd, qs));
    } else if (showTax) {
      eqQ = (dIntercept - (sIntercept + tax)) / (dSlope + sSlope);
      priceConsumersPay = dIntercept - dSlope * eqQ;
      priceSuppliersKeep = priceConsumersPay - tax;
    } else if (showSubsidy) {
      eqQ = (dIntercept - (sIntercept - subsidy)) / (dSlope + sSlope);
      priceConsumersPay = dIntercept - dSlope * eqQ;
      priceSuppliersKeep = priceConsumersPay + subsidy;
    }

    // Metrics (CS/PS)
    const heightAtQ = dIntercept - dSlope * eqQ;
    const totalWillingnessToPay = ((dIntercept + heightAtQ) / 2) * eqQ;
    const totalConsumerCost = priceConsumersPay * eqQ;
    const csValue = Math.max(0, totalWillingnessToPay - totalConsumerCost);

    const supplyHeightAtQ = sIntercept + sSlope * eqQ;
    const totalRevenue = priceSuppliersKeep * eqQ;
    const totalVariableCost = ((sIntercept + supplyHeightAtQ) / 2) * eqQ;
    const psValue = Math.max(0, totalRevenue - totalVariableCost);

    const taxRevenue = showTax && manualPrice === null ? tax * eqQ : 0;
    const subsidyCost = showSubsidy && manualPrice === null ? subsidy * eqQ : 0;

    // 1. How far are we from the optimal quantity?
    const quantityDistortion = Math.abs(naturalEqQ - eqQ);

    // 2. What is the vertical gap between Demand and Supply at the actual Q?
    const demandAtEqQ = dIntercept - dSlope * eqQ;
    const supplyAtEqQ = sIntercept + sSlope * eqQ;
    const priceGap = Math.abs(demandAtEqQ - supplyAtEqQ);

    // 3. Triangle Area Formula: 0.5 * Base * Height
    const deadweightLoss = 0.5 * quantityDistortion * priceGap;

    const totalWelfare = showSubsidy
      ? csValue + psValue - subsidyCost
      : csValue + psValue + taxRevenue;

    // --- D. GENERATE POINTS LOOP (USING DYNAMIC MAX) ---
    const step = dynamicMaxQ > 100 ? dynamicMaxQ / 100 : 1;

    const qValues = new Set<number>();
    for (let q = 0; q <= dynamicMaxQ; q += step) {
      qValues.add(Number(q.toFixed(2)));
    }
    // Ensure exact Equilibrium point exists for perfect shading
    if (eqQ >= 0 && eqQ <= dynamicMaxQ) {
      qValues.add(Number(eqQ.toFixed(2)));
    }

    const sortedQs = Array.from(qValues).sort((a, b) => a - b);

    sortedQs.forEach((q) => {
      const pDemand = dIntercept - dSlope * q;
      const pSupply = sIntercept + sSlope * q;
      const pSupplyTax = showTax && manualPrice === null ? pSupply + tax : null;
      const pSupplySubsidy =
        showSubsidy && manualPrice === null ? pSupply - subsidy : null;
      const isBelowEq = q <= eqQ + 0.001;

      let dwlFill: number[] | null = null;

      if (showSurplus) {
        // Case 1: Under-production (Tax or Monopoly) -> Shade RIGHT of EqQ
        if (eqQ < naturalEqQ) {
          if (q >= eqQ && q <= naturalEqQ) {
            dwlFill = [pSupply, pDemand]; // Fill between Supply and Demand
          }
        }
        // Case 2: Over-production (Subsidy) -> Shade LEFT of EqQ (but right of Natural)
        else if (eqQ > naturalEqQ) {
          if (q >= naturalEqQ && q <= eqQ) {
            dwlFill = [pDemand, pSupply]; // Supply is higher than Demand here
          }
        }
      }

      data.push({
        q: q,
        demand: Math.max(0, pDemand),
        supply: pSupply,
        supplyTax: pSupplyTax,
        supplySubsidy: pSupplySubsidy,

        csFill: showSurplus && isBelowEq ? [priceConsumersPay, pDemand] : null,
        psFill: showSurplus && isBelowEq ? [pSupply, priceSuppliersKeep] : null,
        taxFill:
          showSurplus && showTax && manualPrice === null && isBelowEq
            ? [priceSuppliersKeep, priceConsumersPay]
            : null,
        subsidyFill:
          showSurplus && showSubsidy && manualPrice === null && isBelowEq
            ? [priceConsumersPay, priceSuppliersKeep]
            : null,
        dwlFill: dwlFill,
      });
    });

    return {
      data,
      eqQ,
      priceConsumersPay,
      priceSuppliersKeep,
      naturalEqP,
      metrics: {
        csValue,
        psValue,
        taxRevenue,
        subsidyCost,
        totalWelfare,
        deadweightLoss,
      },
      maxQ: dynamicMaxQ,
    };
  }, [
    dIntercept,
    dSlope,
    sIntercept,
    sSlope,
    tax,
    showTax,
    subsidy,
    showSubsidy,
    showSurplus,
    manualPrice,
  ]);

  const params: EconomicsParams = {
    dIntercept,
    dSlope,
    showDemand,
    sIntercept,
    sSlope,
    showSupply,
    tax,
    showTax,
    subsidy,
    showSubsidy,
    showSurplus,
    manualPrice,
    isTheoretical,
    maxQ: graphData.maxQ, // Use the calculated one
    maxP,
    calcMode,
    calcInput,
  };

  const setters: EconomicsSetters = {
    setDIntercept,
    setDSlope,
    setShowDemand,
    setSIntercept,
    setSSlope,
    setShowSupply,
    setTax,
    setShowTax: handleSetShowTax,
    setSubsidy,
    setShowSubsidy: handleSetShowSubsidy,
    setShowSurplus,
    setManualPrice,
    setIsTheoretical,
    setMaxQ: () => {}, // Disable manual setting
    setMaxP,
    setCalcMode,
    setCalcInput,
  };

  return { params, setters, graphData };
};
