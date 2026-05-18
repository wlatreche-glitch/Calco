import * as math from 'mathjs';

export interface SolutionStep {
  step: number;
  operation: string;
  expression: string;
  rule: string;
  explanation: string;
}

export interface SolverResult {
  success: boolean;
  input: string;
  result: string;
  steps: SolutionStep[];
  error?: string;
}

// Solve linear equations: ax + b = c
function solveLinear(equation: string): SolverResult {
  const steps: SolutionStep[] = [];
  
  try {
    const parts = equation.split('=');
    if (parts.length !== 2) {
      throw new Error('المعادلة يجب أن تحتوي على علامة يساوي واحدة');
    }

    const left = parts[0].trim();
    const right = parts[1].trim();

    steps.push({
      step: 1,
      operation: 'تحديد المعادلة',
      expression: equation,
      rule: 'قراءة المعادلة الأصلية',
      explanation: `نبدأ بالمعادلة: ${left} = ${right}`
    });

    // Parse and simplify: left - right = 0
    const expr = math.parse(`(${left}) - (${right})`);
    const simplified = math.simplify(expr);
    
    steps.push({
      step: 2,
      operation: 'نقل الحدود',
      expression: `${simplified.toString()} = 0`,
      rule: 'نقل جميع الحدود إلى طرف واحد',
      explanation: 'ننقل جميع الحدود إلى الطرف الأيسر'
    });

    // Extract coefficient and constant for ax + b = 0
    const exprStr = simplified.toString().replace(/\s/g, '');
    let a = 0, b = 0;
    
    // Simple parsing for linear equations
    const terms = exprStr.replace(/-/g, '+-').split('+').filter(t => t);
    terms.forEach(term => {
      if (term.includes('x')) {
        const coef = term.replace('x', '').replace('*', '') || '1';
        a += coef === '-' ? -1 : parseFloat(coef);
      } else {
        b += parseFloat(term) || 0;
      }
    });

    if (a === 0) throw new Error('ليست معادلة خطية في x');
    
    const result = -b / a;

    steps.push({
      step: 3,
      operation: 'إيجاد قيمة x',
      expression: `x = ${result}`,
      rule: 'عزل المتغير',
      explanation: `نجد أن قيمة x تساوي ${result}`
    });

    return {
      success: true,
      input: equation,
      result: `x = ${result}`,
      steps
    };
  } catch (error) {
    return {
      success: false,
      input: equation,
      result: '',
      steps,
      error: error instanceof Error ? error.message : 'خطأ في حل المعادلة'
    };
  }
}

// Solve quadratic equations: ax² + bx + c = 0
function solveQuadratic(equation: string): SolverResult {
  const steps: SolutionStep[] = [];
  
  try {
    steps.push({
      step: 1,
      operation: 'تحديد المعادلة التربيعية',
      expression: equation,
      rule: 'الصيغة العامة: ax² + bx + c = 0',
      explanation: 'نحدد المعاملات a, b, c من المعادلة'
    });

    const parts = equation.split('=');
    const left = parts[0].trim();
    const right = parts.length > 1 ? parts[1].trim() : '0';
    
    const expr = math.parse(`(${left}) - (${right})`);
    const simplified = math.simplify(expr).toString().replace(/\s/g, '');
    
    // Parse coefficients for ax^2 + bx + c
    let a = 0, b = 0, c = 0;
    const normalized = simplified.replace(/\^2/g, '²').replace(/\*\*/g, '²');
    
    // Simple coefficient extraction
    const match2 = normalized.match(/([+-]?\d*)x²/);
    const match1 = normalized.match(/([+-]?\d*)x(?!²)/);
    const matchC = normalized.replace(/[+-]?\d*x²?/g, '');
    
    if (match2) a = match2[1] === '' || match2[1] === '+' ? 1 : match2[1] === '-' ? -1 : parseFloat(match2[1]);
    if (match1) b = match1[1] === '' || match1[1] === '+' ? 1 : match1[1] === '-' ? -1 : parseFloat(match1[1]);
    c = parseFloat(matchC) || 0;

    const discriminant = b * b - 4 * a * c;

    steps.push({
      step: 2,
      operation: 'حساب المميز (Δ)',
      expression: `Δ = b² - 4ac = ${b}² - 4×${a}×${c} = ${discriminant}`,
      rule: 'صيغة المميز',
      explanation: discriminant > 0 ? 'Δ > 0: حلان حقيقيان مختلفان' : discriminant === 0 ? 'Δ = 0: حل وحيد مضاعف' : 'Δ < 0: لا يوجد حل حقيقي'
    });

    if (discriminant < 0) {
      return {
        success: true,
        input: equation,
        result: 'لا يوجد حل حقيقي (Δ < 0)',
        steps
      };
    }

    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);

    steps.push({
      step: 3,
      operation: 'تطبيق صيغة الحل',
      expression: 'x = (-b ± √Δ) / 2a',
      rule: 'الصيغة التربيعية',
      explanation: 'نطبق صيغة الحل للمعادلة التربيعية'
    });

    const resultStr = discriminant === 0 ? `x = ${x1}` : `x₁ = ${x1.toFixed(4)} أو x₂ = ${x2.toFixed(4)}`;
    
    steps.push({
      step: 4,
      operation: 'الحلول',
      expression: resultStr,
      rule: 'النتيجة النهائية',
      explanation: discriminant === 0 ? 'المعادلة لها حل وحيد مضاعف' : 'المعادلة لها حلان مختلفان'
    });

    return { success: true, input: equation, result: resultStr, steps };
  } catch (error) {
    return { success: false, input: equation, result: '', steps, error: error instanceof Error ? error.message : 'خطأ في حل المعادلة' };
  }
}

