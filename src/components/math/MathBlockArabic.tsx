import { memo } from 'react';
import { BlockMath } from 'react-katex';

/**
 * MathBlockArabic Component
 * 
 * Renders standalone mathematical equations with professional academic styling.
 * Designed specifically for BAC-level mathematics and physics.
 * 
 * Features:
 * - Beautiful centered layout
 * - Professional scientific styling
 * - Proper RTL/LTR handling
 * - Mobile responsive
 * - Overflow handling for long equations
 * - Optional title and description
 * 
 * @param math LaTeX string for the mathematical expression
 * @param className Optional TailwindCSS classes
 * @param title Optional Arabic title for the equation
 * @param description Optional description text
 */
interface MathBlockArabicProps {
  math: string;
  className?: string;
  title?: string;
  description?: string;
}

export const MathBlockArabic = memo(function MathBlockArabic({
  math,
  className = '',
  title,
  description,
}: MathBlockArabicProps) {
  return (
    <div
      className={`rounded-2xl p-4 bg-white/5 backdrop-blur border border-white/10 shadow-lg space-y-3 ${className}`}
      dir="rtl"
    >
      {title && (
        <h3 className="text-sm font-bold text-blue-300 tracking-wide uppercase">{title}</h3>
      )}
      
      <div
        dir="ltr"
        className="overflow-x-auto py-4 px-2 text-center rounded-lg bg-white/3 border border-white/5 math-isolate"
      >
        <BlockMath math={math} />
      </div>

      {description && (
        <p className="text-sm text-gray-300 leading-relaxed text-right">{description}</p>
      )}
    </div>
  );
});

export default MathBlockArabic;
