import * as math from 'mathjs';
import { evaluateAt } from './mathEngine';

export interface SpecialPoint {
  x: number;
  y: number;
  type: 'root' | 'extremum-max' | 'extremum-min' | 'inflection';
  label: string;
}

export interface Asymptote {
  type: 'vertical' | 'horizontal' | 'oblique';
  value?: number;
  slope?: number;
  intercept?: number;
  equation: string;
}

export interface LimitResult {
  point: string;
  pointValue: number | null;
  leftLimit: string;
  rightLimit: string;
  limit: string;
  type: 'domain-boundary' | 'critical-point' | 'vertical-asymptote';
  description: string;
}

export interface VariationInterval {
  from: string;
  to: string;
  derivativeSign: '+' | '-' | '0';
  variation: 'increasing' | 'decreasing' | 'constant';
  fromValue: string;
  toValue: string;
}

export interface FunctionAnalysis {
  derivative: string;
  secondDerivative: string;
  roots: SpecialPoint[];
  extrema: SpecialPoint[];
  inflectionPoints: SpecialPoint[];
  asymptotes: Asymptote[];
  variationTable: VariationInterval[];
  criticalPoints: number[];
  limits: LimitResult[];
}

// Find roots using Newton-Raphson method
function findRoots(expr: string, xMin: number, xMax: number): number[] {
  const roots: number[] = [];
  const step = (xMax - xMin) / 50;
  
  for (let x = xMin; x < xMax; x += step) {
    const y1 = evaluateAt(expr, x);
    const y2 = evaluateAt(expr, x + step);
    
    // Sign change indicates a root
    if (isFinite(y1) && isFinite(y2) && y1 * y2 < 0) {
      // Binary search for more precision
      let left = x, right = x + step;
      for (let i = 0; i < 20; i++) {
        const mid = (left + right) / 2;
        const yMid = evaluateAt(expr, mid);
        if (Math.abs(yMid) < 1e-10) {
          roots.push(Math.round(mid * 1000) / 1000);
          break;
        }
        if (y1 * yMid < 0) right = mid;
        else left = mid;
      }
      if (roots.length === 0 || Math.abs(roots[roots.length - 1] - (left + right) / 2) > 0.01) {
        roots.push(Math.round((left + right) / 2 * 1000) / 1000);
      }
    }
    
    // Check if very close to zero
    if (Math.abs(y1) < 1e-8 && (roots.length === 0 || Math.abs(roots[roots.length - 1] - x) > 0.1)) {
      roots.push(Math.round(x * 1000) / 1000);
    }
  }
  
  return [...new Set(roots)].sort((a, b) => a - b);
}

// Find vertical asymptotes (where function approaches infinity)
function findVerticalAsymptotes(expr: string, xMin: number, xMax: number): Asymptote[] {
  const asymptotes: Asymptote[] = [];
  const step = (xMax - xMin) / 200;
  
  for (let x = xMin; x < xMax; x += step) {
    const y = evaluateAt(expr, x);
    const yNext = evaluateAt(expr, x + step);
    
    // Check for discontinuity (large jump or infinity)
    if ((!isFinite(y) || !isFinite(yNext)) && (isFinite(evaluateAt(expr, x - step)) || isFinite(evaluateAt(expr, x + 2 * step)))) {
      const potentialX = Math.round(x * 10) / 10;
      if (!asymptotes.some(a => a.type === 'vertical' && Math.abs((a.value || 0) - potentialX) < 0.5)) {
        asymptotes.push({
          type: 'vertical',
          value: potentialX,
          equation: `x = ${potentialX}`
        });
      }
    }
  }
  
  return asymptotes;
}

