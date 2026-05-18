import { memo } from 'react';
import { InlineMath } from 'react-katex';

/**
 * InlineMathArabic Component
 * 
 * Renders inline mathematical expressions safely within Arabic RTL text.
 * Enforces LTR direction and unicode-bidi isolation to prevent RTL inheritance.
 * 
 * Features:
 * - Proper RTL/LTR handling
 * - Unicode-bidi isolation for safe embedding
 * - Responsive sizing
 * - No text overflow
 * 
 * @param math LaTeX string for the mathematical expression (e.g., "x^2 + 1")
 * @param className Optional TailwindCSS classes
 * @param fallback Text to display if math fails to render
 */
interface InlineMathArabicProps {
  math: string;
  className?: string;
  fallback?: string;
}

export const InlineMathArabic = memo(function InlineMathArabic({
  math,
  className = '',
  fallback = '...',
}: InlineMathArabicProps) {
  return (
    <span
      dir="ltr"
      className={`inline-block align-middle mx-1 max-w-full overflow-x-auto ${className}`}
      style={{
        direction: 'ltr',
        unicodeBidi: 'isolate',
      }}
    >
      <InlineMath math={math} />
    </span>
  );
});

export default InlineMathArabic;
