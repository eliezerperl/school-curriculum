import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import type { ProbabilityPoint } from '../types';

interface Props {
  type: 'discrete' | 'continuous';
  data: ProbabilityPoint[];
  showCDF: boolean;
}

export const ProbabilityGraph: React.FC<Props> = ({ type, data, showCDF }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="x" 
            label={{ value: 'Value (x)', position: 'insideBottomRight', offset: -5 }} 
          />
          <YAxis 
            label={{ value: 'Probability', angle: -90, position: 'insideLeft' }} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="top" height={36}/>

          {/* DISCRETE: PMF Bars */}
          {type === 'discrete' && (
            <Bar 
              dataKey="prob" 
              name="PMF P(X=x)" 
              fill="#3b82f6" 
              barSize={20} 
              radius={[4, 4, 0, 0]} 
            />
          )}

          {/* CONTINUOUS: PDF Area */}
          {type === 'continuous' && (
            <Area 
              type="monotone" 
              dataKey="prob" 
              name="PDF f(x)" 
              fill="#3b82f6" 
              fillOpacity={0.2} 
              stroke="#2563eb" 
              strokeWidth={3} 
            />
          )}

          {/* CDF Line */}
          {showCDF && (
            <Line 
              type="monotone" 
              dataKey="cdf" 
              name="CDF F(x)" 
              stroke="#ef4444" 
              strokeWidth={3} 
              dot={false} 
              strokeDasharray="5 5" 
            />
          )}

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};