// Find horizontal asymptotes (limits at ±∞)
function findHorizontalAsymptotes(expr: string): Asymptote[] {
  const asymptotes: Asymptote[] = [];
  
  // Check limit as x → +∞
  const yLargePos = evaluateAt(expr, 10000);
  const yVeryLargePos = evaluateAt(expr, 100000);
  
  if (isFinite(yLargePos) && isFinite(yVeryLargePos) && Math.abs(yLargePos - yVeryLargePos) < 0.01) {
    const limit = Math.round(yLargePos * 100) / 100;
    asymptotes.push({
      type: 'horizontal',
      value: limit,
      equation: `y = ${limit}`
    });
  }
  
  // Check limit as x → -∞
  const yLargeNeg = evaluateAt(expr, -10000);
  const yVeryLargeNeg = evaluateAt(expr, -100000);
  
  if (isFinite(yLargeNeg) && isFinite(yVeryLargeNeg) && Math.abs(yLargeNeg - yVeryLargeNeg) < 0.01) {
    const limit = Math.round(yLargeNeg * 100) / 100;
    if (!asymptotes.some(a => a.value === limit)) {
      asymptotes.push({
        type: 'horizontal',
        value: limit,
        equation: `y = ${limit}`
      });
    }
  }
  
  return asymptotes;
}

// Find oblique asymptotes (y = mx + b as x → ±∞)
function findObliqueAsymptotes(expr: string): Asymptote[] {
  const asymptotes: Asymptote[] = [];
  
  // Check for oblique asymptote as x → +∞
  const x1 = 1000, x2 = 10000;
  const y1 = evaluateAt(expr, x1);
  const y2 = evaluateAt(expr, x2);
  
  if (isFinite(y1) && isFinite(y2) && !isFinite(evaluateAt(expr, 100000) - evaluateAt(expr, 10000))) {
    return asymptotes; // Horizontal asymptote exists
  }
  
  if (isFinite(y1) && isFinite(y2)) {
    const slope = (y2 - y1) / (x2 - x1);
    
    // If slope is significant and consistent
    if (Math.abs(slope) > 0.001) {
      const x3 = 100000;
      const y3 = evaluateAt(expr, x3);
      const slope2 = (y3 - y2) / (x3 - x2);
      
      if (Math.abs(slope - slope2) < 0.01) {
        const m = Math.round(slope * 100) / 100;
        const b = Math.round((y2 - m * x2) * 100) / 100;
        
        asymptotes.push({
          type: 'oblique',
          slope: m,
          intercept: b,
          equation: b >= 0 ? `y = ${m}x + ${b}` : `y = ${m}x - ${Math.abs(b)}`
        });
      }
    }
  }
  
  return asymptotes;
}

// Calculate limit at a point
function calculateLimit(expr: string, point: number, direction: 'left' | 'right' | 'both'): string {
  const epsilon = 0.0001;
  
  if (direction === 'left' || direction === 'both') {
    const leftValues = [
      evaluateAt(expr, point - epsilon),
      evaluateAt(expr, point - epsilon / 10),
      evaluateAt(expr, point - epsilon / 100)
    ];
    
    if (direction === 'left') {
      if (!isFinite(leftValues[2])) {
        return leftValues[2] > 0 ? '+∞' : '-∞';
      }
      return leftValues[2].toFixed(4);
    }
  }
  
  if (direction === 'right' || direction === 'both') {
    const rightValues = [
      evaluateAt(expr, point + epsilon),
      evaluateAt(expr, point + epsilon / 10),
      evaluateAt(expr, point + epsilon / 100)
    ];
    
    if (direction === 'right') {
      if (!isFinite(rightValues[2])) {
        return rightValues[2] > 0 ? '+∞' : '-∞';
      }
      return rightValues[2].toFixed(4);
    }
  }
  
  // Both directions
  const leftVal = evaluateAt(expr, point - epsilon / 100);
  const rightVal = evaluateAt(expr, point + epsilon / 100);
  
  if (!isFinite(leftVal) && !isFinite(rightVal)) {
    if (leftVal > 0 && rightVal > 0) return '+∞';
    if (leftVal < 0 && rightVal < 0) return '-∞';
    return 'غير موجودة';
  }
  
  if (!isFinite(leftVal) || !isFinite(rightVal)) {
    return 'غير موجودة';
  }
  
  if (Math.abs(leftVal - rightVal) < 0.01) {
    return leftVal.toFixed(4);
  }
  
  return 'غير موجودة';
}

