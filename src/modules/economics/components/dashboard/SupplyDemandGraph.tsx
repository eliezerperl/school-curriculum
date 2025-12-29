import React from 'react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, Line, ReferenceDot, ReferenceLine } from 'recharts';
import type { CustomCurve, GraphPoint, CustomLabelProps } from '../../types';

interface Props {
  data: GraphPoint[];
  showTax: boolean;
  showSubsidy: boolean;
  // New visibility props
  showDemand?: boolean;
  showSupply?: boolean;
  eqData: {
    eqQ: number;
    priceConsumersPay: number;
    priceSuppliersKeep: number;
  };
  customCurves: CustomCurve[];
}

export const SupplyDemandGraph: React.FC<Props> = ({
  data,
  showTax,
  showSubsidy,
  showDemand = true, // Default to true if undefined
  showSupply = true,
  eqData,
  customCurves,
}) => {
  const renderLabel = (props: CustomLabelProps, text: string) => {
    const { x, y, stroke, index } = props;
    if (index === data.length - 1 && typeof x === 'number' && typeof y === 'number') {
      return (
        <text x={x} y={y} dx={10} dy={4} fill={stroke} fontSize={12} fontWeight="bold" textAnchor="start">
          {text}
        </text>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 h-[60vh] min-h-125 w-full flex flex-col">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 60, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="q" label={{ value: 'Quantity', position: 'insideBottomRight', offset: -10 }} type="number" />
          <YAxis label={{ value: 'Price', angle: -90, position: 'insideLeft' }} />
          
          <Tooltip
            // 1. This tells Recharts: "If the formatter returns null, do not even render the row"
            filterNull={true}
            // 2. We explicitly filter the items list before it even tries to render
            itemSorter={(item) => {
              // Only allow items that are numbers and NOT arrays (surplus fills are arrays)
              if (Array.isArray(item.value) || item.value === null) return -1;
              return 1;
            }}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            formatter={(value: number | number[] | undefined) => {
              if (value === undefined || value === null || Array.isArray(value))
                return null;
              return Number(value).toFixed(2);
            }}
            labelFormatter={(label) => `Q: ${label}`}
          />

          <Area type="monotone" dataKey="csFill" stroke="none" fill="#3b82f6" fillOpacity={0.2} name="Consumer Surplus" />
          <Area type="monotone" dataKey="psFill" stroke="none" fill="#10b981" fillOpacity={0.2} name="Producer Surplus" />
          <Area type="monotone" dataKey="taxFill" stroke="none" fill="#f97316" fillOpacity={0.3} name="Tax Revenue" />
          <Area type="monotone" dataKey="subsidyFill" stroke="none" fill="#9333ea" fillOpacity={0.3} name="Subsidy Cost" />

          {/* Conditional Demand Line */}
          {showDemand && (
            <Line 
              type="monotone" dataKey="demand" stroke="#2563eb" strokeWidth={3} dot={false} name="Demand" 
              label={(props) => renderLabel(props, 'Demand')} 
            />
          )}

          {/* Conditional Supply Line */}
          {showSupply && (
            <Line 
              type="monotone" dataKey="supply" stroke="#10b981" strokeWidth={showTax ? 2 : 3} 
              strokeDasharray={showTax ? '5 5' : '0'} opacity={showTax ? 0.6 : 1} dot={false} name="Supply"
              label={(props) => renderLabel(props, "Supply")} 
            />
          )}
          
          {showSupply && showTax && (
            <Line type="monotone" dataKey="supplyTax" stroke="#f97316" strokeWidth={3} dot={false} name="Supply + Tax" 
              label={(props) => renderLabel(props, "S + Tax")} 
            />
          )}
          
          {showSupply && showSubsidy && (
            <Line type="monotone" dataKey="supplySubsidy" stroke="#9333ea" strokeWidth={3} dot={false} name="Supply - Sub" 
              label={(props) => renderLabel(props, "S - Sub")} 
            />
          )}

          {customCurves.map((curve) => (
            <Line
              key={curve.id} type="monotone" dataKey={curve.id} name={curve.name} stroke={curve.color}
              strokeWidth={2.5} strokeDasharray={curve.isDashed ? '5 5' : '0'} dot={false}
              label={(props) => renderLabel(props, curve.name)}
            />
          ))}

          {/* Equilibrium Dots */}
          <ReferenceDot x={eqData.eqQ} y={eqData.priceConsumersPay} r={5} fill="#2563eb" stroke="none" />
          {showTax && <ReferenceDot x={eqData.eqQ} y={eqData.priceSuppliersKeep} r={5} fill="#10b981" stroke="none" />}
          {showSubsidy && <ReferenceDot x={eqData.eqQ} y={eqData.priceSuppliersKeep} r={5} fill="#10b981" stroke="white" />}

          <ReferenceLine x={eqData.eqQ} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: `Q*=${eqData.eqQ.toFixed(1)}`, position: 'insideBottomLeft', fill: '#64748b', fontSize: 12 }} />
          <ReferenceLine y={eqData.priceConsumersPay} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: `P*=${eqData.priceConsumersPay.toFixed(2)}`, position: 'insideTopLeft', fill: 'black', fontSize: 12 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};