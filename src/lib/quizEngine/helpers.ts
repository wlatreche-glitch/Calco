import { createRng } from './seed';

export type Rng = ReturnType<typeof createRng>;

export function hashSignature(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    const chr = input.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return `sig-${Math.abs(hash).toString(36).slice(0, 10)}`;
}

export function createSignature(parts: Array<string | number>): string {
  return hashSignature(parts.map((part) => String(part)).join('|'));
}

export function choose<T>(rng: Rng, options: readonly T[]): T {
  return options[Math.floor(rng.random() * options.length)];
}

export function randomIntRange(rng: Rng, min: number, max: number): number {
  return rng.randomInt(min, max);
}

export function randomNonZeroInt(rng: Rng, min: number, max: number): number {
  let value = 0;
  while (value === 0) {
    value = rng.randomInt(min, max);
  }
  return value;
}

export function randomCoefficients(rng: Rng, degree: number, min: number, max: number) {
  const coeffs: number[] = [];
  for (let idx = 0; idx <= degree; idx += 1) {
    const isLeading = idx === 0;
    const coeff = isLeading ? randomNonZeroInt(rng, min, max) : rng.randomInt(min, max);
    coeffs.push(coeff);
  }
  return coeffs;
}

export function derivePolynomialCoefficients(coeffs: number[]): number[] {
  const degree = coeffs.length - 1;
  return coeffs.slice(0, -1).map((coeff, idx) => coeff * (degree - idx));
}

export function formatPolynomialExpression(coeffs: number[], variable = 'x'): string {
  const terms: string[] = [];
  const degree = coeffs.length - 1;

  coeffs.forEach((coeff, index) => {
    const power = degree - index;
    if (coeff === 0) return;
    const absCoeff = Math.abs(coeff);
    const sign = coeff < 0 ? '-' : '+';

    const coeffPart = power === 0 ? `${absCoeff}` : absCoeff === 1 ? '' : `${absCoeff}*`;
    const powerPart = power === 0 ? '' : power === 1 ? variable : `${variable}^${power}`;
    const term = `${coeffPart}${powerPart}`;
    terms.push(`${sign} ${term}`.trim());
  });

  if (terms.length === 0) return '0';
  let polynomial = terms.join(' ');
  if (polynomial.startsWith('+')) {
    polynomial = polynomial.slice(2);
  }
  return polynomial;
}

export function formatPolynomialText(coeffs: number[], variable = 'x'): string {
  const terms: string[] = [];
  const degree = coeffs.length - 1;

  coeffs.forEach((coeff, index) => {
    const power = degree - index;
    if (coeff === 0) return;
    const absCoeff = Math.abs(coeff);
    const sign = coeff < 0 ? '-' : '+';

    const coeffPart = power === 0 ? `${absCoeff}` : absCoeff === 1 ? '' : `${absCoeff}`;
    const powerPart = power === 0 ? '' : power === 1 ? variable : `${variable}^${power}`;
    const term = `${coeffPart}${powerPart}`;
    terms.push(`${sign} ${term}`.trim());
  });

  if (terms.length === 0) return '0';
  let polynomial = terms.join(' ');
  if (polynomial.startsWith('+')) {
    polynomial = polynomial.slice(2);
  }
  return polynomial;
}

export function toLatexPolynomial(coeffs: number[], variable = 'x'): string {
  const degree = coeffs.length - 1;
  const terms = coeffs.map((coeff, index) => {
    const power = degree - index;
    if (coeff === 0) return '';
    const sign = coeff < 0 ? '-' : '+';
    const absValue = Math.abs(coeff);
    const coeffText = power === 0 ? `${absValue}` : absValue === 1 ? '' : `${absValue}`;
    const variableText = power === 0 ? '' : power === 1 ? variable : `${variable}^{${power}}`;
    return `${sign} ${coeffText}${variableText}`.trim();
  });
  const filtered = terms.filter(Boolean);
  let latex = filtered.join(' ');
  if (latex.startsWith('+')) latex = latex.slice(2);
  return latex || '0';
}

export function normalizeExpression(expr: string): string {
  return expr.replace(/\s+/g, '').replace(/\^/g, '^').toLowerCase();
}

export function buildPolynomialDerivativeHint(rng: Rng): string {
  const variants = [
    'احسب مشتقة الدالة',
    'استنتج معادلة المشتقة',
    'حدد الدالة المشتقة',
    'ما هو التعبير عن f\'(x)',
  ];
  return choose(rng, variants);
}
