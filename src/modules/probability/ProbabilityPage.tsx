import React, { useState, useMemo } from 'react';
import { Settings } from 'lucide-react'; // Import icon for the section
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { ProbabilityGraph } from './components/ProbabilityGraph';
import { ControlSection } from '../economics/components/ui/EconomicsUI';
import type { ProbabilityPoint } from './types';

export const ProbabilityPage: React.FC = () => {
  const [distType, setDistType] = useState<'normal' | 'binomial'>('normal');
  const [showCDF, setShowCDF] = useState(false);

  // --- DATA GENERATION ---
  // We type this as ProbabilityPoint[] to satisfy the Graph component
  const graphData: ProbabilityPoint[] = useMemo(() => {
    const data: ProbabilityPoint[] = [];
    
    if (distType === 'normal') {
      // Standard Normal Distribution
      for (let i = -40; i <= 40; i++) {
        const xVal = i / 10;
        const pdf = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * xVal * xVal);
        const cdf = 0.5 * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (xVal + 0.044715 * Math.pow(xVal, 3))));

        data.push({
          x: xVal.toFixed(1), // String for X-axis labels
          prob: pdf,
          cdf: cdf
        });
      }
    } else {
      // Binomial Distribution (n=10, p=0.5)
      const n = 10;
      const p = 0.5;
      let runningSum = 0;

      const fact = (num: number): number => (num <= 1 ? 1 : num * fact(num - 1));
      const combination = (n: number, k: number) => fact(n) / (fact(k) * fact(n - k));

      for (let k = 0; k <= n; k++) {
        const prob = combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
        runningSum += prob;
        
        data.push({
          x: k, // Number for discrete X-axis
          prob: prob,
          cdf: runningSum
        });
      }
    }
    return data;
  }, [distType]);

  return (
    <DashboardLayout title="Probability & Statistics" subtitle="Visualizing Distributions">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* GRAPH SECTION */}
        <div className="flex-1">
          <ProbabilityGraph 
            type={distType === 'normal' ? 'continuous' : 'discrete'} 
            data={graphData} 
            showCDF={showCDF}
          />
        </div>

        {/* CONTROLS SECTION */}
        <div className="w-full lg:w-80 space-y-6">
          
          {/* Using the imported ControlSection properly now */}
          <ControlSection 
            title="Distribution Settings" 
            color="text-slate-800" 
            icon={<Settings size={18} />} 
            defaultOpen={true}
          >
            <div className="space-y-4 pt-2">
              
              {/* Type Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-2 block uppercase tracking-wider">
                  Model Type
                </label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setDistType('normal')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${
                      distType === 'normal' 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    Normal
                  </button>
                  <button 
                    onClick={() => setDistType('binomial')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${
                      distType === 'binomial' 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    Binomial
                  </button>
                </div>
              </div>

              {/* CDF Toggle */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-sm font-semibold text-slate-700">Show CDF Line</span>
                <input 
                  type="checkbox" 
                  checked={showCDF}
                  onChange={(e) => setShowCDF(e.target.checked)}
                  className="w-5 h-5 accent-red-500 cursor-pointer"
                />
              </div>

              <div className="text-xs text-slate-400 mt-2 leading-relaxed border-t border-slate-100 pt-3">
                {distType === 'normal' 
                  ? "Normal: Continuous distribution (Bell Curve). Blue area is PDF, Red line is CDF." 
                  : "Binomial: Discrete distribution (Success/Failure). Blue bars are PMF, Red line is CDF."
                }
              </div>

            </div>
          </ControlSection>

        </div>
      </div>
    </DashboardLayout>
  );
};