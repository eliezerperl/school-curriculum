// Generic helpers that don't care about Economics
export const isNumeric = (val: string): boolean => {
	return !isNaN(parseFloat(val)) && isFinite(parseFloat(val));
};

export const getTerm = (inputValue: string, symbol: string): string => {
	return (!inputValue || inputValue.trim() === "") ? symbol : inputValue;
};