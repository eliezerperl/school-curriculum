import React from 'react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, Line, ReferenceDot, ReferenceLine } from 'recharts';
import type { GraphPoint } from '../types';

interface Props {
  data: GraphPoint[];
  showTax: boolean;
  eqData: { 
    eqQ: number; 
    priceConsumersPay: number; 
    priceSuppliersKeep: number 
  };
}

export const SupplyDemandGraph: React.FC<Props> = ({ data, showTax, eqData }) => {
  return (
    // UPDATED HEIGHT CLASSES BELOW:
    <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 h-[60vh] min-h-125 w-full flex flex-col">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
           <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
           <XAxis dataKey="q" label={{ value: 'Quantity', position: 'insideBottomRight', offset: -10 }} type="number" />
           <YAxis label={{ value: 'Price', angle: -90, position: 'insideLeft' }} />
           
           <Tooltip
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number | number[] | undefined) => {
              if (value === undefined || value === null || Array.isArray(value)) return [];
              return Number(value).toFixed(2);
            }}
            labelFormatter={(label) => `Q: ${label}`}
          />

           <Area type="monotone" dataKey="csFill" stroke="none" fill="#3b82f6" fillOpacity={0.2} name="Consumer Surplus" />
           <Area type="monotone" dataKey="psFill" stroke="none" fill="#10b981" fillOpacity={0.2} name="Producer Surplus" />
           <Area type="monotone" dataKey="taxFill" stroke="none" fill="#f97316" fillOpacity={0.3} name="Tax Revenue" />
           
           <Line type="monotone" dataKey="demand" stroke="#2563eb" strokeWidth={3} dot={false} name="Demand" />
           <Line type="monotone" dataKey="supply" stroke="#10b981" strokeWidth={showTax ? 2 : 3} strokeDasharray={showTax ? '5 5' : '0'} opacity={showTax ? 0.6 : 1} dot={false} name="Supply" />
           {showTax && <Line type="monotone" dataKey="supplyTax" stroke="#f97316" strokeWidth={3} dot={false} name="Supply + Tax" />}

           <ReferenceDot x={eqData.eqQ} y={eqData.priceConsumersPay} r={5} fill="#2563eb" stroke="none" />
           {showTax && <ReferenceDot x={eqData.eqQ} y={eqData.priceSuppliersKeep} r={5} fill="#10b981" stroke="none" /> }
           <ReferenceLine x={eqData.eqQ} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: `Q*=${eqData.eqQ.toFixed(1)}`, position: 'insideTopLeft', fill: '#64748b', fontSize: 12 }} />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};