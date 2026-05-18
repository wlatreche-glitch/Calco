# Mathematical Rendering System - Refactoring Guide

## Overview

This guide helps you migrate existing mathematical rendering in Calco to the new unified system.

## Quick Migration Checklist

- [ ] Import math components from `@/components/math`
- [ ] Replace raw math text with proper components
- [ ] Use `mathFormatter` for normalization
- [ ] Test RTL/LTR rendering
- [ ] Validate on mobile devices
- [ ] Update quiz explanations
- [ ] Update solution steps
- [ ] Update calculator outputs

## Migration Patterns

### Pattern 1: Raw Text → MathBlockArabic

**Before:**
```jsx
<div>
  <p>الطاقة الحركية = ½ × 2 × 5² = 25 J</p>
</div>
```

**After:**
```jsx
import { MathBlockArabic } from '@/components/math';

<div>
  <p>الطاقة الحركية:</p>
  <MathBlockArabic
    math="E_k = \\frac{1}{2} \\times 2 \\times 5^2 = 25 \\text{ J}"
  />
</div>
```

### Pattern 2: Inline Math → InlineMathArabic

**Before:**
```jsx
<p>
  استخدم قانون أوم: U = R × I
</p>
```

**After:**
```jsx
import { InlineMathArabic } from '@/components/math';

<p>استخدم قانون أوم:</p>
<InlineMathArabic math="U = R \\times I" />
```

### Pattern 3: Step Explanations → StepExplanation

**Before:**
```jsx
<div>
  <h3>الخطوة 1: تحديد البيانات</h3>
  <p>m = 2 kg, v = 5 m/s</p>
</div>
<div>
  <h3>الخطوة 2: اختيار الصيغة</h3>
  <p>Ek = ½mv²</p>
</div>
```

**After:**
```jsx
import { StepExplanation } from '@/components/math';

<div className="space-y-3">
  <StepExplanation
    stepNumber={1}
    title="تحديد البيانات"
    math="m = 2 \\text{ kg}, \\quad v = 5 \\text{ m/s}"
  />
  <StepExplanation
    stepNumber={2}
    title="اختيار الصيغة"
    explanation="صيغة الطاقة الحركية:"
    math="E_k = \\frac{1}{2}mv^2"
  />
</div>
```

### Pattern 4: Multi-Step Derivations → EquationRenderer

**Before:**
```jsx
<div>
  <span>التيار = </span>
  <span>P / U</span>
  <br />
  <span>التيار = </span>
  <span>100 / 50</span>
  <br />
  <span>التيار = 2 A</span>
</div>
```

**After:**
```jsx
import { EquationRenderer } from '@/components/math';

<EquationRenderer
  steps={[
    { equation: "I = \\frac{P}{U}", annotation: "قانون القدرة" },
    { equation: "I = \\frac{100}{50}", annotation: "تعويض القيم" },
    { equation: "I = 2A", annotation: "الناتج" }
  ]}
/>
```

### Pattern 5: Using Math Formatter

**Before:**
```jsx
// AI generated: "100/50"
const result = aiResponse.formula;
<p>{result}</p>  // Looks broken
```

**After:**
```jsx
import { normalizeToLatex } from '@/lib/mathFormatter';
import { MathBlockArabic } from '@/components/math';

// AI generated: "100/50"
const result = aiResponse.formula;
const latex = normalizeToLatex(result);
<MathBlockArabic math={latex} />
```

## Specific Tool Migrations

### Physics Calculator

**File:** `src/lib/physicsEngine.ts`

**Current Issue:**
- Solution steps use raw text strings
- Formulas are not properly formatted
- No consistent LaTeX rendering

**Migration:**
1. Update `SolutionStep` interface to support LaTeX
2. Format formulas using `mathFormatter`
3. Use `EquationRenderer` in UI components

**Example:**
```ts
// In physicsEngine.ts
export interface SolutionStep {
  stepNumber: number;
  titleAr: string;
  explanation?: string;
  formula?: string;        // LaTeX formula
  substitution?: string;   // LaTeX substitution
  result?: string;         // LaTeX result
  tip?: string;
  warning?: string;
}

// Use normalizeToLatex when creating steps
import { normalizeToLatex } from '@/lib/mathFormatter';

const step: SolutionStep = {
  stepNumber: 1,
  titleAr: 'تطبيق القانون',
  formula: normalizeToLatex('I = P / U'),
  substitution: normalizeToLatex('I = 100 / 50'),
  result: normalizeToLatex('I = 2A'),
};
```

### Chemistry Engine

**File:** `src/lib/chemistryEngine.ts`

**Current Issue:**
- Equations not properly rendered
- Chemical formulas may be broken
- No visual distinction

**Migration:**
1. Format chemical equations with proper LaTeX
2. Use `ScienceCard` for chemistry content
3. Highlight equations and results

**Example:**
```ts
// Format chemical formulas
const balancedEquation = '2H_2 + O_2 \\rightarrow 2H_2O';

// Use in ScienceCard
<ScienceCard
  title="معادلة الاحتراق"
  icon="🧪"
  subject="chemistry"
  blockMath={balancedEquation}
/>
```

### Equations Solver

**File:** `src/pages/Equations.tsx`

**Current Issue:**
- Solutions may display raw formulas
- No step-by-step visual structure
- Inconsistent formatting

**Migration:**
```jsx
import { EquationRenderer, StepExplanation } from '@/components/math';

// Instead of rendering steps as text, use components
{solutionSteps.map((step, i) => (
  <StepExplanation
    key={i}
    stepNumber={i + 1}
    title={step.titleAr}
    explanation={step.explanation}
    math={step.formula}  // Already LaTeX formatted
    tip={step.tip}
  />
))}
```

