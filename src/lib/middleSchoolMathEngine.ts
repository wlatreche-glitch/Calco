// Middle School Math Engine - 4AM Algeria Curriculum
// Handles: Number operations, Radicals, Linear equations, Inequalities

export type PedagogyMode = 'learning' | 'practice' | 'exam';

export interface SolutionStep {
  stepNumber: number;
  titleAr: string;
  explanation?: string;
  formula?: string;
  result?: string;
  warning?: string;
}

// ==================== RADICAL OPERATIONS ====================

interface RadicalResult {
  originalExpression: string;
  simplifiedForm: string;
  decimalValue: number;
  steps: SolutionStep[];
  errors: string[];
  tips: string[];
}

// Simplify a single radical √n
export function simplifyRadical(n: number): { coefficient: number; radicand: number; steps: SolutionStep[] } {
  const steps: SolutionStep[] = [];
  
  if (n < 0) {
    return { coefficient: 0, radicand: n, steps: [{ stepNumber: 1, titleAr: 'خطأ', result: 'لا يمكن حساب الجذر التربيعي لعدد سالب في ℝ', warning: '❌ الجذر التربيعي غير معرف للأعداد السالبة' }] };
  }
  
  if (n === 0) {
    return { coefficient: 0, radicand: 0, steps: [{ stepNumber: 1, titleAr: 'تبسيط', result: '√0 = 0' }] };
  }

  // Find the largest perfect square factor
  let coefficient = 1;
  let radicand = n;
  
  const perfectSquares = [144, 121, 100, 81, 64, 49, 36, 25, 16, 9, 4];
  
  steps.push({
    stepNumber: 1,
    titleAr: 'البحث عن مربع كامل',
    explanation: `نبحث عن أكبر مربع كامل يقسم ${n}`
  });

  for (const sq of perfectSquares) {
    if (radicand % sq === 0) {
      coefficient = Math.sqrt(sq);
      radicand = n / sq;
      steps.push({
        stepNumber: 2,
        titleAr: 'التحليل',
        formula: `√${n} = √(${sq} × ${radicand})`,
        explanation: `${sq} = ${coefficient}² هو مربع كامل`
      });
      steps.push({
        stepNumber: 3,
        titleAr: 'استخراج الجذر',
        formula: `√${n} = √${sq} × √${radicand} = ${coefficient}√${radicand}`,
        result: radicand === 1 ? `${coefficient}` : `${coefficient}√${radicand}`
      });
      break;
    }
  }

  if (coefficient === 1 && radicand === n) {
    // Check if it's a perfect square
    const sqrt = Math.sqrt(n);
    if (Number.isInteger(sqrt)) {
      return { 
        coefficient: sqrt, 
        radicand: 1, 
        steps: [{ stepNumber: 1, titleAr: 'مربع كامل', result: `√${n} = ${sqrt}`, explanation: `${n} = ${sqrt}²` }] 
      };
    }
    steps.push({
      stepNumber: 2,
      titleAr: 'النتيجة',
      result: `√${n} مبسط بالفعل`,
      explanation: `${n} لا يحتوي على عوامل مربعة كاملة`
    });
  }

  return { coefficient, radicand, steps };
}

// Parse radical expression like \"√50 + √18\" or \"3√2 + 5√2\"
export function parseRadicalExpression(expr: string): { terms: Array<{ coefficient: number; radicand: number; sign: number }>; operations: string[] } {
  const terms: Array<{ coefficient: number; radicand: number; sign: number }> = [];
  const operations: string[] = [];
  
  // Normalize the expression
  let normalized = expr.replace(/\s+/g, '').replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/');
  
  // Split by + and - while keeping the operators
  const parts = normalized.split(/(?=[+\-])/);
  
  for (const part of parts) {
    if (!part) continue;
    
    let sign = 1;
    let cleanPart = part;
    
    if (part.startsWith('+')) {
      cleanPart = part.substring(1);
      operations.push('+');
    } else if (part.startsWith('-')) {
      sign = -1;
      cleanPart = part.substring(1);
      operations.push('-');
    }
    
    // Match patterns like: √50, 3√2, 5
    const radicalMatch = cleanPart.match(/^(\d*)?√(\d+)$/);
    const numberMatch = cleanPart.match(/^(\d+\.?\d*)$/);
    
    if (radicalMatch) {
      const coef = radicalMatch[1] ? parseInt(radicalMatch[1]) : 1;
      const rad = parseInt(radicalMatch[2]);
      terms.push({ coefficient: coef, radicand: rad, sign });
    } else if (numberMatch) {
      terms.push({ coefficient: parseFloat(numberMatch[1]), radicand: 1, sign });
    }
  }
  
  return { terms, operations };
}

