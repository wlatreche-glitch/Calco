# Calco Mathematical Rendering System Documentation

## Overview

The Calco platform has been upgraded with a professional, unified mathematical rendering system that ensures consistent, beautiful, and accessible scientific content across all educational tools.

## Architecture

### Component Structure

```
src/components/math/
├── InlineMathArabic.tsx      # Inline math with RTL support
├── MathBlockArabic.tsx        # Block-level equations
├── StepExplanation.tsx        # Educational step cards
├── ScienceCard.tsx            # Subject-specific content cards
├── EquationRenderer.tsx       # Multi-step derivations
└── index.ts                   # Component exports
```

### Utility System

```
src/lib/
└── mathFormatter.ts           # LaTeX normalization and formatting
```

## Core Components

### 1. InlineMathArabic

Renders inline mathematical expressions safely within Arabic RTL text.

**Features:**
- Automatic LTR/RTL handling
- Unicode-bidi isolation
- Responsive sizing
- No horizontal overflow

**Usage:**
```jsx
import { InlineMathArabic } from '@/components/math';

export function Example() {
  return (
    <div dir="rtl">
      <p>
        قانون التسارع:
        <InlineMathArabic math="a = \\frac{\\Delta v}{\\Delta t}" />
      </p>
    </div>
  );
}
```

**LaTeX Conversion:**
- `a/b` → `\frac{a}{b}`
- `sqrt(x)` → `\sqrt{x}`
- `x^2` → `x^{2}`
- `*` → `\times`

### 2. MathBlockArabic

Professional standalone equation rendering with academic styling.

**Features:**
- Glassmorphism design
- Centered layout
- Proper RTL/LTR handling
- Optional title and description

**Usage:**
```jsx
import { MathBlockArabic } from '@/components/math';

export function EnergyExample() {
  return (
    <MathBlockArabic
      title="الطاقة الحركية"
      math="E_k = \\frac{1}{2}mv^2"
      description="حيث m هي الكتلة وv هي السرعة"
    />
  );
}
```

### 3. StepExplanation

Educational component for step-by-step solutions (BAC-style).

**Features:**
- Step numbering
- Arabic title and explanation
- Mathematical derivation
- Optional tips and warnings
- Color-coded badges

**Usage:**
```jsx
import { StepExplanation } from '@/components/math';

export function SolutionExample() {
  return (
    <StepExplanation
      stepNumber={1}
      title="تطبيق قانون أوم"
      explanation="نستخدم قانون أوم لحساب الجهد من المقاومة والتيار"
      math="U = R \\times I = 10 \\times 2 = 20 \\text{ V}"
      tip="دائماً تأكد من وحدات القياس قبل الحساب"
    />
  );
}
```

### 4. ScienceCard

Premium content card with subject-specific styling.

**Features:**
- Subject color coding (Physics, Chemistry, Math)
- Glassmorphism design
- Mixed text and equations
- Optional emoji/icon
- Responsive layout

**Usage:**
```jsx
import { ScienceCard } from '@/components/math';

export function PhysicsCard() {
  return (
    <ScienceCard
      title="قانون نيوتن الثاني"
      icon="⚛️"
      subject="physics"
      content="يتناول العلاقة بين القوة والكتلة والتسارع"
      blockMath="F = m \\times a"
    />
  );
}
```

### 5. EquationRenderer

Multi-step derivation renderer for complex equations.

**Features:**
- Aligned equation layout (`align*` environment)
- Step-by-step derivations
- Inline annotations
- Professional academic styling

**Usage:**
```jsx
import { EquationRenderer } from '@/components/math';

export function DerivationExample() {
  const steps = [
    { equation: "I = \\frac{P}{U}", annotation: "تطبيق قانون القدرة" },
    { equation: "I = \\frac{100}{50}", annotation: "تعويض القيم" },
    { equation: "I = 2A", annotation: "الناتج النهائي" }
  ];

  return <EquationRenderer steps={steps} title="حساب التيار" />;
}
```

## Math Formatter Utility

Comprehensive utility for LaTeX normalization and scientific expression formatting.

### Core Functions

#### `normalizeToLatex(expr)`

Converts raw expressions to valid LaTeX.

```js
import { normalizeToLatex } from '@/lib/mathFormatter';

// Examples
normalizeToLatex('100/50');        // → '\frac{100}{50}'
normalizeToLatex('sqrt(75)');      // → '\sqrt{75}'
normalizeToLatex('x^2 + 2x + 1'); // → 'x^{2} + 2x + 1'
normalizeToLatex('a * b');        // → 'a \times b'
```

#### `createFraction(num, denom)`

Create proper fraction expressions.

```js
import { createFraction } from '@/lib/mathFormatter';

createFraction('P', 'U');  // → '\frac{P}{U}'
createFraction('100', '50'); // → '\frac{100}{50}'
```

