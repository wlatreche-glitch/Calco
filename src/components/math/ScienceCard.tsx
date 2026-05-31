import { memo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';

/**
 * ScienceCard Component
 * 
 * Premium educational card component for scientific content.
 * Supports mixed Arabic text with inline and block equations.
 * 
 * Features:
 * - Glassmorphism design
 * - Professional educational styling
 * - Icon/emoji support
 * - Multiple content modes
 * - Responsive layout
 * - Subject-based color schemes
 * 
 * @param title Arabic title
 * @param content Arabic content text
 * @param inlineMath Optional inline LaTeX expression
 * @param blockMath Optional block LaTeX expression
 * @param icon Optional emoji or icon
 * @param subject Optional subject type for color coding
 * @param className Optional TailwindCSS classes
 */
interface ScienceCardProps {
  title: string;
  content?: string;
  inlineMath?: string;
  blockMath?: string;
  icon?: string;
  subject?: 'physics' | 'chemistry' | 'math' | 'general';
  className?: string;
}

const subjectColors = {
  physics: 'from-violet-600/30 to-purple-600/20 border-violet-400/20',
  chemistry: 'from-rose-600/30 to-orange-600/20 border-rose-400/20',
  math: 'from-cyan-600/30 to-blue-600/20 border-cyan-400/20',
  general: 'from-white/10 to-white/5 border-white/15',
};

export const ScienceCard = memo(function ScienceCard({
  title,
  content,
  inlineMath,
  blockMath,
  icon,
  subject = 'general',
  className = '',
}: ScienceCardProps) {
  const bgClass = subjectColors[subject];

  return (
    <div
      className={`rounded-2xl p-5 bg-gradient-to-br ${bgClass} backdrop-blur border shadow-lg space-y-4 ${className}`}
      dir="rtl"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        {icon && <span className="text-2xl flex-shrink-0">{icon}</span>}
        <h3 className="text-base font-bold text-white">{title}</h3>
      </div>

      {/* Content */}
      {content && (
        <p className="text-sm text-gray-200 leading-relaxed text-right">{content}</p>
      )}

      {/* Inline Math */}
      {inlineMath && (
        <div className="text-right">
          <span
            dir="ltr"
            className="inline-block math-isolate"
          >
            <InlineMath math={inlineMath} />
          </span>
        </div>
      )}

      {/* Block Math */}
      {blockMath && (
        <div
          dir="ltr"
          className="overflow-x-auto py-4 px-2 text-center rounded-lg bg-white/3 border border-white/10 math-isolate"
        >
          <BlockMath math={blockMath} />
        </div>
      )}
    </div>
  );
});

export default ScienceCard;
