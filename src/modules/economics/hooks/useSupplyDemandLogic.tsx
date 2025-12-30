import { useState, useMemo } from 'react';
import type { GraphPoint, EconomicsParams, EconomicsSetters } from '../types';

export const useSupplyDemandLogic = () => {
  // --- 1. STATE ---
  const [maxP, setMaxP] = useState(200);
  const [calcMode, setCalcMode] = useState<'findP' | 'findQ'>('findP');
  const [calcInput, setCalcInput] = useState<number>(0);

  const [dIntercept, setDIntercept] = useState(50);
  const [dSlope, setDSlope] = useState(1);
  const [showDemand, setShowDemand] = useState(true);

  const [sIntercept, setSIntercept] = useState(5);
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

    // --- B. AUTO-SCALE LOGIC ---
    const demandMaxQ = dSlope !== 0 ? dIntercept / dSlope : 50;
    const calculatedMaxQ = Math.max(naturalEqQ, demandMaxQ) * 1.15;
    const dynamicMaxQ = Math.max(20, Math.min(calculatedMaxQ, 500));

    // --- C. CALCULATE ACTUAL METRICS ---
    let eqQ = naturalEqQ;
    let priceConsumersPay = naturalEqP;
    let priceSuppliersKeep = naturalEqP;

    // === FIX #1: Correct Price Calculation in Manual Mode ===
    if (manualPrice !== null) {
      priceConsumersPay = manualPrice;
      
      // Calculate what suppliers ACTUALLY keep (Price - Tax)
      if (showTax) {
        priceSuppliersKeep = manualPrice - tax;
      } else if (showSubsidy) {
        priceSuppliersKeep = manualPrice + subsidy;
      } else {
        priceSuppliersKeep = manualPrice;
      }

      const qd = (dIntercept - priceConsumersPay) / dSlope;
      const qs = (priceSuppliersKeep - sIntercept) / sSlope;
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

    // === FIX #2: Always calculate Tax/Subsidy Revenue ===
    const taxRevenue = showTax ? tax * eqQ : 0;
    const subsidyCost = showSubsidy ? subsidy * eqQ : 0;

    const quantityDistortion = Math.abs(naturalEqQ - eqQ);
    const demandAtEqQ = dIntercept - dSlope * eqQ;
    const supplyAtEqQ = sIntercept + sSlope * eqQ;
    const priceGap = Math.abs(demandAtEqQ - supplyAtEqQ);
    const deadweightLoss = 0.5 * quantityDistortion * priceGap;

    const totalWelfare = showSubsidy
      ? csValue + psValue - subsidyCost
      : csValue + psValue + taxRevenue;

    // --- D. GENERATE POINTS LOOP ---
    const step = dynamicMaxQ > 100 ? dynamicMaxQ / 100 : 1;
    const qValues = new Set<number>();
    for (let q = 0; q <= dynamicMaxQ; q += step) qValues.add(Number(q.toFixed(2)));
    if (eqQ >= 0 && eqQ <= dynamicMaxQ) qValues.add(Number(eqQ.toFixed(2)));
    const sortedQs = Array.from(qValues).sort((a, b) => a - b);

    sortedQs.forEach((q) => {
      const pDemand = dIntercept - dSlope * q;
      const pSupply = sIntercept + sSlope * q;
      
      // === FIX #3: Always show the lines ===
      const pSupplyTax = showTax ? pSupply + tax : null;
      const pSupplySubsidy = showSubsidy ? pSupply - subsidy : null;
      
      const isBelowEq = q <= eqQ + 0.001;

      let dwlFill: number[] | null = null;
      if (showSurplus) {
        if (eqQ < naturalEqQ) {
          if (q >= eqQ && q <= naturalEqQ) dwlFill = [pSupply, pDemand];
        } else if (eqQ > naturalEqQ) {
          if (q >= naturalEqQ && q <= eqQ) dwlFill = [pDemand, pSupply];
        }
      }

      data.push({
        q: q,
        demand: Math.max(0, pDemand),
        supply: pSupply,
        supplyTax: pSupplyTax,
        supplySubsidy: pSupplySubsidy,

        // CS: Blue Area
        csFill: showSurplus && isBelowEq ? [priceConsumersPay, pDemand] : null,
        
        // PS: Green Area (Correctly stops at priceSuppliersKeep)
        psFill: showSurplus && isBelowEq ? [pSupply, priceSuppliersKeep] : null,
        
        // === FIX #4: Tax Fill (Orange Area) ===
        // Removed 'manualPrice === null' so it shows up in manual mode too!
        taxFill: showSurplus && showTax && isBelowEq
            ? [priceSuppliersKeep, priceConsumersPay]
            : null,
            
        subsidyFill: showSurplus && showSubsidy && isBelowEq
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
    dIntercept, dSlope, sIntercept, sSlope, tax, showTax, subsidy, showSubsidy, 
    showSurplus, manualPrice,
  ]);

  const params: EconomicsParams = {
    dIntercept, dSlope, showDemand,
    sIntercept, sSlope, showSupply,
    tax, showTax, subsidy, showSubsidy, showSurplus,
    manualPrice,
    isTheoretical,
    maxQ: graphData.maxQ,
    maxP,
    calcMode,
    calcInput,
  };

  const setters: EconomicsSetters = {
    setDIntercept, setDSlope, setShowDemand,
    setSIntercept, setSSlope, setShowSupply,
    setTax, setShowTax: handleSetShowTax,
    setSubsidy, setShowSubsidy: handleSetShowSubsidy,
    setShowSurplus,
    setManualPrice,
    setIsTheoretical,
    setMaxQ: () => {},
    setMaxP, setCalcMode, setCalcInput,
  };

  return { params, setters, graphData };
};