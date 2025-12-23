import React from 'react';
import { Navigation } from './Navigation';

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;      // The main content (Graph, Dashboard)
  sideNav?: React.ReactNode;      // The vertical dock icons (Micro/Macro)
  tools?: React.ReactNode;        // The floating tool widget
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  subtitle,
  children,
  sideNav,
  tools
}) => {
  return (
    // EXACT BACKGROUND FROM ECONOMICS PAGE
    <div className="min-h-screen bg-gray-50 relative">
      
      {/* 1. GLOBAL NAV (The "My Studies" Button) */}
      <Navigation />

      {/* 2. FLOATING ICONS (Vertical Dock on Left) */}
      {/* Exact positioning from your code: left-6 top-1/2 -translate-y-1/2 */}
      {sideNav && (
        <div className="fixed left-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
          {sideNav}
        </div>
      )}

      {/* 3. MAIN CONTENT AREA */}
      {/* Exact padding from your code: pl-24 to avoid the dock */}
      <div className="p-6 pl-24 max-w-7xl mx-auto h-screen flex flex-col">
        
        {/* HEADER */}
        <header className="mb-6 text-center shrink-0">
          <h1 className="text-3xl font-bold text-slate-900">
            {title}
          </h1>
          {subtitle && <p className="text-slate-600">{subtitle}</p>}
        </header>

        {/* CONTENT */}
        <main className="flex-1 min-h-0 relative">
          {children}
        </main>
      </div>

      {/* 4. TOOLS SLOT */}
      {tools && tools}
    </div>
  );
};