export function solveEquation(equation: string): SolverResult {
  const normalized = equation.replace(/\s/g, '').toLowerCase();
  if (normalized.includes('x^2') || normalized.includes('x²') || normalized.includes('x**2')) {
    return solveQuadratic(equation);
  }
  return solveLinear(equation);
}

export function simplifyExpression(expr: string): SolverResult {
  const steps: SolutionStep[] = [];
  try {
    steps.push({ step: 1, operation: 'قراءة التعبير', expression: expr, rule: 'التعبير الأصلي', explanation: 'نبدأ بالتعبير المعطى' });
    const result = math.simplify(math.parse(expr)).toString();
    steps.push({ step: 2, operation: 'تبسيط', expression: result, rule: 'قواعد التبسيط الجبري', explanation: 'نطبق قواعد التبسيط والتجميع' });
    return { success: true, input: expr, result, steps };
  } catch (error) {
    return { success: false, input: expr, result: '', steps, error: error instanceof Error ? error.message : 'خطأ في التبسيط' };
  }
}

export function calculateDerivative(expr: string, variable = 'x'): SolverResult {
  const steps: SolutionStep[] = [];
  try {
    steps.push({ step: 1, operation: 'الدالة الأصلية', expression: `f(x) = ${expr}`, rule: 'تحديد الدالة', explanation: 'نحدد الدالة المراد اشتقاقها' });
    const derivative = math.derivative(math.parse(expr), variable);
    const result = derivative.toString();
    steps.push({ step: 2, operation: 'تطبيق قواعد الاشتقاق', expression: `f'(x) = ${result}`, rule: 'قواعد الاشتقاق', explanation: 'نطبق قواعد الاشتقاق على كل حد' });
    const simplified = math.simplify(derivative).toString();
    if (simplified !== result) {
      steps.push({ step: 3, operation: 'تبسيط النتيجة', expression: `f'(x) = ${simplified}`, rule: 'التبسيط', explanation: 'نبسط المشتقة الناتجة' });
    }
    return { success: true, input: expr, result: `f'(x) = ${simplified}`, steps };
  } catch (error) {
    return { success: false, input: expr, result: '', steps, error: error instanceof Error ? error.message : 'خطأ في الاشتقاق' };
  }
}

export function evaluateAt(expr: string, x: number): number {
  try {
    return math.evaluate(expr, { x });
  } catch {
    return NaN;
  }
}

export function generateGraphPoints(expr: string, xMin = -10, xMax = 10, points = 200): { x: number; y: number }[] {
  const result: { x: number; y: number }[] = [];
  const step = (xMax - xMin) / points;
  for (let x = xMin; x <= xMax; x += step) {
    const y = evaluateAt(expr, x);
    if (isFinite(y) && Math.abs(y) < 1000) result.push({ x, y });
  }
  return result;
}

export function calculateIntegral(expr: string): SolverResult {
  const steps: SolutionStep[] = [];
  steps.push({ step: 1, operation: 'الدالة المراد تكاملها', expression: `∫ ${expr} dx`, rule: 'تحديد التكامل', explanation: 'نحدد الدالة المراد إيجاد تكاملها' });
  
  // Basic power rule integration
  let integrated = expr;
  try {
    if (/^x\^(\d+)$/.test(expr)) {
      const n = parseInt(expr.match(/\d+/)![0]);
      integrated = `x^${n + 1}/${n + 1}`;
    } else if (expr === 'x') {
      integrated = 'x^2/2';
    } else if (!/x/.test(expr)) {
      integrated = `${expr}x`;
    }
    steps.push({ step: 2, operation: 'تطبيق قواعد التكامل', expression: integrated + ' + C', rule: 'قواعد التكامل الأساسية', explanation: 'نطبق قواعد التكامل ونضيف ثابت التكامل C' });
    return { success: true, input: expr, result: integrated + ' + C', steps };
  } catch {
    return { success: false, input: expr, result: '', steps, error: 'التكامل الرمزي غير متاح لهذه الدالة' };
  }
}
