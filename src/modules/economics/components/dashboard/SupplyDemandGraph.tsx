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
  ReferenceLine 
} from 'recharts';
import { Download } from 'lucide-react'; // Import the icon
import type { CustomCurve, GraphPoint, CustomLabelProps } from '../../types';
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
  
  // Ref for the graph container to capture the SVG
  const graphRef = useRef<HTMLDivElement>(null);

  const eqPLabel = isTheoretical ? "P*" : `P*=$${eqData.priceConsumersPay.toFixed(2)}`;
  const eqQLabel = isTheoretical ? "Q*" : `Q*=${eqData.eqQ.toFixed(1)}`;

  // === DOWNLOAD FUNCTION ===
  const handleDownload = useCallback(() => {
    if (!graphRef.current) return;

    // FIX: Use '.recharts-surface' to grab the CHART, not the icon!
    const svgElement = graphRef.current.querySelector('.recharts-surface');
    
    if (!svgElement) {
      console.error("Chart SVG not found");
      return;
    }

    // 2. Serialize SVG to XML string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    // 3. Create a canvas to draw the image
    const canvas = document.createElement('canvas');
    const rect = svgElement.getBoundingClientRect();
    
    // Safety check for dimensions
    if (rect.width === 0 || rect.height === 0) return;

    canvas.width = rect.width * 2; // 2x scale for Retina/High Quality
    canvas.height = rect.height * 2;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill white background (otherwise PNG is transparent)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Scale context to match the 2x canvas size
    ctx.scale(2, 2);

    // 4. Create Image from SVG string
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      // 5. Trigger Download
      const link = document.createElement('a');
      link.download = 'economics_graph.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = url;

  }, []);

  const renderLabel = (
    props: CustomLabelProps, 
    name: string, 
    type: 'demand' | 'supply' | 'other'
  ) => {
    const { x, y, stroke, index } = props;
    
    let isTargetIndex = false;

    if (type === 'demand') {
      const firstZeroIndex = data.findIndex(p => p.demand <= 0);
      const targetIndex = firstZeroIndex !== -1 ? firstZeroIndex : data.length - 1;
      isTargetIndex = index === targetIndex;
    } else {
      isTargetIndex = index === data.length - 1;
    }

    if (isTargetIndex && typeof x === 'number' && typeof y === 'number') {
      let dy = -5;
      
      if (name === 'Supply') dy = -10;
      if (name === 'Supply + Tax') dy = 15;
      if (name === 'Supply - Sub') dy = 15;
      if (name === 'Demand') dy = -5;

      return (
        <text x={x} y={y} dy={dy} dx={10} fill={stroke} fontSize={12} fontWeight="bold" textAnchor="start">
          {name}
        </text>
      );
    }
    return null;
  };

  return (
    // Added 'relative' and 'group' to handle the button positioning
    <div ref={graphRef} className="relative bg-white p-4 rounded-xl shadow-lg border border-slate-100 h-[60vh] min-h-125 w-full flex flex-col group">
      
      {/* === DOWNLOAD BUTTON === */}
      <button 
        onClick={handleDownload}
        className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-md border border-slate-200 shadow-sm transition-all opacity-0 group-hover:opacity-100"
        title="Download Graph Image"
      >
        <Download size={18} />
      </button>

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
          
          <Tooltip 
            content={<CustomTooltip isTheoretical={isTheoretical} />}
            cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
          />

          <Area type="monotone" dataKey="csFill" stroke="none" fill="#3b82f6" fillOpacity={0.2} name="Consumer Surplus" />
          <Area type="monotone" dataKey="psFill" stroke="none" fill="#10b981" fillOpacity={0.2} name="Producer Surplus" />
          <Area type="monotone" dataKey="taxFill" stroke="none" fill="#f97316" fillOpacity={0.3} name="Tax Revenue" />
          <Area type="monotone" dataKey="subsidyFill" stroke="none" fill="#9333ea" fillOpacity={0.3} name="Subsidy Cost" />
          
          {/* Deadweight Loss Area (Red) */}
          <Area type="monotone" dataKey="dwlFill" stroke="none" fill="#dc2626" fillOpacity={0.4} name="Deadweight Loss" />

          {showDemand && (
            <Line type="monotone" dataKey="demand" stroke="#2563eb" strokeWidth={3} dot={false} name="Demand" 
              label={(props) => renderLabel(props, 'Demand', 'demand')} 
            />
          )}

          {showSupply && (
            <Line type="monotone" dataKey="supply" stroke="#10b981" strokeWidth={showTax ? 2 : 3} 
              strokeDasharray={showTax ? '5 5' : '0'} opacity={showTax ? 0.6 : 1} dot={false} name="Supply"
              label={(props) => renderLabel(props, "Supply", 'supply')} 
            />
          )}
          
          {showSupply && showTax && (
            <Line type="monotone" dataKey="supplyTax" stroke="#f97316" strokeWidth={3} dot={false} name="Supply + Tax" 
              label={(props) => renderLabel(props, "Supply + Tax", 'supply')} 
            />
          )}
          
          {showSupply && showSubsidy && (
            <Line type="monotone" dataKey="supplySubsidy" stroke="#9333ea" strokeWidth={3} dot={false} name="Supply - Sub" 
              label={(props) => renderLabel(props, "Supply - Sub", 'supply')} 
            />
          )}

          {customCurves.map((curve) => (
            <Line
              key={curve.id} type="monotone" dataKey={curve.id} name={curve.name} stroke={curve.color}
              strokeWidth={2.5} strokeDasharray={curve.isDashed ? '5 5' : '0'} dot={false}
              label={(props) => renderLabel(props, curve.name, 'other')}
            />
          ))}

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