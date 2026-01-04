import React, { useState } from 'react';
import { Menu, X, BookOpen, TrendingUp, Sigma, Code, Home, BarChart3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const modules = [
    { name: 'Home', icon: <Home size={18} />, path: '/' },
    { name: 'Economics', icon: <TrendingUp size={18} />, path: '/economics' },
    { name: 'Calculus', icon: <Sigma size={18} />, path: '/calculus' },
    { name: 'Probability', icon: <BarChart3 size={18} />, path: '/probability' },
    { name: 'Python', icon: <Code size={18} />, path: '/python' },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed top-6 left-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-white p-3 rounded-xl shadow-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all hover:scale-105 flex items-center gap-2">
            <Menu size={24} />
            <span className="font-bold text-slate-700 hidden sm:inline">My Studies</span>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />
      )}

      <div className={`fixed top-0 left-0 h-full w-72 bg-slate-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BookOpen size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">My Studies</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition"><X size={24} /></button>
        </div>

        <nav className="p-4 space-y-2">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4">Menu</p>
          {modules.map((mod) => {
            const active = isActive(mod.path);
            return (
              <button
                key={mod.name}
                onClick={() => handleNavigate(mod.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}>
                {mod.icon}
                <span className="font-medium">{mod.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-400">ME</div>
            <div>
              <p className="text-sm font-bold text-white">Student</p>
              <p className="text-xs text-slate-500">Digital Sciences</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};