import React, { useState, useEffect } from 'react';
import { TrendingUp, Globe, BarChart3 } from 'lucide-react'; 
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { DockTab } from '../../components/layout/DockTab';
import { SupplyDemand } from './components/dashboard/SupplyDemand';
import { Tools } from './components/Tools';




type TabId = 'micro' | 'macro' | 'data';

export const EconomicsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('micro');

  // Page Title Logic
  useEffect(() => {
    document.title = "Economics | Supply & Demand";
    return () => { document.title = "UniDash"; };
  }, []);

  // 3. DEFINE THE SIDEBAR BUTTONS (The Dock)
  const SidebarButtons = (
    <>
      <DockTab 
        label="Micro" 
        icon={<TrendingUp size={24} />} 
        isActive={activeTab === 'micro'} 
        onClick={() => setActiveTab('micro')} 
      />
      <DockTab 
        label="Macro" 
        icon={<Globe size={24} />} 
        isActive={activeTab === 'macro'} 
        onClick={() => setActiveTab('macro')} 
      />
      <DockTab 
        label="Data" 
        icon={<BarChart3 size={24} />} 
        isActive={activeTab === 'data'} 
        onClick={() => setActiveTab('data')} 
      />
    </>
  );

  return (
    // 4. USE THE SHARED LAYOUT
    <DashboardLayout
      title="Economics Dashboard"
      subtitle="Market simulation environment"
      sideNav={SidebarButtons}  // Pass the buttons to the dock
      tools={<Tools />}         // Pass the floating tools widget
    >
      
      {/* 5. MAIN CONTENT AREA (Switches based on active tab) */}
      
      {activeTab === 'micro' && (
         <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
           {/* Your main Supply & Demand Graph */}
           <SupplyDemand />
         </div>
      )}

      {activeTab === 'macro' && (
        <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
           <Globe size={48} className="mb-4 opacity-50" />
           <h3 className="text-lg font-semibold text-slate-600">Macroeconomics</h3>
           <p className="text-sm">Coming in Semester 2</p>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
           <BarChart3 size={48} className="mb-4 opacity-50" />
           <h3 className="text-lg font-semibold text-slate-600">Data Analysis</h3>
           <p className="text-sm">Python Integration</p>
        </div>
      )}

    </DashboardLayout>
  );
};