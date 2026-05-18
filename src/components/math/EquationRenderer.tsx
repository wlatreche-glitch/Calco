import { memo } from 'react';
import { BlockMath } from 'react-katex';

/**
 * EquationRenderer Component
 * 
 * Renders complete multi-step derivations as a single unified equation.
 * Prevents splitting equations across multiple elements.
 * 
 * Features:
 * - Multi-step LaTeX rendering
 * - Aligned equations with `\begin{align*}`
 * - Step-by-step derivations
 * - Professional academic styling
 * - Mobile responsive
 * - Optional annotations
 * 
 * Example:
 * <EquationRenderer
 *   steps={[
 *     { equation: "I = \\frac{P}{U}", annotation: "تطبيق قانون القدرة" },
 *     { equation: "I = \\frac{100}{50}", annotation: "تعويض القيم" },
 *     { equation: "I = 2A", annotation: "الناتج النهائي" }
 *   ]}
 * />
 */
interface EquationStep {
  equation: string;
  annotation?: string;
}

interface EquationRendererProps {
  steps: EquationStep[];
  title?: string;
  className?: string;
}

export const EquationRenderer = memo(function EquationRenderer({
  steps,
  title,
  className = '',
}: EquationRendererProps) {
  // Build aligned equation from steps
  const alignedEquation = steps
    .map((step) => {
      // Add annotation as comment if provided
      if (step.annotation) {
        return `${step.equation} \\quad \\text{${step.annotation}}`;
      }
      return step.equation;
    })
    .join(' \\\\ ');

  const fullEquation = `\\begin{align*}\n${alignedEquation}\n\\end{align*}`;

  return (
    <div
      className={`rounded-2xl p-5 bg-white/5 backdrop-blur border border-white/10 shadow-lg space-y-4 ${className}`}
      dir="rtl"
    >
      {title && (
        <h3 className="text-sm font-bold text-blue-300 tracking-wide uppercase">{title}</h3>
      )}

      <div
        dir="ltr"
        className="overflow-x-auto py-5 px-3 text-center rounded-lg bg-white/3 border border-white/8"
        style={{
          direction: 'ltr',
          unicodeBidi: 'isolate',
        }}
      >
        <BlockMath math={fullEquation} />
      </div>

      {/* Legend for annotations */}
      {steps.some((s) => s.annotation) && (
        <div className="text-xs text-gray-400 text-right space-y-1">
          <p className="font-semibold">الشرح:</p>
          {steps
            .filter((s) => s.annotation)
            .map((s, i) => (
              <p key={i}>• {s.annotation}</p>
            ))}
        </div>
      )}
    </div>
  );
});

export default EquationRenderer;
