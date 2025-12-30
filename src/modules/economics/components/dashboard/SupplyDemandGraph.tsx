import React from 'react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, Line, ReferenceDot, ReferenceLine } from 'recharts';
import type { CustomCurve, GraphPoint, CustomLabelProps } from '../../types';

interface Props {
  data: GraphPoint[];
  showTax: boolean;
  showSubsidy: boolean;
  showDemand?: boolean;
  showSupply?: boolean;
  eqData: {
    eqQ: number;
    priceConsumersPay: number;
    priceSuppliersKeep: number;
  };
  customCurves: CustomCurve[];
  isTheoretical?: boolean;
}

// 1. Define strict types for the Tooltip to satisfy the linter
interface TooltipPayload {
  name: string;
  value: number | string | Array<number>;
  color?: string;
  stroke?: string;
  fill?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string | number;
  isTheoretical?: boolean;
}

// 2. Custom Tooltip Component (Fixed Types & Gray Text)
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, isTheoretical }) => {
  if (!active || !payload || !payload.length) return null;

  // Filter out Arrays (Shading) and nulls
  const visibleItems = payload.filter((item) => 
    !Array.isArray(item.value) && item.value !== null && item.value !== undefined
  );

  if (visibleItems.length === 0) return null;
  if (isTheoretical) return null;

  return (
    <div className="bg-white/95 border border-slate-200 p-3 rounded-lg shadow-sm text-sm" style={{ backdropFilter: 'blur(2px)' }}>
      {/* Header */}
      <p className="font-bold text-slate-700 mb-2 border-b border-slate-100 pb-1">
        Quantity: {label}
      </p>
      
      {/* Rows */}
      <div className="space-y-1">
        {visibleItems.map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-2.5 h-2.5 rounded-full" 
                // Handle different color sources from Recharts
                style={{ backgroundColor: item.color || item.stroke || item.fill }} 
              />
              <span className="text-slate-500 font-medium">{item.name}:</span>
            </div>
            
            {/* === CHANGE IS HERE: Changed text-slate-900 (black) to text-slate-600 (gray) === */}
            <span className="font-mono font-semibold text-slate-600">
              ${Number(item.value).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SupplyDemandGraph: React.FC<Props> = ({
  data,
  showTax,
  showSubsidy,
  showDemand = true,
  showSupply = true,
  eqData,
  customCurves,
  isTheoretical = false,
}) => {
  
  const eqPLabel = isTheoretical ? "P*" : `P*=$${eqData.priceConsumersPay.toFixed(2)}`;
  const eqQLabel = isTheoretical ? "Q*" : `Q*=${eqData.eqQ.toFixed(1)}`;

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
          
          <XAxis 
            dataKey="q" 
            type="number" 
            tick={!isTheoretical} 
            label={{ value: 'Quantity (Q)', position: 'insideBottomRight', offset: -10 }} 
          />
          <YAxis 
            tick={!isTheoretical} 
            label={{ value: 'Price (P)', angle: -90, position: 'insideLeft' }} 
          />
          
          {/* Custom Tooltip */}
          <Tooltip 
            content={<CustomTooltip isTheoretical={isTheoretical} />}
            cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
          />

          {/* Areas */}
          <Area type="monotone" dataKey="csFill" stroke="none" fill="#3b82f6" fillOpacity={0.2} name="Consumer Surplus" />
          <Area type="monotone" dataKey="psFill" stroke="none" fill="#10b981" fillOpacity={0.2} name="Producer Surplus" />
          <Area type="monotone" dataKey="taxFill" stroke="none" fill="#f97316" fillOpacity={0.3} name="Tax Revenue" />
          <Area type="monotone" dataKey="subsidyFill" stroke="none" fill="#9333ea" fillOpacity={0.3} name="Subsidy Cost" />

          {/* Lines */}
          {showDemand && (
            <Line type="monotone" dataKey="demand" stroke="#2563eb" strokeWidth={3} dot={false} name="Demand" 
              label={(props) => renderLabel(props, 'Demand')} 
            />
          )}

          {showSupply && (
            <Line type="monotone" dataKey="supply" stroke="#10b981" strokeWidth={showTax ? 2 : 3} 
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

          <ReferenceLine 
            x={eqData.eqQ} 
            stroke="#94a3b8" 
            strokeDasharray="3 3" 
            label={{ 
              value: eqQLabel, 
              position: 'insideBottomLeft', 
              fill: '#64748b', 
              fontSize: isTheoretical ? 16 : 12,
              fontWeight: isTheoretical ? 'bold' : 'normal'
            }} 
          />
          <ReferenceLine 
            y={eqData.priceConsumersPay} 
            stroke="#94a3b8" 
            strokeDasharray="3 3" 
            label={{ 
              value: eqPLabel, 
              position: 'insideTopLeft', 
              fill: 'black', 
              fontSize: isTheoretical ? 16 : 12,
              fontWeight: isTheoretical ? 'bold' : 'normal'
            }} 
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};