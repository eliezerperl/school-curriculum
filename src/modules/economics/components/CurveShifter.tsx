import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, ReferenceDot } from 'recharts';

export const CurveShifter: React.FC = () => {
  // State for the "Shifts" (Negative = Left/Down, Positive = Right/Up)
  const [dShift, setDShift] = useState(0);
  const [sShift, setSShift] = useState(0);

  // Generate Data for the Mini Graph
  const data = useMemo(() => {
    const points = [];
    // We use a simplified model: P = 100 - Q (Demand), P = Q (Supply)
    for (let q = 0; q <= 100; q += 10) {
      points.push({
        q,
        // Base Curves (Solid)
        dOriginal: 100 - q,
        sOriginal: q,
        // Shifted Curves (Dotted)
        dShifted: (100 - q) + dShift,
        sShifted: q + sShift,
      });
    }
    return points;
  }, [dShift, sShift]);

  // Calculate the new intersection (Equilibrium) for the dot
  // (100 - Q) + Dshift = Q + Sshift  =>  2Q = 100 + Dshift - Sshift
  const newQ = (100 + dShift - sShift) / 2;
  const newP = newQ + sShift;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-bold text-gray-700 mb-4 border-b pb-2">
        Market Intuition Sandbox
      </h3>

      {/* --- SLIDERS --- */}
      <div className="space-y-4 mb-4">
        <div>
          <label className="text-xs font-semibold text-blue-600 flex justify-between">
            <span>Demand Shift</span>
            <span>{dShift > 0 ? `+${dShift}` : dShift}</span>
          </label>
          <input
            type="range" min="-40" max="40" value={dShift}
            onChange={(e) => setDShift(Number(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-emerald-600 flex justify-between">
            <span>Supply Shift</span>
            <span>{sShift > 0 ? `+${sShift}` : sShift}</span>
          </label>
          <input
            type="range" min="-40" max="40" value={sShift}
            onChange={(e) => setSShift(Number(e.target.value))}
            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
        </div>
      </div>

      {/* --- MINI GRAPH --- */}
      <div className="h-48 w-full bg-slate-50 rounded border border-slate-100">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
            <XAxis dataKey="q" type="number" hide />
            <YAxis domain={[0, 140]} hide />
            
            {/* Original Curves (Faint) */}
            <Line type="monotone" dataKey="dOriginal" stroke="#93c5fd" strokeWidth={2} dot={false} strokeOpacity={0.5} />
            <Line type="monotone" dataKey="sOriginal" stroke="#6ee7b7" strokeWidth={2} dot={false} strokeOpacity={0.5} />

            {/* Shifted Curves (Active/Dotted) */}
            <Line type="monotone" dataKey="dShifted" stroke="#2563eb" strokeWidth={2} dot={false} strokeDasharray="4 4" />
            <Line type="monotone" dataKey="sShifted" stroke="#059669" strokeWidth={2} dot={false} strokeDasharray="4 4" />

            {/* The New Equilibrium Dot */}
            <ReferenceDot x={newQ} y={newP} r={4} fill="#f59e0b" stroke="white" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-center">
        <span className="text-xs text-gray-400">
          Blue = Demand | Green = Supply | Orange = New Eq
        </span>
      </div>
    </div>
  );
};
