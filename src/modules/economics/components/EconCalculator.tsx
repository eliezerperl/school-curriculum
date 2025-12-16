import React from 'react';
// Import the "Brain" (the hook) we just created
import { useEconCalculator } from '../hooks/useEconCalculator';

export const EconCalculator: React.FC = () => {
  // WIRING: This pulls all the data and functions from your hook.
  const {
    price,
    setPrice,
    subsidy,
    setSubsidy,
    result,
    handleCalculate,
    resetCalculator
  } = useEconCalculator();

  return (
    <div className="max-w-md mx-auto p-6 bg-white border rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Subsidy Calculator
      </h2>

      {/* --- INPUT SECTION --- */}
      <div className="space-y-4 mb-6">
        
        {/* Price Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Price ($)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 50 (Leave empty for 'P')"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <p className="text-xs text-gray-500 mt-1">
            If left blank, we use the symbol <strong>P</strong>.
          </p>
        </div>

        {/* Subsidy Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Subsidy ($)
          </label>
          <input
            type="number"
            value={subsidy}
            onChange={(e) => setSubsidy(e.target.value)}
            placeholder="e.g. 10 (Leave empty for 'S')"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <p className="text-xs text-gray-500 mt-1">
            If left blank, we use the symbol <strong>S</strong>.
          </p>
        </div>

      </div>

      {/* --- BUTTON SECTION --- */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleCalculate}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
        >
          Calculate Effective Cost
        </button>
        
        <button
          onClick={resetCalculator}
          className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 px-4 rounded-lg transition duration-200"
        >
          Reset
        </button>
      </div>

      {/* --- RESULT SECTION --- */}
      {result && (
        <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg animate-fade-in">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            Result
          </p>
          <div className="text-3xl font-mono text-gray-900">
            {result}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            This is the new effective price for suppliers.
          </p>
        </div>
      )}
    </div>
  );
};