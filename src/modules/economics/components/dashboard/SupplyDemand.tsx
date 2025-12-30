import { useSupplyDemandLogic } from '../../hooks/useSupplyDemandLogic';
import { SupplyDemandGraph } from './SupplyDemandGraph';
import { SupplyDemandControls } from './SupplyDemandControls';
import { MetricCard } from '../ui/EconomicsUI';
import { useMemo, useState } from 'react';
import type { CustomCurve, GraphPoint } from '../../types';

export const SupplyDemand = () => {
  const { params, setters, graphData } = useSupplyDemandLogic();

  const [customCurves, setCustomCurves] = useState<CustomCurve[]>([]);

  const addCurve = (c: CustomCurve) => setCustomCurves([...customCurves, c]);
  const removeCurve = (id: string) =>
    setCustomCurves(customCurves.filter((c) => c.id !== id));

  const updateCurve = (
    id: string,
    field: keyof CustomCurve,
    // We allow string just in case, but currently only numbers/booleans are used for linear
    value: number | boolean | string 
  ) => {
    setCustomCurves((prevCurves) =>
      prevCurves.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const formatMetric = (val: number, isTheoretical: boolean, label: string) => {
    if (!isTheoretical) return val;
    switch (label) {
      case 'Consumer Surplus': return "CS";
      case 'Producer Surplus': return "PS";
      case 'Tax Revenue': return "Tax Rev";
      case 'Subsidy Cost': return "Sub Cost";
      case 'Deadweight Loss': return "DWL";
      case 'Total Welfare': return "Welfare";
      default: return "---";
    }
  };

  const mergedGraphData = useMemo(() => {
    return graphData.data.map((point) => {
      // FIX: Cast to allow 'number | null' so TypeScript doesn't complain
      const newPoint = { ...point } as GraphPoint & { [key: string]: number | null };

      customCurves.forEach((curve) => {
        // === STRICT LINEAR LOGIC ONLY ===
        // Formula: P = Intercept + (Slope * Q)
        const price = curve.intercept + curve.slope * point.q;

        // "Stop at Zero" Rule:
        // If price goes below zero, return null to make the line stop drawing.
        // We use -0.01 tolerance to catch floating point math errors.
        newPoint[curve.id] = price >= -0.01 ? Math.max(0, price) : null;
      });

      return newPoint;
    });
  }, [graphData.data, customCurves]);

  return (
    <div className="space-y-4 flex flex-col">
      {/* 1. Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard
          label="Consumer Surplus"
          value={formatMetric(graphData.metrics.csValue, params.isTheoretical, 'Consumer Surplus')}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <MetricCard
          label="Producer Surplus"
          value={formatMetric(graphData.metrics.psValue, params.isTheoretical, 'Producer Surplus')}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        {params.showTax && (
          <MetricCard
            label="Tax Revenue"
            value={formatMetric(graphData.metrics.taxRevenue, params.isTheoretical, 'Tax Revenue')}
            color="text-orange-600"
            bg="bg-orange-50"
          />
        )}
        {params.showSubsidy && (
          <MetricCard
            label="Subsidy Cost"
            value={formatMetric(graphData.metrics.subsidyCost, params.isTheoretical, 'Subsidy Cost')}
            color="text-purple-600"
            bg="bg-purple-50"
          />
        )}
        {graphData.metrics.deadweightLoss > 0.01 && (
          <MetricCard
            label="Deadweight Loss"
            value={formatMetric(graphData.metrics.deadweightLoss, params.isTheoretical, 'Deadweight Loss')}
            color="text-red-600"
            bg="bg-red-50"
          />
        )}
        <MetricCard
          label="Total Welfare"
          value={formatMetric(graphData.metrics.totalWelfare, params.isTheoretical, 'Total Welfare')}
          color="text-slate-800"
          bg="bg-slate-100"
        />
      </div>

      {/* 2. Main Layout */}
      <div className="flex flex-col xl:flex-row gap-6 flex-1">
        {/* Graph Area */}
        <div className="flex-1 min-w-0">
          <SupplyDemandGraph
            data={mergedGraphData}
            showTax={params.showTax}
            showSubsidy={params.showSubsidy}
            eqData={{
              eqQ: graphData.eqQ,
              priceConsumersPay: graphData.priceConsumersPay,
              priceSuppliersKeep: graphData.priceSuppliersKeep,
            }}
            showDemand={params.showDemand}
            showSupply={params.showSupply}
            customCurves={customCurves}
            isTheoretical={params.isTheoretical}
          />
        </div>

        {/* Controls Area */}
        <div className="w-full xl:w-80 shrink-0">
          <SupplyDemandControls
            params={params}
            setters={setters}
            customCurves={customCurves}
            addCurve={addCurve}
            removeCurve={removeCurve}
            updateCurve={updateCurve}
            naturalEqP={graphData.naturalEqP}
          />
        </div>
      </div>
    </div>
  );
};