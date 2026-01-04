import React from 'react';
import { Settings2 } from 'lucide-react';
import { ControlSection } from '../../../../economics/components/ui/EconomicsUI';

interface Props {
  distType: 'normal' | 'binomial';
  setDistType: (type: 'normal' | 'binomial') => void;
}

export const ModelSection: React.FC<Props> = ({ distType, setDistType }) => {
  return (
    <ControlSection title="Distribution Model" color="text-blue-700" icon={<Settings2 size={18} />}>
      <div className="flex gap-2">
        <button 
          onClick={() => setDistType('normal')} 
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${
            distType === 'normal' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          Normal (Gaussian)
        </button>
        <button 
          onClick={() => setDistType('binomial')} 
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${
            distType === 'binomial' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          Binomial
        </button>
      </div>
      
      <div className="mt-3 text-xs text-slate-400 leading-relaxed">
        {distType === 'normal' 
          ? "Continuous distribution defined by Mean (μ) and Standard Deviation (σ)." 
          : "Discrete distribution defined by Number of Trials (n) and Probability of Success (p)."
        }
      </div>
    </ControlSection>
  );
};