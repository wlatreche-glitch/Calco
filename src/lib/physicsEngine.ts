// ============================================
// PHYSICS ENGINE - المحرك الفيزيائي الرئيسي
// ============================================

import { PHYSICS_CONSTANTS } from './physicsConstants';

// أنواع الحلول
export type PedagogyMode = 'learning' | 'revision' | 'exam';

// واجهة خطوة الحل
export interface SolutionStep {
  stepNumber: number;
  titleAr: string;
  titleFr: string;
  formula?: string;
  substitution?: string;
  result?: string;
  explanation?: string;
  tip?: string;
}

// واجهة النتيجة الفيزيائية
export interface PhysicsResult {
  value: number;
  unit: string;
  formula: string;
  steps: SolutionStep[];
  warnings: string[];
  bacTips: string[];
  physicalInterpretation: string;
}

// ============================================
// أداة 1: محلل الحركة (Motion Analyzer)
// ============================================

export interface MotionInput {
  type: 'MRU' | 'MRUA' | 'FREE_FALL' | 'VERTICAL_THROW';
  v0?: number;
  v?: number;
  a?: number;
  t?: number;
  x0?: number;
  x?: number;
  h?: number;
  g?: number;
  unknown: 'v' | 'v0' | 'a' | 't' | 'x' | 'h';
}

export interface MotionResult extends PhysicsResult {
  motionType: string;
  equations: {
    position: string;
    velocity: string;
    acceleration: string;
  };
  graphData: {
    time: number[];
    position: number[];
    velocity: number[];
    acceleration: number[];
  };
}

