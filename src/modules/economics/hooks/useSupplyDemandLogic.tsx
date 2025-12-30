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
    const demandInterceptQ = dSlope !== 0 ? dIntercept / dSlope : 0;
    const calculatedMaxQ = Math.max(naturalEqQ, demandInterceptQ) * 1.15;
    const dynamicMaxQ = Math.max(20, Math.min(calculatedMaxQ, 500));

    // --- C. CALCULATE ACTUAL METRICS ---
    let eqQ = naturalEqQ;
    let priceConsumersPay = naturalEqP;
    let priceSuppliersKeep = naturalEqP;

    // Safety Clamp for Tax/Subsidy
    const safeTax = Math.min(tax, dIntercept);
    const safeSubsidy = Math.min(subsidy, dIntercept);

    if (manualPrice !== null) {
      priceConsumersPay = manualPrice;
      if (showTax) {
        priceSuppliersKeep = manualPrice - safeTax;
      } else if (showSubsidy) {
        priceSuppliersKeep = manualPrice + safeSubsidy;
      } else {
        priceSuppliersKeep = manualPrice;
      }
      const qd = (dIntercept - priceConsumersPay) / dSlope;
      const qs = (priceSuppliersKeep - sIntercept) / sSlope;
      eqQ = Math.max(0, Math.min(qd, qs));

    } else if (showTax) {
      eqQ = (dIntercept - (sIntercept + safeTax)) / (dSlope + sSlope);
      priceConsumersPay = dIntercept - dSlope * eqQ;
      priceSuppliersKeep = priceConsumersPay - safeTax;
    } else if (showSubsidy) {
      eqQ = (dIntercept - (sIntercept - safeSubsidy)) / (dSlope + sSlope);
      priceConsumersPay = dIntercept - dSlope * eqQ;
      priceSuppliersKeep = priceConsumersPay + safeSubsidy;
    }

    const heightAtQ = dIntercept - dSlope * eqQ;
    const totalWillingnessToPay = ((dIntercept + heightAtQ) / 2) * eqQ;
    const totalConsumerCost = priceConsumersPay * eqQ;
    const csValue = Math.max(0, totalWillingnessToPay - totalConsumerCost);

    const supplyHeightAtQ = sIntercept + sSlope * eqQ;
    const totalRevenue = priceSuppliersKeep * eqQ;
    const totalVariableCost = ((sIntercept + supplyHeightAtQ) / 2) * eqQ;
    const psValue = Math.max(0, totalRevenue - totalVariableCost);

    const taxRevenue = showTax ? safeTax * eqQ : 0;
    const subsidyCost = showSubsidy ? safeSubsidy * eqQ : 0;

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
    
    // Standard points
    for (let q = 0; q <= dynamicMaxQ; q += step) qValues.add(Number(q.toFixed(2)));
    
    // Add Key Points
    if (eqQ >= 0 && eqQ <= dynamicMaxQ) qValues.add(Number(eqQ.toFixed(2)));
    if (demandInterceptQ > 0 && demandInterceptQ <= dynamicMaxQ) {
        qValues.add(Number(demandInterceptQ.toFixed(2)));
    }

    const sortedQs = Array.from(qValues).sort((a, b) => a - b);

    sortedQs.forEach((q) => {
      // Calculate raw prices
      const rawDemand = dIntercept - dSlope * q;
      const rawSupply = sIntercept + sSlope * q;
      const rawSupplyTax = showTax ? rawSupply + safeTax : null;
      const rawSupplySubsidy = showSubsidy ? rawSupply - safeSubsidy : null;

      // === CLEAN LINE LOGIC ===
      // Stop ALL lines if they go below zero (or slightly below zero due to float math)
      // This matches your Custom Curve behavior
      const demand = rawDemand >= -0.01 ? Math.max(0, rawDemand) : null;
      const supply = rawSupply >= -0.01 ? Math.max(0, rawSupply) : null;
      const supplyTax = (rawSupplyTax !== null && rawSupplyTax >= -0.01) ? Math.max(0, rawSupplyTax) : null;
      const supplySubsidy = (rawSupplySubsidy !== null && rawSupplySubsidy >= -0.01) ? Math.max(0, rawSupplySubsidy) : null;

      const isBelowEq = q <= eqQ + 0.001; 

      // Fill Logic (Only fill if lines exist)
      const csFill = showSurplus && isBelowEq && demand !== null ? [priceConsumersPay, demand] : null;
      const psFill = showSurplus && isBelowEq && supply !== null ? [supply, priceSuppliersKeep] : null;
      const taxFill = showSurplus && showTax && isBelowEq ? [priceSuppliersKeep, priceConsumersPay] : null;
      const subsidyFill = showSurplus && showSubsidy && isBelowEq ? [priceConsumersPay, priceSuppliersKeep] : null;

      let dwlFill: number[] | null = null;
      if (showSurplus) {
        // Only draw DWL if both lines exist at this Q
        if (supply !== null && demand !== null) {
            if (eqQ < naturalEqQ) {
                if (q >= eqQ && q <= naturalEqQ) dwlFill = [supply, demand];
            } else if (eqQ > naturalEqQ) {
                if (q >= naturalEqQ && q <= eqQ) dwlFill = [demand, supply];
            }
        }
      }

      data.push({
        q: q,
        demand,
        supply,
        supplyTax,
        supplySubsidy,
        csFill,
        psFill,
        taxFill,
        subsidyFill,
        dwlFill
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