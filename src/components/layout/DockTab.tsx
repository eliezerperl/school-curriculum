import React from 'react';

interface DockTabProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const DockTab: React.FC<DockTabProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      title={label}
      // EXACT BUTTON STYLING FROM ECONOMICS PAGE
      className={`p-4 rounded-xl shadow-sm border transition-all duration-200 flex flex-col items-center justify-center w-16 h-16 ${
        isActive
          ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/20 scale-110'
          : 'bg-white border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200'
      }`}
    >
      {icon}
      <span className="text-[10px] font-bold mt-1">{label}</span>
    </button>
  );
};