export function solveMotion(input: MotionInput, mode: PedagogyMode = 'learning'): MotionResult {
  const g = input.g ?? PHYSICS_CONSTANTS.g.value;
  const steps: SolutionStep[] = [];
  const warnings: string[] = [];
  const bacTips: string[] = [];
  
  let result = 0;
  let unit = '';
  let formula = '';
  let physicalInterpretation = '';
  let motionType = '';
  
  steps.push({
    stepNumber: 1,
    titleAr: 'استخراج المعطيات',
    titleFr: 'Extraction des données',
    explanation: formatGivenData(input),
  });
  
  switch (input.type) {
    case 'MRU':
      motionType = 'حركة مستقيمة منتظمة (MRU)';
      if (input.unknown === 'x' && input.v0 !== undefined && input.t !== undefined) {
        formula = 'x = x₀ + v₀ × t';
        const x0 = input.x0 ?? 0;
        result = x0 + input.v0 * input.t;
        unit = 'm';
        
        steps.push({
          stepNumber: 2,
          titleAr: 'اختيار القانون المناسب',
          titleFr: 'Choix de la loi appropriée',
          formula: formula,
        });
        
        steps.push({
          stepNumber: 3,
          titleAr: 'التعويض في القانون',
          titleFr: 'Substitution',
          substitution: `x = ${x0} + ${input.v0} × ${input.t}`,
        });
        
        steps.push({
          stepNumber: 4,
          titleAr: 'حساب النتيجة',
          titleFr: 'Calcul du résultat',
          result: `x = ${result.toFixed(2)} m`,
        });
        
        physicalInterpretation = `بعد ${input.t} ثانية، يكون الجسم على بعد ${result.toFixed(2)} متر`;
        bacTips.push('في MRU: الرسم البياني x(t) هو خط مستقيم');
      }
      break;
      
    case 'MRUA':
      motionType = 'حركة مستقيمة متغيرة بانتظام (MRUA)';
      const v0 = input.v0 ?? 0;
      const x0 = input.x0 ?? 0;
      const a = input.a ?? 0;
      
      if (input.unknown === 'v' && input.t !== undefined) {
        formula = 'v = v₀ + a × t';
        result = v0 + a * input.t;
        unit = 'm/s';
        
        steps.push({
          stepNumber: 2,
          titleAr: 'اختيار القانون',
          titleFr: 'Choix de la loi',
          formula: formula,
        });
        
        steps.push({
          stepNumber: 3,
          titleAr: 'التعويض',
          titleFr: 'Substitution',
          substitution: `v = ${v0} + ${a} × ${input.t}`,
        });
        
        steps.push({
          stepNumber: 4,
          titleAr: 'النتيجة',
          titleFr: 'Résultat',
          result: `v = ${result.toFixed(2)} m/s`,
        });
        
        physicalInterpretation = result > v0 
          ? `الجسم يتسارع، وصلت سرعته إلى ${result.toFixed(2)} m/s`
          : `الجسم يتباطأ، انخفضت سرعته إلى ${result.toFixed(2)} m/s`;
          
        bacTips.push('تذكر: إذا كان a و v₀ بنفس الإشارة = تسارع');
      }
      
      if (input.unknown === 'x' && input.t !== undefined) {
        formula = 'x = x₀ + v₀t + ½at²';
        result = x0 + v0 * input.t + 0.5 * a * input.t * input.t;
        unit = 'm';
        
        steps.push({
          stepNumber: 2,
          titleAr: 'اختيار القانون',
          titleFr: 'Choix de la loi',
          formula: formula,
        });
        
        steps.push({
          stepNumber: 3,
          titleAr: 'التعويض',
          titleFr: 'Substitution',
          substitution: `x = ${x0} + ${v0} × ${input.t} + ½ × ${a} × ${input.t}²`,
        });
        
        steps.push({
          stepNumber: 4,
          titleAr: 'النتيجة',
          titleFr: 'Résultat',
          result: `x = ${result.toFixed(2)} m`,
        });
        
        physicalInterpretation = `بعد ${input.t} ثانية، يكون موضع الجسم عند ${result.toFixed(2)} متر`;
      }
      break;
      
    case 'FREE_FALL':
      motionType = 'سقوط حر (Chute libre)';
      
      if (input.unknown === 'v' && input.t !== undefined) {
        formula = 'v = g × t';
        result = g * input.t;
        unit = 'm/s';
        
        steps.push({
          stepNumber: 2,
          titleAr: 'اختيار القانون',
          titleFr: 'Choix de la loi',
          formula: formula,
        });
        
        steps.push({
          stepNumber: 3,
          titleAr: 'التعويض',
          titleFr: 'Substitution',
          substitution: `v = ${g} × ${input.t}`,
        });
        
        steps.push({
          stepNumber: 4,
          titleAr: 'النتيجة',
          titleFr: 'Résultat',
          result: `v = ${result.toFixed(2)} m/s`,
        });
        
        physicalInterpretation = `بعد ${input.t} ثانية من السقوط، تصل سرعة الجسم إلى ${result.toFixed(2)} m/s`;
        bacTips.push('في السقوط الحر: نهمل مقاومة الهواء');
      }
      
      if (input.unknown === 'h' && input.t !== undefined) {
        formula = 'h = ½ × g × t²';
        result = 0.5 * g * input.t * input.t;
        unit = 'm';
        
        steps.push({
          stepNumber: 2,
          titleAr: 'اختيار القانون',
          titleFr: 'Choix de la loi',
          formula: formula,
        });
        
        steps.push({
          stepNumber: 3,
          titleAr: 'التعويض',
          titleFr: 'Substitution',
          substitution: `h = ½ × ${g} × ${input.t}²`,
        });
        
        steps.push({
          stepNumber: 4,
          titleAr: 'النتيجة',
          titleFr: 'Résultat',
          result: `h = ${result.toFixed(2)} m`,
        });
      }
      
      if (input.unknown === 't' && input.h !== undefined) {
        formula = 't = √(2h/g)';
        result = Math.sqrt(2 * input.h / g);
        unit = 's';
        
        steps.push({
          stepNumber: 2,
          titleAr: 'اختيار القانون',
          titleFr: 'Choix de la loi',
          formula: 'h = ½gt² → ' + formula,
        });
        
        steps.push({
          stepNumber: 3,
          titleAr: 'التعويض',
          titleFr: 'Substitution',
          substitution: `t = √(2 × ${input.h} / ${g})`,
        });
        
        steps.push({
          stepNumber: 4,
          titleAr: 'النتيجة',
          titleFr: 'Résultat',
          result: `t = ${result.toFixed(2)} s`,
        });
      }
      break;
      
    case 'VERTICAL_THROW':
      motionType = 'رمي شاقولي (Lancer vertical)';
      const vInit = input.v0 ?? 0;
      
      if (input.unknown === 'h' && input.v0 !== undefined) {
        formula = 'h_max = v₀² / (2g)';
        result = (vInit * vInit) / (2 * g);
        unit = 'm';
        
        steps.push({
          stepNumber: 2,
          titleAr: 'اختيار القانون',
          titleFr: 'Choix de la loi',
          formula: formula,
          explanation: 'عند الارتفاع الأقصى، v = 0',
        });
        
        steps.push({
          stepNumber: 3,
          titleAr: 'التعويض',
          titleFr: 'Substitution',
          substitution: `h_max = ${vInit}² / (2 × ${g})`,
        });
        
        steps.push({
          stepNumber: 4,
          titleAr: 'النتيجة',
          titleFr: 'Résultat',
          result: `h_max = ${result.toFixed(2)} m`,
        });
        
        physicalInterpretation = `الجسم يصل إلى ارتفاع أقصى ${result.toFixed(2)} متر`;
        bacTips.push('عند الارتفاع الأقصى: السرعة = 0');
      }
      break;
  }
  
  const graphData = generateMotionGraphData(input, result, unit);
  const finalSteps = filterStepsByMode(steps, mode);
  
  return {
    value: result,
    unit,
    formula,
    steps: finalSteps,
    warnings,
    bacTips,
    physicalInterpretation,
    motionType,
    equations: getMotionEquations(input.type),
    graphData,
  };
}

