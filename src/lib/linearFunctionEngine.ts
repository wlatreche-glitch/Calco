// Linear Function Engine - 4AM Algeria Curriculum
// Covers: f(x) = ax (linear) and f(x) = ax + b (affine)

export type PedagogyMode = 'learning' | 'practice' | 'exam';

export interface SolutionStep {
  stepNumber: number;
  titleAr: string;
  explanation?: string;
  formula?: string;
  result?: string;
  warning?: string;
}

// ==================== FUNCTION ANALYZER ====================

export interface FunctionAnalysisResult {
  input: string;
  type: 'linear' | 'affine' | 'constant' | 'unknown';
  typeAr: string;
  typeFr: string;
  a: number;
  b: number;
  variation: 'increasing' | 'decreasing' | 'constant';
  variationAr: string;
  yIntercept: number;
  xIntercept: number | null;
  steps: SolutionStep[];
  errors: string[];
  tips: string[];
}

export function analyzeFunction(input: string, mode: PedagogyMode): FunctionAnalysisResult {
  const steps: SolutionStep[] = [];
  const errors: string[] = [];
  const tips: string[] = [];

  // Normalize input: remove spaces, handle f(x)= prefix
  let expr = input.trim()
    .replace(/f\(x\)\s*=/i, '')
    .replace(/y\s*=/i, '')
    .replace(/\s+/g, '')
    .replace(/−/g, '-')
    .trim();

  steps.push({
    stepNumber: 1,
    titleAr: 'قراءة الدالة',
    formula: `f(x) = ${expr}`,
    explanation: 'نقرأ التعبير الرياضي للدالة'
  });

  // Parse: match ax+b, ax-b, ax, b forms
  // Patterns: 3x+2, -2x+5, 3x, -x, 5, x+3, -x-4, 0.5x+1
  let a = 0;
  let b = 0;

  // Try to parse ax + b
  const fullMatch = expr.match(/^([+-]?\d*\.?\d*)[xX]([+-]\d+\.?\d*)$/);
  const linearOnlyMatch = expr.match(/^([+-]?\d*\.?\d*)[xX]$/);
  const constantOnlyMatch = expr.match(/^([+-]?\d+\.?\d*)$/);

  if (fullMatch) {
    const aStr = fullMatch[1];
    const bStr = fullMatch[2];
    a = aStr === '' || aStr === '+' ? 1 : aStr === '-' ? -1 : parseFloat(aStr);
    b = parseFloat(bStr);
  } else if (linearOnlyMatch) {
    const aStr = linearOnlyMatch[1];
    a = aStr === '' || aStr === '+' ? 1 : aStr === '-' ? -1 : parseFloat(aStr);
    b = 0;
  } else if (constantOnlyMatch) {
    a = 0;
    b = parseFloat(constantOnlyMatch[1]);
  } else {
    // Try more complex parsing
    // Handle cases like: x+3, -x+5, x-3
    const xPlusBMatch = expr.match(/^([+-]?)[xX]([+-]\d+\.?\d*)$/);
    if (xPlusBMatch) {
      a = xPlusBMatch[1] === '-' ? -1 : 1;
      b = parseFloat(xPlusBMatch[2]);
    } else {
      errors.push('لم يتم التعرف على الدالة. يرجى كتابتها بالشكل: ax+b أو ax');
      return {
        input,
        type: 'unknown',
        typeAr: 'غير معروف',
        typeFr: 'Inconnu',
        a: 0,
        b: 0,
        variation: 'constant',
        variationAr: 'غير محدد',
        yIntercept: 0,
        xIntercept: null,
        steps,
        errors,
        tips: []
      };
    }
  }

  if (isNaN(a) || isNaN(b)) {
    errors.push('خطأ في قراءة معاملات الدالة');
    return {
      input, type: 'unknown', typeAr: 'غير معروف', typeFr: 'Inconnu',
      a: 0, b: 0, variation: 'constant', variationAr: 'غير محدد',
      yIntercept: 0, xIntercept: null, steps, errors, tips: []
    };
  }

  // Determine type
  let type: FunctionAnalysisResult['type'];
  let typeAr: string;
  let typeFr: string;

  if (a === 0) {
    type = 'constant';
    typeAr = 'دالة ثابتة';
    typeFr = 'Fonction constante';
  } else if (b === 0) {
    type = 'linear';
    typeAr = 'دالة خطية';
    typeFr = 'Fonction linéaire';
  } else {
    type = 'affine';
    typeAr = 'دالة تآلفية (عامة)';
    typeFr = 'Fonction affine';
  }

  steps.push({
    stepNumber: 2,
    titleAr: 'تحديد نوع الدالة',
    formula: `f(x) = ${a}x + ${b}`,
    explanation: `المعامل a = ${a} ، الثابت b = ${b}`,
    result: typeAr
  });

  if (mode === 'learning') {
    if (type === 'linear') {
      steps.push({
        stepNumber: 3,
        titleAr: 'تعريف الدالة الخطية',
        explanation: 'الدالة الخطية هي f(x) = ax حيث a ≠ 0',
        formula: 'تمثيلها البياني يمر دائماً بالأصل O(0,0)'
      });
    } else if (type === 'affine') {
      steps.push({
        stepNumber: 3,
        titleAr: 'تعريف الدالة التآلفية',
        explanation: 'الدالة التآلفية هي f(x) = ax + b حيث a ≠ 0',
        formula: `b = ${b} هو الترتيب عند المحور (ordonnée à l'origine)`
      });
    }
  }

  // Variation
  let variation: FunctionAnalysisResult['variation'];
  let variationAr: string;

  if (a > 0) {
    variation = 'increasing';
    variationAr = '↗ متزايدة على ℝ';
  } else if (a < 0) {
    variation = 'decreasing';
    variationAr = '↘ متناقصة على ℝ';
  } else {
    variation = 'constant';
    variationAr = '→ ثابتة على ℝ';
  }

  steps.push({
    stepNumber: steps.length + 1,
    titleAr: 'اتجاه التغيرات',
    explanation: a !== 0 ? `بما أن a = ${a} ${a > 0 ? '> 0' : '< 0'}` : 'بما أن a = 0',
    result: variationAr
  });

  // Y-intercept (x=0)
  const yIntercept = b;
  steps.push({
    stepNumber: steps.length + 1,
    titleAr: 'نقطة التقاطع مع محور التراتيب (y)',
    formula: `f(0) = ${a}×0 + ${b} = ${b}`,
    result: `النقطة B(0, ${b})`
  });

  // X-intercept (f(x)=0)
  let xIntercept: number | null = null;
  if (a !== 0) {
    xIntercept = -b / a;
    steps.push({
      stepNumber: steps.length + 1,
      titleAr: 'نقطة التقاطع مع محور الفواصل (x)',
      formula: `f(x) = 0 → ${a}x + ${b} = 0 → x = ${-b}/${a} = ${xIntercept}`,
      result: `النقطة A(${xIntercept}, 0)`
    });
  }

  if (mode === 'learning') {
    tips.push(`💡 الدالة الخطية f(x) = ax تمر دائماً بالنقطة O(0, 0)`);
    tips.push(`💡 إذا كان a > 0 فالتمثيل البياني يتجه نحو الأعلى، وإذا كان a < 0 فنحو الأسفل`);
    if (type === 'affine') {
      tips.push(`💡 الثابت b = ${b} هو قيمة الدالة عند x = 0`);
    }
  }

  return {
    input,
    type,
    typeAr,
    typeFr,
    a,
    b,
    variation,
    variationAr,
    yIntercept,
    xIntercept,
    steps: mode === 'exam' ? [steps[0], steps[steps.length - 1]] : steps,
    errors,
    tips: mode === 'learning' ? tips : []
  };
}

