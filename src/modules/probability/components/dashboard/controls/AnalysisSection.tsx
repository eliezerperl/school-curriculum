import React from 'react';
import { BarChart3, Box, Eye, EyeOff } from 'lucide-react';
import { ControlSection } from '../../../../economics/components/ui/EconomicsUI';

interface Props {
  viewMode: '2D' | '3D';
  setViewMode: (mode: '2D' | '3D') => void;
  showCDF: boolean;
  setShowCDF: (show: boolean) => void;
}

export const AnalysisSection: React.FC<Props> = ({ 
  viewMode, setViewMode, showCDF, setShowCDF 
}) => {
  return (
    <ControlSection title="Analysis View" color="text-slate-800" icon={<Box size={18} />}>
      
      {/* 2D / 3D Toggle */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-slate-500 mb-2 block uppercase tracking-wider">
          Dimensions
        </label>
        <div className="flex gap-2">
          <button 
            onClick={() => setViewMode('2D')} 
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              viewMode === '2D' ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
             <BarChart3 size={16}/> 2D Single
          </button>
          <button 
            onClick={() => setViewMode('3D')} 
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              viewMode === '3D' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
             <Box size={16}/> 3D Joint
          </button>
        </div>
      </div>

      {/* CDF Toggle */}
      <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
        <input 
          type="checkbox" 
          checked={showCDF} 
          onChange={(e) => setShowCDF(e.target.checked)}
          className="w-4 h-4 accent-red-500 cursor-pointer"
        />
        <label 
          className="text-sm font-semibold text-slate-700 cursor-pointer flex-1 flex justify-between items-center" 
          onClick={() => setShowCDF(!showCDF)}
        >
          {viewMode === '3D' ? "Show CDF Surface" : "Show CDF Line"}
          {showCDF ? <Eye size={16} className="text-red-500" /> : <EyeOff size={16} className="text-slate-400" />}
        </label>
      </div>

    </ControlSection>
  );
};