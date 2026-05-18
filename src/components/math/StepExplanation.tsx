import { memo } from 'react';
import { BlockMath } from 'react-katex';

/**
 * StepExplanation Component
 * 
 * Professional educational component for BAC-style solution steps.
 * Combines Arabic explanation text with mathematical derivations.
 * 
 * Features:
 * - Step numbering
 * - Arabic title and explanation
 * - Mathematical derivation
 * - Optional tips and warnings
 * - Academic layout
 * - Mobile responsive
 * 
 * @param stepNumber Step index for display
 * @param title Arabic title for the step
 * @param explanation Arabic explanation text
 * @param math LaTeX equation for this step
 * @param tip Optional helpful tip
 * @param warning Optional warning message
 * @param className Optional TailwindCSS classes
 */
interface StepExplanationProps {
  stepNumber?: number;
  title: string;
  explanation?: string;
  math: string;
  tip?: string;
  warning?: string;
  className?: string;
}

export const StepExplanation = memo(function StepExplanation({
  stepNumber,
  title,
  explanation,
  math,
  tip,
  warning,
  className = '',
}: StepExplanationProps) {
  return (
    <div
      className={`rounded-2xl p-4 bg-gradient-to-br from-white/5 to-white/3 backdrop-blur border border-white/10 shadow-lg space-y-3 ${className}`}
      dir="rtl"
    >
      {/* Step Header */}
      <div className="flex items-start gap-3">
        {stepNumber !== undefined && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
            {stepNumber}
          </div>
        )}
        <h3 className="text-base font-bold text-white flex-1">{title}</h3>
      </div>

      {/* Explanation */}
      {explanation && (
        <p className="text-sm text-gray-300 leading-relaxed text-right">{explanation}</p>
      )}

      {/* Mathematical Derivation */}
      <div
        dir="ltr"
        className="overflow-x-auto py-4 px-2 text-center rounded-lg bg-white/5 border border-white/8"
        style={{
          direction: 'ltr',
          unicodeBidi: 'isolate',
        }}
      >
        <BlockMath math={math} />
      </div>

      {/* Optional Tip */}
      {tip && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-right">
          <p className="text-xs font-semibold text-amber-300 mb-1">💡 نصيحة:</p>
          <p className="text-sm text-amber-100">{tip}</p>
        </div>
      )}

      {/* Optional Warning */}
      {warning && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-right">
          <p className="text-xs font-semibold text-red-300 mb-1">⚠️ تحذير:</p>
          <p className="text-sm text-red-100">{warning}</p>
        </div>
      )}
    </div>
  );
});

export default StepExplanation;
