import React, { useState } from 'react';
import { PenTool, Plus, Trash2, MoveVertical } from 'lucide-react';
import { ControlSection } from '../../ui/EconomicsUI';
// Ensure this path matches where your types are defined
import type { CustomCurve } from '../../../types';

interface Props {
  curves: CustomCurve[];
  addCurve: (c: CustomCurve) => void;
  removeCurve: (id: string) => void;
  updateCurve: (id: string, field: keyof CustomCurve, value: number) => void;
}

export const CustomCurveSection: React.FC<Props> = ({
  curves,
  addCurve,
  removeCurve,
  updateCurve,
}) => {
  // Local state for the "New Curve" form
  const [newCurve, setNewCurve] = useState<Omit<CustomCurve, 'id'>>({
    name: '',
    intercept: 50,
    slope: 1,
    color: '#6366f1',
    isDashed: true,
    type: 'supply',
  });

  const handleSubmit = () => {
    if (!newCurve.name) return;
    addCurve({ ...newCurve, id: Date.now().toString() });
    setNewCurve({ ...newCurve, name: '' }); // Reset name only
  };

  return (
    <ControlSection
      title="Custom Curves"
      color="text-indigo-600"
      icon={<PenTool size={18} />}>
      {/* --- FORM AREA (Fully Restored) --- */}
      <div className="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
        <input
          type="text"
          placeholder="Curve Name (e.g. New Tax)"
          className="w-full text-sm p-2 rounded border border-slate-300"
          value={newCurve.name}
          onChange={(e) => setNewCurve({ ...newCurve, name: e.target.value })}
        />

        <div className="flex gap-2">
          {/* Intercept Input */}
          <div className="flex-1">
            <label className="text-xs text-slate-500 font-semibold">
              Start $
            </label>
            <input
              type="number"
              className="w-full text-sm p-1 rounded border border-slate-300"
              value={newCurve.intercept}
              onChange={(e) =>
                setNewCurve({ ...newCurve, intercept: Number(e.target.value) })
              }
            />
          </div>
          {/* Slope Input */}
          <div className="flex-1">
            <label className="text-xs text-slate-500 font-semibold">
              Slope
            </label>
            <input
              type="number"
              step="1"
              className="w-full text-sm p-1 rounded border border-slate-300"
              value={newCurve.slope}
              onChange={(e) =>
                setNewCurve({ ...newCurve, slope: Number(e.target.value) })
              }
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="color"
            className="h-8 w-8 cursor-pointer rounded border border-slate-300"
            value={newCurve.color}
            onChange={(e) =>
              setNewCurve({ ...newCurve, color: e.target.value })
            }
          />

          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={newCurve.isDashed}
              onChange={(e) =>
                setNewCurve({ ...newCurve, isDashed: e.target.checked })
              }
              className="accent-indigo-600"
            />
            Dashed?
          </label>

          <button
            onClick={handleSubmit}
            disabled={!newCurve.name}
            className="ml-auto bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 disabled:opacity-50">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* --- ACTIVE LIST (With Drag Sliders) --- */}
      <div className="space-y-3">
        {curves.map((curve) => (
          <div
            key={curve.id}
            className="bg-white p-3 rounded border border-slate-200 shadow-sm">
            {/* Header: Name, Color Indicator, Delete */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: curve.color }}
                />
                <span className="text-sm font-semibold text-slate-700">
                  {curve.name}
                </span>
                {/* Optional: Show slope value */}
                <span className="text-xs text-slate-400">
                  (m={curve.slope})
                </span>
              </div>
              <button
                onClick={() => removeCurve(curve.id)}
                className="text-slate-400 hover:text-red-500">
                <Trash2 size={14} />
              </button>
            </div>

            {/* The "Drag" Slider */}
            <div className="flex items-center gap-3">
              <MoveVertical size={14} className="text-slate-400" />
              <input
                type="range"
                min="0"
                max="100" // Adjust this max based on your graph scale
                step="1"
                value={curve.intercept}
                onChange={(e) =>
                  updateCurve(curve.id, 'intercept', Number(e.target.value))
                }
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-ew-resize accent-indigo-600"
              />
              <span className="text-xs text-slate-500 w-8 text-right font-mono">
                {Math.round(curve.intercept)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ControlSection>
  );
};
