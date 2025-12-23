import React, { useState } from 'react';
import { Minus, PenTool, Plus, Trash2 } from 'lucide-react';
// 1. Ensure Slider is imported
import { ControlSection, Slider } from '../../ui/EconomicsUI';
import type { CustomCurve } from '../../../types';

interface Props {
  curves: CustomCurve[];
  addCurve: (c: CustomCurve) => void;
  removeCurve: (id: string) => void;
  updateCurve: (id: string, field: keyof CustomCurve, value: number) => void;
  currentSupplySlope: number;
  currentDemandSlope: number;
}

export const CustomCurveSection: React.FC<Props> = ({
  curves,
  addCurve,
  removeCurve,
  updateCurve,
  currentSupplySlope,
  currentDemandSlope,
}) => {
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
    setNewCurve({ ...newCurve, name: '' });
  };

  return (
    <ControlSection
      title="Custom Curves"
      color="text-indigo-600"
      icon={<PenTool size={18} />}>
      {/* --- FORM AREA --- */}
      <div className="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
        <input
          type="text"
          placeholder="Curve Name (e.g. New Tax)"
          className="w-full text-sm p-2 rounded border border-slate-300"
          value={newCurve.name}
          onChange={(e) => setNewCurve({ ...newCurve, name: e.target.value })}
        />

        <div className="flex gap-2">
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

          {/* SLOPE INPUT WITH QUICK BUTTONS */}
          <div className="flex-[1.5]">
            <label className="text-xs text-slate-500 font-semibold p-1 flex justify-between">
              Slope
              <span className="text-[10px] font-normal text-slate-400">
                Match:
              </span>
            </label>
            <div className="flex gap-1">
              <input
                type="number"
                step="0.5"
                className="w-full text-sm p-1 rounded border border-slate-300"
                value={newCurve.slope}
                onChange={(e) =>
                  setNewCurve({ ...newCurve, slope: Number(e.target.value) })
                }
              />
              <button
                type="button"
                title="Match Supply Slope"
                onClick={() =>
                  setNewCurve({ ...newCurve, slope: currentSupplySlope })
                }
                className="px-2 bg-emerald-100 text-emerald-700 rounded border border-emerald-200 hover:bg-emerald-200 text-xs font-bold">
                S
              </button>
              <button
                type="button"
                title="Match Demand Slope"
                onClick={() =>
                  setNewCurve({ ...newCurve, slope: currentDemandSlope })
                }
                className="px-2 bg-blue-100 text-blue-700 rounded border border-blue-200 hover:bg-blue-200 text-xs font-bold">
                D
              </button>
            </div>
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

      {/* --- ACTIVE LIST --- */}
      <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar max-h-44">
        {curves.length === 0 && (
          <p className="text-xs text-slate-400 text-center italic py-2">
            No custom curves added
          </p>
        )}

        {curves.map((curve) => (
          <div
            key={curve.id}
            className="bg-white p-3 rounded border border-slate-200 shadow-sm">
            {/* Header Row: Name & Delete */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: curve.color }}
                />
                <span className="text-sm font-semibold text-slate-700">
                  {curve.name}
                </span>
                <span className="text-xs text-black">(m={curve.slope})</span>
                {/* Minus Button */}
                <button
                  onClick={() =>
                    updateCurve(
                      curve.id,
                      'slope',
                      Number((curve.slope - 0.5).toFixed(1))
                    )
                  }
                  className="p-0.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                  title="Decrease Slope">
                  <Minus size={10} />
                </button>
                {/* Plus Button */}
                <button
                  onClick={() =>
                    updateCurve(
                      curve.id,
                      'slope',
                      Number((curve.slope + 0.5).toFixed(1))
                    )
                  }
                  className="p-0.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                  title="Increase Slope">
                  <Plus size={10} />
                </button>
              </div>
              <button
                onClick={() => removeCurve(curve.id)}
                className="text-slate-400 hover:text-red-500">
                <Trash2 size={14} />
              </button>
            </div>

            <Slider
              label="Position ($)"
              val={curve.intercept}
              set={(val) => updateCurve(curve.id, 'intercept', val)}
              min={0}
              max={200}
              step={1}
              color="accent-indigo-600"
            />
          </div>
        ))}
      </div>
    </ControlSection>
  );
};
