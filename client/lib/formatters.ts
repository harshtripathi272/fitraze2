/**
 * Format numbers to display with proper decimal places
 */

// Format number to maximum 2 decimal places, removing unnecessary zeros
export function formatDecimal(
  value: number | string,
  maxDecimals: number = 2,
): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0";

  // Round to max decimals and remove trailing zeros
  const rounded = parseFloat(num.toFixed(maxDecimals));
  return rounded.toString();
}

// Format macros specifically (protein, carbs, fat)
export function formatMacro(value: number | string): string {
  return formatDecimal(value, 1); // 1 decimal place for macros
}

// Format calories (whole numbers)
export function formatCalories(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0";
  return Math.round(num).toString();
}

// Format weight with 1 decimal place
export function formatWeight(value: number | string): string {
  return formatDecimal(value, 1);
}

// Format percentage with 1 decimal place
export function formatPercentage(value: number | string): string {
  return formatDecimal(value, 1) + "%";
}

// Format water intake (1 decimal place)
export function formatWater(value: number | string): string {
  return formatDecimal(value, 1);
}

// Format general nutrition values
export function formatNutrition(value: number | string, unit?: string): string {
  const formatted = formatDecimal(value, 2);
  return unit ? `${formatted}${unit}` : formatted;
}
