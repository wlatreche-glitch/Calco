// Smart Chemical Equation Parser & Classifier
// Internal logic in English. UI labels live in components.

export type SpeciesKind = 'acid' | 'base' | 'ion' | 'molecule' | 'solid' | 'unknown';

export interface Species {
  id: string;
  formula: string;       // raw, e.g. "CH3COO-", "Fe2+", "H2O", "Ag(s)"
  kind: SpeciesKind;
  charge?: number;       // signed integer charge, 0 if neutral
  state?: 's' | 'l' | 'g' | 'aq';
}

export type ReactionType =
  | 'acid_base'
  | 'redox'
  | 'precipitation'
  | 'general'
  | 'unknown';

export interface ParsedEquation {
  reactants: Species[];
  products: Species[];
  detectedType: ReactionType;
  arrow: '→' | '⇌' | '=';
  balanced?: boolean;   // simple atom-balance check (best-effort)
  warnings: string[];
  suggestion?: string;  // human suggestion for completion
}

// ---------- helpers ----------

let _id = 0;
export const newId = () => `sp_${++_id}_${Date.now().toString(36)}`;

const SUPER_MAP: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
  '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
  '⁺': '+', '⁻': '-',
};
const SUB_MAP: Record<string, string> = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
  '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
};

export function normalizeFormula(input: string): string {
  let s = (input || '').trim();
  // map unicode sub/superscript to ASCII
  s = s.split('').map(c => SUB_MAP[c] ?? SUPER_MAP[c] ?? c).join('');
  // collapse spaces
  s = s.replace(/\s+/g, '');
  return s;
}

export function getCharge(formula: string): number {
  const f = normalizeFormula(formula);
  // patterns: X^2+, X2+, X+, X-, X^-, X^3-
  const m = f.match(/(?:\^?(\d*)([+-]))$/);
  if (!m) return 0;
  const n = m[1] ? parseInt(m[1], 10) : 1;
  return m[2] === '+' ? n : -n;
}

export function getState(formula: string): Species['state'] | undefined {
  const m = formula.match(/\((s|l|g|aq)\)/i);
  return m ? (m[1].toLowerCase() as Species['state']) : undefined;
}

// Atomic composition (very lightweight, ignores parentheses groups for now)
export function atomCount(formula: string): Record<string, number> {
  const f = normalizeFormula(formula)
    .replace(/\((s|l|g|aq)\)/gi, '')
    .replace(/[+\-^]\d*$/, '')
    .replace(/\d+[+-]$/, '');
  const counts: Record<string, number> = {};
  // Expand simple parenthesized groups: (OH)2 -> OH OH
  const expanded = f.replace(/\(([^()]+)\)(\d+)/g, (_, g, n) => g.repeat(parseInt(n, 10)));
  const re = /([A-Z][a-z]?)(\d*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(expanded)) !== null) {
    if (!m[1]) continue;
    const n = m[2] ? parseInt(m[2], 10) : 1;
    counts[m[1]] = (counts[m[1]] || 0) + n;
  }
  return counts;
}

// Heuristic auto-classification
export function classifySpecies(rawFormula: string): SpeciesKind {
  const f = normalizeFormula(rawFormula);
  if (!f) return 'unknown';
  const state = getState(f);
  if (state === 's') return 'solid';
  // explicit charge → ion
  if (/[+-]\d*$/.test(f) || /\d+[+-]$/.test(f) || /\^\d*[+-]/.test(f)) return 'ion';
  // common acid markers
  if (/COOH$/.test(f) || /^H\d*[A-Z]/.test(f) || /SO3H$|SO4H$/.test(f)) return 'acid';
  // common bases
  if (/^NH3$/.test(f) || /OH$/.test(f) || /NH2$/.test(f)) return 'base';
  return 'molecule';
}

export function makeSpecies(rawFormula: string): Species {
  const formula = normalizeFormula(rawFormula);
  const kind = classifySpecies(formula);
  return {
    id: newId(),
    formula,
    kind,
    charge: getCharge(formula),
    state: getState(formula),
  };
}

// Detect reaction type from species sets
export function detectReactionType(reactants: Species[], products: Species[]): ReactionType {
    const all = [...reactants, ...products];
  const formulas = all.map(s => s.formula);
  const hasH3O = formulas.some(f => /^H3O\+?$/.test(f));
  const hasOH = formulas.some(f => /^(HO|OH)-?$/.test(f));
  const hasAcid = reactants.some(s => s.kind === 'acid');
  const hasBase = reactants.some(s => s.kind === 'base');
  const ionCount = all.filter(s => s.kind === 'ion').length;
  const solidCount = products.filter(s => s.kind === 'solid').length;

  if (hasH3O || hasOH || hasAcid || hasBase) return 'acid_base';
  if (solidCount > 0 && ionCount >= 2) return 'precipitation';
  // Redox heuristic: charge changes between reactant ions and product ions
  if (ionCount >= 2) {
    const rc = reactants.reduce((a, s) => a + Math.abs(s.charge ?? 0), 0);
    const pc = products.reduce((a, s) => a + Math.abs(s.charge ?? 0), 0);
    if (rc !== pc) return 'redox';
  }
  if (all.length === 0) return 'unknown';
  return 'general';
}