// Calculate limit at infinity
function calculateLimitAtInfinity(expr: string, direction: 'positive' | 'negative'): string {
  const sign = direction === 'positive' ? 1 : -1;
  const values = [
    evaluateAt(expr, sign * 1000),
    evaluateAt(expr, sign * 10000),
    evaluateAt(expr, sign * 100000)
  ];
  
  // Check if approaching a finite limit
  if (isFinite(values[0]) && isFinite(values[1]) && isFinite(values[2])) {
    if (Math.abs(values[1] - values[2]) < 0.01) {
      return values[2].toFixed(4);
    }
    // Growing without bound
    if (values[2] > values[1] && values[1] > values[0]) {
      return '+∞';
    }
    if (values[2] < values[1] && values[1] < values[0]) {
      return '-∞';
    }
  }
  
  if (!isFinite(values[2])) {
    return values[2] > 0 ? '+∞' : '-∞';
  }
  
  return values[2].toFixed(4);
}

// Find all limits for the function
function findAllLimits(expr: string, xMin: number, xMax: number, verticalAsymptotes: Asymptote[], criticalPoints: number[]): LimitResult[] {
  const limits: LimitResult[] = [];
  
  // Limits at domain boundaries (±∞)
  const limitPosInf = calculateLimitAtInfinity(expr, 'positive');
  const limitNegInf = calculateLimitAtInfinity(expr, 'negative');
  
  limits.push({
    point: '+∞',
    pointValue: null,
    leftLimit: limitPosInf,
    rightLimit: limitPosInf,
    limit: limitPosInf,
    type: 'domain-boundary',
    description: `lim[x→+∞] f(x) = ${limitPosInf}`
  });
  
  limits.push({
    point: '-∞',
    pointValue: null,
    leftLimit: limitNegInf,
    rightLimit: limitNegInf,
    limit: limitNegInf,
    type: 'domain-boundary',
    description: `lim[x→-∞] f(x) = ${limitNegInf}`
  });
  
  // Limits at vertical asymptotes
  for (const asymp of verticalAsymptotes) {
    if (asymp.value !== undefined) {
      const leftLim = calculateLimit(expr, asymp.value, 'left');
      const rightLim = calculateLimit(expr, asymp.value, 'right');
      
      limits.push({
        point: asymp.value.toString(),
        pointValue: asymp.value,
        leftLimit: leftLim,
        rightLimit: rightLim,
        limit: leftLim === rightLim ? leftLim : 'غير موجودة',
        type: 'vertical-asymptote',
        description: `lim[x→${asymp.value}⁻] f(x) = ${leftLim}, lim[x→${asymp.value}⁺] f(x) = ${rightLim}`
      });
    }
  }
  
  // Limits at critical points
  for (const cp of criticalPoints) {
    if (cp > xMin && cp < xMax) {
      const fValue = evaluateAt(expr, cp);
      const leftLim = calculateLimit(expr, cp, 'left');
      const rightLim = calculateLimit(expr, cp, 'right');
      
      // Only add if not already covered by vertical asymptote
      if (!verticalAsymptotes.some(a => a.value !== undefined && Math.abs(a.value - cp) < 0.1)) {
        limits.push({
          point: cp.toFixed(2),
          pointValue: cp,
          leftLimit: leftLim,
          rightLimit: rightLim,
          limit: isFinite(fValue) ? fValue.toFixed(4) : 'غير معرفة',
          type: 'critical-point',
          description: `f(${cp.toFixed(2)}) = ${isFinite(fValue) ? fValue.toFixed(4) : 'غير معرفة'}`
        });
      }
    }
  }
  
  return limits;
}

