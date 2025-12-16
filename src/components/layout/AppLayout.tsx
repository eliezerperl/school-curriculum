import { Link, Outlet } from 'react-router-dom';
import { BookOpen, TrendingUp, Calculator } from 'lucide-react';

const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-6 text-white font-bold text-xl flex items-center gap-2">
          <BookOpen /> My Studies
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Link to="/calculus" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition text-white">
            <Calculator size={20} /> Calculus
          </Link>
          <Link to="/economics" className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg transition text-white">
            <TrendingUp size={20} /> Economics
          </Link>
        </nav>
      </div>

      {/* Main Content Area - Reduced Padding here */}
      <div className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;