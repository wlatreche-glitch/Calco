export type QSegment = { text?: string; math?: string };
export type QContent = string | QSegment[];

export type QuizQuestion = {
  unit: string;
  q: QContent;
  options: QContent[];
  answer: number;
  explain: QContent;
};

export type UnitStat = {
  unit: string;
  total: number;
  correct: number;
  ratio: number;
  level: 'strong' | 'medium' | 'weak';
};

export function analyze(questions: QuizQuestion[], answers: (number | null)[]): {
  score: number;
  total: number;
  units: UnitStat[];
  weakest?: string;
  strongest?: string;
} {
  const map = new Map<string, { total: number; correct: number }>();
  let score = 0;
  questions.forEach((q, i) => {
    const cur = map.get(q.unit) ?? { total: 0, correct: 0 };
    cur.total += 1;
    if (answers[i] === q.answer) {
      cur.correct += 1;
      score += 1;
    }
    map.set(q.unit, cur);
  });
  const units: UnitStat[] = Array.from(map.entries()).map(([unit, v]) => {
    const ratio = v.total ? v.correct / v.total : 0;
    const level: UnitStat['level'] = ratio >= 0.8 ? 'strong' : ratio >= 0.5 ? 'medium' : 'weak';
    return { unit, total: v.total, correct: v.correct, ratio, level };
  });
  const sorted = [...units].sort((a, b) => a.ratio - b.ratio);
  return {
    score,
    total: questions.length,
    units,
    weakest: sorted[0]?.unit,
    strongest: sorted[sorted.length - 1]?.unit,
  };
}

export const UNIT_AR: Record<string, string> = {
  Electricity: 'الكهرباء',
  Motion: 'الحركة',
  Energy: 'الطاقة',
  Waves: 'الموجات',
  General: 'عام',
  Mole: 'المول',
  Reactions: 'التفاعلات',
  pH: 'الـ pH',
  Concentration: 'التركيز',
  Functions: 'الدوال',
  Derivatives: 'المشتقات',
  Integrals: 'التكاملات',
  Probability: 'الاحتمالات',
  Limits: 'النهايات',
};

export function unitAr(u: string) {
  return UNIT_AR[u] ?? u;
}

export function calcoFeedback(units: UnitStat[]): { lines: string[]; main: string } {
  const lines = units.map((u) => {
    const name = unitAr(u.unit);
    if (u.level === 'strong') return `😎 قوي في ${name}`;
    if (u.level === 'medium') return `⚡ تحتاج تحسين في ${name}`;
    return `❌ ${name} نقطة ضعفك`;
  });
  return { lines, main: '🤖 أنا Calco… دعنا نعمل على تحسين مستواك!' };
}

// Gamification
const KEY = 'calco_coach_state_v1';
export type CoachState = {
  xp: number;
  streak: number;
  lastDay: string | null;
  fixedUnits: string[];
};

export function loadState(): CoachState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { xp: 0, streak: 0, lastDay: null, fixedUnits: [] };
}

export function saveState(s: CoachState) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function levelOf(xp: number): { name: string; next: number; pct: number } {
  const tiers = [
    { name: 'Beginner', max: 200 },
    { name: 'Intermediate', max: 600 },
    { name: 'Advanced', max: 1500 },
    { name: 'Master', max: Infinity },
  ];
  let acc = 0;
  for (const t of tiers) {
    if (xp < t.max) {
      const range = t.max - acc;
      return { name: t.name, next: t.max === Infinity ? xp : t.max, pct: Math.min(100, ((xp - acc) / range) * 100) };
    }
    acc = t.max;
  }
  return { name: 'Master', next: xp, pct: 100 };
}

export function bumpStreak(s: CoachState): CoachState {
  const today = new Date().toISOString().slice(0, 10);
  if (s.lastDay === today) return s;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const streak = s.lastDay === yesterday ? s.streak + 1 : 1;
  return { ...s, streak, lastDay: today };
}

