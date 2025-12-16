import { useState, useMemo } from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot } from 'recharts';
import { TrendingUp, DollarSign } from 'lucide-react';

const SupplyDemand = () => {
  // --- STATE ---
  const [dIntercept, setDIntercept] = useState(100); 
  const [dSlope, setDSlope] = useState(1);           
  const [sIntercept, setSIntercept] = useState(10);  
  const [sSlope, setSSlope] = useState(1);           
  const [tax, setTax] = useState(0);                 
  const [showTax, setShowTax] = useState(false);     

  // --- MATH ENGINE ---
  const graphData = useMemo(() => {
    const data = [];
    const effectiveSIntercept = showTax ? sIntercept + tax : sIntercept;

    // Equilibrium Calculation
    const eqQ = (dIntercept - effectiveSIntercept) / (dSlope + sSlope);
    const eqP = dIntercept - (dSlope * eqQ);

    const maxQ = Math.max(100, eqQ * 1.5);
    
    for (let q = 0; q <= maxQ; q += 5) {
      const pDemand = dIntercept - (dSlope * q);
      const pSupply = sIntercept + (sSlope * q);
      const pSupplyTax = (sIntercept + tax) + (sSlope * q);

      if (pDemand < 0 && pSupply < 0) break;

      data.push({
        q: q,
        demand: Math.max(0, pDemand),
        supply: Math.max(0, pSupply),
        supplyTax: showTax ? Math.max(0, pSupplyTax) : null,
      });
    }

    return { data, eqQ, eqP };
  }, [dIntercept, dSlope, sIntercept, sSlope, tax, showTax]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        
        {/* Demand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-blue-600 font-bold">
            <TrendingUp className="rotate-180" /> Demand
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Intercept (Max Price)</label>
            <input type="range" min="50" max="200" value={dIntercept} onChange={(e) => setDIntercept(Number(e.target.value))} className="w-full accent-blue-600"/>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Slope</label>
            <input type="range" min="0.5" max="3" step="0.1" value={dSlope} onChange={(e) => setDSlope(Number(e.target.value))} className="w-full accent-blue-600"/>
          </div>
        </div>

        {/* Supply */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 font-bold">
            <TrendingUp /> Supply
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Intercept (Min Cost)</label>
            <input type="range" min="0" max="50" value={sIntercept} onChange={(e) => setSIntercept(Number(e.target.value))} className="w-full accent-emerald-600"/>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Slope</label>
            <input type="range" min="0.5" max="3" step="0.1" value={sSlope} onChange={(e) => setSSlope(Number(e.target.value))} className="w-full accent-emerald-600"/>
          </div>
        </div>

        {/* Policy */}
        <div className="space-y-4 border-l pl-4 border-slate-100">
          <div className="flex items-center gap-2 text-orange-600 font-bold">
            <DollarSign /> Policy
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={showTax} onChange={(e) => setShowTax(e.target.checked)} className="w-5 h-5 rounded text-orange-600"/>
            <span className="text-sm font-medium">Apply Tax</span>
          </div>
          {showTax && (
            <div>
              <label className="text-xs font-semibold text-slate-500">Tax Amount: ${tax}</label>
              <input type="range" min="0" max="50" value={tax} onChange={(e) => setTax(Number(e.target.value))} className="w-full accent-orange-500"/>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 h-[500px]">
        <h2 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
          Market Equilibrium
          <span className="text-xs font-normal text-slate-400 ml-auto">
            Eq Price: ${graphData.eqP.toFixed(2)} | Eq Qty: {graphData.eqQ.toFixed(2)}
          </span>
        </h2>
        
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={graphData.data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="q" label={{ value: 'Quantity (Q)', position: 'insideBottomRight', offset: -10 }} type="number"/>
            <YAxis label={{ value: 'Price (P)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Line type="monotone" dataKey="demand" stroke="#2563eb" strokeWidth={3} dot={false} name="Demand"/>
            <Line type="monotone" dataKey="supply" stroke="#10b981" strokeWidth={showTax ? 2 : 3} strokeDasharray={showTax ? "5 5" : "0"} opacity={showTax ? 0.6 : 1} dot={false} name="Supply (Original)"/>
            {showTax && <Line type="monotone" dataKey="supplyTax" stroke="#f97316" strokeWidth={3} dot={false} name="Supply + Tax"/>}
            <ReferenceDot x={graphData.eqQ} y={graphData.eqP} r={6} fill="#ef4444" stroke="none" />
            <ReferenceLine x={graphData.eqQ} stroke="#ef4444" strokeDasharray="3 3" />
            <ReferenceLine y={graphData.eqP} stroke="#ef4444" strokeDasharray="3 3" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SupplyDemand;