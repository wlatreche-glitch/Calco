/**
 * Implementation Examples & Patterns
 * 
 * This file demonstrates how to use the new unified math rendering system
 * across different types of educational content.
 */

// ============================================
// EXAMPLE 1: Physics Calculator with Steps
// ============================================

import { StepExplanation, EquationRenderer, ScienceCard } from '@/components/math';

export function PhysicsCalculatorExample() {
  return (
    <div className="space-y-4">
      {/* Problem Context */}
      <ScienceCard
        title="حساب الطاقة الحركية"
        icon="⚛️"
        subject="physics"
        content="جسم كتلته 2 kg يتحرك بسرعة 5 m/s. احسب طاقته الحركية."
      />

      {/* Solution Steps */}
      <div className="space-y-3">
        <StepExplanation
          stepNumber={1}
          title="تحديد البيانات"
          explanation="نكتب القيم المعطاة:"
          math="m = 2 \\text{ kg}, \\quad v = 5 \\text{ m/s}"
          tip="تأكد أن البيانات بوحدات SI"
        />

        <StepExplanation
          stepNumber={2}
          title="اختيار الصيغة"
          explanation="صيغة الطاقة الحركية:"
          math="E_k = \\frac{1}{2}mv^2"
          warning="لا تنسَ معامل 1/2"
        />

        <StepExplanation
          stepNumber={3}
          title="التعويض والحساب"
          explanation="نعوض القيم في الصيغة:"
          math="E_k = \\frac{1}{2} \\times 2 \\times 5^2 = 1 \\times 25 = 25 \\text{ J}"
        />
      </div>

      {/* Final Result */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30">
        <p className="text-right text-sm text-gray-300 mb-2">الإجابة النهائية:</p>
        <EquationRenderer
          steps={[
            { equation: "E_k = 25 \\text{ J}" }
          ]}
        />
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 2: Chemistry Equation Balancing
// ============================================

export function ChemistryEquationExample() {
  return (
    <div className="space-y-4">
      <ScienceCard
        title="معادلة احتراق الميثان"
        icon="🧪"
        subject="chemistry"
        content="اكتب المعادلة الموازنة لاحتراق الميثان:"
        blockMath="CH_4 + O_2 \\rightarrow CO_2 + H_2O"
      />

      <StepExplanation
        stepNumber={1}
        title="عد الذرات"
        explanation="قبل الموازنة:"
        math="\\text{يسار: } C=1, H=4, O=2 \\quad \\text{يمين: } C=1, H=2, O=3"
        warning="العناصر غير متوازنة"
      />

      <StepExplanation
        stepNumber={2}
        title="موازنة الهيدروجين"
        explanation="نضع معامل 2 أمام H₂O:"
        math="CH_4 + O_2 \\rightarrow CO_2 + 2H_2O"
      />

      <StepExplanation
        stepNumber={3}
        title="موازنة الأكسجين"
        explanation="نضع معامل 2 أمام O₂ لموازنة الأكسجين:"
        math="CH_4 + 2O_2 \\rightarrow CO_2 + 2H_2O"
        tip="تأكد من تطابق العناصر على الطرفين"
      />
    </div>
  );
}

// ============================================
// EXAMPLE 3: Mathematics - Limits Concept
// ============================================

export function MathematicsLimitExample() {
  return (
    <div className="space-y-4">
      <ScienceCard
        title="حساب النهايات"
        icon="∑"
        subject="math"
        content="احسب النهاية التالية:"
        blockMath="\\lim_{x \\to 2} (x^2 + 3x - 1)"
      />

      <StepExplanation
        stepNumber={1}
        title="التحقق من الشكل"
        explanation="نتحقق من نوع الشكل غير المحدد:"
        math="\\lim_{x \\to 2} (x^2 + 3x - 1) = \\frac{a}{b} \\text{ نوع محدد}"
      />

      <StepExplanation
        stepNumber={2}
        title="التعويض المباشر"
        explanation="بما أن الدالة متصلة، نعوض مباشرة:"
        math="= 2^2 + 3(2) - 1 = 4 + 6 - 1 = 9"
      />

      <EquationRenderer
        steps={[
          { equation: "\\lim_{x \\to 2} (x^2 + 3x - 1) = 9", annotation: "الإجابة" }
        ]}
      />
    </div>
  );
}

// ============================================
// EXAMPLE 4: Multi-Subject Comparison
// ============================================

export function SubjectComparisonExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Physics */}
      <ScienceCard
        title="قانون أوم"
        icon="⚛️"
        subject="physics"
        content="العلاقة بين الجهد والتيار والمقاومة"
        blockMath="U = R \\times I"
      />

      {/* Chemistry */}
      <ScienceCard
        title="قانون التركيز"
        icon="🧪"
        subject="chemistry"
        content="حساب التركيز المولاري"
        blockMath="M = \\frac{n}{V} \\text{ (mol/L)}"
      />

      {/* Math */}
      <ScienceCard
        title="الاشتقاق"
        icon="∑"
        subject="math"
        content="مشتقة دالة كثيرة الحدود"
        blockMath="f'(x) = nx^{n-1}"
      />
    </div>
  );
}