### Quiz System (CalcoCoach)

**File:** `src/pages/CalcoCoach.tsx`

**Current Issue:**
- Explanations may be split or broken
- Mathematical content not properly rendered
- No visual hierarchy

**Migration:**
```jsx
// In CoachEngine.tsx - format explanations
explain: [
  { text: 'استخدم قانون أوم:' },
  {
    math: 'U = R \\times I = 10 \\times 2 = 20 \\text{ V}'
  },
]

// In component - render properly
{explain.map((seg, i) =>
  seg.math ? (
    <div key={i} dir="ltr">
      <BlockMath math={seg.math} />
    </div>
  ) : (
    <p key={i} dir="rtl">{seg.text}</p>
  )
)}
```

## Common Issues and Solutions

### Issue 1: Math overlapping RTL text

**Problem:**
```jsx
<div dir="rtl">
  <p>القانون: P = U × I</p>  {/* U × I appears broken */}
</div>
```

**Solution:**
```jsx
<div dir="rtl">
  <p>القانون:</p>
  <InlineMathArabic math="P = U \\times I" />
</div>
```

### Issue 2: Equations split across multiple elements

**Problem:**
```jsx
<span>I = </span>
<span>100/50</span>  {/* Broken rendering */}
<span>= 2A</span>
```

**Solution:**
```jsx
<EquationRenderer
  steps={[
    { equation: "I = \\frac{100}{50} = 2A" }
  ]}
/>
```

### Issue 3: AI-generated formulas with ASCII math

**Problem:**
```jsx
const aiFormula = "E = m * c^2";
<p>{aiFormula}</p>  // Not proper LaTeX
```

**Solution:**
```jsx
import { formatPhysicsFormula } from '@/lib/mathFormatter';

const aiFormula = "E = m * c^2";
const latex = formatPhysicsFormula(aiFormula);
<MathBlockArabic math={latex} />
```

### Issue 4: Complex derivations spanning multiple steps

**Problem:**
```jsx
// Multiple separate renders = inconsistent styling
<p>{step1}</p>
<p>{step2}</p>
<p>{step3}</p>
```

**Solution:**
```jsx
<EquationRenderer
  steps={[
    { equation: step1, annotation: 'annotation 1' },
    { equation: step2, annotation: 'annotation 2' },
    { equation: step3, annotation: 'annotation 3' },
  ]}
/>
```

## Testing Checklist

After migrating each component:

- [ ] Math renders correctly in RTL context
- [ ] No horizontal overflow on mobile
- [ ] Operators display correctly (÷, ×, =, etc.)
- [ ] LaTeX compiles without errors
- [ ] Step numbers visible and correct
- [ ] Tips and warnings display properly
- [ ] Colors match subject type
- [ ] Text is readable on all devices
- [ ] Touch targets ≥44px on mobile
- [ ] Component memoization prevents re-renders

## Performance Optimization

### Before Migration
```jsx
// Rendering math each time props change
function Calculator({ formula }) {
  return <div>{formula}</div>;  // Inefficient
}
```

### After Migration
```jsx
// Components are memoized
function Calculator({ formula }) {
  const latex = useMemo(() => normalizeToLatex(formula), [formula]);
  return <MathBlockArabic math={latex} />;  // Optimized
}
```

## Rollout Strategy

### Phase 1: Core Components
- [ ] Deploy math component library
- [ ] Deploy mathFormatter utility
- [ ] Add to component exports

### Phase 2: Quiz System
- [ ] Update question explanations
- [ ] Update result displays
- [ ] Test all subjects (Physics, Chemistry, Math)

### Phase 3: Calculators
- [ ] Update Physics Calculator
- [ ] Update Chemistry Engine
- [ ] Update Equations Solver

### Phase 4: All Tools
- [ ] Update Statistics
- [ ] Update Functions
- [ ] Update Matrices
- [ ] Update Sequences

### Phase 5: Polish & Documentation
- [ ] Mobile testing
- [ ] Performance audit
- [ ] Accessibility check
- [ ] Documentation complete

## Support & Troubleshooting

### Common LaTeX Errors

**Error:** `Missing $ inserted`
- **Cause:** Unescaped special characters
- **Fix:** Use `escapeLaTeX()` for user input

**Error:** `Extra }, or forgotten $`
- **Cause:** Mismatched braces
- **Fix:** Use helpers like `createFraction()` instead of manual strings

**Error:** `Display too wide`
- **Cause:** Long equations overflow on mobile
- **Fix:** Add horizontal scroll: `overflow-x-auto`

### RTL/LTR Issues

**Math appears backwards:**
- Ensure `dir="ltr"` on math container
- Check `unicode-bidi: isolate`

**Text overlaps with operators:**
- Use `InlineMathArabic` for inline expressions
- Never mix raw text and operators

## Resources

- [KaTeX Documentation](https://katex.org/)
- [LaTeX Math Commands](https://en.wikibooks.org/wiki/LaTeX/Mathematics)
- [MDN: CSS direction](https://developer.mozilla.org/en-US/docs/Web/CSS/direction)
- [Unicode Bidi Algorithm](https://unicode.org/reports/tr9/)

## Getting Help

1. Check SYSTEM.md for component documentation
2. Review EXAMPLES.tsx for usage patterns
3. Check mathFormatter.ts for available utilities
4. Test components in isolation first
5. Verify mobile rendering before deployment
