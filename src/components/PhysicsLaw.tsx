import { BlockMath } from 'react-katex';

interface PhysicsLawProps {
  /** Main formula in LaTeX (e.g., "V = R \times I") */
  formula: string;
  /** Arabic description of what the formula means */
  description: string;
  /** Optional: Full calculation example with substitution */
  calculation?: string;
  /** Optional: Law/rule name in Arabic (e.g., "قانون أوم") */
  lawName?: string;
  /** Optional: Derived formula if different from main */
  derived?: string;
}

export default function PhysicsLaw({
  formula,
  description,
  calculation,
  lawName,
  derived,
}: PhysicsLawProps) {
  return (
    <div className="space-y-3">
      {/* Main Law Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-300">{lawName || 'القانون'}</p>
          </div>
        </div>

        {/* Formula in single line - inline mode */}
        <div className="bg-white/10 border border-white/20 rounded-xl p-4 flex items-center justify-center min-h-16">
          <div className="inline-block max-w-full overflow-x-auto">
            <BlockMath math={formula} />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-right text-slate-200">{description}</p>
      </div>

      {/* Calculation Example */}
      {calculation && (
        <div className="space-y-2 pt-2 border-t border-white/10">
          <p className="text-xs font-semibold text-slate-400 text-right">التطبيق العددي:</p>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-center">
            <div className="inline-block max-w-full overflow-x-auto">
              <BlockMath math={calculation} />
            </div>
          </div>
        </div>
      )}

      {/* Derived/Alternative form */}
      {derived && (
        <div className="space-y-2 pt-2 border-t border-white/10">
          <p className="text-xs font-semibold text-slate-400 text-right">صيغة مشتقة:</p>
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-center">
            <div className="inline-block max-w-full overflow-x-auto">
              <BlockMath math={derived} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
