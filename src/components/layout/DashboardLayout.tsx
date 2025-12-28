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
    // changed h-screen to min-h-screen so mobile can scroll
    <div className="min-h-screen bg-gray-50 relative flex flex-col">
      
      {/* 1. GLOBAL NAV */}
      <Navigation />

      {/* 2. FLOATING ICONS (Vertical Dock on Left) */}
      {/* Added 'hidden md:flex': Hides this on mobile, shows it on Tablet/Desktop */}
      {sideNav && (
        <div className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col gap-4">
          {sideNav}
        </div>
      )}

      {/* 3. MAIN CONTENT AREA */}
      {/* - Changed 'pl-24' to 'md:pl-24': Only add the left padding on desktop.
          - Changed 'p-6' to 'p-4 md:p-6': Smaller padding on mobile.
          - Changed 'h-screen' to 'min-h-screen': Allows scrolling on mobile.
      */}
      <div className="p-4 md:p-6 md:pl-24 max-w-7xl mx-auto min-h-screen w-full flex flex-col">
        
        {/* HEADER */}
        <header className="mb-6 text-center shrink-0">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            {title}
          </h1>
          {subtitle && <p className="text-sm md:text-base text-slate-600">{subtitle}</p>}
        </header>

        {/* CONTENT */}
        <main className="flex-1 w-full relative">
          {children}
        </main>
      </div>

      {/* 4. TOOLS SLOT */}
      {tools && tools}
    </div>
  );
};