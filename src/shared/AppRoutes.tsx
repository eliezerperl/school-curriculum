import { Routes, Route, Navigate } from 'react-router-dom';
import { EconomicsPage } from '../modules/economics/EconomicsPage';
import { CalculusPage } from '../modules/calculus/CalculusPage';
import { ProbabilityPage } from '../modules/probability/ProbabilityPage';

export const AppRoutes = () => {
  return (
    <Routes>
      
      <Route path="/" element={<Navigate to="/economics" replace />} />
      <Route path="/economics" element={<EconomicsPage />} />
      <Route path="/calculus" element={<CalculusPage />} />
      <Route path="/probability" element={<ProbabilityPage />} />

    </Routes>
  );
};