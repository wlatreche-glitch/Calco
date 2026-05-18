// Dynamic Input System — Bac Algérie Chemistry
// Determines which inputs to show based on what data the student already has.
// Pure logic, no UI. Returns a configuration consumed by DynamicInputPanel.

export type InputKey =
  | 'pH'
  | 'C0'
  | 'V'
  | 'sigma'
  | 'lambdaCation'
  | 'lambdaAnion'
  | 'K'
  | 'Qr'
  | 'n0'
  | 'Vm';

export type DetectedType =
  | 'pH'         // pH-based acid/base
  | 'sigma'     // conductivity
  | 'mole'      // mole-based (n given, no C0/V needed)
  | 'gas'       // Vm-based gas
  | 'K'         // equilibrium constant qualitative
  | 'Qr'        // reaction direction
  | 'mixed'     // multiple sources
  | 'unknown';

export type SolveMode = 'numeric' | 'symbolic' | 'qualitative';

export type UserMode = 'auto' | 'pH' | 'sigma' | 'n' | 'K' | 'Vm' | 'mixed';

export interface RawInputs {
  pH?: string;
  C0?: string;
  V?: string;
  sigma?: string;
  lambdaCation?: string;
  lambdaAnion?: string;
  K?: string;
  Qr?: string;
  n0?: string;
  Vm?: string;
}

export interface InputConfig {
  detectedType: DetectedType;
  detectedLabel: string;          // Arabic human label
  requiredInputs: InputKey[];     // must be filled
  optionalInputs: InputKey[];     // helpful but not mandatory
  hiddenInputs: InputKey[];       // hide entirely (not relevant)
  mode: SolveMode;
  solvingStrategy: string;        // Arabic explanation
  warnings: string[];             // Arabic warnings/hints
  hints: string[];                // educational guidance
}

function has(v?: string): boolean {
  if (v === undefined) return false;
  const s = String(v).trim();
  if (s === '') return false;
  const n = parseFloat(s);
  return !isNaN(n);
}

/**
 * Build dynamic input configuration based on currently filled inputs and user mode.
 */
