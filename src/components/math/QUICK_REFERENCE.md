# Calco Math Rendering System - Quick Reference

## Import All Components

```jsx
import {
  InlineMathArabic,
  MathBlockArabic,
  StepExplanation,
  ScienceCard,
  EquationRenderer,
} from '@/components/math';

import {
  normalizeToLatex,
  createFraction,
  createScientificEquation,
  formatPhysicsFormula,
  formatWithUnit,
} from '@/lib/mathFormatter';
```

## Component Cheat Sheet

### InlineMathArabic
**Use:** For inline math expressions within Arabic text
```jsx
<InlineMathArabic math="x^2 + 1" />
```

### MathBlockArabic
**Use:** For standalone equations with title/description
```jsx
<MathBlockArabic
  title="قانون أوم"
  math="U = R \\times I"
  description="الجهد = المقاومة × التيار"
/>
```

### StepExplanation
**Use:** For educational step-by-step sequences
```jsx
<StepExplanation
  stepNumber={1}
  title="الخطوة الأولى"
  explanation="النص التوضيحي"
  math="E = mc^2"
  tip="نصيحة مفيدة"
  warning="تحذير مهم"
/>
```

### ScienceCard
**Use:** For subject-specific content cards
```jsx
<ScienceCard
  title="العنوان"
  icon="⚛️"
  subject="physics|chemistry|math|general"
  content="المحتوى"
  blockMath="\\frac{P}{U}"
/>
```

### EquationRenderer
**Use:** For multi-step derivations
```jsx
<EquationRenderer
  title="حساب التيار"
  steps={[
    { equation: "I = \\frac{P}{U}", annotation: "القانون" },
    { equation: "I = \\frac{100}{50}", annotation: "التعويض" },
    { equation: "I = 2A", annotation: "الناتج" }
  ]}
/>
```

## Formatter Functions

### normalizeToLatex
```js
normalizeToLatex('100/50')    // → '\frac{100}{50}'
normalizeToLatex('sqrt(x)')   // → '\sqrt{x}'
normalizeToLatex('x^2')       // → 'x^{2}'
```

### createFraction
```js
createFraction('P', 'U')  // → '\frac{P}{U}'
```

### createScientificEquation
```js
createScientificEquation('I = P/U', 'I = 100/50', 'I = 2A')
```

### formatPhysicsFormula
```js
formatPhysicsFormula('E = m * c^2')  // → 'E = m \times c^{2}'
```

### formatWithUnit
```js
formatWithUnit(20, 'm/s')  // → '20 \, \text{m/s}'
```

## Common LaTeX Patterns

| Need | LaTeX Code |
|------|-----------|
| Fraction | `\frac{a}{b}` |
| Square Root | `\sqrt{x}` |
| Power | `x^{2}` or `x^n` |
| Subscript | `x_{1}` or `x_n` |
| Times | `\times` |
| Division | `\div` |
| Less/Greater | `\leq` or `\geq` |
| Approximation | `\approx` |
| Greek Pi | `\pi` |
| Greek Delta | `\Delta` |
| Greek Theta | `\theta` |
| Infinity | `\infty` |
| Text in math | `\text{word}` |
| Aligned equations | `\begin{align*}...\end{align*}` |

## RTL/LTR Handling

✅ DO:
```jsx
<div dir="rtl">
  <p>نص عربي:</p>
  <InlineMathArabic math="a = b + c" />
</div>
```

❌ DON'T:
```jsx
<div dir="rtl">
  <p>نص عربي: a = b + c</p>  {/* Broken */}
</div>
```

## Complete Example

```jsx
import { StepExplanation, EquationRenderer } from '@/components/math';

export function PhysicsExample() {
  return (
    <div className="space-y-4" dir="rtl">
      <StepExplanation
        stepNumber={1}
        title="تحديد القانون"
        math="P = U \\times I"
      />
      
      <StepExplanation
        stepNumber={2}
        title="التعويض"
        math="P = 50 \\times 2 = 100 \\text{ W}"
      />

      <EquationRenderer
        steps={[
          { equation: "P = 100 \\text{ W}" }
        ]}
      />
    </div>
  );
}
```

## File Organization

```
src/
├── components/
│   └── math/
│       ├── InlineMathArabic.tsx      ← Inline expressions
│       ├── MathBlockArabic.tsx       ← Block equations
│       ├── StepExplanation.tsx       ← Educational steps
│       ├── ScienceCard.tsx           ← Subject cards
│       ├── EquationRenderer.tsx      ← Multi-step derivations
│       ├── index.ts                  ← Exports
│       ├── SYSTEM.md                 ← Full documentation
│       ├── REFACTORING_GUIDE.md      ← Migration guide
│       ├── TEMPLATES.tsx             ← Copy-paste templates
│       └── EXAMPLES.tsx              ← Usage examples
│
└── lib/
    └── mathFormatter.ts              ← LaTeX normalization
```

## Tips & Best Practices

1. **Always use components** instead of raw math text
2. **Memoization happens automatically** - no extra work needed
3. **Use helpers** like `createFraction()` instead of manual strings
4. **Test on mobile** - ensure no overflow
5. **Include units** with `\text{}`
6. **Add annotations** to multi-step equations
7. **Use proper RTL** - never mix with raw operators

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Math overlaps RTL text | Use `InlineMathArabic` |
| Equation looks broken | Use `normalizeToLatex()` |
| Operators appear backward | Ensure `dir="ltr"` on math container |
| Split equations | Use `EquationRenderer` |
| AI formula not rendering | Use `normalizeToLatex(aiOutput)` |
| Mobile overflow | Add `overflow-x-auto` |

## Performance Notes

- All components are **memoized** by default
- LaTeX rendering is **optimized** by KaTeX
- Heavy pages should use **lazy loading**
- Formatter functions are **pure** and cacheable

## Troubleshooting

### Math not rendering?
1. Check LaTeX syntax is valid
2. Verify `dir="ltr"` on math container
3. Check console for errors

### RTL text looks broken?
1. Ensure parent container is `dir="rtl"`
2. Use `InlineMathArabic` for inline math
3. Don't mix raw operators with Arabic

### Mobile display issues?
1. Add `overflow-x-auto` to math container
2. Check viewport meta tag
3. Test in DevTools device mode

## Quick Links

- **Full Documentation:** See `SYSTEM.md`
- **Migration Guide:** See `REFACTORING_GUIDE.md`
- **Code Examples:** See `EXAMPLES.tsx`
- **Copy Templates:** See `TEMPLATES.tsx`

## Support

For help with:
- **Component usage** → Check EXAMPLES.tsx
- **LaTeX syntax** → Check SYSTEM.md
- **Migration** → Check REFACTORING_GUIDE.md
- **Custom formatter** → Check mathFormatter.ts

---

**Version:** 1.0  
**Updated:** 2026-05-13  
**Status:** Production Ready
