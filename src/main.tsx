import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import './index.css';

// Import Layout and Routes separately
import { AppLayout } from './components/layout/AppLayout';
import { AppRoutes } from './shared/AppRoutes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Analytics />
    <BrowserRouter>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </BrowserRouter>
  </StrictMode>
);