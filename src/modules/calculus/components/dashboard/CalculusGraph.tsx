import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import type { Coordinate } from '../../types';

interface Props {
  data: Coordinate[];
  range: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
  };
}

export const CalculusGraph: React.FC<Props> = ({ data, range }) => {
  return (
    <div className="h-full w-full bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

          {/* X Axis: We lock the domain to the range state so zooming works later */}
          <XAxis
            dataKey="x"
            type="number"
            domain={[range.xMin, range.xMax]}
            allowDataOverflow={true}
            tickCount={10}
            stroke="#64748b"
          />

          {/* Y Axis */}
          <YAxis
            type="number"
            domain={[range.yMin, range.yMax]}
            allowDataOverflow={true}
            tickCount={10}
            stroke="#64748b"
          />

          {/* THE AXES CROSSHAIRS (x=0 and y=0) */}
          <ReferenceLine x={0} stroke="#334155" strokeWidth={2} />
          <ReferenceLine y={0} stroke="#334155" strokeWidth={2} />

          <Tooltip
            formatter={(
              value: number | string | Array<number | string> | undefined
            ) => {
              if (typeof value === 'number') return value.toFixed(2);
              return Array.isArray(value) ? value.join(', ') : value;
            }}
            labelFormatter={(label) => `x: ${label}`}
            contentStyle={{ borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />

          {/* THE FUNCTION LINE */}
          <Line
            type="monotone"
            dataKey="y"
            stroke="#2563eb" // Blue
            strokeWidth={3}
            dot={false} // No dots, just a smooth line
            isAnimationActive={false} // Disable animation for faster updates when dragging
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
