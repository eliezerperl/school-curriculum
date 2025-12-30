import { useState, useMemo } from 'react';
import type { GraphPoint, EconomicsParams, EconomicsSetters } from '../types';

export const useSupplyDemandLogic = () => {
  // --- STATE ---
  const [maxQ, setMaxQ] = useState(120);
  const [maxP, setMaxP] = useState(200);
  const [calcMode, setCalcMode] = useState<'findP' | 'findQ'>('findP');
  const [calcInput, setCalcInput] = useState<number>(0);

  const [dIntercept, setDIntercept] = useState(150);
  const [dSlope, setDSlope] = useState(1);
  const [showDemand, setShowDemand] = useState(true);

  const [sIntercept, setSIntercept] = useState(50);
  const [sSlope, setSSlope] = useState(1);
  const [showSupply, setShowSupply] = useState(true);

  const [tax, setTax] = useState(0);
  const [showTax, setShowTax] = useState(false);
  const [subsidy, setSubsidy] = useState(20);
  const [showSubsidy, setShowSubsidy] = useState(false);
  const [showSurplus, setShowSurplus] = useState(true);

  const [manualPrice, setManualPrice] = useState<number | null>(null);

  const [isTheoretical, setIsTheoretical] = useState(false);

  // --- TOGGLE LOGIC ---
  const handleSetShowTax = (val: boolean) => {
    setShowTax(val);
    if (val) setShowSubsidy(false);
  };

  const handleSetShowSubsidy = (val: boolean) => {
    setShowSubsidy(val);
    if (val) setShowTax(false);
  };

  // --- MATH ENGINE ---
  const graphData = useMemo(() => {
    const data: GraphPoint[] = [];

    // 1. Calculate Natural Equilibrium first (we need this for the Reset logic)
    const naturalEqQ = (dIntercept - sIntercept) / (dSlope + sSlope);
    const naturalEqP = dIntercept - dSlope * naturalEqQ;

    // 2. Determine ACTUAL Price and Quantity
    let eqQ = naturalEqQ;
    let priceConsumersPay = naturalEqP;
    let priceSuppliersKeep = naturalEqP;

    if (manualPrice !== null) {
      // === MANUAL MODE (Monopoly / Price Control) ===
      priceConsumersPay = manualPrice;
      priceSuppliersKeep = manualPrice; // Ignoring tax for simplicity in manual mode

      // Quantity Demanded at this price
      const qd = (dIntercept - manualPrice) / dSlope;
      // Quantity Supplied at this price
      const qs = (manualPrice - sIntercept) / sSlope;

      // The market trades at the LOWER of the two (Short Side Rule)
      // e.g., if Price is high, only Qd is bought. If Price is low, only Qs is sold.
      eqQ = Math.max(0, Math.min(qd, qs));
    } else if (showTax) {
      // Tax Logic
      eqQ = (dIntercept - (sIntercept + tax)) / (dSlope + sSlope);
      priceConsumersPay = dIntercept - dSlope * eqQ;
      priceSuppliersKeep = priceConsumersPay - tax;
    } else if (showSubsidy) {
      // Subsidy Logic
      eqQ = (dIntercept - (sIntercept - subsidy)) / (dSlope + sSlope);
      priceConsumersPay = dIntercept - dSlope * eqQ;
      priceSuppliersKeep = priceConsumersPay + subsidy;
    }

    // --- METRICS CALCULATION ---
    // Consumer Surplus: Area below Demand, above Price, up to Q
    // Area of Trapezoid: (TopBase + BottomBase) / 2 * Height
    // Or simpler: Total Utility - Cost
    // CS = Integral(0 to Q) of (Demand - PricePaid)
    // Since Demand is linear: 0.5 * Q * (Intercept - PriceAtQ) + Q * (PriceAtQ - PricePaid)
    // Let's stick to the triangle formula which works if Q matches Demand.
    // If Q < Qd (Shortage), it's a Trapezoid.

    // Robust CS Calc (Area under Demand curve - Price Paid)
    const totalWillingnessToPay =
      ((dIntercept + (dIntercept - dSlope * eqQ)) / 2) * eqQ;
    const totalConsumerCost = priceConsumersPay * eqQ;
    const csValue = Math.max(0, totalWillingnessToPay - totalConsumerCost);

    // Robust PS Calc (Total Revenue - Area under Supply curve)
    const totalRevenue = priceSuppliersKeep * eqQ;
    const totalVariableCost =
      ((sIntercept + (sIntercept + sSlope * eqQ)) / 2) * eqQ;
    const psValue = Math.max(0, totalRevenue - totalVariableCost);

    const taxRevenue = showTax && manualPrice === null ? tax * eqQ : 0;
    const subsidyCost = showSubsidy && manualPrice === null ? subsidy * eqQ : 0;

    const totalWelfare = showSubsidy
      ? csValue + psValue - subsidyCost
      : csValue + psValue + taxRevenue;

    // --- GRAPH POINTS GENERATION ---
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

        // Shading Logic
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
      });
    }

    return {
      data,
      eqQ,
      priceConsumersPay,
      priceSuppliersKeep,
      naturalEqP,
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
    maxQ,
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
    setMaxQ,
    setMaxP,
    setCalcMode,
    setCalcInput,
  };

  return { params, setters, graphData };
};
