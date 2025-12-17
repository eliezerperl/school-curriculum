import React from 'react';
import { SupplyDemand } from '../components/dashboard/SupplyDemand';
import { Tools } from '../components/Tools';

export const EconomicsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Main Content Area */}
      <div className="p-6 max-w-7xl mx-auto h-auto flex flex-col">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Economics Dashboard
          </h1>
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