// ============================================
// أداة 2: حلال الدارات الكهربائية (DC Circuits)
// ============================================

export interface CircuitInput {
  type: 'OHM' | 'SERIES' | 'PARALLEL' | 'KIRCHHOFF';
  resistances?: number[];
  voltage?: number;
  current?: number;
  power?: number;
  unknown: 'R' | 'U' | 'I' | 'P' | 'Req';
}

export interface CircuitResult extends PhysicsResult {
  circuitType: string;
  equivalentResistance?: number;
  totalCurrent?: number;
  voltageDrops?: number[];
  currents?: number[];
}

export function solveCircuit(input: CircuitInput, mode: PedagogyMode = 'learning'): CircuitResult {
  const steps: SolutionStep[] = [];
  const warnings: string[] = [];
  const bacTips: string[] = [];
  
  let result = 0;
  let unit = '';
  let formula = '';
  let physicalInterpretation = '';
  let circuitType = '';
  let equivalentResistance: number | undefined;
  let totalCurrent: number | undefined;
  let voltageDrops: number[] | undefined;
  let currents: number[] | undefined;
  
  steps.push({
    stepNumber: 1,
    titleAr: 'استخراج المعطيات',
    titleFr: 'Extraction des données',
    explanation: formatCircuitData(input),
  });
  
  switch (input.type) {
    case 'OHM':
      circuitType = "قانون أوم (Loi d'Ohm)";
      
      if (input.unknown === 'U' && input.current !== undefined && input.resistances?.[0] !== undefined) {
        formula = 'U = R × I';
        result = input.resistances[0] * input.current;
        unit = 'V';
        
        steps.push({
          stepNumber: 2,
          titleAr: 'تطبيق قانون أوم',
          titleFr: "Application de la loi d'Ohm",
          formula: formula,
        });
        
        steps.push({
          stepNumber: 3,
          titleAr: 'التعويض',
          titleFr: 'Substitution',
          substitution: `U = ${input.resistances[0]} × ${input.current}`,
        });
        
        steps.push({
          stepNumber: 4,
          titleAr: 'النتيجة',
          titleFr: 'Résultat',
          result: `U = ${result.toFixed(2)} V`,
        });
        
        physicalInterpretation = `التوتر على طرفي المقاومة يساوي ${result.toFixed(2)} فولت`;
      }
      
      if (input.unknown === 'I' && input.voltage !== undefined && input.resistances?.[0] !== undefined) {
        formula = 'I = U / R';
        result = input.voltage / input.resistances[0];
        unit = 'A';
        
        steps.push({
          stepNumber: 2,
          titleAr: 'تطبيق قانون أوم',
          titleFr: "Application de la loi d'Ohm",
          formula: formula,
        });
        
        steps.push({
          stepNumber: 3,
          titleAr: 'التعويض',
          titleFr: 'Substitution',
          substitution: `I = ${input.voltage} / ${input.resistances[0]}`,
        });
        
        steps.push({
          stepNumber: 4,
          titleAr: 'النتيجة',
          titleFr: 'Résultat',
          result: `I = ${result.toFixed(3)} A = ${(result * 1000).toFixed(1)} mA`,
        });
        
        physicalInterpretation = `شدة التيار المار في الدارة تساوي ${result.toFixed(3)} أمبير`;
        bacTips.push('تذكر: التيار يسري من القطب + إلى القطب - خارج المولد');
      }
      
      if (input.unknown === 'R' && input.voltage !== undefined && input.current !== undefined) {
        formula = 'R = U / I';
        result = input.voltage / input.current;
        unit = 'Ω';
        
        steps.push({
          stepNumber: 2,
          titleAr: 'تطبيق قانون أوم',
          titleFr: "Application de la loi d'Ohm",
          formula: formula,
        });
        
        steps.push({
          stepNumber: 3,
          titleAr: 'التعويض',
          titleFr: 'Substitution',
          substitution: `R = ${input.voltage} / ${input.current}`,
        });
        
        steps.push({
          stepNumber: 4,
          titleAr: 'النتيجة',
          titleFr: 'Résultat',
          result: `R = ${result.toFixed(2)} Ω`,
        });
      }
      
      if (input.unknown === 'P' && input.voltage !== undefined && input.current !== undefined) {
        formula = 'P = U × I';
        result = input.voltage * input.current;
        unit = 'W';
        
        steps.push({
          stepNumber: 2,
          titleAr: 'حساب القدرة',
          titleFr: 'Calcul de la puissance',
          formula: formula,
        });
        
        steps.push({
          stepNumber: 3,
          titleAr: 'التعويض',
          titleFr: 'Substitution',
          substitution: `P = ${input.voltage} × ${input.current}`,
        });
        
        steps.push({
          stepNumber: 4,
          titleAr: 'النتيجة',
          titleFr: 'Résultat',
          result: `P = ${result.toFixed(2)} W`,
        });
      }
      break;
      
    case 'SERIES':
      circuitType = 'ربط على التوالي (Association en série)';
      
      if (input.resistances && input.resistances.length > 0) {
        equivalentResistance = input.resistances.reduce((sum, r) => sum + r, 0);
        
        steps.push({
          stepNumber: 2,
          titleAr: 'حساب المقاومة المكافئة',
          titleFr: 'Calcul de la résistance équivalente',
          formula: 'Req = R₁ + R₂ + R₃ + ...',
        });
        
        steps.push({
          stepNumber: 3,
          titleAr: 'التعويض',
          titleFr: 'Substitution',
          substitution: `Req = ${input.resistances.join(' + ')}`,
        });
        
        steps.push({
          stepNumber: 4,
          titleAr: 'النتيجة',
          titleFr: 'Résultat',
          result: `Req = ${equivalentResistance.toFixed(2)} Ω`,
        });
        
        if (input.voltage !== undefined) {
          totalCurrent = input.voltage / equivalentResistance;
          voltageDrops = input.resistances.map(r => totalCurrent! * r);
          
          steps.push({
            stepNumber: 5,
            titleAr: 'حساب التيار الكلي',
            titleFr: 'Calcul du courant total',
            formula: 'I = U / Req',
            result: `I = ${totalCurrent.toFixed(3)} A`,
          });
        }
        
        result = equivalentResistance;
        unit = 'Ω';
        formula = 'Req = R₁ + R₂ + ...';
        
        physicalInterpretation = `المقاومة المكافئة ${equivalentResistance.toFixed(2)} Ω`;
        bacTips.push('في التوالي: نفس التيار، التوترات تُجمع');
      }
      break;
      
    case 'PARALLEL':
      circuitType = 'ربط على التوازي (Association en parallèle)';
      
      if (input.resistances && input.resistances.length > 0) {
        const sumInverse = input.resistances.reduce((sum, r) => sum + 1 / r, 0);
        equivalentResistance = 1 / sumInverse;
        
        steps.push({
          stepNumber: 2,
          titleAr: 'حساب المقاومة المكافئة',
          titleFr: 'Calcul de la résistance équivalente',
          formula: '1/Req = 1/R₁ + 1/R₂ + ...',
        });
        
        steps.push({
          stepNumber: 3,
          titleAr: 'التعويض',
          titleFr: 'Substitution',
          substitution: `1/Req = ${input.resistances.map(r => `1/${r}`).join(' + ')}`,
        });
        
        steps.push({
          stepNumber: 4,
          titleAr: 'النتيجة',
          titleFr: 'Résultat',
          result: `Req = ${equivalentResistance.toFixed(2)} Ω`,
        });
        
        if (input.voltage !== undefined) {
          totalCurrent = input.voltage / equivalentResistance;
          currents = input.resistances.map(r => input.voltage! / r);
        }
        
        result = equivalentResistance;
        unit = 'Ω';
        formula = '1/Req = 1/R₁ + 1/R₂ + ...';
        
        physicalInterpretation = `المقاومة المكافئة ${equivalentResistance.toFixed(2)} Ω`;
        bacTips.push('في التوازي: نفس التوتر، التيارات تُجمع');
      }
      break;
  }
  
  const finalSteps = filterStepsByMode(steps, mode);
  
  return {
    value: result,
    unit,
    formula,
    steps: finalSteps,
    warnings,
    bacTips,
    physicalInterpretation,
    circuitType,
    equivalentResistance,
    totalCurrent,
    voltageDrops,
    currents,
  };
}

