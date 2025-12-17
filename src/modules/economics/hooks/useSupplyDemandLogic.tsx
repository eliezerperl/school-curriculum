import { useState, useMemo } from 'react';
import type { GraphPoint } from '../types'; // Adjust path if needed

export const useSupplyDemandLogic = () => {
  // --- 1. STATE ---
  // Scale & Calculator State
  const [maxQ, setMaxQ] = useState(120);
  const [maxP, setMaxP] = useState(200);
  const [calcMode, setCalcMode] = useState<'findP' | 'findQ'>('findP');
  const [calcInput, setCalcInput] = useState<number>(0);

  // Math State
  const [dIntercept, setDIntercept] = useState(100);
  const [dSlope, setDSlope] = useState(1);
  const [sIntercept, setSIntercept] = useState(10);
  const [sSlope, setSSlope] = useState(1);

  // Policy State
  const [tax, setTax] = useState(0);
  const [showTax, setShowTax] = useState(false);

  // NEW: Subsidy State
  const [subsidy, setSubsidy] = useState(20);
  const [showSubsidy, setShowSubsidy] = useState(false);

  const [showSurplus, setShowSurplus] = useState(true);

  // --- 2. TOGGLE LOGIC (Must be outside useMemo) ---
  const handleSetShowTax = (val: boolean) => {
    setShowTax(val);
    if (val) setShowSubsidy(false); // Tax and Subsidy can't both be on
  };

  const handleSetShowSubsidy = (val: boolean) => {
    setShowSubsidy(val);
    if (val) setShowTax(false); // Tax and Subsidy can't both be on
  };

  // --- 3. MATH ENGINE ---
  const graphData = useMemo(() => {
    const data: GraphPoint[] = [];

    // --- A. CALCULATE EQUILIBRIUM ---
    let eqQ = 0;
    let priceConsumersPay = 0;
    let priceSuppliersKeep = 0;

    // Standard Equilibrium (No Policy)
    const standardEqQ = (dIntercept - sIntercept) / (dSlope + sSlope);

    if (showTax) {
      // TAX: Supply Shifts UP (Intercept + Tax)
      // Eq: dInt - dSlope*Q = (sInt + Tax) + sSlope*Q
      eqQ = (dIntercept - (sIntercept + tax)) / (dSlope + sSlope);
      priceConsumersPay = dIntercept - dSlope * eqQ; // Higher Price
      priceSuppliersKeep = priceConsumersPay - tax; // Lower Price
    } else if (showSubsidy) {
      // SUBSIDY: Supply Shifts DOWN (Intercept - Subsidy)
      // Eq: dInt - dSlope*Q = (sInt - Subsidy) + sSlope*Q
      eqQ = (dIntercept - (sIntercept - subsidy)) / (dSlope + sSlope);
      priceConsumersPay = dIntercept - dSlope * eqQ; // Lower Price
      priceSuppliersKeep = priceConsumersPay + subsidy; // Higher Price (Price + Gov check)
    } else {
      // NORMAL
      eqQ = standardEqQ;
      priceConsumersPay = dIntercept - dSlope * eqQ;
      priceSuppliersKeep = priceConsumersPay;
    }

    // --- B. CALCULATE METRICS ---
    const csValue = 0.5 * eqQ * (dIntercept - priceConsumersPay);
    const psValue = 0.5 * eqQ * (priceSuppliersKeep - sIntercept);

    // Tax Revenue vs Subsidy Cost
    const taxRevenue = showTax ? tax * eqQ : 0;
    const subsidyCost = showSubsidy ? subsidy * eqQ : 0;

    // Total Welfare
    // If Subsidy: Welfare = CS + PS - SubsidyCost
    const totalWelfare = showSubsidy
      ? csValue + psValue - subsidyCost
      : csValue + psValue + taxRevenue;

    // --- C. GENERATE POINTS LOOP ---
    // Use maxQ from state so loop scales with graph
    const step = maxQ > 500 ? maxQ / 100 : 1;

    for (let q = 0; q <= maxQ; q += step) {
      // Demand: P = Int - Slope*Q
      const pDemand = dIntercept - dSlope * q;

      // Supply: P = Int + Slope*Q
      const pSupply = sIntercept + sSlope * q;

      // Policy Curves
      const pSupplyTax = showTax ? pSupply + tax : null;
      const pSupplySubsidy = showSubsidy ? pSupply - subsidy : null;

      const isBelowEq = q <= eqQ;

      data.push({
        q: Number(q.toFixed(1)),
        demand: Math.max(0, pDemand),
        supply: pSupply,
        supplyTax: pSupplyTax,
        supplySubsidy: pSupplySubsidy,

        // --- D. SHADING LOGIC (FILLS) ---
        // Consumer Surplus (Always area below Demand and above PriceConsumerPays)
        csFill: showSurplus && isBelowEq ? [priceConsumersPay, pDemand] : null,

        // Producer Surplus (Always area above Supply and below PriceSuppliersKeep)
        psFill: showSurplus && isBelowEq ? [pSupply, priceSuppliersKeep] : null,

        // Tax Revenue (Rectangle between prices)
        taxFill:
          showSurplus && showTax && isBelowEq
            ? [priceSuppliersKeep, priceConsumersPay]
            : null,

        subsidyFill:
          showSurplus && showSubsidy && isBelowEq
            ? [priceConsumersPay, priceSuppliersKeep]
            : null,
      });
    }

    return {
      data,
      eqQ,
      priceConsumersPay,
      priceSuppliersKeep,
      metrics: { csValue, psValue, taxRevenue, subsidyCost, totalWelfare },
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
    maxQ,
  ]);

  // --- 4. RETURN EVERYTHING ---
  return {
    params: {
      dIntercept,
      dSlope,
      sIntercept,
      sSlope,
      tax,
      showTax,
      subsidy,
      showSubsidy, // Pass Subsidy Params
      showSurplus,
      maxQ,
      maxP,
      calcMode,
      calcInput,
    },
    setters: {
      setDIntercept,
      setDSlope,
      setSIntercept,
      setSSlope,
      setTax,
      setShowTax: handleSetShowTax, // Use our wrapper
      setSubsidy,
      setShowSubsidy: handleSetShowSubsidy, // Use our wrapper
      setShowSurplus,
      setMaxQ,
      setMaxP,
      setCalcMode,
      setCalcInput,
    },
    graphData,
  };
};
