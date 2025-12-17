import { Routes, Route, Navigate } from 'react-router-dom';
import { EconomicsPage } from '../modules/economics/pages/EconomicsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      
      <Route path="/" element={<Navigate to="/economics" replace />} />
      <Route path="/economics" element={<EconomicsPage />} />
      
    </Routes>
  );
};