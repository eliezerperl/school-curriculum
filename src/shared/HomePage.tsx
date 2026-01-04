import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Sigma, BarChart3, Code, ArrowRight, BookOpen } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Economics",
      description: "Supply & Demand, Market Equilibrium, Taxes, and Subsidies.",
      icon: <TrendingUp size={32} className="text-blue-600" />,
      path: "/economics",
      color: "bg-blue-50 border-blue-100 hover:border-blue-300",
      textColor: "text-blue-900"
    },
    {
      title: "Calculus",
      description: "Derivatives, Integrals, and Function Analysis.",
      icon: <Sigma size={32} className="text-emerald-600" />,
      path: "/calculus",
      color: "bg-emerald-50 border-emerald-100 hover:border-emerald-300",
      textColor: "text-emerald-900"
    },
    {
      title: "Probability",
      description: "Distributions, PMF/PDF/CDF, and 3D Joint Probability.",
      icon: <BarChart3 size={32} className="text-indigo-600" />,
      path: "/probability",
      color: "bg-indigo-50 border-indigo-100 hover:border-indigo-300",
      textColor: "text-indigo-900"
    },
    {
      title: "Python (Coming Soon)",
      description: "Data Science basics and scripting challenges.",
      icon: <Code size={32} className="text-slate-400" />,
      path: "#",
      color: "bg-slate-50 border-slate-100 opacity-70 cursor-not-allowed",
      textColor: "text-slate-500",
      disabled: true
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      
      {/* HEADER SECTION */}
      <div className="text-center max-w-2xl mb-12 animate-fade-in-up">
        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-slate-100 mb-6">
          <BookOpen size={28} className="text-slate-800" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Studies Curriculum
        </h1>
        <p className="text-lg text-slate-600">
          Interactive visualizations for Economics, Math, and Statistics.
          <br className="hidden md:block" />
          Select a module below to begin exploring.
        </p>
      </div>

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {modules.map((mod) => (
          <div
            key={mod.title}
            onClick={() => !mod.disabled && navigate(mod.path)}
            className={`
              group relative p-6 rounded-2xl border-2 transition-all duration-300 ease-in-out
              ${mod.color}
              ${mod.disabled ? '' : 'hover:-translate-y-1 hover:shadow-xl cursor-pointer'}
            `}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                {mod.icon}
              </div>
              {!mod.disabled && (
                <ArrowRight className="text-slate-400 group-hover:text-slate-700 transition-colors" />
              )}
            </div>
            
            <h3 className={`text-xl font-bold mb-2 ${mod.textColor}`}>
              {mod.title}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {mod.description}
            </p>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="mt-16 text-slate-400 text-sm font-medium">
        © 2024 Digital Sciences & Economics
      </div>
    </div>
  );
};