// Simple atom + charge balance check (best effort)
export function isBalanced(reactants: Species[], products: Species[]): boolean {
  if (reactants.length === 0 || products.length === 0) return false;
  const sum = (list: Species[]) => {
    const acc: Record<string, number> = {};
    for (const s of list) {
      const c = atomCount(s.formula);
      for (const k of Object.keys(c)) acc[k] = (acc[k] || 0) + c[k];
    }
    return acc;
  };
  const a = sum(reactants);
  const b = sum(products);
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) if ((a[k] || 0) !== (b[k] || 0)) return false;
  const ch = (l: Species[]) => l.reduce((x, s) => x + (s.charge ?? 0), 0);
  return ch(reactants) === ch(products);
}

// Quick-input free-text parser: "CH3COOH + H2O = CH3COO- + H3O+"
export function parseQuickInput(text: string): ParsedEquation {
  const warnings: string[] = [];
  const t = (text || '').trim();
  if (!t) {
    return { reactants: [], products: [], detectedType: 'unknown', arrow: '⇌', warnings: ['الرجاء إدخال معادلة'] };
  }
  // normalize arrows
  const arrowMatch = t.match(/(⇌|<=>|<->|->|→|=)/);
  const arrow: ParsedEquation['arrow'] = arrowMatch
    ? (arrowMatch[1] === '→' || arrowMatch[1] === '->' ? '→' : (arrowMatch[1] === '=' ? '=' : '⇌'))
    : '⇌';
  if (!arrowMatch) warnings.push('لم يُكتشف رمز التفاعل، تم استخدام ⇌ افتراضياً');
  const [lhs, rhs = ''] = arrowMatch ? t.split(arrowMatch[1]) : [t, ''];
  const splitSide = (side: string) =>
    side.split('+').map(s => s.trim()).filter(Boolean).map(makeSpecies);
  const reactants = splitSide(lhs);
  const products = splitSide(rhs);
  const detectedType = detectReactionType(reactants, products);
  const balanced = isBalanced(reactants, products);
  if (!balanced && reactants.length && products.length) warnings.push('⚠️ المعادلة قد تكون غير متوازنة');

  return { reactants, products, detectedType, arrow, balanced, warnings };
}

// Auto-completion suggestions
export function suggestCompletion(reactants: Species[]): { products: Species[]; type: ReactionType } | null {
  if (reactants.length === 0) return null;
  const first = reactants[0];
  const f = first.formula;

  if (first.kind === 'acid') {
    // AH + H2O ⇌ A- + H3O+
    const conjugate = f.endsWith('COOH')
      ? f.replace(/COOH$/, 'COO-')
      : f.replace(/^H/, '') + '-';
    return {
      products: [makeSpecies(conjugate), makeSpecies('H3O+')],
      type: 'acid_base',
    };
  }
  if (first.kind === 'base') {
    // B + H2O ⇌ BH+ + OH-
    const conjugate = f === 'NH3' ? 'NH4+' : f + 'H+';
    return {
      products: [makeSpecies(conjugate), makeSpecies('OH-')],
      type: 'acid_base',
    };
  }
  return null;
}

export function formatEquation(eq: ParsedEquation): string {
  const join = (list: Species[]) => list.map(s => s.formula).join(' + ');
  return `${join(eq.reactants)} ${eq.arrow} ${join(eq.products)}`;
}

// Useful presets for the "+ Add species" picker
export const PRESETS: { label: string; formula: string; kind: SpeciesKind }[] = [
  { label: 'H₂O', formula: 'H2O', kind: 'molecule' },
  { label: 'H₃O⁺', formula: 'H3O+', kind: 'ion' },
  { label: 'OH⁻', formula: 'OH-', kind: 'ion' },
  { label: 'CH₃COOH', formula: 'CH3COOH', kind: 'acid' },
  { label: 'CH₃COO⁻', formula: 'CH3COO-', kind: 'ion' },
  { label: 'NH₃', formula: 'NH3', kind: 'base' },
  { label: 'NH₄⁺', formula: 'NH4+', kind: 'ion' },
  { label: 'HCl', formula: 'HCl', kind: 'acid' },
  { label: 'Cl⁻', formula: 'Cl-', kind: 'ion' },
  { label: 'Fe²⁺', formula: 'Fe2+', kind: 'ion' },
  { label: 'Ag⁺', formula: 'Ag+', kind: 'ion' },
  { label: 'Ag(s)', formula: 'Ag(s)', kind: 'solid' },
];
