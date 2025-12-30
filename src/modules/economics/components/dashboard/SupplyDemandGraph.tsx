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

export const SupplyDemandGraph: React.FC<Props> = ({
  data,
  showTax,
  showSubsidy,
  showDemand = true,
  showSupply = true,
  eqData,
  customCurves,
  isTheoretical = true,
}) => {
  
  // Dynamic Equilibrium Labels
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
            tick={!isTheoretical} // Hide numbers in Theoretical Mode
            label={{ value: 'Quantity (Q)', position: 'insideBottomRight', offset: -10 }} 
          />
          <YAxis 
            tick={!isTheoretical} // Hide numbers in Theoretical Mode
            label={{ value: 'Price (P)', angle: -90, position: 'insideLeft' }} 
          />
          
          <Tooltip
            filterNull={true}
            content={isTheoretical ? () => null : undefined}
            
            itemSorter={(item) => {
              if (item.value && Array.isArray(item.value)) return -1;
              return 1;
            }}
            
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '8px 12px',
            }}

            formatter={(
              value: number | string | Array<number | string> | readonly (number | string)[] | undefined | null,
              name: string | undefined
            ) => {
              if (value === undefined || value === null || Array.isArray(value)) {
                return [null, null];
              }

              // Formatting
              return [`$${Number(value).toFixed(2)}`, name || ''];
            }}
            labelFormatter={(label) => `Quantity: ${label}`}
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

          {/* Equilibrium Dots & Lines */}
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