// ==================== TABLE OF VALUES ====================

export interface TableRow {
  x: number;
  fx: number;
  calculationSteps?: string;
}

export interface TableOfValuesResult {
  a: number;
  b: number;
  rows: TableRow[];
  steps: SolutionStep[];
  errors: string[];
}

export function generateTableOfValues(
  funcExpr: string,
  xMin: number,
  xMax: number,
  mode: PedagogyMode
): TableOfValuesResult {
  const steps: SolutionStep[] = [];
  const errors: string[] = [];

  const analysis = analyzeFunction(funcExpr, 'exam');
  if (analysis.errors.length > 0) {
    return { a: 0, b: 0, rows: [], steps, errors: analysis.errors };
  }

  const { a, b } = analysis;

  steps.push({
    stepNumber: 1,
    titleAr: 'الدالة المعطاة',
    formula: `f(x) = ${a}x ${b >= 0 ? '+' : ''} ${b}`,
    explanation: `نحسب قيمة f(x) لكل قيمة x من ${xMin} إلى ${xMax}`
  });

  const rows: TableRow[] = [];
  const step = xMax - xMin <= 6 ? 1 : Math.ceil((xMax - xMin) / 7);

  for (let x = xMin; x <= xMax; x += step) {
    const fx = a * x + b;
    let calculationSteps = '';
    if (mode === 'learning') {
      calculationSteps = `f(${x}) = ${a}×(${x}) + ${b} = ${a * x} + ${b} = ${fx}`;
    } else if (mode === 'practice') {
      calculationSteps = `f(${x}) = ... = ${fx}`;
    }
    rows.push({ x: parseFloat(x.toFixed(2)), fx: parseFloat(fx.toFixed(2)), calculationSteps });
  }

  if (mode === 'learning') {
    steps.push({
      stepNumber: 2,
      titleAr: 'طريقة الحساب',
      explanation: 'نعوّض كل قيمة x في التعبير f(x) = ax + b',
      formula: `f(x) = ${a}x ${b >= 0 ? '+' : ''} ${b}`
    });
  }

  steps.push({
    stepNumber: steps.length + 1,
    titleAr: 'جدول القيم',
    result: `${rows.length} نقطة محسوبة`
  });

  return { a, b, rows, steps, errors };
}

