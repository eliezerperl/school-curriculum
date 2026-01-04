import { Routes, Route } from 'react-router-dom';
import { EconomicsPage } from '../modules/economics/EconomicsPage';
import { CalculusPage } from '../modules/calculus/CalculusPage';
import { ProbabilityPage } from '../modules/probability/ProbabilityPage';
import { HomePage } from './HomePage';

export const AppRoutes = () => {
  return (
    <Routes>
      
      <Route path="/" element={<HomePage />} />
      <Route path="/economics" element={<EconomicsPage />} />
      <Route path="/calculus" element={<CalculusPage />} />
      <Route path="/probability" element={<ProbabilityPage />} />

    </Routes>
  );
};