// ============================================
// أداة 3: محلل الذبذبات والأمواج
// ============================================

export interface OscillationInput {
  type: 'SIMPLE_HARMONIC' | 'WAVE' | 'PENDULUM' | 'SPRING';
  frequency?: number;
  period?: number;
  wavelength?: number;
  velocity?: number;
  amplitude?: number;
  mass?: number;
  springConstant?: number;
  length?: number;
  unknown: 'f' | 'T' | 'λ' | 'v' | 'ω' | 'k' | 'L';
}

export interface OscillationResult extends PhysicsResult {
  oscillationType: string;
  waveEquation?: string;
  angularFrequency?: number;
}

export function solveOscillation(input: OscillationInput, mode: PedagogyMode = 'learning'): OscillationResult {
  const g = PHYSICS_CONSTANTS.g.value;
  const steps: SolutionStep[] = [];
  const warnings: string[] = [];
  const bacTips: string[] = [];
  
  let result = 0;
  let unit = '';
  let formula = '';
  let physicalInterpretation = '';
  let oscillationType = '';
  let angularFrequency: number | undefined;
  let waveEquation: string | undefined;
  
  steps.push({
    stepNumber: 1,
    titleAr: 'استخراج المعطيات',
    titleFr: 'Extraction des données',
    explanation: formatOscillationData(input),
  });
  
  switch (input.type) {
    case 'SIMPLE_HARMONIC':
      oscillationType = 'حركة توافقية بسيطة (MHS)';
      
      if (input.unknown === 'T' && input.frequency !== undefined) {
        formula = 'T = 1/f';
        result = 1 / input.frequency;
        unit = 's';
        
        steps.push({
          stepNumber: 2,
          titleAr: 'العلاقة بين الدور والتردد',
          titleFr: 'Relation période-fréquence',
          formula: formula,
        });
        
        steps.push({
          stepNumber: 3,
          titleAr: 'التعويض',
          titleFr: 'Substitution',
          substitution: `T = 1 / ${input.frequency}`,
        });
        
        steps.push({
          stepNumber: 4,
          titleAr: 'النتيجة',
          titleFr: 'Résultat',
          result: `T = ${result.toFixed(4)} s`,
        });
        
        angularFrequency = 2 * Math.PI * input.frequency;
        physicalInterpretation = `دور الذبذبة ${result.toFixed(4)} ثانية`;
      }
      
      if (input.unknown === 'f' && input.period !== undefined) {
        formula = 'f = 1/T';
        result = 1 / input.period;
        unit = 'Hz';
        
        steps.push({
          stepNumber: 2,
          titleAr: 'العلاقة بين التردد والدور',
          titleFr: 'Relation fréquence-période',
          formula: formula,
          substitution: `f = 1 / ${input.period}`,
          result: `f = ${result.toFixed(2)} Hz`,
        });
        
        physicalInterpretation = `تردد الذبذبة ${result.toFixed(2)} هرتز`;
      }
      
      if (input.unknown === 'ω') {
        if (input.frequency !== undefined) {
          formula = 'ω = 2πf';
          result = 2 * Math.PI * input.frequency;
          unit = 'rad/s';
          
          steps.push({
            stepNumber: 2,
            titleAr: 'حساب النبض',
            titleFr: 'Calcul de la pulsation',
            formula: formula,
            substitution: `ω = 2π × ${input.frequency}`,
            result: `ω = ${result.toFixed(2)} rad/s`,
          });
        } else if (input.period !== undefined) {
          formula = 'ω = 2π/T';
          result = 2 * Math.PI / input.period;
          unit = 'rad/s';
          
          steps.push({
            stepNumber: 2,
            titleAr: 'حساب النبض',
            titleFr: 'Calcul de la pulsation',
            formula: formula,
            substitution: `ω = 2π / ${input.period}`,
            result: `ω = ${result.toFixed(2)} rad/s`,
          });
        }
        
        angularFrequency = result;
        bacTips.push('النبض ω يستخدم في معادلات الحركة: x(t) = A·cos(ωt + φ)');
      }
      break;
      
    case 'WAVE':
      oscillationType = 'موجة (Onde)';
      
      if (input.unknown === 'v' && input.frequency !== undefined && input.wavelength !== undefined) {
        formula = 'v = λ × f';
        result = input.wavelength * input.frequency;
        unit = 'm/s';
        
        steps.push({
          stepNumber: 2,
          titleAr: 'العلاقة الأساسية للأمواج',
          titleFr: 'Relation fondamentale des ondes',
          formula: formula,
        });
        
        steps.push({
          stepNumber: 3,
          titleAr: 'التعويض',
          titleFr: 'Substitution',
          substitution: `v = ${input.wavelength} × ${input.frequency}`,
        });
        
        steps.push({
          stepNumber: 4,
          titleAr: 'النتيجة',
          titleFr: 'Résultat',
          result: `v = ${result.toFixed(2)} m/s`,
        });
        
        physicalInterpretation = `سرعة انتشار الموجة ${result.toFixed(2)} m/s`;
        bacTips.push('سرعة الموجة تعتمد على خصائص الوسط');
      }
      
      if (input.unknown === 'λ') {
        if (input.velocity !== undefined && input.frequency !== undefined) {
          formula = 'λ = v / f';
          result = input.velocity / input.frequency;
          unit = 'm';
          
          steps.push({
            stepNumber: 2,
            titleAr: 'حساب طول الموجة',
            titleFr: "Calcul de la longueur d'onde",
            formula: formula,
            substitution: `λ = ${input.velocity} / ${input.frequency}`,
            result: `λ = ${result.toFixed(4)} m`,
          });
        } else if (input.velocity !== undefined && input.period !== undefined) {
          formula = 'λ = v × T';
          result = input.velocity * input.period;
          unit = 'm';
          
          steps.push({
            stepNumber: 2,
            titleAr: 'حساب طول الموجة',
            titleFr: "Calcul de la longueur d'onde",
            formula: formula,
            substitution: `λ = ${input.velocity} × ${input.period}`,
            result: `λ = ${result.toFixed(4)} m`,
          });
        }
        
        physicalInterpretation = `طول الموجة ${result.toFixed(4)} م`;
      }
      
      if (input.unknown === 'f' && input.velocity !== undefined && input.wavelength !== undefined) {
        formula = 'f = v / λ';
        result = input.velocity / input.wavelength;
        unit = 'Hz';
        
        steps.push({
          stepNumber: 2,
          titleAr: 'حساب التردد',
          titleFr: 'Calcul de la fréquence',
          formula: formula,
          substitution: `f = ${input.velocity} / ${input.wavelength}`,
          result: `f = ${result.toFixed(2)} Hz`,
        });
      }
      break;
      
    case 'PENDULUM':
      oscillationType = 'نواس بسيط (Pendule simple)';
      
      if (input.unknown === 'T' && input.length !== undefined) {
        formula = 'T = 2π√(L/g)';
        result = 2 * Math.PI * Math.sqrt(input.length / g);
        unit = 's';
        
        steps.push({
          stepNumber: 2,
          titleAr: 'دور النواس البسيط',
          titleFr: 'Période du pendule simple',
          formula: formula,
        });
        
        steps.push({
          stepNumber: 3,
          titleAr: 'التعويض',
          titleFr: 'Substitution',
          substitution: `T = 2π√(${input.length} / ${g})`,
        });
        
        steps.push({
          stepNumber: 4,
          titleAr: 'النتيجة',
          titleFr: 'Résultat',
          result: `T = ${result.toFixed(3)} s`,
        });
        
        physicalInterpretation = `دور النواس ${result.toFixed(3)} ثانية`;
        bacTips.push('شروط النواس البسيط: زاوية صغيرة (< 10°)');
      }
      
      if (input.unknown === 'L' && input.period !== undefined) {
        formula = 'L = g × (T/2π)²';
        result = g * Math.pow(input.period / (2 * Math.PI), 2);
        unit = 'm';
        
        steps.push({
          stepNumber: 2,
          titleAr: 'حساب طول النواس',
          titleFr: 'Calcul de la longueur du pendule',
          formula: formula,
          substitution: `L = ${g} × (${input.period}/(2π))²`,
          result: `L = ${result.toFixed(3)} m`,
        });
      }
      break;
      
    case 'SPRING':
      oscillationType = 'جملة {نابض - كتلة}';
      
      if (input.unknown === 'T' && input.mass !== undefined && input.springConstant !== undefined) {
        formula = 'T = 2π√(m/k)';
        result = 2 * Math.PI * Math.sqrt(input.mass / input.springConstant);
        unit = 's';
        
        steps.push({
          stepNumber: 2,
          titleAr: 'دور جملة نابض-كتلة',
          titleFr: 'Période du système masse-ressort',
          formula: formula,
        });
        
        steps.push({
          stepNumber: 3,
          titleAr: 'التعويض',
          titleFr: 'Substitution',
          substitution: `T = 2π√(${input.mass} / ${input.springConstant})`,
        });
        
        steps.push({
          stepNumber: 4,
          titleAr: 'النتيجة',
          titleFr: 'Résultat',
          result: `T = ${result.toFixed(3)} s`,
        });
        
        angularFrequency = 2 * Math.PI / result;
        physicalInterpretation = `دور الذبذبة ${result.toFixed(3)} ثانية`;
      }
      
      if (input.unknown === 'k' && input.mass !== undefined && input.period !== undefined) {
        formula = 'k = m × (2π/T)²';
        result = input.mass * Math.pow(2 * Math.PI / input.period, 2);
        unit = 'N/m';
        
        steps.push({
          stepNumber: 2,
          titleAr: 'حساب ثابت الصلابة',
          titleFr: 'Calcul de la constante de raideur',
          formula: formula,
          substitution: `k = ${input.mass} × (2π/${input.period})²`,
          result: `k = ${result.toFixed(2)} N/m`,
        });
      }
      break;
  }
  
  if (input.amplitude !== undefined && angularFrequency) {
    waveEquation = `x(t) = ${input.amplitude} × cos(${angularFrequency.toFixed(2)}t + φ)`;
  }
  
  const finalSteps = filterStepsByMode(steps, mode);
  
  return {
    value: result,
    unit,
    formula,
    steps: finalSteps,
    warnings,
    bacTips,
    physicalInterpretation,
    oscillationType,
    waveEquation,
    angularFrequency,
  };
}