export function analyzeFunction(expr: string, xMin = -10, xMax = 10): FunctionAnalysis {
  try {
    // Calculate derivatives
    const derivativeNode = math.derivative(math.parse(expr), 'x');
    const derivative = math.simplify(derivativeNode).toString();
    
    let secondDerivative = '';
    try {
      const secondDerivNode = math.derivative(derivativeNode, 'x');
      secondDerivative = math.simplify(secondDerivNode).toString();
    } catch {
      secondDerivative = 'غير متاح';
    }
    
    // Find roots of the original function
    const rootValues = findRoots(expr, xMin, xMax);
    const roots: SpecialPoint[] = rootValues.map(x => ({
      x,
      y: 0,
      type: 'root' as const,
      label: `صفر: (${x}, 0)`
    }));
    
    // Find critical points (where derivative = 0)
    const criticalPoints = findRoots(derivative, xMin, xMax);
    
    // Classify extrema
    const extrema: SpecialPoint[] = [];
    for (const x of criticalPoints) {
      const y = evaluateAt(expr, x);
      if (!isFinite(y)) continue;
      
      const leftY = evaluateAt(derivative, x - 0.01);
      const rightY = evaluateAt(derivative, x + 0.01);
      
      if (leftY > 0 && rightY < 0) {
        extrema.push({
          x: Math.round(x * 100) / 100,
          y: Math.round(y * 100) / 100,
          type: 'extremum-max',
          label: `قيمة عظمى: (${Math.round(x * 100) / 100}, ${Math.round(y * 100) / 100})`
        });
      } else if (leftY < 0 && rightY > 0) {
        extrema.push({
          x: Math.round(x * 100) / 100,
          y: Math.round(y * 100) / 100,
          type: 'extremum-min',
          label: `قيمة صغرى: (${Math.round(x * 100) / 100}, ${Math.round(y * 100) / 100})`
        });
      }
    }
    
    // Find inflection points (where second derivative = 0)
    const inflectionPoints: SpecialPoint[] = [];
    if (secondDerivative !== 'غير متاح') {
      const inflectionXValues = findRoots(secondDerivative, xMin, xMax);
      for (const x of inflectionXValues) {
        const y = evaluateAt(expr, x);
        if (isFinite(y)) {
          inflectionPoints.push({
            x: Math.round(x * 100) / 100,
            y: Math.round(y * 100) / 100,
            type: 'inflection',
            label: `نقطة انعطاف: (${Math.round(x * 100) / 100}, ${Math.round(y * 100) / 100})`
          });
        }
      }
    }
    
    // Find asymptotes
    const verticalAsymptotes = findVerticalAsymptotes(expr, xMin, xMax);
    const horizontalAsymptotes = findHorizontalAsymptotes(expr);
    const obliqueAsymptotes = horizontalAsymptotes.length === 0 ? findObliqueAsymptotes(expr) : [];
    const asymptotes = [...verticalAsymptotes, ...horizontalAsymptotes, ...obliqueAsymptotes];
    
    // Calculate limits
    const limits = findAllLimits(expr, xMin, xMax, verticalAsymptotes, criticalPoints);
    
    // Build variation table
    const allCriticalPoints = [...criticalPoints].sort((a, b) => a - b);
    const variationTable: VariationInterval[] = [];
    
    const boundaryPoints = [xMin, ...allCriticalPoints.filter(p => p > xMin && p < xMax), xMax];
    
    for (let i = 0; i < boundaryPoints.length - 1; i++) {
      const from = boundaryPoints[i];
      const to = boundaryPoints[i + 1];
      const midpoint = (from + to) / 2;
      const derivValue = evaluateAt(derivative, midpoint);
      
      let derivativeSign: '+' | '-' | '0' = '0';
      let variation: 'increasing' | 'decreasing' | 'constant' = 'constant';
      
      if (derivValue > 0.001) {
        derivativeSign = '+';
        variation = 'increasing';
      } else if (derivValue < -0.001) {
        derivativeSign = '-';
        variation = 'decreasing';
      }
      
      const fromValue = evaluateAt(expr, from);
      const toValue = evaluateAt(expr, to);
      
      variationTable.push({
        from: from === xMin ? '-∞' : from.toString(),
        to: to === xMax ? '+∞' : to.toString(),
        derivativeSign,
        variation,
        fromValue: isFinite(fromValue) ? fromValue.toFixed(2) : (fromValue > 0 ? '+∞' : '-∞'),
        toValue: isFinite(toValue) ? toValue.toFixed(2) : (toValue > 0 ? '+∞' : '-∞')
      });
    }
    
    return {
      derivative,
      secondDerivative,
      roots,
      extrema,
      inflectionPoints,
      asymptotes,
      variationTable,
      criticalPoints,
      limits
    };
  } catch (error) {
    return {
      derivative: 'خطأ',
      secondDerivative: 'خطأ',
      roots: [],
      extrema: [],
      inflectionPoints: [],
      asymptotes: [],
      variationTable: [],
      criticalPoints: [],
      limits: []
    };
  }
}
