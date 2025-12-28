import { Routes, Route, Navigate } from 'react-router-dom';
import { EconomicsPage } from '../modules/economics/pages/EconomicsPage';
import { CalculusPage } from '../modules/calculus/CalculusPage';

export const AppRoutes = () => {
  return (
    <Routes>
      
      <Route path="/" element={<Navigate to="/economics" replace />} />
      <Route path="/economics" element={<EconomicsPage />} />
      <Route path="/calculus" element={<CalculusPage />} />
      
    </Routes>
  );
};