export function solveRadicalExpression(expression: string, mode: PedagogyMode): RadicalResult {
  const steps: SolutionStep[] = [];
  const errors: string[] = [];
  const tips: string[] = [];
  
  steps.push({
    stepNumber: 1,
    titleAr: 'المعطيات',
    formula: expression
  });

  const { terms } = parseRadicalExpression(expression);
  
  if (terms.length === 0) {
    return {
      originalExpression: expression,
      simplifiedForm: 'خطأ في التعبير',
      decimalValue: 0,
      steps,
      errors: ['لم يتم التعرف على التعبير'],
      tips: []
    };
  }

  // Simplify each term
  const simplifiedTerms: Array<{ coefficient: number; radicand: number; sign: number; originalSteps: SolutionStep[] }> = [];
  
  steps.push({
    stepNumber: 2,
    titleAr: 'تبسيط كل جذر',
    explanation: 'نبسط كل جذر على حدة باستخراج المربعات الكاملة'
  });

  for (const term of terms) {
    const simplified = simplifyRadical(term.radicand);
    simplifiedTerms.push({
      coefficient: term.coefficient * simplified.coefficient * term.sign,
      radicand: simplified.radicand,
      sign: 1,
      originalSteps: simplified.steps
    });
    
    if (mode === 'learning' && simplified.steps.length > 1) {
      const signStr = term.sign === -1 ? '-' : '';
      const coefStr = term.coefficient === 1 ? '' : term.coefficient.toString();
      steps.push({
        stepNumber: steps.length + 1,
        titleAr: `تبسيط ${signStr}${coefStr}√${term.radicand}`,
        formula: simplified.steps.map(s => s.formula || s.result).filter(Boolean).join(' → '),
        result: simplified.radicand === 1 
          ? `${term.sign * term.coefficient * simplified.coefficient}`
          : `${term.sign * term.coefficient * simplified.coefficient}√${simplified.radicand}`
      });
    }
  }

  // Group by radicand
  const grouped: Record<number, number> = {};
  for (const term of simplifiedTerms) {
    const key = term.radicand;
    grouped[key] = (grouped[key] || 0) + term.coefficient;
  }

  // Check for like radicals
  const radicands = Object.keys(grouped).map(Number).filter(r => r !== 1 && grouped[r] !== 0);
  if (radicands.length > 1) {
    tips.push('⚠️ توجد جذور غير متشابهة لا يمكن جمعها');
  }

  steps.push({
    stepNumber: steps.length + 1,
    titleAr: 'تجميع الجذور المتشابهة',
    explanation: 'نجمع الحدود التي لها نفس الجذر'
  });

  // Build final result
  const resultParts: string[] = [];
  let decimalValue = 0;

  // Handle constant term first
  if (grouped[1] && grouped[1] !== 0) {
    resultParts.push(grouped[1].toString());
    decimalValue += grouped[1];
  }

  // Handle radical terms
  for (const rad of radicands) {
    const coef = grouped[rad];
    if (coef === 0) continue;
    
    decimalValue += coef * Math.sqrt(rad);
    
    const prefix = resultParts.length > 0 ? (coef > 0 ? ' + ' : ' - ') : (coef < 0 ? '-' : '');
    const absCoef = Math.abs(coef);
    
    if (absCoef === 1) {
      resultParts.push(`${prefix}√${rad}`);
    } else {
      resultParts.push(`${prefix}${absCoef}√${rad}`);
    }
  }

  const simplifiedForm = resultParts.join('').trim() || '0';

  steps.push({
    stepNumber: steps.length + 1,
    titleAr: 'النتيجة النهائية',
    result: simplifiedForm,
    formula: `≈ ${decimalValue.toFixed(4)}`
  });

  if (mode === 'learning') {
    tips.push('💡 تذكر: لا يمكن جمع جذور غير متشابهة مثل √2 + √3');
    tips.push('💡 ابحث دائماً عن المربعات الكاملة: 4, 9, 16, 25, 36...');
  }

  return {
    originalExpression: expression,
    simplifiedForm,
    decimalValue,
    steps: mode === 'exam' ? [steps[0], steps[steps.length - 1]] : steps,
    errors,
    tips: mode === 'learning' ? tips : []
  };
}

// ==================== FRACTION OPERATIONS ====================

