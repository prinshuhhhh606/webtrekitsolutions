/**
 * Global Indian Rupee (INR) Currency Formatter
 * Formats numbers into standardized Indian Rupee currency representation (e.g. ₹5,500, ₹45,000)
 * utilizing the native Intl.NumberFormat API with 'en-IN' locale and 'INR' currency.
 */

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  currencyDisplay: 'symbol',
  maximumFractionDigits: 0,
});

const inrFormatterWithDecimals = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  currencyDisplay: 'symbol',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formats any numeric value or raw currency string into Indian Rupees (₹)
 * 
 * @param {number|string} amount - The amount to format
 * @param {Object} [options]
 * @param {boolean} [options.showDecimals=false] - Whether to show .00 decimals
 * @param {number} [options.fallback=0] - Fallback value if invalid
 * @returns {string} Formatted string, e.g. "₹5,500"
 */
export const formatINR = (amount, options = {}) => {
  if (amount === null || amount === undefined || amount === '') {
    return inrFormatter.format(options.fallback || 0);
  }

  // If already string
  if (typeof amount === 'string') {
    const trimmed = amount.trim();

    // Check if it's already formatted with ₹ symbol
    if (trimmed.startsWith('₹') && !trimmed.includes('$')) {
      return trimmed;
    }

    // Specific legacy mapping for $65 placeholder -> ₹5,500
    if (trimmed === '$65' || trimmed === '$ 65') {
      return inrFormatter.format(5500);
    }

    // Clean any dollar signs, letters, and extraneous spaces
    const cleanNum = trimmed.replace(/[^0-9.-]+/g, '');
    const parsed = parseFloat(cleanNum);

    if (isNaN(parsed)) {
      return inrFormatter.format(options.fallback || 0);
    }

    // If small USD amount previously passed with '$', convert realistically (~85 INR/USD)
    if (trimmed.includes('$') && parsed <= 500) {
      const converted = Math.round(parsed * 85);
      return options.showDecimals
        ? inrFormatterWithDecimals.format(converted)
        : inrFormatter.format(converted);
    }

    return options.showDecimals
      ? inrFormatterWithDecimals.format(parsed)
      : inrFormatter.format(parsed);
  }

  const num = Number(amount);
  if (isNaN(num)) {
    return inrFormatter.format(options.fallback || 0);
  }

  return options.showDecimals
    ? inrFormatterWithDecimals.format(num)
    : inrFormatter.format(num);
};

/**
 * Parses any currency string or numeric input into a clean numeric value
 * 
 * @param {number|string} val 
 * @returns {number}
 */
export const parseINR = (val) => {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  const cleaned = String(val).replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

export default formatINR;
