/**
 * Math Formatter Utility
 * 
 * Converts raw mathematical expressions into valid LaTeX format.
 * Handles normalization of ASCII and Unicode math notation.
 * 
 * Designed to sanitize AI-generated outputs and user inputs before rendering.
 */

/**
 * Normalize ASCII mathematical notation to LaTeX
 * 
 * Handles conversions like:
 * - 100/50 → \frac{100}{50}
 * - sqrt(75) → \sqrt{75}
 * - x^2 → x^2
 * - √x → \sqrt{x}
 * 
 * @param expr Raw mathematical expression
 * @returns LaTeX-formatted expression
 */
export function normalizeToLatex(expr: string): string {
  if (!expr) return '';

  let result = expr;

  // 1. Handle sqrt/√ notation
  // sqrt(expr) or sqrt{expr}
  result = result.replace(/sqrt\s*\(([^()]+)\)/gi, '\\sqrt{$1}');
  result = result.replace(/sqrt\s*\{([^{}]+)\}/gi, '\\sqrt{$1}');

  // √(expr) or √{expr}
  result = result.replace(/√\s*\(([^()]+)\)/g, '\\sqrt{$1}');
  result = result.replace(/√\s*\{([^{}]+)\}/g, '\\sqrt{$1}');

  // Bare √ or sqrt
  result = result.replace(/√\s*([A-Za-z0-9]+)/g, '\\sqrt{$1}');
  result = result.replace(/sqrt\s*([A-Za-z0-9]+)/gi, '\\sqrt{$1}');

  // 2. Handle fraction notation
  // Convert a/b to \frac{a}{b} - but be careful with complex expressions
  // Only convert if both sides are simple (not already containing \)
  result = result.replace(
    /([a-zA-Z0-9}\)])\s*\/\s*([a-zA-Z0-9{(])/g,
    (match, a, b) => {
      // If already in LaTeX, don't double-wrap
      if (a.includes('\\') || b.includes('\\')) {
        return match;
      }
      return `\\frac{${a}}{${b}}`;
    }
  );

  // 3. Handle exponent notation
  // x^(...) → x^{...}
  result = result.replace(/\^(\w+)/g, (match, exp) => {
    if (exp.startsWith('{')) return match; // Already wrapped
    return `^{${exp}}`;
  });

  // 4. Handle subscript notation
  // x_(...) → x_{...}
  result = result.replace(/_(\w+)/g, (match, sub) => {
    if (sub.startsWith('{')) return match; // Already wrapped
    return `_{${sub}}`;
  });

  // 5. Handle mathematical operators
  result = result.replace(/×/g, '\\times ');
  result = result.replace(/÷/g, '\\div ');
  result = result.replace(/·/g, '\\cdot ');
  result = result.replace(/\*/g, '\\times '); // Asterisk to times

  // 6. Handle comparison operators
  result = result.replace(/≤/g, '\\leq ');
  result = result.replace(/≥/g, '\\geq ');
  result = result.replace(/≠/g, '\\neq ');
  result = result.replace(/≈/g, '\\approx ');
  result = result.replace(/∞/g, '\\infty ');

  // 7. Handle Greek letters
  result = result.replace(/π/g, '\\pi ');
  result = result.replace(/θ/g, '\\theta ');
  result = result.replace(/α/g, '\\alpha ');
  result = result.replace(/β/g, '\\beta ');
  result = result.replace(/γ/g, '\\gamma ');
  result = result.replace(/δ/g, '\\delta ');
  result = result.replace(/Δ/g, '\\Delta ');
  result = result.replace(/Σ/g, '\\Sigma ');
  result = result.replace(/σ/g, '\\sigma ');
  result = result.replace(/λ/g, '\\lambda ');
  result = result.replace(/μ/g, '\\mu ');
  result = result.replace(/ν/g, '\\nu ');

  // 8. Handle unicode subscript and superscript characters
  const subscriptMap: Record<string, string> = {
    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', 'ₙ': 'n',
  };
  const superscriptMap: Record<string, string> = {
    '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', 'ⁿ': 'n', 'ᵐ': 'm',
  };

  result = result.replace(/[₀₁₂₃₄₅₆₇₈₉ₙ]/g, (match) => `_{${subscriptMap[match] ?? match}}`);
  result = result.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᵐ]/g, (match) => `^{${superscriptMap[match] ?? match}}`);

  // 9. Clean up extra spaces before/after operators
  result = result.replace(/\s+\\times\s+/g, ' \\times ');
  result = result.replace(/\s+\\div\s+/g, ' \\div ');

  return result.trim();
}

/**
 * Create a fraction LaTeX expression from numerator and denominator
 * 
 * @param numerator Numerator expression
 * @param denominator Denominator expression
 * @returns LaTeX \frac expression
 */
