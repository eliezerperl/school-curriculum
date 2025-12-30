import React, { useRef, useCallback } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Line,
  ReferenceDot,
  ReferenceLine,
} from 'recharts';
import { Download } from 'lucide-react';
import type { CustomCurve, CustomLabelProps, GraphPoint } from '../../types';
import { CustomTooltip } from '../ui/EconomicsUI';

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
  isTheoretical = false,
}) => {
  const graphRef = useRef<HTMLDivElement>(null);
  const eqPLabel = isTheoretical
    ? 'P*'
    : `P*=$${eqData.priceConsumersPay.toFixed(2)}`;
  const eqQLabel = isTheoretical ? 'Q*' : `Q*=${eqData.eqQ.toFixed(1)}`;

  // === DOWNLOAD FUNCTION ===
  const handleDownload = useCallback(() => {
    if (!graphRef.current) return;
    const svgElement = graphRef.current.querySelector('.recharts-surface');
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const rect = svgElement.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(2, 2);

    const img = new Image();
    const svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const link = document.createElement('a');
      link.download = 'economics_graph.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = url;
  }, []);

  // === SMART LABEL LOGIC ===
  // Finds the very last visible point of the line to place the label
  const renderLabel = (
    props: CustomLabelProps,
    name: string,
    dataKey: string
  ) => {
    const { x, y, stroke, index } = props;

    // 1. Find the target index
    // We scan BACKWARDS to find the first non-null, valid number.
    let targetIndex = -1;

    for (let i = data.length - 1; i >= 0; i--) {
      // FIX: Cast as a Record instead of 'any' to satisfy the linter
      const point = data[i] as Record<
        string,
        number | number[] | null | undefined
      >;
      const val = point[dataKey];

      // Check if value exists and is a valid number
      if (val !== null && val !== undefined && typeof val === 'number') {
        targetIndex = i;
        break;
      }
    }

    // 2. Render label only at that specific index
    if (
      index === targetIndex &&
      typeof x === 'number' &&
      typeof y === 'number'
    ) {
      let dy = -5;
      const dx = 10;

      // Offsets to avoid overlap
      if (name === 'Supply') dy = -10;
      if (name === 'Supply + Tax') dy = 15;
      if (name === 'Supply - Sub') dy = 15;

      // If close to bottom (y is large), push up
      if (y > 300) dy = -10;

      return (
        <text
          x={x}
          y={y}
          dy={dy}
          dx={dx}
          fill={stroke}
          fontSize={12}
          fontWeight="bold"
          textAnchor="start">
          {name}
        </text>
      );
    }
    return null;
  };

  return (
    <div
      ref={graphRef}
      className="relative bg-white p-4 rounded-xl shadow-lg border border-slate-100 h-[60vh] min-h-125 w-full flex flex-col group">
      <button
        onClick={handleDownload}
        className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-md border border-slate-200 shadow-sm transition-all opacity-0 group-hover:opacity-100"
        title="Download Graph Image">
        <Download size={18} />
      </button>

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 60, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />

          <XAxis
            dataKey="q"
            type="number"
            tick={!isTheoretical}
            label={{
              value: 'Quantity (Q)',
              position: 'insideBottomRight',
              offset: -10,
            }}
          />
          <YAxis
            tick={!isTheoretical}
            label={{ value: 'Price (P)', angle: -90, position: 'insideLeft' }}
          />

          <Tooltip
            content={<CustomTooltip isTheoretical={isTheoretical} />}
            cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
          />

          <Area
            type="monotone"
            dataKey="csFill"
            stroke="none"
            fill="#3b82f6"
            fillOpacity={0.2}
            name="Consumer Surplus"
          />
          <Area
            type="monotone"
            dataKey="psFill"
            stroke="none"
            fill="#10b981"
            fillOpacity={0.2}
            name="Producer Surplus"
          />
          <Area
            type="monotone"
            dataKey="taxFill"
            stroke="none"
            fill="#f97316"
            fillOpacity={0.3}
            name="Tax Revenue"
          />
          <Area
            type="monotone"
            dataKey="subsidyFill"
            stroke="none"
            fill="#9333ea"
            fillOpacity={0.3}
            name="Subsidy Cost"
          />
          <Area
            type="monotone"
            dataKey="dwlFill"
            stroke="none"
            fill="#dc2626"
            fillOpacity={0.4}
            name="Deadweight Loss"
          />

          {showDemand && (
            <Line
              type="monotone"
              dataKey="demand"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
              name="Demand"
              label={(props) => renderLabel(props, 'Demand', 'demand')}
            />
          )}

          {showSupply && (
            <Line
              type="monotone"
              dataKey="supply"
              stroke="#10b981"
              strokeWidth={showTax ? 2 : 3}
              strokeDasharray={showTax ? '5 5' : '0'}
              opacity={showTax ? 0.6 : 1}
              dot={false}
              name="Supply"
              label={(props) => renderLabel(props, 'Supply', 'supply')}
            />
          )}

          {showSupply && showTax && (
            <Line
              type="monotone"
              dataKey="supplyTax"
              stroke="#f97316"
              strokeWidth={3}
              dot={false}
              name="Supply + Tax"
              label={(props) => renderLabel(props, 'Supply + Tax', 'supplyTax')}
            />
          )}

          {showSupply && showSubsidy && (
            <Line
              type="monotone"
              dataKey="supplySubsidy"
              stroke="#9333ea"
              strokeWidth={3}
              dot={false}
              name="Supply - Sub"
              label={(props) =>
                renderLabel(props, 'Supply - Sub', 'supplySubsidy')
              }
            />
          )}

          {customCurves.map((curve) => (
            <Line
              key={curve.id}
              type="monotone"
              dataKey={curve.id}
              name={curve.name}
              stroke={curve.color}
              strokeWidth={2.5}
              strokeDasharray={curve.isDashed ? '5 5' : '0'}
              dot={false}
              // This is the FIX for custom curves: Pass the curve ID as the dataKey
              label={(props) => renderLabel(props, curve.name, curve.id)}
            />
          ))}

          <ReferenceDot
            x={eqData.eqQ}
            y={eqData.priceConsumersPay}
            r={5}
            fill="#2563eb"
            stroke="none"
          />
          {showTax && (
            <ReferenceDot
              x={eqData.eqQ}
              y={eqData.priceSuppliersKeep}
              r={5}
              fill="#10b981"
              stroke="none"
            />
          )}
          {showSubsidy && (
            <ReferenceDot
              x={eqData.eqQ}
              y={eqData.priceSuppliersKeep}
              r={5}
              fill="#10b981"
              stroke="white"
            />
          )}

          <ReferenceLine
            x={eqData.eqQ}
            stroke="#94a3b8"
            strokeDasharray="3 3"
            label={{
              value: eqQLabel,
              position: 'insideBottomLeft',
              fill: '#64748b',
              fontSize: isTheoretical ? 16 : 12,
              fontWeight: isTheoretical ? 'bold' : 'normal',
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
              fontWeight: isTheoretical ? 'bold' : 'normal',
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
