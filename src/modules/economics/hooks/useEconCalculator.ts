import { useState } from 'react';
// Import the specific math logic for this module
import { calculateEffectiveCost } from '../utils/supplyDemandMath'; 

export const useEconCalculator = () => {
  // 1. State: The "Memory" of the component
  const [price, setPrice] = useState<string>("");
  const [subsidy, setSubsidy] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);

  // 2. Action: What happens when you click "Calculate"
  const handleCalculate = () => {
    // We send the raw text inputs to our math utility
    // The utility decides if it returns a number or a formula string
    const calculatedValue = calculateEffectiveCost(price, subsidy);
    
    // We update the result state so the UI can see it
    setResult(calculatedValue);
  };

  // 3. Reset: Optional helper to clear everything
  const resetCalculator = () => {
    setPrice("");
    setSubsidy("");
    setResult(null);
  };

  // 4. Export: We only expose what the UI needs to know about
  return {
    price,
    setPrice,
    subsidy,
    setSubsidy,
    result,
    handleCalculate,
    resetCalculator
  };
};