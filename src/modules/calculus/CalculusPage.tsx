import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, ArrowRightLeft } from 'lucide-react'; 
import { CalculusDashboard } from './components/dashboard/CalculusDashboard';
import { CalculusTools } from './components/controls/CalculusTools';

// Define the tabs for the Calculus section
type TabId = 'engine' | 'limits' | 'derivatives';

export const CalculusPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('engine');

  useEffect(() => {
    document.title = "Calculus | Interactive Engine";
    return () => {
      document.title = "UniDash";
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      
      {/* --- FLOATING VERTICAL DOCK (Left Side) --- */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
        
        {/* Tab 1: General Engine (The main grapher) */}
        <button
          onClick={() => setActiveTab('engine')}
          title="Graph Engine"
          className={`p-4 rounded-xl shadow-sm border transition-all duration-200 flex flex-col items-center justify-center w-16 h-16 ${
            activeTab === 'engine'
              ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/20 scale-110'
              : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200'
          }`}
        >
          <Calculator size={24} />
          <span className="text-[10px] font-bold mt-1">Engine</span>
        </button>

        {/* Tab 2: Limits */}
        <button
          onClick={() => setActiveTab('limits')}
          title="Limits & Continuity"
          className={`p-4 rounded-xl shadow-sm border transition-all duration-200 flex flex-col items-center justify-center w-16 h-16 ${
            activeTab === 'limits'
              ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/20 scale-110'
              : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200'
          }`}
        >
          <ArrowRightLeft size={24} />
          <span className="text-[10px] font-bold mt-1">Limits</span>
        </button>

        {/* Tab 3: Derivatives */}
        <button
          onClick={() => setActiveTab('derivatives')}
          title="Derivatives & Tangents"
          className={`p-4 rounded-xl shadow-sm border transition-all duration-200 flex flex-col items-center justify-center w-16 h-16 ${
            activeTab === 'derivatives'
              ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/20 scale-110'
              : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200'
          }`}
        >
          <TrendingUp size={24} />
          <span className="text-[10px] font-bold mt-1">Slope</span>
        </button>

      </div>

      {/* --- MAIN CONTENT AREA --- */}
      {/* pl-24 pushes content right to make room for the dock */}
      <div className="p-4 pl-28 w-full h-screen flex flex-col">
        
        {/* 1. Page Header */}
        <header className="mb-4 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Calculus Workshop
          </h1>
          <p className="text-slate-500">
            {activeTab === 'engine' && "General Function Visualization"}
            {activeTab === 'limits' && "Explore Limits and Infinity"}
            {activeTab === 'derivatives' && "Tangents and Instantaneous Rates of Change"}
          </p>
        </header>

        {/* 2. Active Tab Content */}
        <main className="flex-1 min-h-0 relative">
          
          {/* TAB: ENGINE (Our Dashboard) */}
          {activeTab === 'engine' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
               {/* We render the Dashboard here, but we might want to remove the header inside Dashboard since we have one here now */}
               <CalculusDashboard />
             </div>
          )}

          {/* TAB: LIMITS (Placeholder) */}
          {activeTab === 'limits' && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <ArrowRightLeft size={48} className="mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-slate-600">Limits Module</h3>
              <p className="text-sm">Coming Soon: Visualize Epsilon-Delta</p>
            </div>
          )}

          {/* TAB: DERIVATIVES (Placeholder) */}
          {activeTab === 'derivatives' && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <TrendingUp size={48} className="mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-slate-600">Derivative Module</h3>
              <p className="text-sm">Coming Soon: Tangent Lines & Secant Slopes</p>
            </div>
          )}
<CalculusTools />
        </main>
      </div>
    </div>
  );
};