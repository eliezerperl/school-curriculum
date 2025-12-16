import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

import AppLayout from './components/layout/AppLayout';
import ComingSoon from './modules/ComingSoon';
import EconomicsPage from './modules/economics/pages/EconomicsPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/economics" replace />} />
          <Route path="economics" element={<EconomicsPage />} />
          <Route path="calculus" element={<ComingSoon />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