#### `createScientificEquation(formula, values, result)`

Format complete physics/chemistry derivations.

```js
import { createScientificEquation } from '@/lib/mathFormatter';

createScientificEquation(
  'I = P / U',
  'I = 100 / 50',
  'I = 2A'
);
// Returns complete aligned LaTeX derivation
```

#### `formatPhysicsFormula(formula)`

Special handling for physics formulas.

```js
import { formatPhysicsFormula } from '@/lib/mathFormatter';

formatPhysicsFormula('E = m * c^2');
// → 'E = m \times c^{2}'
```

#### `formatWithUnit(value, unit)`

Format values with proper unit spacing.

```js
import { formatWithUnit } from '@/lib/mathFormatter';

formatWithUnit(20, 'm/s');   // → '20 \, \text{m/s}'
formatWithUnit(100, 'W');    // → '100 \, \text{W}'
```

## RTL/LTR Handling

### Key Principles

1. **Automatic Direction:**
   - Math containers: `dir="ltr"`
   - Arabic containers: `dir="rtl"`

2. **Unicode Bidirectional Isolation:**
   ```css
   direction: ltr;
   unicode-bidi: isolate;
   ```

3. **Prevents RTL Inheritance:**
   - Math expressions never inherit RTL from parent containers
   - Ensures operators render correctly

### Example

```jsx
<div dir="rtl" className="space-y-4">
  {/* Arabic text container */}
  <p>قانون الطاقة الكهربائية:</p>
  
  {/* Math properly isolated */}
  <InlineMathArabic math="P = U \\times I" />
  
  {/* Another Arabic text */}
  <p>حيث P هي القدرة و U هو الجهد</p>
</div>
```

## Migration Guide

### Old Approach (DON'T USE)

```jsx
// ❌ Raw text with operators
<p>التيار = P / U</p>

// ❌ Split equations
<span>I = </span>
<span>{value}</span>

// ❌ Inline LaTeX without proper isolation
<span>{100/50}</span>
```

### New Approach (USE)

```jsx
// ✅ Structured math component
<MathBlockArabic
  math="I = \\frac{P}{U}"
  description="التيار = القدرة / الجهد"
/>

// ✅ Step-by-step explanation
<StepExplanation
  stepNumber={1}
  title="حساب التيار"
  explanation="نطبق قانون القدرة"
  math="I = \\frac{P}{U} = \\frac{100}{50} = 2A"
/>

// ✅ Inline math with proper RTL
<InlineMathArabic math="I = \\frac{P}{U}" />
```

## Common Patterns

### Physics Solution Step

```jsx
<StepExplanation
  stepNumber={1}
  title="تطبيق القانون"
  explanation="نستخدم قانون نيوتن الثاني"
  math="F = m \\times a"
  tip="تأكد من وحدات SI"
/>
```

### Chemistry Equation

```jsx
<ScienceCard
  title="المعادلة الموازنة"
  subject="chemistry"
  icon="🧪"
  content="معادلة الاحتراق:"
  blockMath="2H_2 + O_2 \\rightarrow 2H_2O"
/>
```

### Multi-Step Derivation

```jsx
<EquationRenderer
  steps={[
    { equation: "E = mc^2" },
    { equation: "E = 1 \\times (3 \\times 10^8)^2" },
    { equation: "E = 9 \\times 10^{16} J" }
  ]}
  title="طاقة التحويل"
/>
```

## Best Practices

1. **Always use components** for mathematical content
2. **Prefer block equations** over inline for formulas
3. **Use proper LaTeX notation** (not raw division/exponents)
4. **Include units** in final results using `\text{}`
5. **Add annotations** to multi-step equations
6. **Test on mobile** - ensure no overflow
7. **Use step numbers** for educational sequences
8. **Group related content** with ScienceCard

## Performance Optimization

### Memoization

All math components are memoized to prevent unnecessary re-renders.

```jsx
// Automatically memoized
<MathBlockArabic math={largeExpression} />
```

### Lazy Loading

Load math-heavy pages only when needed:

```jsx
const Physics = lazy(() => import('@/pages/Physics'));
const Equations = lazy(() => import('@/pages/Equations'));

// In App.tsx
<Suspense fallback={<RouteFallback />}>
  <Routes>
    <Route path="/physics" element={<Physics />} />
  </Routes>
</Suspense>
```

## Browser Compatibility

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ RTL-aware (Arabic, Farsi, Hebrew)
- ✅ High DPI displays

## Accessibility

- Uses semantic HTML
- Proper `dir` attributes
- Supports screen readers
- Keyboard navigable

## Support

For issues or improvements:
1. Check component props documentation
2. Review mathFormatter utility functions
3. Test RTL/LTR rendering
4. Validate LaTeX syntax
