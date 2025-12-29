import { useState, useMemo } from 'react';
import type { GraphPoint, EconomicsParams, EconomicsSetters } from '../types';

export const useSupplyDemandLogic = () => {
  // --- 1. STATE ---
  // Scale & Calculator
  const [maxQ, setMaxQ] = useState(120);
  const [maxP, setMaxP] = useState(200);
  const [calcMode, setCalcMode] = useState<'findP' | 'findQ'>('findP');
  const [calcInput, setCalcInput] = useState<number>(0);

  // Math State
  const [dIntercept, setDIntercept] = useState(150);
  const [dSlope, setDSlope] = useState(1);
  const [showDemand, setShowDemand] = useState(true); // <--- ADDED

  const [sIntercept, setSIntercept] = useState(50);
  const [sSlope, setSSlope] = useState(1);
  const [showSupply, setShowSupply] = useState(true); // <--- ADDED

  // Policy State
  const [tax, setTax] = useState(0);
  const [showTax, setShowTax] = useState(false);
  const [subsidy, setSubsidy] = useState(20);
  const [showSubsidy, setShowSubsidy] = useState(false);
  const [showSurplus, setShowSurplus] = useState(true);

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
    let eqQ = 0;
    let priceConsumersPay = 0;
    let priceSuppliersKeep = 0;

    const standardEqQ = (dIntercept - sIntercept) / (dSlope + sSlope);

    if (showTax) {
      eqQ = (dIntercept - (sIntercept + tax)) / (dSlope + sSlope);
      priceConsumersPay = dIntercept - dSlope * eqQ;
      priceSuppliersKeep = priceConsumersPay - tax;
    } else if (showSubsidy) {
      eqQ = (dIntercept - (sIntercept - subsidy)) / (dSlope + sSlope);
      priceConsumersPay = dIntercept - dSlope * eqQ;
      priceSuppliersKeep = priceConsumersPay + subsidy;
    } else {
      eqQ = standardEqQ;
      priceConsumersPay = dIntercept - dSlope * eqQ;
      priceSuppliersKeep = priceConsumersPay;
    }

    // --- B. CALCULATE METRICS ---
    const csValue = 0.5 * eqQ * (dIntercept - priceConsumersPay);
    const psValue = 0.5 * eqQ * (priceSuppliersKeep - sIntercept);
    const taxRevenue = showTax ? tax * eqQ : 0;
    const subsidyCost = showSubsidy ? subsidy * eqQ : 0;

    const totalWelfare = showSubsidy
      ? csValue + psValue - subsidyCost
      : csValue + psValue + taxRevenue;

    // --- C. GENERATE POINTS LOOP ---
    const step = maxQ > 500 ? maxQ / 100 : 1;

    for (let q = 0; q <= maxQ; q += step) {
      const pDemand = dIntercept - dSlope * q;
      const pSupply = sIntercept + sSlope * q;
      const pSupplyTax = showTax ? pSupply + tax : null;
      const pSupplySubsidy = showSubsidy ? pSupply - subsidy : null;
      const isBelowEq = q <= eqQ;

      data.push({
        q: Number(q.toFixed(1)),
        demand: Math.max(0, pDemand),
        supply: pSupply,
        supplyTax: pSupplyTax,
        supplySubsidy: pSupplySubsidy,
        
        csFill: showSurplus && isBelowEq ? [priceConsumersPay, pDemand] : null,
        psFill: showSurplus && isBelowEq ? [pSupply, priceSuppliersKeep] : null,
        taxFill: showSurplus && showTax && isBelowEq ? [priceSuppliersKeep, priceConsumersPay] : null,
        subsidyFill: showSurplus && showSubsidy && isBelowEq ? [priceConsumersPay, priceSuppliersKeep] : null,
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
    dIntercept, dSlope, sIntercept, sSlope, tax, showTax, subsidy, showSubsidy, showSurplus, maxQ
  ]);

  // --- 4. RETURN EVERYTHING ---
  const params: EconomicsParams = {
    dIntercept, dSlope, showDemand,
    sIntercept, sSlope, showSupply,
    tax, showTax,
    subsidy, showSubsidy,
    showSurplus,
    maxQ, maxP, calcMode, calcInput,
  };

  const setters: EconomicsSetters = {
    setDIntercept, setDSlope, setShowDemand,
    setSIntercept, setSSlope, setShowSupply,
    setTax, setShowTax: handleSetShowTax,
    setSubsidy, setShowSubsidy: handleSetShowSubsidy,
    setShowSurplus,
    setMaxQ, setMaxP, setCalcMode, setCalcInput,
  };

  return { params, setters, graphData };
};