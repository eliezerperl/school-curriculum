import { getTerm, isNumeric } from "../../../shared/utils/mathHelper";


export const calculateEffectiveCost = (price: string, subsidy: string): string => {
  // Uses the shared helper to get terms
  const pTerm = getTerm(price, "P");
  const sTerm = getTerm(subsidy, "S");

  if (isNumeric(price) && isNumeric(subsidy)) {
    return (parseFloat(price) - parseFloat(subsidy)).toFixed(2);
  }
  return `${pTerm} - ${sTerm}`;
};