interface FractionResult {
  originalExpression: string;
  result: { numerator: number; denominator: number };
  decimalValue: number;
  steps: SolutionStep[];
  errors: string[];
  tips: string[];
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

function simplifyFraction(num: number, den: number): { numerator: number; denominator: number } {
  if (den === 0) return { numerator: num, denominator: 0 };
  const g = gcd(num, den);
  let n = num / g;
  let d = den / g;
  if (d < 0) { n = -n; d = -d; }
  return { numerator: n, denominator: d };
}

export function solveFractionExpression(expression: string, mode: PedagogyMode): FractionResult {
  const steps: SolutionStep[] = [];
  const errors: string[] = [];
  const tips: string[] = [];

  steps.push({
    stepNumber: 1,
    titleAr: 'المعطيات',
    formula: expression
  });

  // Parse fractions like \"5/6 + 3/4\" or \"2/3 - 1/4\"
  const fractionRegex = /(-?\d+)\/(\d+)/g;
  const operatorRegex = /[+\-×÷*/]/g;
  
  const fractions: Array<{ num: number; den: number }> = [];
  let match;
  
  while ((match = fractionRegex.exec(expression)) !== null) {
    fractions.push({ num: parseInt(match[1]), den: parseInt(match[2]) });
  }

  const operators = expression.match(/(?<=\d\/\d)\s*([+\-×÷*])\s*(?=\d)/g)?.map(op => op.trim()) || ['+'];

  if (fractions.length < 2) {
    // Single fraction - just simplify
    if (fractions.length === 1) {
      const simplified = simplifyFraction(fractions[0].num, fractions[0].den);
      steps.push({
        stepNumber: 2,
        titleAr: 'التبسيط',
        formula: `${fractions[0].num}/${fractions[0].den} = ${simplified.numerator}/${simplified.denominator}`,
        result: simplified.denominator === 1 ? `${simplified.numerator}` : `${simplified.numerator}/${simplified.denominator}`
      });
      return {
        originalExpression: expression,
        result: simplified,
        decimalValue: simplified.numerator / simplified.denominator,
        steps,
        errors: [],
        tips: []
      };
    }
    return {
      originalExpression: expression,
      result: { numerator: 0, denominator: 1 },
      decimalValue: 0,
      steps,
      errors: ['لم يتم التعرف على الكسور في التعبير'],
      tips: []
    };
  }

  let result = { num: fractions[0].num, den: fractions[0].den };

  for (let i = 1; i < fractions.length; i++) {
    const op = operators[i - 1] || '+';
    const f2 = fractions[i];

    if (op === '+' || op === '-') {
      // Find LCD
      const lcd = lcm(result.den, f2.den);
      
      steps.push({
        stepNumber: steps.length + 1,
        titleAr: 'توحيد المقامات',
        formula: `المقام المشترك الأصغر: ${lcd}`,
        explanation: `${result.den} و ${f2.den} → ${lcd}`
      });

      const mult1 = lcd / result.den;
      const mult2 = lcd / f2.den;

      steps.push({
        stepNumber: steps.length + 1,
        titleAr: 'تحويل الكسور',
        formula: `${result.num}/${result.den} = ${result.num * mult1}/${lcd}`,
      });
      steps.push({
        stepNumber: steps.length + 1,
        titleAr: 'تحويل الكسور',
        formula: `${f2.num}/${f2.den} = ${f2.num * mult2}/${lcd}`,
      });

      const newNum = op === '+' 
        ? result.num * mult1 + f2.num * mult2
        : result.num * mult1 - f2.num * mult2;

      steps.push({
        stepNumber: steps.length + 1,
        titleAr: op === '+' ? 'الجمع' : 'الطرح',
        formula: `(${result.num * mult1} ${op} ${f2.num * mult2})/${lcd} = ${newNum}/${lcd}`
      });

      result = { num: newNum, den: lcd };

    } else if (op === '×' || op === '*') {
      steps.push({
        stepNumber: steps.length + 1,
        titleAr: 'الضرب',
        formula: `(${result.num} × ${f2.num})/(${result.den} × ${f2.den})`,
        result: `${result.num * f2.num}/${result.den * f2.den}`
      });
      result = { num: result.num * f2.num, den: result.den * f2.den };

    } else if (op === '÷' || op === '/') {
      steps.push({
        stepNumber: steps.length + 1,
        titleAr: 'القسمة (ضرب بالمقلوب)',
        formula: `${result.num}/${result.den} × ${f2.den}/${f2.num}`,
        result: `${result.num * f2.den}/${result.den * f2.num}`
      });
      result = { num: result.num * f2.den, den: result.den * f2.num };
    }
  }

  // Simplify final result
  const simplified = simplifyFraction(result.num, result.den);
  
  if (result.num !== simplified.numerator || result.den !== simplified.denominator) {
    steps.push({
      stepNumber: steps.length + 1,
      titleAr: 'التبسيط',
      formula: `${result.num}/${result.den} = ${simplified.numerator}/${simplified.denominator}`,
      explanation: `PGCD = ${gcd(result.num, result.den)}`
    });
  }

  steps.push({
    stepNumber: steps.length + 1,
    titleAr: 'النتيجة النهائية',
    result: simplified.denominator === 1 ? `${simplified.numerator}` : `${simplified.numerator}/${simplified.denominator}`,
    formula: `≈ ${(simplified.numerator / simplified.denominator).toFixed(4)}`
  });

  if (mode === 'learning') {
    tips.push('💡 لجمع أو طرح الكسور، يجب توحيد المقامات أولاً');
    tips.push('💡 لضرب كسرين: بسط × بسط / مقام × مقام');
    tips.push('💡 للقسمة: نضرب بمقلوب الكسر الثاني');
  }

  return {
    originalExpression: expression,
    result: simplified,
    decimalValue: simplified.numerator / simplified.denominator,
    steps: mode === 'exam' ? [steps[0], steps[steps.length - 1]] : steps,
    errors,
    tips: mode === 'learning' ? tips : []
  };
}

// ==================== LINEAR EQUATIONS ====================

interface EquationResult {
  originalEquation: string;
  solution: number | null;
  solutionSet: string;
  steps: SolutionStep[];
  errors: string[];
  tips: string[];
  verification?: string;
}

export function solveLinearEquation(equation: string, mode: PedagogyMode): EquationResult {
  const steps: SolutionStep[] = [];
  const errors: string[] = [];
  const tips: string[] = [];

  steps.push({
    stepNumber: 1,
    titleAr: 'المعادلة المعطاة',
    formula: equation
  });

  // Parse equation: ax + b = cx + d
  const sides = equation.split('=');
  if (sides.length !== 2) {
    return {
      originalEquation: equation,
      solution: null,
      solutionSet: 'خطأ في صيغة المعادلة',
      steps,
      errors: ['المعادلة يجب أن تحتوي على علامة = واحدة'],
      tips: []
    };
  }

  const parseLinear = (expr: string): { coefficient: number; constant: number } => {
    let coefficient = 0;
    let constant = 0;
    
    // Normalize
    expr = expr.replace(/\s+/g, '').replace(/−/g, '-');
    
    // Add + at beginning if starts with number or x
    if (!expr.startsWith('+') && !expr.startsWith('-')) {
      expr = '+' + expr;
    }
    
    // Match terms
    const termRegex = /([+-]?\d*\.?\d*)x|([+-]?\d+\.?\d*)/g;
    let match;
    
    while ((match = termRegex.exec(expr)) !== null) {
      if (match[1] !== undefined) {
        // x term
        const coef = match[1];
        if (coef === '' || coef === '+') coefficient += 1;
        else if (coef === '-') coefficient -= 1;
        else coefficient += parseFloat(coef);
      } else if (match[2] !== undefined) {
        // constant term
        constant += parseFloat(match[2]);
      }
    }
    
    return { coefficient, constant };
  };

  const left = parseLinear(sides[0]);
  const right = parseLinear(sides[1]);

  steps.push({
    stepNumber: 2,
    titleAr: 'تحديد المعاملات',
    formula: `الطرف الأيسر: ${left.coefficient}x + ${left.constant}`,
    explanation: `الطرف الأيمن: ${right.coefficient}x + ${right.constant}`
  });

  // Move x terms to left, constants to right
  const a = left.coefficient - right.coefficient;
  const b = right.constant - left.constant;

  steps.push({
    stepNumber: 3,
    titleAr: 'نقل الحدود',
    explanation: 'ننقل حدود x إلى اليسار والأعداد إلى اليمين',
    formula: `${a}x = ${b}`
  });

  if (a === 0) {
    if (b === 0) {
      steps.push({
        stepNumber: 4,
        titleAr: 'النتيجة',
        result: 'المعادلة محققة لكل x ∈ ℝ',
        explanation: '0 = 0 صحيحة دائماً'
      });
      return {
        originalEquation: equation,
        solution: null,
        solutionSet: 'S = ℝ',
        steps,
        errors: [],
        tips: mode === 'learning' ? ['💡 هذه معادلة لها حلول لا نهائية'] : []
      };
    } else {
      steps.push({
        stepNumber: 4,
        titleAr: 'النتيجة',
        result: 'المعادلة مستحيلة',
        explanation: `0 = ${b} تناقض!`,
        warning: '❌ لا يوجد حل'
      });
      return {
        originalEquation: equation,
        solution: null,
        solutionSet: 'S = ∅',
        steps,
        errors: ['المعادلة مستحيلة'],
        tips: mode === 'learning' ? ['💡 هذه معادلة ليس لها حل'] : []
      };
    }
  }

  const solution = b / a;

  steps.push({
    stepNumber: 4,
    titleAr: 'القسمة على معامل x',
    formula: `x = ${b} ÷ ${a}`,
    result: `x = ${Number.isInteger(solution) ? solution : solution.toFixed(4)}`
  });

  // Verification
  let verification = '';
  if (mode === 'learning') {
    const leftVal = left.coefficient * solution + left.constant;
    const rightVal = right.coefficient * solution + right.constant;
    verification = `التحقق: ${leftVal.toFixed(2)} = ${rightVal.toFixed(2)} ✓`;
    
    steps.push({
      stepNumber: 5,
      titleAr: 'التحقق',
      formula: `نعوض x = ${solution.toFixed(2)} في المعادلة`,
      result: verification
    });
  }

  steps.push({
    stepNumber: steps.length + 1,
    titleAr: 'مجموعة الحل',
    result: `S = {${Number.isInteger(solution) ? solution : solution.toFixed(4)}}`
  });

  if (mode === 'learning') {
    tips.push('💡 تذكر: ما تفعله في طرف، افعله في الطرف الآخر');
    tips.push('💡 تحقق دائماً من الحل بالتعويض');
  }

  return {
    originalEquation: equation,
    solution,
    solutionSet: `S = {${Number.isInteger(solution) ? solution : solution.toFixed(4)}}`,
    steps: mode === 'exam' ? [steps[0], steps[steps.length - 1]] : steps,
    errors,
    tips: mode === 'learning' ? tips : [],
    verification
  };
}

// ==================== LINEAR INEQUALITIES ====================

interface InequalityResult {
  originalInequality: string;
  solutionSet: string;
  solutionInterval: { type: 'open' | 'closed' | 'half-open'; left: number | null; right: number | null; leftIncluded: boolean; rightIncluded: boolean };
  steps: SolutionStep[];
  errors: string[];
  tips: string[];
  signChanged: boolean;
}

export function solveLinearInequality(inequality: string, mode: PedagogyMode): InequalityResult {
  const steps: SolutionStep[] = [];
  const errors: string[] = [];
  const tips: string[] = [];
  let signChanged = false;

  steps.push({
    stepNumber: 1,
    titleAr: 'المتراجحة المعطاة',
    formula: inequality
  });

  // Detect inequality type
  let operator = '';
  let parts: string[] = [];
  
  if (inequality.includes('≤')) {
    operator = '≤';
    parts = inequality.split('≤');
  } else if (inequality.includes('≥')) {
    operator = '≥';
    parts = inequality.split('≥');
  } else if (inequality.includes('<=')) {
    operator = '≤';
    parts = inequality.split('<=');
  } else if (inequality.includes('>=')) {
    operator = '≥';
    parts = inequality.split('>=');
  } else if (inequality.includes('<')) {
    operator = '<';
    parts = inequality.split('<');
  } else if (inequality.includes('>')) {
    operator = '>';
    parts = inequality.split('>');
  }

  if (parts.length !== 2) {
    return {
      originalInequality: inequality,
      solutionSet: 'خطأ في صيغة المتراجحة',
      solutionInterval: { type: 'open', left: null, right: null, leftIncluded: false, rightIncluded: false },
      steps,
      errors: ['المتراجحة يجب أن تحتوي على علامة مقارنة واحدة'],
      tips: [],
      signChanged: false
    };
  }

  const parseLinear = (expr: string): { coefficient: number; constant: number } => {
    let coefficient = 0;
    let constant = 0;
    
    expr = expr.replace(/\s+/g, '').replace(/−/g, '-');
    if (!expr.startsWith('+') && !expr.startsWith('-')) {
      expr = '+' + expr;
    }
    
    const termRegex = /([+-]?\d*\.?\d*)x|([+-]?\d+\.?\d*)/g;
    let match;
    
    while ((match = termRegex.exec(expr)) !== null) {
      if (match[1] !== undefined) {
        const coef = match[1];
        if (coef === '' || coef === '+') coefficient += 1;
        else if (coef === '-') coefficient -= 1;
        else coefficient += parseFloat(coef);
      } else if (match[2] !== undefined) {
        constant += parseFloat(match[2]);
      }
    }
    
    return { coefficient, constant };
  };

  const left = parseLinear(parts[0]);
  const right = parseLinear(parts[1]);

  const a = left.coefficient - right.coefficient;
  const b = right.constant - left.constant;

  steps.push({
    stepNumber: 2,
    titleAr: 'نقل الحدود',
    explanation: 'ننقل حدود x إلى اليسار والأعداد إلى اليمين',
    formula: `${a}x ${operator} ${b}`
  });

  if (a === 0) {
    const isTrue = (operator === '<' && 0 < b) || 
                   (operator === '≤' && 0 <= b) ||
                   (operator === '>' && 0 > b) ||
                   (operator === '≥' && 0 >= b);
    
    steps.push({
      stepNumber: 3,
      titleAr: 'النتيجة',
      result: isTrue ? 'S = ℝ (محققة دائماً)' : 'S = ∅ (مستحيلة)'
    });

    return {
      originalInequality: inequality,
      solutionSet: isTrue ? 'S = ℝ' : 'S = ∅',
      solutionInterval: { 
        type: 'open', 
        left: isTrue ? -Infinity : null, 
        right: isTrue ? Infinity : null, 
        leftIncluded: false, 
        rightIncluded: false 
      },
      steps,
      errors: [],
      tips: [],
      signChanged: false
    };
  }

  // Divide by coefficient
  let newOperator = operator;
  if (a < 0) {
    signChanged = true;
    // Flip the inequality
    if (operator === '<') newOperator = '>';
    else if (operator === '>') newOperator = '<';
    else if (operator === '≤') newOperator = '≥';
    else if (operator === '≥') newOperator = '≤';

    steps.push({
      stepNumber: 3,
      titleAr: 'القسمة على عدد سالب',
      formula: `x ${newOperator} ${b}/${a}`,
      warning: '⚠️ عند القسمة على عدد سالب، نغير اتجاه المتراجحة!',
      explanation: `قسمنا على ${a} (سالب) → تغيرت الإشارة`
    });
  } else {
    steps.push({
      stepNumber: 3,
      titleAr: 'القسمة على معامل x',
      formula: `x ${operator} ${b}/${a}`
    });
  }

  const solution = b / a;
  const solutionStr = Number.isInteger(solution) ? solution.toString() : solution.toFixed(4);

  let solutionSet = '';
  let interval: InequalityResult['solutionInterval'];

  if (newOperator === '<') {
    solutionSet = `S = ]-∞ ; ${solutionStr}[`;
    interval = { type: 'open', left: -Infinity, right: solution, leftIncluded: false, rightIncluded: false };
  } else if (newOperator === '≤') {
    solutionSet = `S = ]-∞ ; ${solutionStr}]`;
    interval = { type: 'half-open', left: -Infinity, right: solution, leftIncluded: false, rightIncluded: true };
  } else if (newOperator === '>') {
    solutionSet = `S = ]${solutionStr} ; +∞[`;
    interval = { type: 'open', left: solution, right: Infinity, leftIncluded: false, rightIncluded: false };
  } else {
    solutionSet = `S = [${solutionStr} ; +∞[`;
    interval = { type: 'half-open', left: solution, right: Infinity, leftIncluded: true, rightIncluded: false };
  }

  steps.push({
    stepNumber: 4,
    titleAr: 'مجموعة الحل',
    result: solutionSet,
    formula: `x ${newOperator} ${solutionStr}`
  });

  if (mode === 'learning') {
    if (signChanged) {
      tips.push('⚠️ تنبيه مهم: عند القسمة أو الضرب بعدد سالب، يتغير اتجاه المتراجحة');
    }
    tips.push('💡 [ تعني أن الحد مشمول، ] تعني أنه غير مشمول');
    tips.push('💡 تذكر تمثيل الحل على مستقيم الأعداد');
  }

  return {
    originalInequality: inequality,
    solutionSet,
    solutionInterval: interval,
    steps: mode === 'exam' ? [steps[0], steps[steps.length - 1]] : steps,
    errors,
    tips: mode === 'learning' ? tips : [],
    signChanged
  };
}
