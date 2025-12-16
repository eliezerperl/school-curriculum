import { useState, useMemo } from 'react';

export const useSupplyDemandLogic = () => {
  // --- STATE ---
  const [dIntercept, setDIntercept] = useState(100);
  const [dSlope, setDSlope] = useState(1);
  const [sIntercept, setSIntercept] = useState(10);
  const [sSlope, setSSlope] = useState(1);
  const [tax, setTax] = useState(0);
  const [showTax, setShowTax] = useState(false);
  const [showSurplus, setShowSurplus] = useState(true);

  // --- MATH ENGINE ---
  const graphData = useMemo(() => {
    const data = [];
    const effectiveSIntercept = showTax ? sIntercept + tax : sIntercept;

    // 1. Calculate Equilibrium
    const eqQ = (dIntercept - effectiveSIntercept) / (dSlope + sSlope);
    const priceConsumersPay = dIntercept - dSlope * eqQ;
    const priceSuppliersKeep = sIntercept + sSlope * eqQ;

    // 2. Calculate Metrics
    const csValue = 0.5 * eqQ * (dIntercept - priceConsumersPay);
    const psValue = 0.5 * eqQ * (priceSuppliersKeep - sIntercept);
    const taxRevenue = showTax ? tax * eqQ : 0;
    const totalWelfare = csValue + psValue + taxRevenue;

    // 3. Generate Points
    const maxQ = Math.max(100, eqQ * 1.5);
    for (let q = 0; q <= maxQ; q += 2) {
      const pDemand = dIntercept - dSlope * q;
      const pSupply = sIntercept + sSlope * q;
      const pSupplyTax = sIntercept + tax + sSlope * q;

      if (pDemand < 0 && pSupply < 0) break;

      const isBelowEq = q <= eqQ;

      data.push({
        q,
        demand: Math.max(0, pDemand),
        supply: Math.max(0, pSupply),
        supplyTax: showTax ? Math.max(0, pSupplyTax) : null,
        csFill: showSurplus && isBelowEq ? [priceConsumersPay, pDemand] : null,
        psFill: showSurplus && isBelowEq ? [pSupply, priceSuppliersKeep] : null,
        taxFill: showSurplus && showTax && isBelowEq ? [priceSuppliersKeep, priceConsumersPay] : null,
      });
    }

    return {
      data,
      eqQ,
      priceConsumersPay,
      priceSuppliersKeep,
      metrics: { csValue, psValue, taxRevenue, totalWelfare },
    };
  }, [dIntercept, dSlope, sIntercept, sSlope, tax, showTax, showSurplus]);

  // Return everything needed by the UI
  return {
    params: { dIntercept, dSlope, sIntercept, sSlope, tax, showTax, showSurplus },
    setters: { setDIntercept, setDSlope, setSIntercept, setSSlope, setTax, setShowTax, setShowSurplus },
    graphData
  };
};