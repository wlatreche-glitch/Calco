# Physics Solution Steps Rendering Analysis

## Overview
This document identifies where physics solution steps with `titleAr` (Arabic titles) and `formula` (LaTeX formulas) are rendered separately in the Calco application.

---

## Key Findings

### 1. **SolutionStep Interface Definition**
**File:** [src/lib/physicsEngine.ts](src/lib/physicsEngine.ts#L11-L22)

```typescript
export interface SolutionStep {
  stepNumber: number;
  titleAr: string;      // ← Arabic title
  titleFr: string;      // ← French title
  formula?: string;     // ← LaTeX formula (currently NOT rendered as math)
  substitution?: string;
  result?: string;
  explanation?: string;
  tip?: string;
}
```

### 2. **Current Rendering Pattern - Separate Display**

**File:** [src/components/physics/ThermodynamicsCalculator.tsx](src/components/physics/ThermodynamicsCalculator.tsx#L850-880)

**Location in Code:**
```jsx
// Lines 852-880: Step rendering loop
{result.steps.map((step, i) => (
  <div key={i} className="p-3 rounded-lg bg-secondary/50 space-y-1">
    {/* Step number and Arabic title on separate line */}
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="text-xs">{step.stepNumber}</Badge>
      <span className="font-medium text-sm">{step.titleAr}</span>  {/* ← Plain text */}
    </div>
    
    {/* Formula displayed as plain monospace text, NOT LaTeX */}
    {step.formula && (
      <p className="text-sm font-mono text-primary pr-6">{step.formula}</p>
    )}
    
    {/* Additional fields */}
    {step.substitution && (
      <p className="text-sm font-mono text-muted-foreground pr-6">{step.substitution}</p>
    )}
    {step.result && (
      <p className="text-sm font-bold text-green-600 pr-6">{step.result}</p>
    )}
    {step.explanation && mode === 'learning' && (
      <p className="text-xs text-muted-foreground pr-6 italic">{step.explanation}</p>
    )}
  </div>
))}
```

**Issues:**
- `titleAr` is rendered as plain HTML text without LaTeX support
- `formula` is rendered as monospace ASCII text, NOT as LaTeX math
- No mathematical symbols or proper equation formatting

---

### 3. **Related Calculators with Same Pattern**

#### Motion Analysis
**File:** [src/components/physics/MotionAnalyzer.tsx](src/components/physics/MotionAnalyzer.tsx)
- Similar rendering of `titleAr` and `formula` separately
- No LaTeX rendering

#### Electrical Circuits  
**File:** [src/components/physics/ElectricalCircuits.tsx](src/components/physics/ElectricalCircuits.tsx)
- Same pattern as thermodynamics

#### Oscillations & Waves
**File:** [src/components/physics/OscillationsWaves.tsx](src/components/physics/OscillationsWaves.tsx)
- Same pattern as thermodynamics

#### Optics
**File:** [src/components/physics/OpticsCalculator.tsx](src/components/physics/OpticsCalculator.tsx)
- Same pattern as thermodynamics

#### Nuclear Physics
**File:** [src/components/physics/NuclearPhysics.tsx](src/components/physics/NuclearPhysics.tsx)
- Same pattern as thermodynamics

---

### 4. **Quiz System - Better Implementation Example**

**File:** [src/pages/CalcoCoach.tsx](src/pages/CalcoCoach.tsx#L272-280)

The quiz system shows how this should be done with `MathContent` component:

```jsx
{reveal && (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-sm">
    <div className="font-bold mb-2">💡 شرح:</div>
    {/* Handles both Arabic text and LaTeX formulas properly */}
    <MathContent content={q.explain} asSteps />
  </motion.div>
)}
```

**Associated Types:**
**File:** [src/lib/coachEngine.ts](src/lib/coachEngine.ts#L1-10)

```typescript
export type QSegment = { text?: string; math?: string };
export type QContent = string | QSegment[];

export type QuizQuestion = {
  unit: string;
  q: QContent;
  options: QContent[];
  answer: number;
  explain: QContent;  // ← Can contain mixed text and math segments
};
```

**Example Quiz Explanation:**
```typescript
{
  unit: 'Motion',
  q: 'سيارة تتحرك بسرعة ثابتة 20 m/s. كم تقطع المسافة في 5 ثوانٍ؟',
  options: ['80 m', '100 m', '120 m', '150 m'],
  answer: 1,
  explain: [
    { text: 'استخدم قانون المسافة:' },
    { math: 'd = v \\times t = 20 \\times 5 = 100 \\text{ m}' }  // ← LaTeX!
  ],
}
```

---

### 5. **MathContent Component**

**File:** [src/components/MathContent.tsx](src/components/MathContent.tsx#L1-100)

This component properly handles:
- Arabic text with automatic direction (RTL)
- LaTeX formulas with `react-katex` (BlockMath for display, InlineMath for inline)
- Math notation normalization (converts ASCII symbols to LaTeX)
- Block rendering with `asSteps` prop for step-by-step display

**Key Type:**
```typescript
export type MathSegment = {
  text?: string;
  math?: string;
  display?: boolean;
};

interface Props {
  content: MathContentInput;
  className?: string;
  asSteps?: boolean;  // ← When true, renders each segment as separate block
}
```

---

## Summary: How titleAr and formula Are Currently Displayed Separately

1. **titleAr** → Rendered as plain Arabic text in a badge/header line
2. **formula** → Rendered as plain monospace ASCII text, not as LaTeX math
3. Both are in separate `<p>` tags within the step container
4. No mathematical formatting or symbol rendering
5. Contrast: Quiz system in CalcoCoach correctly combines title text + LaTeX formulas using MathContent

## Files Affected by This Pattern

1. `src/components/physics/ThermodynamicsCalculator.tsx`
2. `src/components/physics/MotionAnalyzer.tsx`
3. `src/components/physics/ElectricalCircuits.tsx`
4. `src/components/physics/OscillationsWaves.tsx`
5. `src/components/physics/OpticsCalculator.tsx`
6. `src/components/physics/NuclearPhysics.tsx`
7. Any other physics components using SolutionStep interface

All follow the same rendering pattern where `titleAr` and `formula` are displayed as separate plain-text elements without LaTeX formatting.
