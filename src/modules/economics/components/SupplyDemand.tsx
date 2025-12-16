import { useSupplyDemandLogic } from '../hooks/useSupplyDemandLogic';
import { SupplyDemandGraph } from './SupplyDemandGraph';
import { SupplyDemandControls } from './SupplyDemandControls';
import { MetricCard } from './EconomicsUI';

export const SupplyDemand = () => {
  const { params, setters, graphData } = useSupplyDemandLogic();

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* 1. Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Consumer Surplus"
          value={graphData.metrics.csValue}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <MetricCard
          label="Producer Surplus"
          value={graphData.metrics.psValue}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        {params.showTax && (
          <MetricCard
            label="Tax Revenue"
            value={graphData.metrics.taxRevenue}
            color="text-orange-600"
            bg="bg-orange-50"
          />
        )}
        <MetricCard
          label="Total Welfare"
          value={graphData.metrics.totalWelfare}
          color="text-slate-800"
          bg="bg-slate-100"
        />
      </div>

      {/* 2. Main Layout 
          - On XL screens (Desktops): Side by Side
          - On L/M screens (Laptops): Stacked (Graph on top, full width)
      */}
      <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0">
        {/* Graph Area */}
        <div className="flex-1 min-w-0">
          <SupplyDemandGraph
            data={graphData.data}
            showTax={params.showTax}
            eqData={{
              eqQ: graphData.eqQ,
              priceConsumersPay: graphData.priceConsumersPay,
              priceSuppliersKeep: graphData.priceSuppliersKeep,
            }}
          />
        </div>

        {/* Controls Area */}
        <div className="w-full xl:w-80 shrink-0">
          <SupplyDemandControls params={params} setters={setters} />
        </div>
      </div>
    </div>
  );
};

export default SupplyDemand;