// ==================== POINT CHECKER ====================

export interface PointCheckResult {
  pointX: number;
  pointY: number;
  fAtX: number;
  belongs: boolean;
  steps: SolutionStep[];
  conclusionAr: string;
  conclusionFr: string;
  errors: string[];
}

export function checkPointBelongs(
  funcExpr: string,
  px: number,
  py: number,
  mode: PedagogyMode
): PointCheckResult {
  const steps: SolutionStep[] = [];
  const errors: string[] = [];

  const analysis = analyzeFunction(funcExpr, 'exam');
  if (analysis.errors.length > 0) {
    return {
      pointX: px, pointY: py, fAtX: 0, belongs: false,
      steps, conclusionAr: '', conclusionFr: '', errors: analysis.errors
    };
  }

  const { a, b } = analysis;

  steps.push({
    stepNumber: 1,
    titleAr: 'المعطيات',
    formula: `f(x) = ${a}x + ${b}`,
    explanation: `نريد اختبار إذا كانت النقطة A(${px}, ${py}) تنتمي إلى التمثيل البياني`
  });

  if (mode !== 'exam') {
    steps.push({
      stepNumber: 2,
      titleAr: 'الطريقة',
      explanation: `نحسب f(${px}) ثم نقارن بـ ${py}`,
      formula: `f(${px}) = ${a} × ${px} + ${b}`
    });
  }

  const fAtX = a * px + b;

  steps.push({
    stepNumber: mode === 'exam' ? 2 : 3,
    titleAr: 'حساب قيمة الدالة',
    formula: `f(${px}) = ${a} × ${px} + ${b} = ${a * px} + ${b} = ${fAtX}`,
    result: `f(${px}) = ${fAtX}`
  });

  const belongs = Math.abs(fAtX - py) < 0.0001;

  steps.push({
    stepNumber: steps.length + 1,
    titleAr: 'المقارنة والاستنتاج',
    formula: `f(${px}) = ${fAtX} ${belongs ? '=' : '≠'} ${py}`,
    result: belongs
      ? `f(${px}) = ${py} ✓`
      : `f(${px}) = ${fAtX} ≠ ${py} ✗`
  });

  const conclusionAr = belongs
    ? `النقطة A(${px}, ${py}) تنتمي إلى التمثيل البياني للدالة f لأن f(${px}) = ${fAtX} = ${py}`
    : `النقطة A(${px}, ${py}) لا تنتمي إلى التمثيل البياني للدالة f لأن f(${px}) = ${fAtX} ≠ ${py}`;

  const conclusionFr = belongs
    ? `Le point A(${px}, ${py}) appartient à la représentation graphique car f(${px}) = ${fAtX} = ${py}`
    : `Le point A(${px}, ${py}) n'appartient pas à la représentation graphique car f(${px}) = ${fAtX} ≠ ${py}`;

  if (mode === 'learning') {
    steps.push({
      stepNumber: steps.length + 1,
      titleAr: 'القاعدة',
      explanation: 'نقطة M(x₀, y₀) تنتمي للتمثيل البياني لـ f إذا وفقط إذا كان f(x₀) = y₀',
      formula: `A ∈ (D_f) ⟺ f(${px}) = ${py}`
    });
  }

  return {
    pointX: px,
    pointY: py,
    fAtX,
    belongs,
    steps: mode === 'exam' ? [steps[0], steps[steps.length - 2]] : steps,
    conclusionAr,
    conclusionFr,
    errors
  };
}

// ==================== EQUATION FROM TWO POINTS ====================

export interface EquationFromPointsResult {
  x1: number; y1: number;
  x2: number; y2: number;
  a: number | null;
  b: number | null;
  equation: string;
  isVertical: boolean;
  steps: SolutionStep[];
  errors: string[];
  tips: string[];
}