// ============================================
// EXAMPLE 5: Complex Quiz Explanation
// ============================================

export function QuizExplanationExample() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 bg-emerald-500/10 border border-emerald-500/30">
        <p className="text-right text-sm font-bold text-emerald-300 mb-2">✓ إجابة صحيحة</p>
        <p className="text-right text-sm text-gray-300">
          قدرة كهربائية 100 W وجهد 50 V. ما التيار؟
        </p>
      </div>

      <EquationRenderer
        title="الحل الكامل"
        steps={[
          { equation: "P = U \\times I", annotation: "قانون القدرة" },
          { equation: "100 = 50 \\times I", annotation: "تعويض القيم" },
          { equation: "I = \\frac{100}{50} = 2 \\text{ A}", annotation: "الناتج" }
        ]}
      />

      <div className="rounded-lg p-3 bg-blue-500/10 border border-blue-500/30 text-right">
        <p className="text-xs font-semibold text-blue-300 mb-1">💡 شرح إضافي:</p>
        <p className="text-sm text-blue-100">
          القدرة تمثل معدل استهلاك الطاقة، وتحسب بضرب الجهد في التيار. كلما زاد التيار لنفس الجهد، زادت القدرة المستهلكة.
        </p>
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 6: Using Math Formatter Directly
// ============================================

import {
  normalizeToLatex,
  createFraction,
  createScientificEquation,
  formatPhysicsFormula,
  formatWithUnit
} from '@/lib/mathFormatter';

export function MathFormatterExample() {
  // Example 1: Normalize raw expressions
  const expr1 = normalizeToLatex('100/50');
  // Result: '\frac{100}{50}'

  // Example 2: Create fractions
  const expr2 = createFraction('P', 'U');
  // Result: '\frac{P}{U}'

  // Example 3: Create scientific equation
  const expr3 = createScientificEquation(
    'I = P / U',
    'I = 100 / 50',
    'I = 2A'
  );
  // Result: Complete aligned LaTeX

  // Example 4: Format physics formula
  const expr4 = formatPhysicsFormula('E = m * c^2');
  // Result: 'E = m \times c^{2}'

  // Example 5: Format with unit
  const expr5 = formatWithUnit(20, 'm/s');
  // Result: '20 \, \text{m/s}'

  return (
    <div className="space-y-4">
      <div className="rounded-lg p-4 bg-white/5 border border-white/10">
        <p className="text-right text-sm font-mono mb-2">نتائج المعالج:</p>
        <ul className="text-xs text-gray-400 space-y-1 text-right">
          <li>expr1: {expr1}</li>
          <li>expr2: {expr2}</li>
          <li>expr4: {expr4}</li>
          <li>expr5: {expr5}</li>
        </ul>
      </div>
    </div>
  );
}

export default {
  PhysicsCalculatorExample,
  ChemistryEquationExample,
  MathematicsLimitExample,
  SubjectComparisonExample,
  QuizExplanationExample,
  MathFormatterExample,
};