export function buildInputConfig(raw: RawInputs, userMode: UserMode = 'auto'): InputConfig {
  const warnings: string[] = [];
  const hints: string[] = [];

  // -------- Manual user mode override --------
  if (userMode !== 'auto') {
    return manualConfig(userMode, raw);
  }

  // -------- Auto detection --------
  const flags = {
    pH: has(raw.pH),
    C0: has(raw.C0),
    V: has(raw.V),
    sigma: has(raw.sigma),
    lambdaCation: has(raw.lambdaCation),
    lambdaAnion: has(raw.lambdaAnion),
    K: has(raw.K),
    Qr: has(raw.Qr),
    n0: has(raw.n0),
    Vm: has(raw.Vm),
  };

  // Count "primary signal" sources
  const sources = [flags.pH, flags.sigma, flags.Vm, flags.n0].filter(Boolean).length;

  let detected: DetectedType = 'unknown';
  let detectedLabel = 'لم يتم تحديد نوع التمرين بعد';
  const required: InputKey[] = [];
  const optional: InputKey[] = [];
  const hidden: InputKey[] = [];
  let mode: SolveMode = 'numeric';
  let strategy = '';

  if (sources >= 2) {
    detected = 'mixed';
    detectedLabel = 'تمرين مختلط (عدة معطيات)';
    required.push('C0');
    optional.push('pH', 'sigma', 'V', 'K', 'Qr', 'lambdaCation', 'lambdaAnion');
    strategy = 'يحتوي التمرين على عدة معطيات. استعمل كل واحدة للتحقق من الأخرى.';
    hints.push('💡 جرّب حساب τ_f بطريقتين (pH وσ مثلاً) للتحقق.');
  } else if (flags.Vm) {
    detected = 'gas';
    detectedLabel = 'تمرين تحول غازي (Vm معطى)';
    required.push('Vm');
    optional.push('V', 'n0');
    hidden.push('pH', 'sigma', 'lambdaCation', 'lambdaAnion');
    strategy = 'استعمل n = V / Vm لاستخراج كمية المادة الغازية.';
    hints.push('💡 في الشروط النظامية: Vm = 22.4 L/mol.');
  } else if (flags.sigma) {
    detected = 'sigma';
    detectedLabel = 'تمرين ناقلية (σ معطى)';
    required.push('sigma', 'C0', 'lambdaCation', 'lambdaAnion');
    optional.push('V', 'K');
    hidden.push('pH', 'Vm', 'n0');
    strategy = 'استعمل σ = Σ λ_i · [X_i] لاستخراج التراكيز ثم x_f.';
    hints.push('💡 انتبه للوحدات: σ بـ S/m والتراكيز بـ mol/m³ (اضرب mol/L × 1000).');
  } else if (flags.pH) {
    detected = 'pH';
    detectedLabel = 'تمرين حمض/أساس (pH معطى)';
    required.push('pH', 'C0');
    optional.push('V', 'K');
    hidden.push('sigma', 'lambdaCation', 'lambdaAnion', 'Vm', 'n0');
    strategy = 'استعمل [H₃O⁺] = 10⁻ᵖᴴ، ثم x_f = [H₃O⁺] · V.';
    hints.push('💡 استعمل pH لحساب [H₃O⁺] مباشرة.');
  } else if (flags.n0) {
    detected = 'mole';
    detectedLabel = 'تمرين مولي (n معطى)';
    required.push('n0');
    optional.push('V', 'K', 'Qr');
    hidden.push('C0', 'pH', 'sigma', 'lambdaCation', 'lambdaAnion', 'Vm');
    strategy = 'استعمل العدد الابتدائي للمولات مباشرة في جدول التقدم.';
    hints.push('💡 لا حاجة لـ C₀ هنا — n₀ يكفي.');
  } else if (flags.K && !flags.Qr) {
    detected = 'K';
    detectedLabel = 'تحليل ثابت التوازن K';
    required.push('K');
    optional.push('C0', 'V');
    hidden.push('pH', 'sigma', 'lambdaCation', 'lambdaAnion', 'Vm', 'n0', 'Qr');
    mode = 'qualitative';
    strategy = 'تحليل نوعي: K كبير ⇒ تفاعل تام، K صغير ⇒ تفاعل محدود.';
    hints.push('💡 لا تتطلب الإجابة الكاملة معطيات إضافية.');
  } else if (flags.Qr) {
    detected = 'Qr';
    detectedLabel = 'تحديد اتجاه التفاعل (Q_r معطى)';
    required.push('Qr', 'K');
    optional.push('C0', 'V');
    hidden.push('pH', 'sigma', 'lambdaCation', 'lambdaAnion', 'Vm', 'n0');
    strategy = 'قارن Q_r مع K: Q_r < K ⇒ مباشر، Q_r > K ⇒ عكسي، Q_r = K ⇒ توازن.';
    hints.push('💡 لا تحتاج لحلّ كامل — فقط مقارنة.');
  } else {
    detected = 'unknown';
    detectedLabel = 'أدخل أحد المعطيات (pH، σ، n، K أو Qr) ليتعرّف النظام على نوع التمرين';
    required.push('C0');
    optional.push('pH', 'sigma', 'V', 'K', 'Qr', 'n0', 'Vm');
    strategy = 'في انتظار معطيات كافية لاختيار طريقة الحل.';
  }

  // -------- Symbolic mode trigger: missing V (and not gas/K only) --------
  const needsV = ['pH', 'sigma', 'mixed'].includes(detected);
  if (needsV && !flags.V) {
    mode = 'symbolic';
    warnings.push('⚠️ الحجم غير معطى → سيتم الحل بالرموز فقط (Symbolic Mode).');
    hints.push('💡 ستظهر النتائج بدلالة V (مثال: x_f = [H₃O⁺] · V).');
  }

  // -------- Missing-data warnings --------
  if (detected === 'sigma') {
    if (!flags.lambdaCation || !flags.lambdaAnion) {
      warnings.push('⚠️ ينقص λ(الموجب) أو λ(السالب) لاستعمال صيغة الناقلية.');
    }
  }
  if (detected === 'Qr' && !flags.K) {
    warnings.push('⚠️ Q_r وحده لا يكفي — أدخل K للمقارنة.');
  }
  if (detected === 'pH' && flags.pH) {
    const pH = parseFloat(raw.pH || '');
    if (pH <= 0 || pH >= 14) warnings.push('⚠️ قيمة pH خارج المجال [0, 14].');
  }
  if (flags.C0 && parseFloat(raw.C0 || '') <= 0) {
    warnings.push('⚠️ التركيز C₀ يجب أن يكون موجباً.');
  }

  return {
    detectedType: detected,
    detectedLabel,
    requiredInputs: required,
    optionalInputs: optional,
    hiddenInputs: hidden,
    mode,
    solvingStrategy: strategy,
    warnings,
    hints,
  };
}

