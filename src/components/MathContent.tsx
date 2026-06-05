import { memo, useMemo } from "react";
import { BlockMath, InlineMath } from "react-katex";

export type MathSegment = {
  text?: string;
  math?: string;
  display?: boolean;
};

export type MathContentInput = string | MathSegment | MathSegment[];

/** Normalize ASCII / unicode math notation into proper LaTeX. */
function normalizeMathNotation(s: string): string {
  return s
    // √(expr) or √{expr}  -> \sqrt{expr}
    .replace(/√\s*\(([^()]+)\)/g, "\\sqrt{$1}")
    .replace(/√\s*\{([^{}]+)\}/g, "\\sqrt{$1}")
    // √x or √123  -> \sqrt{x}
    .replace(/√\s*([A-Za-z0-9]+)/g, "\\sqrt{$1}")
    // bare √  -> \sqrt{}
    .replace(/√/g, "\\sqrt{\\,}")
    // x^(...) -> x^{...}
    .replace(/\^\(([^()]+)\)/g, "^{$1}")
    // x_(...) -> x_{...}
    .replace(/_\(([^()]+)\)/g, "_{$1}")    // unicode subscripts
    .replace(/[₀₁₂₃₄₅₆₇₈₉ₙ]/g, (match) => {
      const map: Record<string, string> = {
        '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9', 'ₙ': 'n',
      };
      return `_{${map[match] ?? match}}`;
    })
    // unicode superscripts
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿᵐ]/g, (match) => {
      const map: Record<string, string> = {
        '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', 'ⁿ': 'n', 'ᵐ': 'm',
      };
      return `^{${map[match] ?? match}}`;
    })    // unicode operators
    .replace(/×/g, "\\times ")
    .replace(/÷/g, "\\div ")
    .replace(/·/g, "\\cdot ")
    .replace(/≤/g, "\\leq ")
    .replace(/≥/g, "\\geq ")
    .replace(/≠/g, "\\neq ")
    .replace(/∞/g, "\\infty ")
    .replace(/π/g, "\\pi ")
    .replace(/θ/g, "\\theta ")
    .replace(/α/g, "\\alpha ")
    .replace(/β/g, "\\beta ")
    .replace(/Δ/g, "\\Delta ");
}

/** Split text into Arabic runs vs non-Arabic runs. Any non-Arabic run that contains
 *  math indicators is treated as a SINGLE math expression — this prevents splitting
 *  things like `f(-x) = -f(x)` into 3 pieces. */
const ARABIC_RE = /[\u0600-\u06FF]/;
const MATH_HINT_RE = /[=^_√/\\]|\\[a-zA-Z]+|[A-Za-z]\s*\(|\d\s*[A-Za-z(]|[A-Za-z]\s*[+\-*/=]\s*[A-Za-z0-9(\-]|[A-Za-z0-9)]\s*[+\-*/=]/;

function autoWrapMath(text: string): MathSegment[] {
  const segs: MathSegment[] = [];
  // Tokenize: each token is either an Arabic run (with its trailing whitespace/punctuation)
  // or a non-Arabic run.
  const re = /[\u0600-\u06FF][\u0600-\u06FF\s،.؟!:؛"'%-]*|[^\u0600-\u06FF]+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const chunk = m[0];
    if (ARABIC_RE.test(chunk)) {
      segs.push({ text: chunk });
      continue;
    }
    // Non-Arabic chunk
    const trimmed = chunk.trim();
    if (!trimmed) {
      // pure whitespace — attach to previous text or skip
      if (segs.length && segs[segs.length - 1].text != null) {
        segs[segs.length - 1].text! += chunk;
      }
      continue;
    }
    if (MATH_HINT_RE.test(trimmed)) {
      const expr = normalizeMathNotation(trimmed);
      const display = expr.length > 22;
      segs.push({ math: expr, display });
    } else {
      segs.push({ text: chunk });
    }
  }
  return segs.length ? segs : [{ text }];
}

/** Parse a string with $...$ (inline) and $$...$$ (block) into segments. */
function parseString(s: string): MathSegment[] {
  const out: MathSegment[] = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$|\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(...autoWrapMath(s.slice(last, m.index)));
    const block = m[1] ?? m[4];
    const inline = m[2] ?? m[3];
    if (block) out.push({ math: normalizeMathNotation(block.trim()), display: true });
    else if (inline) {
      const expr = normalizeMathNotation(inline.trim());
      out.push({ math: expr, display: expr.length > 18 });
    }
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push(...autoWrapMath(s.slice(last)));
  return out.length ? out : [{ text: s }];
}

function normalize(input: MathContentInput): MathSegment[] {
  if (input == null) return [];
  if (typeof input === "string") return parseString(input);
  if (Array.isArray(input)) {
    return input.flatMap((seg) => {
      if (typeof seg === "string") return parseString(seg);
      const out: MathSegment[] = [];
      if (seg.text) out.push(...parseString(seg.text));
      if (seg.math) out.push({ math: seg.math, display: seg.display ?? true });
      return out;
    });
  }
  return [input];
}

interface Props {
  content: MathContentInput;
  className?: string;
  /** When true, render each segment as its own block (best for explanations/steps). */
  asSteps?: boolean;
}

function MathContentInner({ content, className = "", asSteps = false }: Props) {
  const segments = useMemo(() => normalize(content), [content]);

  if (asSteps) {
    return (
      <div className={`space-y-3 ${className}`} dir="rtl">
        {segments.map((seg, i) => {
          if (seg.math) {
            // For display formulas in steps mode, show them in centered boxes
            return (
              <div
                key={i}
                dir="ltr"
                className="my-2 max-w-full overflow-x-auto overflow-y-hidden py-4 px-4 rounded-lg bg-white/10 border border-white/20 text-center flex items-center justify-center min-h-14"
              >
                <div className="inline-block">
                  <BlockMath math={seg.math} />
                </div>
              </div>
            );
          }
          return (
            <p key={i} className="leading-relaxed text-right text-slate-200" dir="rtl">
              {seg.text}
            </p>
          );
        })}
      </div>
    );
  }

  return (
    <span className={`block ${className}`} dir="rtl">
      {segments.map((seg, i) =>
        seg.math ? (
          (seg as { display?: boolean }).display ? (
            <span
              key={i}
              dir="ltr"
              className="block my-3 max-w-full overflow-x-auto overflow-y-hidden py-3 px-3 rounded-lg bg-white/5 border border-white/10 text-center"
            >
              <BlockMath math={seg.math} />
            </span>
          ) : (
            <span key={i} dir="ltr" className="inline-block mx-1 align-middle max-w-full overflow-x-auto">
              <InlineMath math={seg.math} />
            </span>
          )
        ) : (
          <span key={i} dir="rtl">{seg.text}</span>
        )
      )}
    </span>
  );
}

export const MathContent = memo(MathContentInner);

/** Glassmorphism block: Arabic text + centered math equation. */
export const MathBlock = memo(function MathBlock({
  text,
  math,
  className = "",
}: {
  text?: string;
  math?: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl p-4 bg-white/10 backdrop-blur-md border border-white/15 shadow-lg space-y-3 ${className}`}
      dir="rtl"
    >
      {text && <p className="text-right leading-relaxed">{text}</p>}
      {math && (
        <div dir="ltr" className="overflow-x-auto py-2 text-center">
          <BlockMath math={math} />
        </div>
      )}
    </div>
  );
});

export { InlineMath, BlockMath };