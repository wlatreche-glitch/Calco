// BAC Chemistry — Chemical Kinetics Engine
// المتابعة الزمنية لتحول كيميائي

export interface KineticsPoint {
  t: number;          // time (s)
  x?: number;         // advancement (mol)
  V?: number;         // gas volume (L) — optional input source
  C?: number;         // concentration (mol/L) — optional input source
}

export type KineticsSource = 'x' | 'volume' | 'concentration';

export interface ReactantSpec {
  label: string;
  n0: number;     // initial mol
  coef: number;   // stoichiometric coefficient
}

export interface KineticsInput {
  source: KineticsSource;
  points: KineticsPoint[];
  reactants: ReactantSpec[];     // to compute xmax & limiting reactant
  productCoef?: number;          // for source 'volume' or 'concentration' (coef of tracked species)
  Vm?: number;                   // L/mol (default 24)
  Vsol?: number;                 // L (solution volume, for source 'concentration' or speed)
  askedTime?: number;            // for v(t)
}

export interface KineticsStep {
  title: string;
  formula?: string;
  detail?: string;
}

export interface KineticsResult {
  xmax: number;
  limiting: string;
  table: { t: number; x: number }[];
  xfinal?: number;
  tHalf?: number;
  vAtAsked?: number;     // mol/(L·s)
  vAverage?: number;     // mol/(L·s) over full range
  steps: KineticsStep[];
  traps: string[];
  reminder: string[];
}

const round = (n: number, d = 4) => {
  if (!isFinite(n)) return n;
  const f = Math.pow(10, d);
  return Math.round(n * f) / f;
};

export function computeXmax(reactants: ReactantSpec[]): { xmax: number; limiting: string } {
  let xmax = Infinity;
  let limiting = reactants[0]?.label ?? '';
  for (const r of reactants) {
    if (r.coef <= 0 || r.n0 <= 0) continue;
    const candidate = r.n0 / r.coef;
    if (candidate < xmax) {
      xmax = candidate;
      limiting = r.label;
    }
  }
  if (!isFinite(xmax)) xmax = 0;
  return { xmax, limiting };
}

export function pointToX(pt: KineticsPoint, src: KineticsSource, productCoef = 1, Vm = 24, Vsol = 1): number {
  if (src === 'x') return pt.x ?? 0;
  if (src === 'volume') return (pt.V ?? 0) / Vm / productCoef;
  // concentration: x = C * Vsol / coef
  return (pt.C ?? 0) * Vsol / productCoef;
}

/** Numerical derivative dx/dt at index i (centered when possible). */
function dxdt(table: { t: number; x: number }[], i: number): number {
  if (table.length < 2) return 0;
  if (i === 0) return (table[1].x - table[0].x) / (table[1].t - table[0].t);
  if (i === table.length - 1) {
    const n = table.length;
    return (table[n - 1].x - table[n - 2].x) / (table[n - 1].t - table[n - 2].t);
  }
  return (table[i + 1].x - table[i - 1].x) / (table[i + 1].t - table[i - 1].t);
}

/** Linear interpolation: find t such that x(t) = target. */
function interpTimeForX(table: { t: number; x: number }[], target: number): number | undefined {
  for (let i = 1; i < table.length; i++) {
    const a = table[i - 1], b = table[i];
    if ((a.x <= target && b.x >= target) || (a.x >= target && b.x <= target)) {
      if (b.x === a.x) return a.t;
      const r = (target - a.x) / (b.x - a.x);
      return a.t + r * (b.t - a.t);
    }
  }
  return undefined;
}

/** Linear interpolation of x at a given t. */
function interpXForT(table: { t: number; x: number }[], t: number): number | undefined {
  if (table.length === 0) return undefined;
  if (t <= table[0].t) return table[0].x;
  if (t >= table[table.length - 1].t) return table[table.length - 1].x;
  for (let i = 1; i < table.length; i++) {
    const a = table[i - 1], b = table[i];
    if (t >= a.t && t <= b.t) {
      if (b.t === a.t) return a.x;
      const r = (t - a.t) / (b.t - a.t);
      return a.x + r * (b.x - a.x);
    }
  }
  return undefined;
}