// Quiz Question Database
const PHYSICS_QUESTIONS: QuizQuestion[] = [
  {
    unit: 'Motion',
    q: 'سيارة تتحرك بسرعة ثابتة 20 m/s. كم تقطع المسافة في 5 ثوانٍ؟',
    options: ['80 m', '100 m', '120 m', '150 m'],
    answer: 1,
    explain: [
      { text: 'استخدم قانون المسافة:' },
      { math: 'd = v \\times t = 20 \\times 5 = 100 \\text{ m}' },
    ],
  },
  {
    unit: 'Motion',
    q: 'تسارع جسم يتغير من 0 إلى 10 m/s في 2 ثانية. ما التسارع؟',
    options: ['2 m/s²', '5 m/s²', '10 m/s²', '20 m/s²'],
    answer: 1,
    explain: [
      { text: 'استخدم قانون التسارع:' },
      { math: 'a = \\frac{v_f - v_i}{t} = \\frac{10 - 0}{2} = 5 \\text{ m/s}^2' },
    ],
  },
  {
    unit: 'Energy',
    q: 'جسم كتلته 2 kg يتحرك بسرعة 5 m/s. ما طاقته الحركية؟',
    options: ['10 J', '25 J', '50 J', '100 J'],
    answer: 2,
    explain: 'الطاقة الحركية = ½ × m × v² = ½ × 2 × 25 = 25 J',
  },
  {
    unit: 'Energy',
    q: 'جسم كتلته 1 kg على ارتفاع 10 m. ما طاقته الكامنة؟ (g = 10 m/s²)',
    options: ['10 J', '50 J', '100 J', '1000 J'],
    answer: 2,
    explain: 'الطاقة الكامنة = m × g × h = 1 × 10 × 10 = 100 J',
  },
  {
    unit: 'Waves',
    q: 'موجة بتردد 50 Hz وطول موجة 2 m. ما سرعتها؟',
    options: ['25 m/s', '50 m/s', '100 m/s', '200 m/s'],
    answer: 2,
    explain: 'السرعة = التردد × الطول الموجي = 50 × 2 = 100 m/s',
  },
  {
    unit: 'Electricity',
    q: 'مقاومة كهربائية 10 Ω وتيار 2 A. ما الجهد؟',
    options: ['5 V', '10 V', '20 V', '40 V'],
    answer: 2,
    explain: 'الجهد = المقاومة × التيار = 10 × 2 = 20 V (قانون أوم)',
  },
  {
    unit: 'Electricity',
    q: 'قدرة كهربائية 100 W وجهد 50 V. ما التيار؟',
    options: ['0.5 A', '1 A', '2 A', '5 A'],
    answer: 2,
    explain: 'التيار = القدرة / الجهد = 100/50 = 2 A',
  },
  {
    unit: 'General',
    q: 'كم تساوي قيمة g على سطح الأرض؟',
    options: ['5.8 m/s²', '8.8 m/s²', '9.8 m/s²', '11.8 m/s²'],
    answer: 2,
    explain: 'عجلة الجاذبية الأرضية = 9.8 m/s² (قيمة تقريبية)',
  },
];

const CHEMISTRY_QUESTIONS: QuizQuestion[] = [
  {
    unit: 'Mole',
    q: 'عدد جزيئات H₂O في 1 mole؟',
    options: ['3.01 × 10²³', '6.02 × 10²³', '9.03 × 10²³', '12.04 × 10²³'],
    answer: 1,
    explain: 'عدد أفوجادرو = 6.02 × 10²³ جزيء/mole',
  },
  {
    unit: 'Mole',
    q: 'الكتلة المولية لـ CO₂؟',
    options: ['30 g/mol', '44 g/mol', '60 g/mol', '88 g/mol'],
    answer: 1,
    explain: 'الكتلة المولية = (12 × 1) + (16 × 2) = 44 g/mol',
  },
  {
    unit: 'Reactions',
    q: 'في معادلة: 2H₂ + O₂ → 2H₂O، كم mole من O₂ يلزم لـ 4 mole من H₂؟',
    options: ['1', '2', '4', '8'],
    answer: 0,
    explain: 'النسبة بين H₂ و O₂ هي 2:1، لذا 4 mole من H₂ تحتاج 2 mole من O₂',
  },
  {
    unit: 'Concentration',
    q: 'محلول يحتوي على 10 g من NaCl في 100 mL. ما التركيز الكتلي؟',
    options: ['0.1 g/mL', '0.01 g/mL', '100 g/L', '0.1 g/L'],
    answer: 2,
    explain: 'التركيز الكتلي = (الكتلة / الحجم) × 1000 = (10/100) × 1000 = 100 g/L',
  },
  {
    unit: 'Concentration',
    q: 'تركيز محلول HCl بـ 0.5 mol/L و حجم 200 mL. كم mole من HCl؟',
    options: ['0.01', '0.1', '0.5', '1.0'],
    answer: 1,
    explain: 'عدد المولات = التركيز × الحجم = 0.5 × 0.2 = 0.1 mol',
  },
  {
    unit: 'pH',
    q: '[H⁺] = 10⁻⁷ mol/L. ما قيمة pH؟',
    options: ['3', '5', '7', '9'],
    answer: 2,
    explain: 'pH = -log[H⁺] = -log(10⁻⁷) = 7 (محلول محايد)',
  },
  {
    unit: 'pH',
    q: 'محلول بـ pH = 2. ما قيمة [H⁺]؟',
    options: ['10⁻²', '10⁻⁷', '10⁻¹⁴', '10²'],
    answer: 0,
    explain: '[H⁺] = 10⁻ᵖᴴ = 10⁻² mol/L',
  },
  {
    unit: 'General',
    q: 'العدد الذري للكربون (C)؟',
    options: ['4', '6', '8', '12'],
    answer: 1,
    explain: 'العدد الذري للكربون = 6 (عدد البروتونات)',
  },
];

