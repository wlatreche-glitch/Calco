export type QSegment = { text?: string; math?: string; display?: boolean };
export type QContent = string | QSegment | QSegment[];

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
  const labels: Record<string, string> = {
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

  return labels[u] ?? UNIT_AR[u] ?? u;
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
    explain: [
      { math: 'V = R \\times I', display: true },
      { text: 'قانون أوم: الجهد = المقاومة × التيار' },
      { math: 'V = 10 \\times 2 = 20\\text{ V}', display: true },
    ],
  },
  {
    unit: 'Electricity',
    q: 'قدرة كهربائية 100 W وجهد 50 V. ما التيار؟',
    options: ['0.5 A', '1 A', '2 A', '5 A'],
    answer: 2,
    explain: [
      { math: 'I = \\frac{P}{V}', display: true },
      { text: 'التيار = القدرة ÷ الجهد' },
      { math: 'I = \\frac{100}{50} = 2\\text{ A}', display: true },
    ],
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

type QuizSubject = 'physics' | 'chemistry' | 'math';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(items: T[]): T {
  return items[randomInt(0, items.length - 1)];
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? `${value}` : value.toFixed(2).replace(/\.?0+$/, '');
}

function makeQuestion(
  unit: string,
  q: QContent,
  correct: QContent,
  distractors: QContent[],
  explain: QContent
): QuizQuestion {
  const correctKey = JSON.stringify(correct);
  const uniqueDistractors = Array.from(
    new Map(
      distractors
        .filter((value) => JSON.stringify(value) !== correctKey)
        .map((value) => [JSON.stringify(value), value])
    ).values()
  );
  const options = shuffle([
    { value: correct, correct: true },
    ...uniqueDistractors.slice(0, 3).map((value) => ({ value, correct: false })),
  ]);

  return {
    unit,
    q,
    options: options.map((option) => option.value),
    answer: options.findIndex((option) => option.correct),
    explain,
  };
}

function numericQuestion(
  unit: string,
  q: QContent,
  answer: number,
  unitLabel: string,
  explain: QContent
): QuizQuestion {
  const step = Math.max(1, Math.round(Math.abs(answer) * 0.2));
  const values = new Set<number>();
  [answer - step, answer + step, answer + step * 2, answer - step * 2, answer + 1]
    .filter((value) => value > 0 && value !== answer)
    .forEach((value) => values.add(value));

  while (values.size < 3) {
    const offset = randomInt(1, Math.max(3, step * 3));
    values.add(answer + offset);
  }

  const format = (value: number) => `${formatNumber(value)} ${unitLabel}`.trim();
  return makeQuestion(unit, q, format(answer), Array.from(values).slice(0, 3).map(format), explain);
}

function signedTerm(value: number): string {
  if (value === 0) return '';
  return value > 0 ? `+ ${value}` : `- ${Math.abs(value)}`;
}

function variableTerm(coefficient: number, variable = 'x'): string {
  if (coefficient === 0) return '';
  const abs = Math.abs(coefficient);
  const coefficientText = abs === 1 ? variable : `${abs}${variable}`;
  return coefficient > 0 ? `+ ${coefficientText}` : `- ${coefficientText}`;
}

function linearExpression(slope: number, intercept: number): string {
  const slopeText = slope === 1 ? 'x' : slope === -1 ? '-x' : `${slope}x`;
  const interceptText = signedTerm(intercept);
  return `${slopeText}${interceptText ? ` ${interceptText}` : ''}`;
}

function quadraticExpression(a: number, b: number, c: number): string {
  const leading = a === 1 ? 'x^2' : a === -1 ? '-x^2' : `${a}x^2`;
  return [leading, variableTerm(b), signedTerm(c)].filter(Boolean).join(' ');
}

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function fraction(numerator: number, denominator: number): string {
  const divisor = gcd(numerator, denominator);
  return `${numerator / divisor}/${denominator / divisor}`;
}

function physicsVariant(base: QuizQuestion): QuizQuestion {
  if (base.unit === 'Motion') {
    if (Math.random() < 0.5) {
      const speed = randomInt(6, 32);
      const time = randomInt(2, 12);
      const distance = speed * time;
      return numericQuestion(
        'Motion',
        [
          { text: 'احسب المسافة d التي يقطعها جسم يتحرك بسرعة ثابتة:' },
          { math: `v=${speed}\\text{ m/s},\\quad t=${time}\\text{ s}` },
        ],
        distance,
        'm',
        [
          { text: 'نستعمل العلاقة:' },
          { math: `d=${speed}\\times ${time}=${distance}\\text{ m}` },
        ]
      );
    }

    const acceleration = randomInt(2, 8);
    const time = randomInt(2, 6);
    const finalSpeed = acceleration * time;
    return numericQuestion(
      'Motion',
      [
        { text: 'احسب التسارع a لجسم انطلق من السكون:' },
        { math: `v_f=${finalSpeed}\\text{ m/s},\\quad t=${time}\\text{ s}` },
      ],
      acceleration,
      'm/s^2',
      [
        { text: 'نستعمل العلاقة:' },
        { math: `a=\\frac{\\Delta v}{\\Delta t}=\\frac{${finalSpeed}-0}{${time}}=${acceleration}\\text{ m/s}^2` },
      ]
    );
  }

  if (base.unit === 'Energy') {
    if (Math.random() < 0.5) {
      const mass = randomInt(1, 6) * 2;
      const speed = randomInt(2, 10);
      const energy = 0.5 * mass * speed ** 2;
      return numericQuestion(
        'Energy',
        [
          { text: 'احسب الطاقة الحركية E_c لجسم معطياته:' },
          { math: `m=${mass}\\text{ kg},\\quad v=${speed}\\text{ m/s}` },
        ],
        energy,
        'J',
        [
          { text: 'نستعمل العلاقة:' },
          { math: `E_c=\\frac{1}{2}mv^2=\\frac{1}{2}\\times ${mass}\\times ${speed}^2=${energy}\\text{ J}` },
        ]
      );
    }

    const mass = randomInt(1, 10);
    const height = randomInt(2, 20);
    const energy = mass * 10 * height;
    return numericQuestion(
      'Energy',
      [
        { text: 'احسب الطاقة الكامنة الثقالية E_p باستعمال g = 10 m/s^2:' },
        { math: `m=${mass}\\text{ kg},\\quad h=${height}\\text{ m}` },
      ],
      energy,
      'J',
      [
        { text: 'نستعمل العلاقة:' },
        { math: `E_p=mgh=${mass}\\times 10\\times ${height}=${energy}\\text{ J}` },
      ]
    );
  }

  if (base.unit === 'Waves') {
    const frequency = randomInt(2, 18) * 5;
    const wavelength = randomInt(1, 8);
    const speed = frequency * wavelength;
    return numericQuestion(
      'Waves',
      [
        { text: 'احسب سرعة انتشار الموجة v:' },
        { math: `f=${frequency}\\text{ Hz},\\quad \\lambda=${wavelength}\\text{ m}` },
      ],
      speed,
      'm/s',
      [
        { text: 'نستعمل العلاقة:' },
        { math: `v=f\\lambda=${frequency}\\times ${wavelength}=${speed}\\text{ m/s}` },
      ]
    );
  }

  if (base.unit === 'Electricity') {
    if (Math.random() < 0.5) {
      const resistance = randomInt(2, 20);
      const current = randomInt(1, 8);
      const voltage = resistance * current;
      return numericQuestion(
        'Electricity',
        [
          { text: 'احسب التوتر الكهربائي U بين طرفي ناقل أومي:' },
          { math: `R=${resistance}\\Omega,\\quad I=${current}\\text{ A}` },
        ],
        voltage,
        'V',
        [
          { text: 'نستعمل قانون أوم:' },
          { math: `U=RI=${resistance}\\times ${current}=${voltage}\\text{ V}` },
        ]
      );
    }

    const voltage = pick([10, 20, 25, 50, 100]);
    const current = randomInt(1, 8);
    const power = voltage * current;
    return numericQuestion(
      'Electricity',
      [
        { text: 'احسب شدة التيار الكهربائي I:' },
        { math: `P=${power}\\text{ W},\\quad V=${voltage}\\text{ V}` },
      ],
      current,
      'A',
      [
        { text: 'نستعمل علاقة الاستطاعة الكهربائية:' },
        { math: `P=UI\\Rightarrow I=\\frac{P}{U}=\\frac{${power}}{${voltage}}=${current}\\text{ A}` },
      ]
    );
  }

  if (base.unit === 'General') {
    const mass = randomInt(1, 12);
    const weight = mass * 10;
    return numericQuestion(
      'General',
      [
        { text: 'احسب ثقل جسم P على سطح الأرض باستعمال g = 10 m/s^2:' },
        { math: `m=${mass}\\text{ kg}` },
      ],
      weight,
      'N',
      [
        { text: 'نستعمل العلاقة:' },
        { math: `P=mg=${mass}\\times 10=${weight}\\text{ N}` },
      ]
    );
  }

  return base;
}

function mathVariant(base: QuizQuestion): QuizQuestion {
  if (base.unit === 'Functions') {
    const a = randomInt(1, 6) * pick([-1, 1]);
    const b = randomInt(-8, 8);
    const x = randomInt(-5, 8);
    const answer = a * x + b;
    return numericQuestion(
      'Functions',
      [
        { text: 'احسب قيمة الدالة عند العدد المعطى:' },
        { math: `f(x)=${linearExpression(a, b)},\\quad f(${x})=?` },
      ],
      answer,
      '',
      [
        { text: 'نعوض x بالقيمة المعطاة:' },
        { math: `f(${x})=${a}\\times ${x}${signedTerm(b) ? ` ${signedTerm(b)}` : ''}=${answer}` },
      ]
    );
  }

  if (base.unit === 'Derivatives') {
    const a = randomInt(1, 5);
    const b = randomInt(-6, 6);
    let c = randomInt(-8, 8);
    while (c === b) {
      c = randomInt(-8, 8);
    }
    const correct = linearExpression(2 * a, b);
    return makeQuestion(
      'Derivatives',
      [
        { text: 'احسب مشتقة الدالة:' },
        { math: `f(x)=${quadraticExpression(a, b, c)}` },
      ],
      correct,
      [
        linearExpression(a, b),
        `${2 * a}x^2 ${signedTerm(b)}`,
        linearExpression(2 * a, c),
      ],
      [
        { text: 'نستعمل قواعد الاشتقاق:' },
        { math: `f'(x)=${correct}` },
      ]
    );
  }

  if (base.unit === 'Integrals') {
    const a = randomInt(1, 6) * 2;
    const correct = `${a / 2}x^2 + C`;
    return makeQuestion(
      'Integrals',
      [
        { text: 'احسب التكامل غير المحدد:' },
        { math: `\\int ${a}x\\,dx` },
      ],
      correct,
      [`${a}x^2 + C`, `${a / 2}x + C`, `${a / 2}x^2`],
      [
        { text: 'نزيد الأس بدرجة واحدة ثم نقسم على الأس الجديد، ونضيف الثابت C:' },
        { math: `\\int ${a}x\\,dx=${correct}` },
      ]
    );
  }

  if (base.unit === 'Limits') {
    const a = randomInt(-4, 5);
    const m = randomInt(-5, 5) || 2;
    const b = randomInt(-8, 8);
    const answer = m * a + b;
    return numericQuestion(
      'Limits',
      [
        { text: 'احسب النهاية:' },
        { math: `\\lim_{x\\to ${a}}(${linearExpression(m, b)})` },
      ],
      answer,
      '',
      [
        { text: 'بما أن الدالة خطية، نعوض مباشرة:' },
        { math: `${m}\\times ${a}${signedTerm(b) ? ` ${signedTerm(b)}` : ''}=${answer}` },
      ]
    );
  }

  if (base.unit === 'Probability') {
    const total = randomInt(5, 12);
    const success = randomInt(1, total - 1);
    const correct = fraction(success, total);
    const distractors = new Set<string>();
    while (distractors.size < 3) {
      const alt = randomInt(1, total - 1);
      const value = fraction(alt, total);
      if (value !== correct) distractors.add(value);
    }

    return makeQuestion(
      'Probability',
      `في صندوق يحتوي على ${total} كرات، منها ${success} كرات حمراء. ما احتمال سحب كرة حمراء؟`,
      correct,
      Array.from(distractors),
      [
        { text: 'الاحتمال يساوي عدد الحالات الملائمة على عدد الحالات الممكنة:' },
        { math: `P=\\frac{${success}}{${total}}=${correct}` },
      ]
    );
  }

  return base;
}

function createQuestionVariant(subject: QuizSubject, question: QuizQuestion): QuizQuestion {
  if (subject === 'physics') return physicsVariant(question);
  if (subject === 'math') return mathVariant(question);
  return question;
}

export function generateQuiz(
  subject: QuizSubject,
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
  const canGenerateVariants = subject === 'physics' || subject === 'math';
  const targetCount = canGenerateVariants ? count : Math.min(count, filtered.length);

  while (selected.length < targetCount) {
    if (indices.size >= filtered.length) {
      indices.clear();
    }

    const idx = Math.floor(Math.random() * filtered.length);
    if (!indices.has(idx)) {
      indices.add(idx);
      selected.push(createQuestionVariant(subject, filtered[idx]));
    }
  }

  return { questions: selected };
}