function manualConfig(userMode: UserMode, raw: RawInputs): InputConfig {
  const cfgMap: Record<Exclude<UserMode, 'auto'>, InputConfig> = {
    pH: {
      detectedType: 'pH',
      detectedLabel: 'وضع يدوي: حمض/أساس (pH)',
      requiredInputs: ['pH', 'C0'],
      optionalInputs: ['V', 'K'],
      hiddenInputs: ['sigma', 'lambdaCation', 'lambdaAnion', 'Vm', 'n0', 'Qr'],
      mode: has(raw.V) ? 'numeric' : 'symbolic',
      solvingStrategy: 'استعمل [H₃O⁺] = 10⁻ᵖᴴ ثم استنتج x_f و τ_f.',
      warnings: !has(raw.V) ? ['⚠️ الحجم غير معطى → حل رمزي.'] : [],
      hints: ['💡 [H₃O⁺] = 10⁻ᵖᴴ', '💡 τ_f = [H₃O⁺] / C₀ (للحمض الضعيف)'],
    },
    sigma: {
      detectedType: 'sigma',
      detectedLabel: 'وضع يدوي: ناقلية (σ)',
      requiredInputs: ['sigma', 'C0', 'lambdaCation', 'lambdaAnion'],
      optionalInputs: ['V', 'K'],
      hiddenInputs: ['pH', 'Vm', 'n0', 'Qr'],
      mode: has(raw.V) ? 'numeric' : 'symbolic',
      solvingStrategy: 'σ = Σ λ_i · [X_i].',
      warnings: !has(raw.V) ? ['⚠️ الحجم غير معطى → حل رمزي.'] : [],
      hints: ['💡 وحدة [X] في صيغة الناقلية mol/m³.'],
    },
    n: {
      detectedType: 'mole',
      detectedLabel: 'وضع يدوي: مولي (n)',
      requiredInputs: ['n0'],
      optionalInputs: ['V', 'K'],
      hiddenInputs: ['C0', 'pH', 'sigma', 'lambdaCation', 'lambdaAnion', 'Vm', 'Qr'],
      mode: 'numeric',
      solvingStrategy: 'استعمل n₀ مباشرة في جدول التقدم.',
      warnings: [],
      hints: ['💡 n₀ يحلّ محل C₀·V.'],
    },
    K: {
      detectedType: 'K',
      detectedLabel: 'وضع يدوي: تحليل K',
      requiredInputs: ['K'],
      optionalInputs: ['C0'],
      hiddenInputs: ['V', 'pH', 'sigma', 'lambdaCation', 'lambdaAnion', 'Vm', 'n0', 'Qr'],
      mode: 'qualitative',
      solvingStrategy: 'تحليل نوعي عبر K.',
      warnings: [],
      hints: ['💡 K > 10⁴ ⇒ تفاعل تام تقريباً.', '💡 K < 10⁻⁴ ⇒ تفاعل محدود.'],
    },
    Vm: {
      detectedType: 'gas',
      detectedLabel: 'وضع يدوي: غاز (Vm)',
      requiredInputs: ['Vm'],
      optionalInputs: ['V', 'n0'],
      hiddenInputs: ['pH', 'sigma', 'lambdaCation', 'lambdaAnion', 'C0', 'Qr'],
      mode: 'numeric',
      solvingStrategy: 'n = V / Vm.',
      warnings: [],
      hints: ['💡 في الشروط النظامية Vm ≈ 22.4 L/mol.'],
    },
    mixed: {
      detectedType: 'mixed',
      detectedLabel: 'وضع يدوي: مختلط',
      requiredInputs: ['C0'],
      optionalInputs: ['pH', 'sigma', 'V', 'K', 'Qr', 'lambdaCation', 'lambdaAnion', 'Vm', 'n0'],
      hiddenInputs: [],
      mode: 'numeric',
      solvingStrategy: 'استعمل أكثر من معطى للتحقق المتبادل.',
      warnings: [],
      hints: [],
    },
  };
  return cfgMap[userMode as Exclude<UserMode, 'auto'>];
}

/**
 * Localized labels for input keys (Arabic).
 */
export const inputLabels: Record<InputKey, { label: string; placeholder: string; hint?: string }> = {
  pH: { label: 'pH', placeholder: 'مثال: 3.4', hint: 'لحساب [H₃O⁺]' },
  C0: { label: 'التركيز الابتدائي C₀ (mol/L)', placeholder: '0.01' },
  V: { label: 'الحجم V (L)', placeholder: '0.1', hint: 'إذا غاب → حل رمزي' },
  sigma: { label: 'الناقلية σ (S/m)', placeholder: '0.05' },
  lambdaCation: { label: 'λ (الموجب) S·m²/mol', placeholder: '0.0350' },
  lambdaAnion: { label: 'λ (السالب) S·m²/mol', placeholder: '0.0041' },
  K: { label: 'ثابت التوازن K', placeholder: '1.6e-5' },
  Qr: { label: 'خارج التفاعل Q_r', placeholder: '1.5e-5', hint: 'من رسم بياني عادةً' },
  n0: { label: 'العدد الابتدائي n₀ (mol)', placeholder: '0.001' },
  Vm: { label: 'الحجم المولي Vm (L/mol)', placeholder: '22.4', hint: 'للغازات' },
};