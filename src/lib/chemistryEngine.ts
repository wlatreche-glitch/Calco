// Chemistry equilibrium engine — Bac Algérie
// Pure functions for solving "تطور جملة كيميائية نحو التوازن"

export type SystemType = 'acid' | 'base' | 'general' | 'auto';

export interface EquilibriumInput {
  systemType: SystemType;
  C0?: number;            // mol/L
  V?: number;             // L
  pH?: number;            // optional
  K?: number;             // optional equilibrium constant
  Qr?: number;            // optional reaction quotient (graph reading)
  sigma?: number;         // S/m (conductivity)
  lambdaCation?: number;  // S·m²/mol  e.g. λ(H₃O⁺)
  lambdaAnion?: number;   // S·m²/mol  e.g. λ(A⁻)
  n0?: number;            // mol — direct mole input (no need for C0·V)
  Vm?: number;            // L/mol — molar gas volume
  symbolic?: boolean;     // if true, V missing → solve symbolically
  hintMode?: boolean;     // when true, provide gradual hints instead of full solution
  // For 'general' type, the user can override the equation labels
  acidLabel?: string;     // default "AH"
  baseLabel?: string;     // default "A⁻"
  customEquation?: string;
}

export interface AdvancementRow {
  state: string;          // "الحالة الابتدائية" / "أثناء التحول" / "الحالة النهائية"
  values: string[];       // one cell per species (in order of equation)
}

export interface EquilibriumResult {
  equation: string;
  speciesHeader: string[];
  table: AdvancementRow[];
  steps: { label: string; expression: string; value?: string; why?: string }[];
  xMax?: number;          // mol
  xf?: number;            // mol
  tauF?: number;          // 0..1
  H3O?: number;           // mol/L
  OH?: number;            // mol/L
  concentrations?: { name: string; value: number; unit: string }[];
  Qr?: number;
  K?: number;
  comparison?: 'less' | 'equal' | 'greater';
  conclusion: string;
  formulas: string[];
  alerts: string[];
  warnings: string[];
  detectedType?: string;  // human label of detection
  hints?: string[];       // for HINT MODE
  rejectedSolutions?: string[];
}

function fmt(n: number | undefined, digits = 4): string {
  if (n === undefined || !isFinite(n)) return '—';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs < 1e-3 || abs >= 1e4) return n.toExponential(2);
  return Number(n.toPrecision(digits)).toString();
}

/**
 * Auto-detect type of exercise from given data.
 */
export function detectExerciseType(input: EquilibriumInput): { type: SystemType; label: string } {
  if (input.systemType && input.systemType !== 'auto') {
    const map: Record<string, string> = {
      acid: 'تمرين حمض/أساس (pH)',
      base: 'تمرين أساس (pH)',
      general: 'تفاعل عام / توازن',
    };
    return { type: input.systemType, label: map[input.systemType] || 'تفاعل عام' };
  }
  if (input.sigma !== undefined && input.sigma > 0) {
    return { type: 'acid', label: 'تمرين ناقلية (σ) — يُحسب x_f من الناقلية' };
  }
  if (input.pH !== undefined) {
    return { type: 'acid', label: 'تمرين حمض/أساس (pH معطى)' };
  }
  if (input.K !== undefined || input.Qr !== undefined) {
    return { type: 'general', label: 'توازن كيميائي (K أو Q_r معطى)' };
  }
  return { type: 'acid', label: 'تفاعل عام (افتراضي)' };
}

/**
 * Solve evolution toward equilibrium — Bac Algérie style.
 * Auto-detects exercise type, builds advancement table, computes x_f, τ, Q_r,
 * compares with K, validates solutions, and produces full pedagogical solution.
 */