const MATH_QUESTIONS: QuizQuestion[] = [
  {
    unit: 'Functions',
    q: [
      { text: 'إذا كانت ' },
      { math: 'f(x) = 2x + 3' },
      { text: '، فما قيمة ' },
      { math: 'f(5)' },
      { text: '؟' },
    ],
    options: ['8', '10', '13', '15'],
    answer: 2,
    explain: [
      { text: 'f(5) = 2(5) + 3 = 10 + 3 = ' },
      { math: '13' },
    ],
  },
  {
    unit: 'Functions',
    q: [
      { text: 'ما مجال الدالة ' },
      { math: 'f(x) = 1/(x-2)' },
      { text: '؟' },
    ],
    options: ['ℝ', 'ℝ - {2}', 'ℝ - {0}', 'ℝ - {-2}'],
    answer: 1,
    explain: [
      { text: 'المقام يجب أن لا يساوي صفر، لذا ' },
      { math: 'x ≠ 2' },
    ],
  },
  {
    unit: 'Derivatives',
    q: [
      { text: 'مشتقة ' },
      { math: 'f(x) = x²' },
      { text: ' هي؟' },
    ],
    options: ['x', '2x', 'x³', '2'],
    answer: 1,
    explain: [
      { text: "باستخدام قاعدة القوة: f'(x) = " },
      { math: '2x' },
    ],
  },
  {
    unit: 'Derivatives',
    q: [
      { text: 'مشتقة ' },
      { math: 'f(x) = 3x² + 2x + 1' },
      { text: ' هي؟' },
    ],
    options: ['6x + 2', '3x + 2', '6x', 'x + 1'],
    answer: 0,
    explain: [
      { text: "f'(x) = " },
      { math: '6x + 2' },
    ],
  },
  {
    unit: 'Integrals',
    q: [
      { text: 'التكامل ' },
      { math: '∫ 2x dx' },
      { text: ' هو؟' },
    ],
    options: [
      { math: 'x + C' },
      { math: 'x² + C' },
      { math: '2x² + C' },
      { math: 'x³ + C' },
    ],
    answer: 1,
    explain: [
      { text: '∫ 2x dx = ' },
      { math: 'x² + C' },
    ],
  },
  {
    unit: 'Limits',
    q: [
      { text: 'حد الدالة: ' },
      { math: 'lim (x→2) (x²)' },
      { text: ' يساوي؟' },
    ],
    options: ['1', '2', '4', '8'],
    answer: 2,
    explain: [
      { text: 'عند x = 2: ' },
      { math: '2² = 4' },
    ],
  },
  {
    unit: 'Probability',
    q: 'احتمالية الحصول على عدد زوجي عند رمي حجر نرد؟',
    options: ['1/6', '1/3', '1/2', '2/3'],
    answer: 2,
    explain: 'الأعداد الزوجية = {2, 4, 6}، العدد = 3/6 = 1/2',
  },
  {
    unit: 'Limits',
    q: [
      { text: 'ما حد ' },
      { math: '1/x' },
      { text: ' عندما ' },
      { math: 'x → ∞' },
      { text: '؟' },
    ],
    options: ['1', '∞', '0', '-∞'],
    answer: 2,
    explain: [
      { text: 'كلما زادت x، قيمة 1/x تقترب من ' },
      { math: '0' },
    ],
  },
];

export function generateQuiz(
  subject: 'physics' | 'chemistry' | 'math',
  unit?: string,
  count = 10,
  _difficulty?: string
): { questions: QuizQuestion[] } {
  const questionBank =
    subject === 'physics' ? PHYSICS_QUESTIONS :
    subject === 'chemistry' ? CHEMISTRY_QUESTIONS :
    MATH_QUESTIONS;

  let filtered = questionBank;
  if (unit) {
    filtered = questionBank.filter((q) => q.unit === unit);
  }

  if (filtered.length === 0) {
    filtered = questionBank;
  }

  const selected: QuizQuestion[] = [];
  const indices = new Set<number>();

  while (selected.length < Math.min(count, filtered.length)) {
    const idx = Math.floor(Math.random() * filtered.length);
    if (!indices.has(idx)) {
      indices.add(idx);
      selected.push(filtered[idx]);
    }
  }

  return { questions: selected };
}