export function findEquationFromPoints(
  x1: number, y1: number,
  x2: number, y2: number,
  mode: PedagogyMode
): EquationFromPointsResult {
  const steps: SolutionStep[] = [];
  const errors: string[] = [];
  const tips: string[] = [];

  steps.push({
    stepNumber: 1,
    titleAr: 'النقطتان المعطاتان',
    formula: `A(${x1}, ${y1}) و B(${x2}, ${y2})`,
    explanation: 'نريد إيجاد معادلة الخط المار بهاتين النقطتين'
  });

  // Check vertical line
  if (x1 === x2) {
    if (y1 === y2) {
      errors.push('النقطتان متطابقتان، لا يمكن تحديد خط وحيد');
      return { x1, y1, x2, y2, a: null, b: null, equation: 'خطأ', isVertical: false, steps, errors, tips };
    }
    steps.push({
      stepNumber: 2,
      titleAr: 'خط عمودي',
      explanation: `x₁ = x₂ = ${x1} → الخط عمودي على محور الفواصل`,
      formula: `x = ${x1}`,
      warning: '⚠️ هذا الخط ليس تمثيل دالة (لا يمكن التعبير عنه بـ f(x))'
    });
    return {
      x1, y1, x2, y2, a: null, b: null,
      equation: `x = ${x1}`,
      isVertical: true,
      steps, errors,
      tips: mode === 'learning' ? ['💡 الخط الرأسي لا يمثل دالة لأن لكل قيمة x قيمة وحيدة من f(x)'] : []
    };
  }

  // Compute slope
  const aNumerator = y2 - y1;
  const aDenominator = x2 - x1;
  const a = aNumerator / aDenominator;

  if (mode !== 'exam') {
    steps.push({
      stepNumber: 2,
      titleAr: 'حساب المعامل a (الميل)',
      formula: `a = (y₂ - y₁) / (x₂ - x₁) = (${y2} - ${y1}) / (${x2} - ${x1}) = ${aNumerator} / ${aDenominator} = ${a}`,
      explanation: 'الميل يمثل معدل التغير بين نقطتين'
    });
  } else {
    steps.push({
      stepNumber: 2,
      titleAr: 'الميل',
      formula: `a = (${aNumerator}) / (${aDenominator}) = ${a}`
    });
  }

  // Compute b using point A
  const b = y1 - a * x1;
  const bCalc = `${y1} - (${a} × ${x1}) = ${y1} - ${a * x1} = ${b}`;

  steps.push({
    stepNumber: 3,
    titleAr: 'حساب الثابت b',
    formula: `b = y₁ - a×x₁ = ${bCalc}`,
    explanation: `نعوّض بالنقطة A(${x1}, ${y1}) في f(x) = ax + b`
  });

  // Form equation
  const bStr = b === 0 ? '' : b > 0 ? ` + ${b}` : ` - ${Math.abs(b)}`;
  const aStr = a === 1 ? '' : a === -1 ? '-' : `${a}`;
  const equation = `f(x) = ${aStr}x${bStr}`;

  steps.push({
    stepNumber: 4,
    titleAr: 'المعادلة النهائية',
    formula: equation,
    result: equation
  });

  // Verify with point B
  if (mode === 'learning') {
    const check = a * x2 + b;
    steps.push({
      stepNumber: 5,
      titleAr: 'التحقق بالنقطة B',
      formula: `f(${x2}) = ${a}×${x2} + ${b} = ${check}`,
      result: Math.abs(check - y2) < 0.001
        ? `✓ صحيح: f(${x2}) = ${check} = ${y2}`
        : `✗ خطأ: f(${x2}) = ${check} ≠ ${y2}`,
      explanation: 'نتحقق أن النقطة B تنتمي للخط'
    });

    tips.push('💡 الصيغة: a = (y₂ - y₁) / (x₂ - x₁) — قسمة الفرق في y على الفرق في x');
    tips.push('💡 للتحقق: عوّض قيم النقطتين في المعادلة الناتجة');
    if (a === 0) {
      tips.push('💡 عندما a = 0 فالخط أفقي موازٍ لمحور الفواصل');
    }
  }

  return {
    x1, y1, x2, y2,
    a,
    b,
    equation,
    isVertical: false,
    steps: mode === 'exam' ? [steps[0], steps[steps.length - 2]] : steps,
    errors,
    tips: mode === 'learning' ? tips : []
  };
}

// ==================== GRAPH POINTS GENERATOR ====================

export function generateGraphPoints(
  a: number,
  b: number,
  xMin = -6,
  xMax = 6
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const step = (xMax - xMin) / 100;
  for (let x = xMin; x <= xMax + 0.001; x += step) {
    const xR = parseFloat(x.toFixed(3));
    const y = a * xR + b;
    points.push({ x: xR, y: parseFloat(y.toFixed(4)) });
  }
  return points;
}