export function solveEquilibrium(input: EquilibriumInput): EquilibriumResult {
  const warnings: string[] = [];
  const alerts: string[] = [];
  const steps: { label: string; expression: string; value?: string; why?: string }[] = [];
  const hints: string[] = [];
  const rejectedSolutions: string[] = [];
  const formulas = [
    'τ_f = x_f / x_max',
    'Q_r = ([products]) / ([reactants])',
    'K = Q_{r,éq}',
    '[H_3O^+] = 10^{-pH}',
    '[OH^-] = 10^{-(14-pH)}  (à 25°C)',
    'σ = Σ λ_i · [X_i]   (en S/m, [X] en mol/m³)',
    'τ = [H_3O^+] / C_0   (raccourci pour acide faible)',
  ];

  const detected = detectExerciseType(input);
  const effectiveType: SystemType = detected.type;

  // ---- Resolve n0: prefer explicit n0, else C0·V ----
  const hasN0 = input.n0 !== undefined && input.n0 > 0;
  const hasC0 = input.C0 !== undefined && input.C0 > 0;
  const hasV = input.V !== undefined && input.V > 0;
  const symbolic = input.symbolic === true || (!hasV && !hasN0);

  if (!hasN0 && !hasC0) {
    return {
      equation: '',
      speciesHeader: [],
      table: [],
      steps: [],
      conclusion: 'الرجاء إدخال التركيز الابتدائي C₀ أو العدد الابتدائي للمولات n₀.',
      formulas,
      alerts: [],
      warnings: ['ينقص C₀ أو n₀'],
    };
  }
  if (symbolic) {
    warnings.push('⚠️ الحجم V غير معطى → النتائج بدلالة V (حل رمزي).');
    alerts.push('💡 الحل الرمزي: التراكيز والتقدم تُكتب بدلالة V.');
  }

  const C0 = input.C0 ?? (hasN0 && hasV ? (input.n0! / input.V!) : 0);
  const V = hasV ? input.V! : 1;          // placeholder for symbolic computation
  const n0 = hasN0 ? input.n0! : C0 * V;

  // Build equation
  const AH = input.acidLabel || 'AH';
  const A = input.baseLabel || 'A⁻';
  let equation = '';
  let speciesHeader: string[] = [];

  if (effectiveType === 'acid') {
    equation = `${AH} + H₂O ⇌ ${A} + H₃O⁺`;
    speciesHeader = [AH, 'H₂O', A, 'H₃O⁺'];
  } else if (effectiveType === 'base') {
    const B = input.baseLabel || 'B';
    const BH = input.acidLabel || 'BH⁺';
    equation = `${B} + H₂O ⇌ ${BH} + HO⁻`;
    speciesHeader = [B, 'H₂O', BH, 'HO⁻'];
  } else {
    equation = input.customEquation || `${AH} + H₂O ⇌ ${A} + H₃O⁺`;
    speciesHeader = [AH, 'H₂O', A, 'H₃O⁺'];
  }

  // Tableau d'avancement (water excess => noted "excès")
  const table: AdvancementRow[] = [
    {
      state: 'الحالة الابتدائية (x = 0)',
      values: [`${fmt(n0)} mol`, 'بوفرة', '0', '≈ 0'],
    },
    {
      state: 'أثناء التحول (x)',
      values: [`${fmt(n0)} − x`, 'بوفرة', 'x', 'x'],
    },
    {
      state: 'الحالة النهائية (x_f)',
      values: [`${fmt(n0)} − x_f`, 'بوفرة', 'x_f', 'x_f'],
    },
  ];

  alerts.push('تم إهمال الماء لأنه المذيب (موجود بوفرة).');
  alerts.push('يُهمل تركيز H₃O⁺ الابتدائي مقارنة بالناتج عن التفاعل.');

  // HINT MODE: emit progressive hints, don't reveal full solve
  if (input.hintMode) {
    hints.push('💡 الخطوة 1: اكتب جدول التقدم بدلالة x.');
    hints.push('💡 الخطوة 2: احسب x_max = n₀ = C₀ · V.');
    if (input.pH !== undefined) {
      hints.push('💡 الخطوة 3: استعمل [H₃O⁺] = 10^(−pH) لاستخراج x_f.');
      hints.push('💡 الخطوة 4: احسب τ_f = x_f / x_max ثم استنتج طبيعة الحمض.');
    } else if (input.sigma !== undefined) {
      hints.push('💡 الخطوة 3: استعمل σ = Σ λ_i · [X_i] لإيجاد التراكيز.');
      hints.push('💡 الخطوة 4: اربط [H₃O⁺] مع جدول التقدم لاستخراج x_f.');
    } else {
      hints.push('💡 الخطوة 3: استعمل ثابت التوازن K = (النواتج)/(المتفاعلات).');
    }
    hints.push('💡 الخطوة 5: قارن Q_r مع K لاستنتاج اتجاه التطور.');
  }

  // x_max : limiting reactant is AH (water in excess)
  const xMax = n0;
  steps.push({
    label: 'حساب التقدم الأعظمي x_max',
    expression: `x_max = n₀(${AH}) = C₀ · V = ${fmt(C0)} × ${fmt(V)}`,
    value: `${fmt(xMax)} mol`,
    why: 'الماء بوفرة، إذن المتفاعل المحدّ هو الحمض (أو الأساس). x_max يطابق العدد الابتدائي للمولات.',
  });

  // x_f from pH if provided (acid case)
  let xf: number | undefined;
  let H3O: number | undefined;
  let OH: number | undefined;
  let tauF: number | undefined;
  let Qr: number | undefined;
  let comparison: 'less' | 'equal' | 'greater' | undefined;

  if (input.pH !== undefined && input.pH > 0 && input.pH < 14) {
    H3O = Math.pow(10, -input.pH);
    OH = Math.pow(10, -(14 - input.pH));
    steps.push({
      label: 'حساب [H₃O⁺]',
      expression: `[H₃O⁺] = 10^(−pH) = 10^(−${input.pH})`,
      value: `${fmt(H3O)} mol/L`,
      why: 'pH هو سالب لوغاريتم تركيز شوارد الهيدرونيوم.',
    });
    steps.push({
      label: 'حساب [HO⁻]',
      expression: `[HO⁻] = 10^(−(14−pH)) = 10^(−${(14 - input.pH).toFixed(2)})`,
      value: `${fmt(OH)} mol/L`,
      why: 'الجداء الشاردي للماء K_e = [H₃O⁺]·[HO⁻] = 10^(−14) عند 25°C.',
    });

    if (effectiveType === 'acid' || effectiveType === 'general') {
      // [H3O+] = xf / V  =>  xf = [H3O+] * V
      xf = H3O * V;
      steps.push({
        label: 'حساب التقدم النهائي x_f',
        expression: `x_f = [H₃O⁺] · V = ${fmt(H3O)} × ${fmt(V)}`,
        value: `${fmt(xf)} mol`,
        why: 'من جدول التقدم: n(H₃O⁺) = x_f، إذن x_f = [H₃O⁺] · V.',
      });
    } else if (effectiveType === 'base') {
      xf = OH * V;
      steps.push({
        label: 'حساب التقدم النهائي x_f',
        expression: `x_f = [HO⁻] · V = ${fmt(OH)} × ${fmt(V)}`,
        value: `${fmt(xf)} mol`,
        why: 'في حالة الأساس: n(HO⁻) = x_f.',
      });
    }
  }

  // Conductivity branch — extract [H3O+] from σ when pH not given
  if (xf === undefined && input.sigma !== undefined && input.sigma > 0
      && input.lambdaCation !== undefined && input.lambdaAnion !== undefined) {
    // σ = (λ_cation + λ_anion) · [X]   with [X] in mol/m³
    // [H3O+] (mol/L) = σ / (λ_cation + λ_anion) / 1000
    const sumLambda = input.lambdaCation + input.lambdaAnion;
    const concSI = input.sigma / sumLambda;          // mol/m³
    H3O = concSI / 1000;                              // mol/L
    xf = H3O * V;
    steps.push({
      label: 'استخراج [H₃O⁺] من الناقلية σ',
      expression: `[H₃O⁺] = σ / (λ_+ + λ_−) = ${fmt(input.sigma)} / (${fmt(input.lambdaCation)} + ${fmt(input.lambdaAnion)})`,
      value: `${fmt(H3O)} mol/L`,
      why: 'الناقلية σ = Σ λ_i · [X_i]. التركيزات في mol/m³، فنقسم على 1000 للحصول على mol/L.',
    });
    steps.push({
      label: 'حساب التقدم النهائي x_f',
      expression: `x_f = [H₃O⁺] · V = ${fmt(H3O)} × ${fmt(V)}`,
      value: `${fmt(xf)} mol`,
      why: 'بنفس منطق جدول التقدم.',
    });
  }

  // From Qr (e.g. graph reading) — derive xf for AH+H2O ⇌ A− + H3O+
  if (xf === undefined && input.Qr !== undefined && input.Qr > 0) {
    // Q = (xf/V)^2 / ((n0-xf)/V) = xf^2 / (V·(n0 - xf))
    // => xf^2 + Q·V·xf - Q·V·n0 = 0
    const a = 1, b = input.Qr * V, c = -input.Qr * V * n0;
    const disc = b * b - 4 * a * c;
    if (disc >= 0) {
      const r1 = (-b + Math.sqrt(disc)) / (2 * a);
      const r2 = (-b - Math.sqrt(disc)) / (2 * a);
      const candidates = [r1, r2];
      const valid = candidates.filter(r => r > 0 && r < xMax);
      candidates.forEach(r => {
        if (r <= 0) rejectedSolutions.push(`x = ${fmt(r)} مرفوض (سالب أو معدوم — غير فيزيائي).`);
        else if (r >= xMax) rejectedSolutions.push(`x = ${fmt(r)} مرفوض لأنه ≥ x_max = ${fmt(xMax)}.`);
      });
      if (valid.length > 0) {
        xf = valid[0];
        steps.push({
          label: 'حلّ معادلة من الدرجة الثانية لاستخراج x_f من Q_r',
          expression: `x_f² + Q_r·V·x_f − Q_r·V·n₀ = 0  →  Δ = ${fmt(disc)}`,
          value: `x_f = ${fmt(xf)} mol`,
          why: 'تعويض التراكيز في عبارة Q_r يعطي معادلة تربيعية في x_f. نختار الحل الموجب الأصغر من x_max.',
        });
      }
    }
  }

  // Validate xf physically
  if (xf !== undefined) {
    if (xf < 0) {
      rejectedSolutions.push(`x_f = ${fmt(xf)} < 0 → مرفوض (تقدم سالب غير فيزيائي).`);
      xf = undefined;
    } else if (xf > xMax * 1.0001) {
      rejectedSolutions.push(`x_f = ${fmt(xf)} > x_max = ${fmt(xMax)} → مرفوض.`);
      xf = undefined;
    }
  }

  // Concentrations
  const concentrations: { name: string; value: number; unit: string }[] = [];
  if (H3O !== undefined) concentrations.push({ name: '[H₃O⁺]', value: H3O, unit: 'mol/L' });
  if (OH !== undefined) concentrations.push({ name: '[HO⁻]', value: OH, unit: 'mol/L' });
  if (xf !== undefined) {
    const cAH = (n0 - xf) / V;
    const cA = xf / V;
    if (effectiveType === 'base') {
      concentrations.push({ name: `[${input.baseLabel || 'B'}]`, value: cAH, unit: 'mol/L' });
      concentrations.push({ name: `[${input.acidLabel || 'BH⁺'}]`, value: cA, unit: 'mol/L' });
    } else {
      concentrations.push({ name: `[${AH}]`, value: cAH, unit: 'mol/L' });
      concentrations.push({ name: `[${A}]`, value: cA, unit: 'mol/L' });
    }
  }

  if (xf !== undefined && xMax > 0) {
    tauF = xf / xMax;
    steps.push({
      label: 'حساب نسبة التقدم النهائي τ_f',
      expression: `τ_f = x_f / x_max = ${fmt(xf)} / ${fmt(xMax)}`,
      value: `${fmt(tauF)} (≈ ${(tauF * 100).toFixed(2)} %)`,
      why: 'τ_f تقيس مدى تقدم التفاعل: 0 = لم يحدث، 1 = تام.',
    });

    if (tauF < 0.05) {
      alerts.push('τ_f صغيرة جداً → التفاعل محدود جداً والحمض ضعيف.');
    } else if (tauF < 1) {
      alerts.push('0 < τ_f < 1 → التفاعل غير تام (محدود).');
    } else {
      alerts.push('τ_f ≈ 1 → التفاعل تام (الحمض قوي).');
    }
  }

  // Qr at equilibrium (using concentrations from xf)
  if (xf !== undefined) {
    const cAH = (n0 - xf) / V;
    const cA = xf / V;
    const cH3O = xf / V;
    if (cAH > 0) {
      Qr = (cA * cH3O) / cAH;
      steps.push({
        label: 'حساب خارج التفاعل في حالة التوازن Q_{r,éq}',
        expression: `Q_r = ([${A}]·[H₃O⁺]) / [${AH}] = (${fmt(cA)} × ${fmt(cH3O)}) / ${fmt(cAH)}`,
        value: `${fmt(Qr)}`,
        why: 'Q_r محسوب بالتراكيز عند التوازن يساوي ثابت التوازن K للجملة.',
      });
    }
  } else if (input.Qr !== undefined) {
    Qr = input.Qr;
  }

  // Compare with K
  if (Qr !== undefined && input.K !== undefined && input.K > 0) {
    const ratio = Qr / input.K;
    if (Math.abs(ratio - 1) < 0.05) comparison = 'equal';
    else if (Qr < input.K) comparison = 'less';
    else comparison = 'greater';
  } else if (Qr !== undefined && input.K === undefined && tauF !== undefined && tauF < 1) {
    // Self-derived K from equilibrium values
    comparison = 'equal';
  }

  // Conclusion
  let conclusion = '';
  if (comparison === 'less') {
    conclusion = `بما أنّ Q_r < K، فإن جملة التفاعل تتطور في الاتجاه المباشر (نحو تشكيل النواتج). التفاعل ${tauF !== undefined && tauF < 1 ? 'غير تام (محدود)، والحمض ضعيف' : 'يستمر نحو التوازن'}.`;
  } else if (comparison === 'greater') {
    conclusion = 'بما أنّ Q_r > K، فإن جملة التفاعل تتطور في الاتجاه العكسي (نحو تشكيل المتفاعلات).';
  } else if (comparison === 'equal') {
    conclusion = `الجملة في حالة توازن (Q_r = K)${tauF !== undefined ? `، مع نسبة تقدم τ_f ≈ ${(tauF * 100).toFixed(2)}%` : ''}. ${tauF !== undefined && tauF < 1 ? 'التفاعل غير تام، والحمض ضعيف.' : ''}`;
  } else if (tauF !== undefined) {
    if (tauF < 1) {
      conclusion = `نسبة التقدم النهائي τ_f = ${(tauF * 100).toFixed(2)}% < 100%، إذن التفاعل غير تام (محدود)، والحمض ضعيف.`;
    } else {
      conclusion = 'τ_f ≈ 1، إذن التفاعل تام والحمض قوي.';
    }
  } else {
    conclusion = 'أدخل pH أو ثابت التوازن K للحصول على استنتاج كامل.';
  }

  // Smart hints
  if (input.pH !== undefined && input.C0 !== undefined) {
    const expectedStrong = -Math.log10(input.C0);
    if (Math.abs(input.pH - expectedStrong) < 0.2) {
      alerts.push(`pH ≈ −log(C₀) = ${expectedStrong.toFixed(2)} → مؤشر على حمض قوي (تفاعل تام).`);
    } else if (input.pH > expectedStrong + 0.5) {
      alerts.push('pH أكبر من −log(C₀) → مؤشر على حمض ضعيف (تفاعل محدود). يمكن استعمال الاختصار: τ_f = [H₃O⁺] / C₀.');
    }
  }

  return {
    equation,
    speciesHeader,
    table,
    steps,
    xMax,
    xf,
    tauF,
    H3O,
    OH,
    concentrations,
    Qr,
    K: input.K,
    comparison,
    conclusion,
    formulas,
    alerts,
    warnings,
    detectedType: detected.label,
    hints,
    rejectedSolutions,
  };
}