export function solveKinetics(input: KineticsInput): KineticsResult {
  const steps: KineticsStep[] = [];
  const traps: string[] = [];
  const Vm = input.Vm ?? 24;
  const Vsol = input.Vsol ?? 1;
  const productCoef = input.productCoef ?? 1;

  // 1. xmax + limiting
  const { xmax, limiting } = computeXmax(input.reactants);
  steps.push({
    title: '١) جدول التقدم — حساب xmax',
    formula: input.reactants
      .map(r => `x_max(${r.label}) = ${r.n0}/${r.coef} = ${round(r.n0 / r.coef, 5)} mol`)
      .join('  ;  '),
    detail: `المتفاعل المحدّ هو ${limiting} ⇒ x_max = ${round(xmax, 5)} mol`,
  });

  // 2. Build x(t) table from source
  const table = input.points
    .filter(p => p.t !== undefined && !isNaN(p.t))
    .map(p => ({ t: p.t, x: pointToX(p, input.source, productCoef, Vm, Vsol) }))
    .sort((a, b) => a.t - b.t);

  if (input.source === 'volume') {
    steps.push({
      title: '٢) حساب التقدم x من حجم الغاز',
      formula: `x(t) = V(غاز)/(coef × Vm) = V(t)/(${productCoef} × ${Vm})`,
      detail: `Vm = ${Vm} L/mol — تأكّد من وحدة الحجم (mL → L: قسمة على 1000).`,
    });
  } else if (input.source === 'concentration') {
    steps.push({
      title: '٢) حساب التقدم x من التركيز',
      formula: `x(t) = [Produit] × V_sol / coef = C(t) × ${Vsol} / ${productCoef}`,
    });
  } else {
    steps.push({ title: '٢) قراءة التقدم x مباشرة من المعطيات', formula: 'x(t) معطى مباشرة' });
  }

  // 3. xfinal + τ
  const xfinal = table.length ? table[table.length - 1].x : undefined;
  if (xfinal !== undefined) {
    const tau = xmax > 0 ? xfinal / xmax : 0;
    steps.push({
      title: '٣) معدل التقدم النهائي τ',
      formula: `τ = x_f / x_max = ${round(xfinal, 5)} / ${round(xmax, 5)} = ${round(tau, 3)}`,
      detail: tau >= 0.99
        ? 'التحوّل تامّ تقريبًا (τ ≈ 1).'
        : tau <= 0.01 ? 'التحوّل ضعيف جدًّا.' : 'تحوّل محدود — جملة في حالة توازن.',
    });
  }

  // 4. t1/2
  let tHalf: number | undefined;
  if (table.length >= 2) {
    const target = (xfinal ?? xmax) / 2;
    tHalf = interpTimeForX(table, target);
    if (tHalf !== undefined) {
      steps.push({
        title: '٤) زمن نصف التفاعل t₁ₐ₂',
        formula: `x(t₁ₐ₂) = x_f/2 = ${round(target, 5)} mol`,
        detail: `بالاستيفاء من الجدول: t₁ₐ₂ ≈ ${round(tHalf, 2)} s`,
      });
    }
  }

  // 5. Speed v = (1/V) dx/dt
  let vAtAsked: number | undefined;
  let vAverage: number | undefined;
  if (table.length >= 2) {
    if (input.askedTime !== undefined) {
      // find nearest index
      let bestIdx = 0;
      let bestDiff = Infinity;
      table.forEach((p, i) => {
        const d = Math.abs(p.t - input.askedTime!);
        if (d < bestDiff) { bestDiff = d; bestIdx = i; }
      });
      const slope = dxdt(table, bestIdx);
      vAtAsked = slope / Vsol;
      steps.push({
        title: `٥) السرعة الحجمية عند t = ${input.askedTime} s`,
        formula: 'v(t) = (1/V_sol) × (dx/dt)',
        detail: `الميل عند هذه النقطة ≈ ${slope.toExponential(3)} mol/s ⇒ v ≈ ${vAtAsked.toExponential(3)} mol/(L·s)`,
      });
    }
    const first = table[0], last = table[table.length - 1];
    if (last.t !== first.t) {
      vAverage = (last.x - first.x) / (last.t - first.t) / Vsol;
      steps.push({
        title: '٥-bis) السرعة المتوسطة',
        formula: `v_moy = Δx / (V_sol × Δt) = (${round(last.x - first.x, 5)})/(${Vsol} × ${last.t - first.t})`,
        detail: `v_moy ≈ ${vAverage.toExponential(3)} mol/(L·s)`,
      });
    }
  }

  // ---- Trap detection ----
  if (xfinal !== undefined && xfinal > xmax * 1.001) {
    traps.push('⚠️ x_f > x_max — تحقّق من معامل الناتج أو وحدة الحجم (mL/L) أو Vm.');
  }
  if (input.source === 'volume') {
    if (input.Vm && (input.Vm < 20 || input.Vm > 30)) {
      traps.push('⚠️ قيمة Vm غير مألوفة — في الباك غالبًا Vm = 24 L/mol أو 25 L/mol.');
    }
    if (productCoef !== 1) traps.push(`ℹ️ المعامل العديدي للناتج الغازي = ${productCoef} — لا تنسَ القسمة عليه.`);
    traps.push('❗ تأكّد من تحويل mL إلى L قبل القسمة على Vm.');
  }
  if (table.length < 3) traps.push('ℹ️ عدد النقاط قليل — السرعة قد تكون غير دقيقة، استعمل الميل البياني إن أمكن.');
  traps.push('❗ لا تخلط بين n (كمية المادة) و x (التقدم).');
  traps.push('❗ السرعة الحجمية تُقسم على V_sol وليس على V_غاز.');

  const reminder = [
    'x_max = min( n₀(i) / νᵢ ) — المتفاعل المحدّ يعطي أصغر قيمة.',
    'x من حجم غاز:  x = V_gaz / (ν × Vm)',
    'x من تركيز:    x = [P] × V_sol / ν',
    'السرعة الحجمية:  v(t) = (1/V_sol) · (dx/dt)',
    'زمن نصف التفاعل:  x(t₁ₐ₂) = x_f / 2',
    'معدّل التقدّم:  τ = x_f / x_max',
  ];

  return {
    xmax,
    limiting,
    table,
    xfinal,
    tHalf,
    vAtAsked,
    vAverage,
    steps,
    traps,
    reminder,
  };
}