export function createFraction(numerator: string, denominator: string): string {
  return `\\frac{${normalizeToLatex(numerator)}}{${normalizeToLatex(denominator)}}`;
}

/**
 * Create a square root LaTeX expression
 * 
 * @param expr Expression to take square root of
 * @returns LaTeX \sqrt expression
 */
export function createSquareRoot(expr: string): string {
  return `\\sqrt{${normalizeToLatex(expr)}}`;
}

/**
 * Create an exponent LaTeX expression
 * 
 * @param base Base expression
 * @param exponent Exponent expression
 * @returns LaTeX exponent expression
 */
export function createExponent(base: string, exponent: string): string {
  const cleanBase = normalizeToLatex(base);
  const cleanExp = normalizeToLatex(exponent);
  return `${cleanBase}^{${cleanExp}}`;
}

/**
 * Create a scientific equation from a formula and values
 * 
 * @param formula Main formula (e.g., "I = P / U")
 * @param values Substituted values (e.g., "I = 100 / 50")
 * @param result Final result (e.g., "I = 2A")
 * @returns Complete LaTeX derivation
 */
export function createScientificEquation(
  formula: string,
  values?: string,
  result?: string
): string {
  const formulaLatex = normalizeToLatex(formula);
  const parts = [formulaLatex];

  if (values) {
    parts.push(normalizeToLatex(values));
  }

  if (result) {
    parts.push(normalizeToLatex(result));
  }

  // Return as aligned equations
  return `\\begin{align*}\n${parts.join(' \\\\ \n')}\n\\end{align*}`;
}

/**
 * Format a physics/chemistry formula string
 * 
 * Handles common patterns like:
 * - "F = m * a" → "F = m \\times a"
 * - "E = m * c^2" → "E = m \\times c^{2}"
 * 
 * @param formula Formula string
 * @returns Formatted LaTeX
 */
export function formatPhysicsFormula(formula: string): string {
  let result = formula;

  // Handle energy formula specially
  if (result.includes('c^2') || result.includes('c²')) {
    result = result.replace(/c²/g, 'c^{2}');
    result = result.replace(/c\^2/g, 'c^{2}');
  }

  // Replace multiplication operators
  result = result.replace(/\s*\*\s*/g, ' \\times ');
  result = result.replace(/\s*x\s*(?=[A-Z])/g, ' \\times '); // x between variables

  return normalizeToLatex(result);
}

/**
 * Escape special LaTeX characters
 * 
 * Useful when including user input in LaTeX expressions.
 * 
 * @param text Text to escape
 * @returns Escaped text safe for LaTeX
 */
export function escapeLaTeX(text: string): string {
  const escapeMap: Record<string, string> = {
    '\\': '\\textbackslash ',
    '{': '\\{',
    '}': '\\}',
    '^': '\\^{}',
    '_': '\\_',
    '$': '\\$',
    '&': '\\&',
    '#': '\\#',
    '%': '\\%',
    '~': '\\textasciitilde ',
  };

  return text.replace(/[\\{}^_$&#%~]/g, (char) => escapeMap[char] || char);
}

/**
 * Format a complex multi-step derivation
 * 
 * @param steps Array of derivation steps
 * @returns Complete LaTeX derivation with align*
 */
export function formatDerivation(steps: string[]): string {
  const normalized = steps.map((step) => normalizeToLatex(step));
  return `\\begin{align*}\n${normalized.join(' \\\\ \n')}\n\\end{align*}`;
}

/**
 * Convert scientific notation to LaTeX
 * 
 * @param value Numeric value (e.g., 1.5e-3)
 * @returns LaTeX scientific notation
 */
export function formatScientificNotation(value: number): string {
  const str = value.toExponential();
  const [mantissa, exponent] = str.split('e');
  return `${mantissa} \\times 10^{${exponent}}`;
}

/**
 * Format a unit expression with proper spacing
 * 
 * @param value Numeric value
 * @param unit Unit string (e.g., "m/s", "kg·m/s²")
 * @returns Formatted expression with proper spacing
 */
export function formatWithUnit(value: number | string, unit: string): string {
  const normUnit = normalizeToLatex(unit);
  return `${value} \\, \\text{${normUnit}}`;
}

/**
 * Create inline physics annotation
 * 
 * @param variable Variable name (e.g., "I", "P")
 * @param meaning Meaning in Arabic
 * @returns Formatted annotation
 */
export function createPhysicsAnnotation(variable: string, meaning: string): string {
  return `${variable} \\text{ — ${meaning}}`;
}

export default {
  normalizeToLatex,
  createFraction,
  createSquareRoot,
  createExponent,
  createScientificEquation,
  formatPhysicsFormula,
  escapeLaTeX,
  formatDerivation,
  formatScientificNotation,
  formatWithUnit,
  createPhysicsAnnotation,
};
