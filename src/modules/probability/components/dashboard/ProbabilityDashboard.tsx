import React, { useState, useMemo, useEffect } from 'react';
import { BarChart3, Box } from 'lucide-react';

// Layout & UI
import { DashboardLayout } from '../../../../components/layout/DashboardLayout';
import { DockTab } from '../../../../components/layout/DockTab';
import { ProbabilityControls } from './ProbabilityControls';

// Graphs
import { ProbabilityGraph } from '../ProbabilityGraph';
import { ProbabilityGraph3D } from '../ProbabilityGraph3D';
import type { ProbabilityPoint, ProbabilityPoint3D } from '../../types';

export const ProbabilityDashboard: React.FC = () => {
  // === 1. TITLE EFFECT ===
  useEffect(() => {
    document.title = "Probability & Statistics | My Studies";
  }, []);

  // === 2. STATE ===
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const [distType, setDistType] = useState<'normal' | 'binomial'>('normal');
  const [showCDF, setShowCDF] = useState(false);

  // 2D Parameters
  const [mean, setMean] = useState(0);
  const [stdDev, setStdDev] = useState(1);
  const [n, setN] = useState(10);
  const [p, setP] = useState(0.5);

  // 3D Joint Parameters
  const [meanY, setMeanY] = useState(0);
  const [stdY, setStdY] = useState(1);
  const [nY, setNY] = useState(10);
  const [pY, setPY] = useState(0.5);
  const [correlation, setCorrelation] = useState(0);

  // === 3. MATH ENGINE (2D) ===
  const data2D: ProbabilityPoint[] = useMemo(() => {
    if (viewMode === '3D') return [];
    
    const data: ProbabilityPoint[] = [];
    if (distType === 'normal') {
      const start = mean - (4 * stdDev);
      const end = mean + (4 * stdDev);
      const step = (end - start) / 100;

      for (let x = start; x <= end; x += step) {
        const z = (x - mean) / stdDev;
        const pdf = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
        const cdf = 0.5 * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (z + 0.044715 * Math.pow(z, 3))));
        data.push({ x: Number(x.toFixed(2)), prob: pdf, cdf: cdf });
      }
    } else {
      const fact = (num: number): number => (num <= 1 ? 1 : num * fact(num - 1));
      const combination = (n: number, k: number) => fact(n) / (fact(k) * fact(n - k));
      let runningSum = 0;
      for (let k = 0; k <= n; k++) {
        const prob = combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
        runningSum += prob;
        data.push({ x: k, prob: prob, cdf: runningSum });
      }
    }
    return data;
  }, [viewMode, distType, mean, stdDev, n, p]);

  // === 4. MATH ENGINE (3D) ===
  const data3D: ProbabilityPoint3D[] = useMemo(() => {
    if (viewMode === '2D') return [];

    const data: ProbabilityPoint3D[] = [];
    const resolution = 25;

    if (distType === 'normal') {
      const FIXED_RANGE = 6; 
      const stepX = (FIXED_RANGE * 2) / resolution;
      const stepY = (FIXED_RANGE * 2) / resolution;
      const startX = -FIXED_RANGE;
      const startY = -FIXED_RANGE;

      for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
          const x = startX + i * stepX;
          const y = startY + j * stepY;
          const rho = correlation;
          
          const zTerm = (
            Math.pow((x - mean) / stdDev, 2) -
            2 * rho * ((x - mean) / stdDev) * ((y - meanY) / stdY) +
            Math.pow((y - meanY) / stdY, 2)
          );
          
          let val = 0;
          if (showCDF) {
             val = (0.5 * (1 + Math.tanh((x - mean) / stdDev))) * (0.5 * (1 + Math.tanh((y - meanY) / stdY)));
          } else {
            const denom = 2 * Math.PI * stdDev * stdY * Math.sqrt(1 - rho * rho);
            val = (1 / denom) * Math.exp(-zTerm / (2 * (1 - rho * rho)));
          }
          data.push({ x, y, z: val });
        }
      }
    } else {
      const fact = (num: number): number => (num <= 1 ? 1 : num * fact(num - 1));
      const combination = (n: number, k: number) => fact(n) / (fact(k) * fact(n - k));
      const limitX = Math.min(n, 20); 
      const limitY = Math.min(nY, 20);

      for (let i = 0; i <= limitX; i++) {
        for (let j = 0; j <= limitY; j++) {
          const probX = combination(n, i) * Math.pow(p, i) * Math.pow(1 - p, n - i);
          const probY = combination(nY, j) * Math.pow(pY, j) * Math.pow(1 - pY, nY - j);
          data.push({ x: i, y: j, z: probX * probY });
        }
      }
    }
    return data;
  }, [viewMode, distType, mean, stdDev, meanY, stdY, correlation, n, p, nY, pY, showCDF]);

  return (
    <DashboardLayout 
      title="Probability & Statistics" 
      subtitle={viewMode === '2D' ? "Univariate Distributions" : "Bivariate Joint Distributions"}
      sideNav={
        <>
          <DockTab 
            label="2D Single" 
            icon={<BarChart3 size={20} />} 
            isActive={viewMode === '2D'} 
            onClick={() => setViewMode('2D')} 
          />
          <DockTab 
            label="3D Joint" 
            icon={<Box size={20} />} 
            isActive={viewMode === '3D'} 
            onClick={() => setViewMode('3D')} 
          />
        </>
      }
    >
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)]">
        
        {/* LEFT: GRAPH */}
        <div className="flex-1 min-h-[500px]">
          {viewMode === '2D' ? (
            <ProbabilityGraph 
              type={distType === 'normal' ? 'continuous' : 'discrete'} 
              data={data2D} 
              showCDF={showCDF}
            />
          ) : (
            <ProbabilityGraph3D
              type={distType === 'normal' ? 'continuous' : 'discrete'}
              data={data3D}
              resolution={distType === 'normal' ? 25 : Math.min(n, 20)}
              zLabel={showCDF ? "CDF" : "Density"}
            />
          )}
        </div>

        {/* RIGHT: CONTROLS */}
        <ProbabilityControls 
          viewMode={viewMode} setViewMode={setViewMode}
          distType={distType} setDistType={setDistType}
          showCDF={showCDF} setShowCDF={setShowCDF}
          mean={mean} setMean={setMean}
          stdDev={stdDev} setStdDev={setStdDev}
          n={n} setN={setN} p={p} setP={setP}
          meanY={meanY} setMeanY={setMeanY}
          stdY={stdY} setStdY={setStdY}
          nY={nY} setNY={setNY}
          pY={pY} setPY={setPY}
          correlation={correlation} setCorrelation={setCorrelation}
        />
      </div>
    </DashboardLayout>
  );
};