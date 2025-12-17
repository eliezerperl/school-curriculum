import { evaluate } from 'mathjs';

/**
 * Safely evaluates a math expression string.
 * @param expression The math string (e.g., "x^2 + a")
 * @param scope The variables object (e.g., { x: 5, a: 2 })
 * @returns The calculated number, or null if there's an error.
 */
export const evaluateExpression = (
  expression: string,
  scope: Record<string, number>
): number | null => {
  try {
    // mathjs handles the magic parsing
    const result = evaluate(expression, scope);

    // Ensure we actually got a number back (not a complex number or matrix)
    if (typeof result === 'number' && isFinite(result)) {
      return result;
    }
    return null;
  } catch (error) {
    // If the user types an incomplete formula, just return null silently
    console.log(error);
    return null;
  }
};