// ============================================
// دوال مساعدة
// ============================================

function formatGivenData(input: MotionInput): string {
  const parts: string[] = [];
  if (input.v0 !== undefined) parts.push(`v₀ = ${input.v0} m/s`);
  if (input.v !== undefined) parts.push(`v = ${input.v} m/s`);
  if (input.a !== undefined) parts.push(`a = ${input.a} m/s²`);
  if (input.t !== undefined) parts.push(`t = ${input.t} s`);
  if (input.x0 !== undefined) parts.push(`x₀ = ${input.x0} m`);
  if (input.x !== undefined) parts.push(`x = ${input.x} m`);
  if (input.h !== undefined) parts.push(`h = ${input.h} m`);
  return parts.join(' | ');
}

function formatCircuitData(input: CircuitInput): string {
  const parts: string[] = [];
  if (input.resistances) parts.push(`R = [${input.resistances.join(', ')}] Ω`);
  if (input.voltage !== undefined) parts.push(`U = ${input.voltage} V`);
  if (input.current !== undefined) parts.push(`I = ${input.current} A`);
  if (input.power !== undefined) parts.push(`P = ${input.power} W`);
  return parts.join(' | ');
}

function formatOscillationData(input: OscillationInput): string {
  const parts: string[] = [];
  if (input.frequency !== undefined) parts.push(`f = ${input.frequency} Hz`);
  if (input.period !== undefined) parts.push(`T = ${input.period} s`);
  if (input.wavelength !== undefined) parts.push(`λ = ${input.wavelength} m`);
  if (input.velocity !== undefined) parts.push(`v = ${input.velocity} m/s`);
  if (input.amplitude !== undefined) parts.push(`A = ${input.amplitude} m`);
  if (input.mass !== undefined) parts.push(`m = ${input.mass} kg`);
  if (input.springConstant !== undefined) parts.push(`k = ${input.springConstant} N/m`);
  if (input.length !== undefined) parts.push(`L = ${input.length} m`);
  return parts.join(' | ');
}

