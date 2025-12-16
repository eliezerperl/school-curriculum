import React from 'react';
import { SupplyDemand } from '../components/SupplyDemand';
import { Tools } from '../components/Tools';

const EconomicsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      
      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto h-screen flex flex-col">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Economics Dashboard</h1>
          <p className="text-slate-600">Market simulation environment</p>
        </header>

        <main className="flex-1 min-h-0">
          <SupplyDemand />
        </main>
      </div>

      {/* The Tools Component (Handles its own popup state) */}
      <Tools />

    </div>
  );
};

export default EconomicsPage;