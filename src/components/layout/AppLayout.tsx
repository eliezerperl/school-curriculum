import React from 'react';
import { Navigation } from './Navigation';

// Define that this component expects 'children'
interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="relative z-0">{children}</main>
    </div>
  );
};
