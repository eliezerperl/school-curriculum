import React, { useEffect, useState } from 'react';
import { TrendingUp, Globe, BarChart3 } from 'lucide-react'; 

import { SupplyDemand } from '../components/dashboard/SupplyDemand';
import { Tools } from '../components/Tools';

type TabId = 'micro' | 'macro' | 'data';

export const EconomicsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('micro');

		useEffect(() => {
			document.title = "Economics | Supply & Demand"; // Set your desired title here

			// Optional: Reset title when leaving this page
			return () => {
					document.title = "EconDash"; // Fallback title
			};
	}, []);

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      
      {/* --- FLOATING ICONS (Vertical Dock on Left) --- */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
        
        {/* Tab 1: Micro */}
        <button
          onClick={() => setActiveTab('micro')}
          title="Market Equilibrium"
          className={`p-4 rounded-xl shadow-sm border transition-all duration-200 flex flex-col items-center justify-center w-16 h-16 ${
            activeTab === 'micro'
              ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/20 scale-110'
              : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200'
          }`}
        >
          <TrendingUp size={24} />
          <span className="text-[10px] font-bold mt-1">Micro</span>
        </button>

        {/* Tab 2: Macro */}
        <button
          onClick={() => setActiveTab('macro')}
          title="Macroeconomics"
          className={`p-4 rounded-xl shadow-sm border transition-all duration-200 flex flex-col items-center justify-center w-16 h-16 ${
            activeTab === 'macro'
              ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/20 scale-110'
              : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200'
          }`}
        >
          <Globe size={24} />
          <span className="text-[10px] font-bold mt-1">Macro</span>
        </button>

        {/* Tab 3: Data */}
        <button
          onClick={() => setActiveTab('data')}
          title="Data Analysis"
          className={`p-4 rounded-xl shadow-sm border transition-all duration-200 flex flex-col items-center justify-center w-16 h-16 ${
            activeTab === 'data'
              ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/20 scale-110'
              : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200'
          }`}
        >
          <BarChart3 size={24} />
          <span className="text-[10px] font-bold mt-1">Data</span>
        </button>

      </div>

      {/* --- MAIN CONTENT AREA --- */}
      {/* Added pl-24 (Padding Left 6rem) so the icons don't overlap the text */}
      <div className="p-6 pl-24 max-w-7xl mx-auto h-auto flex flex-col">
        
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Economics Dashboard
          </h1>
          <p className="text-slate-600">Market simulation environment</p>
        </header>

        <main className="flex-1 min-h-0">
          
          {/* Active Tab Content */}
          {activeTab === 'micro' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <SupplyDemand />
             </div>
          )}

          {activeTab === 'macro' && (
            <div className="h-96 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <Globe size={48} className="mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-slate-600">Macroeconomics</h3>
              <p className="text-sm">Coming in Semester 2</p>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="h-96 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <BarChart3 size={48} className="mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-slate-600">Data Analysis</h3>
              <p className="text-sm">Python Integration</p>
            </div>
          )}

        </main>
      </div>

      {/* The Tools Component (Handles its own popup state) */}
      <Tools />
    </div>
  );
};