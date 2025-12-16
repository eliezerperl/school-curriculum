import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

import AppLayout from './components/layout/AppLayout'
import SupplyDemand from './modules/economics/SupplyDemand'
import ComingSoon from './modules/ComingSoon'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
<BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/economics" replace />} />
          <Route path="economics" element={<SupplyDemand />} />
          <Route path="calculus" element={<ComingSoon />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
