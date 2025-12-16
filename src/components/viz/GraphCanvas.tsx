import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface GraphCanvasProps {
	data: { x: number; y: number }[];
  range: { min: number; max: number };
  title?: string;
}

const GraphCanvas: React.FC<GraphCanvasProps> = ({ data, range, title }) => {
  return (
    <div className="h-[400px] w-full bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
      {title && <h3 className="text-slate-500 text-sm font-semibold mb-2">{title}</h3>}
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          
          <XAxis 
            dataKey="x" 
            type="number" 
            domain={[range.min, range.max]} 
            allowDataOverflow={true}
          />
          <YAxis allowDataOverflow={true} />
          
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '8px' }}
            itemStyle={{ color: '#60a5fa' }}
            formatter={(value: number | undefined) => value ? value.toFixed(2) : ''}
          />
          
          <ReferenceLine x={0} stroke="#94a3b8" />
          <ReferenceLine y={0} stroke="#94a3b8" />

          <Line 
            type="monotone" 
            dataKey="y" 
            stroke="#2563eb" 
            strokeWidth={3} 
            dot={false} 
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraphCanvas;