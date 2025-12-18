import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, ArrowRightLeft } from 'lucide-react';

// Import our new "Economics-style" layout
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { DockTab } from '../../components/layout/DockTab';
import { CalculusTools } from './components/controls/CalculusTools';
import { CalculusDashboard } from './components/dashboard/CalculusDashboard';

type TabId = 'engine' | 'limits' | 'derivatives';

export const CalculusPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('engine');

  useEffect(() => {
    document.title = 'Calculus | Interactive Engine';
    return () => {
      document.title = 'UniDash';
    };
  }, []);

  // Define the Side Dock Buttons
  const SidebarButtons = (
    <>
      <DockTab
        label="Engine"
        icon={<Calculator size={24} />}
        isActive={activeTab === 'engine'}
        onClick={() => setActiveTab('engine')}
      />
      <DockTab
        label="Limits"
        icon={<ArrowRightLeft size={24} />}
        isActive={activeTab === 'limits'}
        onClick={() => setActiveTab('limits')}
      />
      <DockTab
        label="Slope"
        icon={<TrendingUp size={24} />}
        isActive={activeTab === 'derivatives'}
        onClick={() => setActiveTab('derivatives')}
      />
    </>
  );

  return (
    <DashboardLayout
      title="Calculus Workshop"
      subtitle="Functions, Limits, and Derivatives"
      sideNav={SidebarButtons}
      tools={<CalculusTools />}>
      {/* CONTENT: EXACTLY LIKE ECONOMICS TABS */}

      {activeTab === 'engine' && (
        <div className="h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Your main Graph Dashboard goes here */}
          <CalculusDashboard />
        </div>
      )}

      {activeTab === 'limits' && (
        <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <ArrowRightLeft size={48} className="mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-slate-600">
            Limits Module
          </h3>
          <p className="text-sm">Coming Soon</p>
        </div>
      )}

      {activeTab === 'derivatives' && (
        <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <TrendingUp size={48} className="mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-slate-600">
            Derivative Module
          </h3>
          <p className="text-sm">Coming Soon</p>
        </div>
      )}
    </DashboardLayout>
  );
};
