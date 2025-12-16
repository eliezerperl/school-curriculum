import { useSupplyDemandLogic } from './hooks/useSupplyDemandLogic';
import { SupplyDemandGraph } from './components/SupplyDemandGraph';
import { SupplyDemandControls } from './components/SupplyDemandControls';
import { MetricCard } from './components/EconomicsUI';

const SupplyDemand = () => {
  // 1. Get Logic from Hook
  const { params, setters, graphData } = useSupplyDemandLogic();

  return (
    <div className="space-y-6">
      
      {/* 2. Top Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Consumer Surplus" value={graphData.metrics.csValue} color="text-blue-600" bg="bg-blue-50" />
        <MetricCard label="Producer Surplus" value={graphData.metrics.psValue} color="text-emerald-600" bg="bg-emerald-50" />
        {params.showTax && <MetricCard label="Tax Revenue" value={graphData.metrics.taxRevenue} color="text-orange-600" bg="bg-orange-50" />}
        <MetricCard label="Total Welfare" value={graphData.metrics.totalWelfare} color="text-slate-800" bg="bg-slate-100" />
      </div>

      {/* 3. Main Layout: Graph Left, Controls Right */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Side: The Graph (Takes up remaining space) */}
        <div className="flex-1 min-w-0">
          <SupplyDemandGraph 
            data={graphData.data} 
            showTax={params.showTax}
            eqData={{ 
              eqQ: graphData.eqQ, 
              priceConsumersPay: graphData.priceConsumersPay, 
              priceSuppliersKeep: graphData.priceSuppliersKeep 
            }} 
          />
        </div>

        {/* Right Side: The Controls (Fixed width on desktop) */}
        <div className="w-full lg:w-80 shrink-0">
          <SupplyDemandControls params={params} setters={setters} />
        </div>

      </div>
    </div>
  );
};

export default SupplyDemand;