function getMotionEquations(type: MotionInput['type']): MotionResult['equations'] {
  switch (type) {
    case 'MRU':
      return {
        position: 'x(t) = x₀ + v₀t',
        velocity: 'v(t) = v₀ = cste',
        acceleration: 'a(t) = 0',
      };
    case 'MRUA':
      return {
        position: 'x(t) = x₀ + v₀t + ½at²',
        velocity: 'v(t) = v₀ + at',
        acceleration: 'a(t) = a = cste',
      };
    case 'FREE_FALL':
      return {
        position: 'h(t) = ½gt²',
        velocity: 'v(t) = gt',
        acceleration: 'a(t) = g = 9.8 m/s²',
      };
    case 'VERTICAL_THROW':
      return {
        position: 'h(t) = v₀t - ½gt²',
        velocity: 'v(t) = v₀ - gt',
        acceleration: 'a(t) = -g',
      };
  }
}

function generateMotionGraphData(input: MotionInput, result: number, unit: string): MotionResult['graphData'] {
  const timeMax = input.t ?? 10;
  const numPoints = 50;
  const dt = timeMax / numPoints;
  
  const time: number[] = [];
  const position: number[] = [];
  const velocity: number[] = [];
  const acceleration: number[] = [];
  
  const v0 = input.v0 ?? 0;
  const x0 = input.x0 ?? 0;
  const a = input.a ?? (input.type === 'FREE_FALL' ? PHYSICS_CONSTANTS.g.value : 0);
  
  for (let i = 0; i <= numPoints; i++) {
    const t = i * dt;
    time.push(t);
    
    switch (input.type) {
      case 'MRU':
        position.push(x0 + v0 * t);
        velocity.push(v0);
        acceleration.push(0);
        break;
      case 'MRUA':
        position.push(x0 + v0 * t + 0.5 * a * t * t);
        velocity.push(v0 + a * t);
        acceleration.push(a);
        break;
      case 'FREE_FALL':
        position.push(0.5 * PHYSICS_CONSTANTS.g.value * t * t);
        velocity.push(PHYSICS_CONSTANTS.g.value * t);
        acceleration.push(PHYSICS_CONSTANTS.g.value);
        break;
      case 'VERTICAL_THROW':
        const g = PHYSICS_CONSTANTS.g.value;
        position.push(v0 * t - 0.5 * g * t * t);
        velocity.push(v0 - g * t);
        acceleration.push(-g);
        break;
    }
  }
  
  return { time, position, velocity, acceleration };
}

function filterStepsByMode(steps: SolutionStep[], mode: PedagogyMode): SolutionStep[] {
  switch (mode) {
    case 'exam':
      return steps.filter(s => s.stepNumber === 1 || s.result);
    case 'revision':
      return steps.map(s => ({ ...s, explanation: undefined, tip: undefined }));
    case 'learning':
    default:
      return steps;
  }
}
