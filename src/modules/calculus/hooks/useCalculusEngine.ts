import { useState, useMemo } from 'react';
import { evaluateExpression } from '../utils/mathUtils';
import type { Coordinate } from '../types';

export const useCalculusEngine = () => {
  // --- STATE ---
  // 1. The Function Input
  // We start with a simple quadratic but allow "a" and "b" variables
  const [expression, setExpression] = useState('a * x^2 + b');

  // 2. The Variables (Sliders)
  // We store them in a flexible object so we can add more later
  const [variables, setVariables] = useState<Record<string, number>>({
    a: 1,
    b: 0,
    c: 0, // Extra one just in case
  });

  // 3. The Window (Zoom/Range)
  const [range, setRange] = useState({
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10,
  });

  // --- ENGINE ---
  const graphData = useMemo(() => {
    const points: Coordinate[] = [];
    
    // How smooth the curve is. Smaller step = smoother line but more processing.
    // We calculate step dynamically based on zoom (always 100-200 points)
    const step = (range.xMax - range.xMin) / 200;

    for (let x = range.xMin; x <= range.xMax; x += step) {
      // 1. Create the scope (x changes, variables stay constant)
      const scope = { x, ...variables };

      // 2. Calculate Y using our helper
      const y = evaluateExpression(expression, scope);

      // 3. Only add valid points
      if (y !== null) {
        // Fix float precision issues (e.g. 0.0000000004 -> 0)
        const cleanX = Number(x.toFixed(2));
        const cleanY = Number(y.toFixed(2));
        
        points.push({ x: cleanX, y: cleanY });
      }
    }

    return points;
  }, [expression, variables, range.xMin, range.xMax]);

  // --- HANDLERS ---
  // Helper to update just one variable (e.g., setVariable('a', 5))
  const setVariable = (key: string, value: number) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };

  return {
    params: { expression, variables, range },
    setters: { setExpression, setVariable, setRange },
    data: graphData,
  };
};