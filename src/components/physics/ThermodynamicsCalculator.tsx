import { useState } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Play, RotateCcw, Info, Lightbulb, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PedagogyMode } from '@/lib/physicsEngine';
import { PHYSICS_CONSTANTS } from '@/lib/physicsConstants';

interface Props {
  mode: PedagogyMode;
}

type ThermodynamicsType = 'HEAT_TRANSFER' | 'WORK' | 'FIRST_LAW' | 'EFFICIENCY' | 'IDEAL_GAS' | 'PHASE_CHANGE';
type UnknownVar = 'Q' | 'W' | 'ΔU' | 'η' | 'P' | 'V' | 'T' | 'n' | 'm' | 'L';

interface SolutionStep {
  stepNumber: number;
  titleAr: string;
  titleFr: string;
  formula?: string;
  substitution?: string;
  result?: string;
  explanation?: string;
}

interface ThermodynamicsResult {
  value: number;
  unit: string;
  formula: string;
  steps: SolutionStep[];
  warnings: string[];
  bacTips: string[];
  physicalInterpretation: string;
  calculationType: string;
}

const thermodynamicsTypes = [
  { value: 'HEAT_TRANSFER', label: 'انتقال الحرارة', labelFr: 'Transfert de chaleur' },
  { value: 'WORK', label: 'العمل الترموديناميكي', labelFr: 'Travail thermodynamique' },
  { value: 'FIRST_LAW', label: 'المبدأ الأول', labelFr: 'Premier principe' },
  { value: 'EFFICIENCY', label: 'المردود (الكفاءة)', labelFr: 'Rendement' },
  { value: 'IDEAL_GAS', label: 'قانون الغاز المثالي', labelFr: 'Loi des gaz parfaits' },
  { value: 'PHASE_CHANGE', label: 'تغير الحالة', labelFr: 'Changement de phase' },
];

// السعات الحرارية الشائعة (J/(kg·K))
const specificHeats: Record<string, { value: number; nameAr: string }> = {
  water: { value: 4186, nameAr: 'الماء' },
  ice: { value: 2090, nameAr: 'الجليد' },
  steam: { value: 2010, nameAr: 'بخار الماء' },
  aluminum: { value: 897, nameAr: 'الألومنيوم' },
  copper: { value: 385, nameAr: 'النحاس' },
  iron: { value: 449, nameAr: 'الحديد' },
  air: { value: 1005, nameAr: 'الهواء' },
};

// حرارات التحول (J/kg)
const latentHeats: Record<string, { fusion: number; vaporization: number; nameAr: string }> = {
  water: { fusion: 334000, vaporization: 2260000, nameAr: 'الماء' },
};

export default function ThermodynamicsCalculator({ mode }: Props) {
  const [calculationType, setCalculationType] = useState<ThermodynamicsType>('HEAT_TRANSFER');
  const [unknown, setUnknown] = useState<UnknownVar>('Q');
  
  // المتغيرات
  const [mass, setMass] = useState<string>('');
  const [specificHeat, setSpecificHeat] = useState<string>('4186');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('water');
  const [deltaT, setDeltaT] = useState<string>('');
  const [T1, setT1] = useState<string>('');
  const [T2, setT2] = useState<string>('');
  const [Q, setQ] = useState<string>('');
  const [W, setW] = useState<string>('');
  const [deltaU, setDeltaU] = useState<string>('');
  const [P, setP] = useState<string>('');
  const [V1, setV1] = useState<string>('');
  const [V2, setV2] = useState<string>('');
  const [n, setN] = useState<string>('');
  const [V, setV] = useState<string>('');
  const [T, setT] = useState<string>('');
  const [Qh, setQh] = useState<string>('');
  const [Qc, setQc] = useState<string>('');
  const [Th, setTh] = useState<string>('');
  const [Tc, setTc] = useState<string>('');
  const [phaseChange, setPhaseChange] = useState<'fusion' | 'vaporization'>('fusion');
  
  const [result, setResult] = useState<ThermodynamicsResult | null>(null);

  const getAvailableUnknowns = (): { value: UnknownVar; label: string }[] => {
    switch (calculationType) {
      case 'HEAT_TRANSFER':
        return [
          { value: 'Q', label: 'الحرارة Q' },
          { value: 'm', label: 'الكتلة m' },
          { value: 'ΔU', label: 'تغير درجة الحرارة ΔT' },
        ];
      case 'WORK':
        return [
          { value: 'W', label: 'العمل W' },
          { value: 'P', label: 'الضغط P' },
          { value: 'V', label: 'تغير الحجم ΔV' },
        ];
      case 'FIRST_LAW':
        return [
          { value: 'ΔU', label: 'تغير الطاقة الداخلية ΔU' },
          { value: 'Q', label: 'الحرارة Q' },
          { value: 'W', label: 'العمل W' },
        ];
      case 'EFFICIENCY':
        return [
          { value: 'η', label: 'المردود η' },
        ];
      case 'IDEAL_GAS':
        return [
          { value: 'P', label: 'الضغط P' },
          { value: 'V', label: 'الحجم V' },
          { value: 'T', label: 'درجة الحرارة T' },
          { value: 'n', label: 'كمية المادة n' },
        ];
      case 'PHASE_CHANGE':
        return [
          { value: 'Q', label: 'الحرارة Q' },
          { value: 'm', label: 'الكتلة m' },
          { value: 'L', label: 'حرارة التحول L' },
        ];
      default:
        return [];
    }
  };

  const handleCalculate = () => {
    const steps: SolutionStep[] = [];
    const warnings: string[] = [];
    const bacTips: string[] = [];
    let resultValue = 0;
    let unit = '';
    let formula = '';
    let physicalInterpretation = '';
    let calcType = '';

    const R = PHYSICS_CONSTANTS.R.value; // 8.314 J/(mol·K)

    switch (calculationType) {
      case 'HEAT_TRANSFER':
        calcType = 'انتقال الحرارة';
        const m_ht = parseFloat(mass);
        const c = parseFloat(specificHeat);
        const dT = deltaT ? parseFloat(deltaT) : (parseFloat(T2) - parseFloat(T1));
        
        steps.push({
          stepNumber: 1,
          titleAr: 'استخراج المعطيات',
          titleFr: 'Extraction des données',
          explanation: `m = ${m_ht} kg | c = ${c} J/(kg·K) | ΔT = ${dT} K`,
        });

        if (unknown === 'Q') {
          formula = 'Q = m × c × ΔT';
          resultValue = m_ht * c * dT;
          unit = 'J';
          
          steps.push({
            stepNumber: 2,
            titleAr: 'تطبيق قانون انتقال الحرارة',
            titleFr: 'Application de la loi de transfert de chaleur',
            formula: formula,
          });
          
          steps.push({
            stepNumber: 3,
            titleAr: 'التعويض',
            titleFr: 'Substitution',
            substitution: `Q = ${m_ht} × ${c} × ${dT}`,
          });
          
          steps.push({
            stepNumber: 4,
            titleAr: 'النتيجة',
            titleFr: 'Résultat',
            result: `Q = ${resultValue.toFixed(2)} J = ${(resultValue / 1000).toFixed(2)} kJ`,
          });
          
          physicalInterpretation = resultValue > 0 
            ? `الجسم يكتسب ${Math.abs(resultValue).toFixed(0)} جول من الحرارة`
            : `الجسم يفقد ${Math.abs(resultValue).toFixed(0)} جول من الحرارة`;
          
          bacTips.push('Q > 0: الجسم يكتسب حرارة | Q < 0: الجسم يفقد حرارة');
        } else if (unknown === 'm') {
          formula = 'm = Q / (c × ΔT)';
          const Q_val = parseFloat(Q);
          resultValue = Q_val / (c * dT);
          unit = 'kg';
          
          steps.push({
            stepNumber: 2,
            titleAr: 'استخراج الكتلة من القانون',
            titleFr: 'Extraction de la masse',
            formula: formula,
            substitution: `m = ${Q_val} / (${c} × ${dT})`,
            result: `m = ${resultValue.toFixed(3)} kg`,
          });
        }
        break;

      case 'WORK':
        calcType = 'العمل الترموديناميكي';
        const P_w = parseFloat(P);
        const dV = parseFloat(V2) - parseFloat(V1);
        
        steps.push({
          stepNumber: 1,
          titleAr: 'استخراج المعطيات',
          titleFr: 'Extraction des données',
          explanation: `P = ${P_w} Pa | V₁ = ${V1} m³ | V₂ = ${V2} m³`,
        });

        if (unknown === 'W') {
          formula = 'W = -P × ΔV = -P × (V₂ - V₁)';
          resultValue = -P_w * dV;
          unit = 'J';
          
          steps.push({
            stepNumber: 2,
            titleAr: 'حساب العمل (تحول متساوي الضغط)',
            titleFr: 'Calcul du travail (transformation isobare)',
            formula: formula,
            explanation: 'الإشارة السالبة لأن العمل يُحسب على الجملة',
          });
          
          steps.push({
            stepNumber: 3,
            titleAr: 'التعويض',
            titleFr: 'Substitution',
            substitution: `W = -${P_w} × (${V2} - ${V1})`,
            result: `W = ${resultValue.toFixed(2)} J`,
          });
          
          physicalInterpretation = resultValue > 0 
            ? `الجملة تستقبل عملاً (ضغط): ${resultValue.toFixed(2)} J`
            : `الجملة تقدم عملاً (تمدد): ${Math.abs(resultValue).toFixed(2)} J`;
          
          bacTips.push('W > 0: ضغط (الحجم يتناقص) | W < 0: تمدد (الحجم يتزايد)');
        }
        break;

      case 'FIRST_LAW':
        calcType = 'المبدأ الأول للترموديناميك';
        
        steps.push({
          stepNumber: 1,
          titleAr: 'المبدأ الأول',
          titleFr: 'Premier principe',
          formula: 'ΔU = Q + W',
          explanation: 'تغير الطاقة الداخلية = الحرارة + العمل',
        });

        if (unknown === 'ΔU') {
          const Q_fl = parseFloat(Q);
          const W_fl = parseFloat(W);
          formula = 'ΔU = Q + W';
          resultValue = Q_fl + W_fl;
          unit = 'J';
          
          steps.push({
            stepNumber: 2,
            titleAr: 'التعويض',
            titleFr: 'Substitution',
            substitution: `ΔU = ${Q_fl} + ${W_fl}`,
            result: `ΔU = ${resultValue.toFixed(2)} J`,
          });
          
          physicalInterpretation = resultValue > 0 
            ? 'الطاقة الداخلية للجملة تزداد (درجة الحرارة ترتفع)'
            : 'الطاقة الداخلية للجملة تنقص (درجة الحرارة تنخفض)';
        } else if (unknown === 'Q') {
          const dU = parseFloat(deltaU);
          const W_fl = parseFloat(W);
          formula = 'Q = ΔU - W';
          resultValue = dU - W_fl;
          unit = 'J';
          
          steps.push({
            stepNumber: 2,
            titleAr: 'استخراج Q',
            titleFr: 'Extraction de Q',
            formula: formula,
            substitution: `Q = ${dU} - ${W_fl}`,
            result: `Q = ${resultValue.toFixed(2)} J`,
          });
        } else if (unknown === 'W') {
          const dU = parseFloat(deltaU);
          const Q_fl = parseFloat(Q);
          formula = 'W = ΔU - Q';
          resultValue = dU - Q_fl;
          unit = 'J';
          
          steps.push({
            stepNumber: 2,
            titleAr: 'استخراج W',
            titleFr: 'Extraction de W',
            formula: formula,
            substitution: `W = ${dU} - ${Q_fl}`,
            result: `W = ${resultValue.toFixed(2)} J`,
          });
        }
        
        bacTips.push('في تحول أديباتي: Q = 0 → ΔU = W');
        bacTips.push('في تحول متساوي الحرارة للغاز المثالي: ΔU = 0 → Q = -W');
        break;

      case 'EFFICIENCY':
        calcType = 'المردود الحراري';
        const Qh_val = parseFloat(Qh);
        const Qc_val = parseFloat(Qc);
        const Th_val = parseFloat(Th);
        const Tc_val = parseFloat(Tc);
        
        steps.push({
          stepNumber: 1,
          titleAr: 'استخراج المعطيات',
          titleFr: 'Extraction des données',
          explanation: `Qₕ = ${Qh_val} J | Qc = ${Qc_val} J`,
        });

        // حساب المردود الفعلي
        formula = 'η = 1 - |Qc|/|Qₕ| = W/Qₕ';
        resultValue = 1 - Math.abs(Qc_val) / Math.abs(Qh_val);
        unit = '';
        
        const W_engine = Math.abs(Qh_val) - Math.abs(Qc_val);
        
        steps.push({
          stepNumber: 2,
          titleAr: 'حساب العمل المنتج',
          titleFr: 'Calcul du travail produit',
          formula: 'W = |Qₕ| - |Qc|',
          substitution: `W = ${Math.abs(Qh_val)} - ${Math.abs(Qc_val)}`,
          result: `W = ${W_engine.toFixed(2)} J`,
        });
        
        steps.push({
          stepNumber: 3,
          titleAr: 'حساب المردود',
          titleFr: 'Calcul du rendement',
          formula: 'η = W / |Qₕ|',
          substitution: `η = ${W_engine.toFixed(2)} / ${Math.abs(Qh_val)}`,
          result: `η = ${resultValue.toFixed(4)} = ${(resultValue * 100).toFixed(2)}%`,
        });
        
        // مردود كارنو
        if (Th_val && Tc_val) {
          const carnotEfficiency = 1 - Tc_val / Th_val;
          steps.push({
            stepNumber: 4,
            titleAr: 'مردود كارنو (الحد الأقصى النظري)',
            titleFr: 'Rendement de Carnot (maximum théorique)',
            formula: 'ηc = 1 - Tc/Tₕ',
            substitution: `ηc = 1 - ${Tc_val}/${Th_val}`,
            result: `ηc = ${carnotEfficiency.toFixed(4)} = ${(carnotEfficiency * 100).toFixed(2)}%`,
          });
          
          if (resultValue > carnotEfficiency) {
            warnings.push('تحذير: المردود المحسوب أكبر من مردود كارنو! تحقق من المعطيات.');
          }
        }
        
        physicalInterpretation = `المحرك الحراري يحول ${(resultValue * 100).toFixed(1)}% من الحرارة الممتصة إلى عمل ميكانيكي`;
        bacTips.push('مردود كارنو هو الحد الأقصى النظري الذي لا يمكن تجاوزه');
        break;

      case 'IDEAL_GAS':
        calcType = 'قانون الغاز المثالي';
        
        steps.push({
          stepNumber: 1,
          titleAr: 'قانون الغاز المثالي',
          titleFr: 'Loi des gaz parfaits',
          formula: 'PV = nRT',
          explanation: `R = ${R} J/(mol·K)`,
        });

        if (unknown === 'P') {
          const n_ig = parseFloat(n);
          const V_ig = parseFloat(V);
          const T_ig = parseFloat(T);
          formula = 'P = nRT/V';
          resultValue = (n_ig * R * T_ig) / V_ig;
          unit = 'Pa';
          
          steps.push({
            stepNumber: 2,
            titleAr: 'التعويض',
            titleFr: 'Substitution',
            substitution: `P = (${n_ig} × ${R} × ${T_ig}) / ${V_ig}`,
            result: `P = ${resultValue.toFixed(2)} Pa = ${(resultValue / 101325).toFixed(4)} atm`,
          });
        } else if (unknown === 'V') {
          const n_ig = parseFloat(n);
          const P_ig = parseFloat(P);
          const T_ig = parseFloat(T);
          formula = 'V = nRT/P';
          resultValue = (n_ig * R * T_ig) / P_ig;
          unit = 'm³';
          
          steps.push({
            stepNumber: 2,
            titleAr: 'التعويض',
            titleFr: 'Substitution',
            substitution: `V = (${n_ig} × ${R} × ${T_ig}) / ${P_ig}`,
            result: `V = ${resultValue.toFixed(6)} m³ = ${(resultValue * 1000).toFixed(3)} L`,
          });
        } else if (unknown === 'T') {
          const n_ig = parseFloat(n);
          const P_ig = parseFloat(P);
          const V_ig = parseFloat(V);
          formula = 'T = PV/(nR)';
          resultValue = (P_ig * V_ig) / (n_ig * R);
          unit = 'K';
          
          steps.push({
            stepNumber: 2,
            titleAr: 'التعويض',
            titleFr: 'Substitution',
            substitution: `T = (${P_ig} × ${V_ig}) / (${n_ig} × ${R})`,
            result: `T = ${resultValue.toFixed(2)} K = ${(resultValue - 273.15).toFixed(2)} °C`,
          });
        } else if (unknown === 'n') {
          const P_ig = parseFloat(P);
          const V_ig = parseFloat(V);
          const T_ig = parseFloat(T);
          formula = 'n = PV/(RT)';
          resultValue = (P_ig * V_ig) / (R * T_ig);
          unit = 'mol';
          
          steps.push({
            stepNumber: 2,
            titleAr: 'التعويض',
            titleFr: 'Substitution',
            substitution: `n = (${P_ig} × ${V_ig}) / (${R} × ${T_ig})`,
            result: `n = ${resultValue.toFixed(4)} mol`,
          });
        }
        
        bacTips.push('درجة الحرارة يجب أن تكون بالكلفن (K = °C + 273.15)');
        bacTips.push('الضغط بالباسكال (1 atm = 101325 Pa)');
        break;

      case 'PHASE_CHANGE':
        calcType = 'تغير الحالة الفيزيائية';
        const m_pc = parseFloat(mass);
        const L = phaseChange === 'fusion' 
          ? latentHeats.water.fusion 
          : latentHeats.water.vaporization;
        
        steps.push({
          stepNumber: 1,
          titleAr: 'استخراج المعطيات',
          titleFr: 'Extraction des données',
          explanation: `m = ${m_pc} kg | L = ${L} J/kg (${phaseChange === 'fusion' ? 'انصهار' : 'تبخر'})`,
        });

        if (unknown === 'Q') {
          formula = 'Q = m × L';
          resultValue = m_pc * L;
          unit = 'J';
          
          steps.push({
            stepNumber: 2,
            titleAr: 'حساب حرارة التحول',
            titleFr: 'Calcul de la chaleur de changement de phase',
            formula: formula,
            substitution: `Q = ${m_pc} × ${L}`,
            result: `Q = ${resultValue.toFixed(0)} J = ${(resultValue / 1000).toFixed(2)} kJ`,
          });
          
          physicalInterpretation = phaseChange === 'fusion'
            ? `يحتاج ${m_pc} kg من الجليد إلى ${(resultValue / 1000).toFixed(2)} kJ للانصهار`
            : `يحتاج ${m_pc} kg من الماء إلى ${(resultValue / 1000).toFixed(2)} kJ للتبخر`;
        } else if (unknown === 'm') {
          const Q_pc = parseFloat(Q);
          formula = 'm = Q / L';
          resultValue = Q_pc / L;
          unit = 'kg';
          
          steps.push({
            stepNumber: 2,
            titleAr: 'حساب الكتلة',
            titleFr: 'Calcul de la masse',
            formula: formula,
            substitution: `m = ${Q_pc} / ${L}`,
            result: `m = ${resultValue.toFixed(4)} kg = ${(resultValue * 1000).toFixed(2)} g`,
          });
        }
        
        bacTips.push('أثناء تغير الحالة، درجة الحرارة تبقى ثابتة');
        bacTips.push(`حرارة انصهار الجليد: Lf = 334 kJ/kg | حرارة تبخر الماء: Lv = 2260 kJ/kg`);
        break;
    }

    const filteredSteps = mode === 'exam' 
      ? steps.filter(s => s.stepNumber === 1 || s.result)
      : mode === 'revision'
      ? steps.map(s => ({ ...s, explanation: undefined }))
      : steps;

    setResult({
      value: resultValue,
      unit,
      formula,
      steps: filteredSteps,
      warnings,
      bacTips: mode === 'learning' ? bacTips : [],
      physicalInterpretation,
      calculationType: calcType,
    });
  };

  const handleReset = () => {
    setMass('');
    setDeltaT('');
    setT1('');
    setT2('');
    setQ('');
    setW('');
    setDeltaU('');
    setP('');
    setV1('');
    setV2('');
    setN('');
    setV('');
    setT('');
    setQh('');
    setQc('');
    setTh('');
    setTc('');
    setResult(null);
  };

  const renderInputFields = () => {
    switch (calculationType) {
      case 'HEAT_TRANSFER':
        return (
          <>
            {unknown !== 'm' && (
              <div className="space-y-2">
                <Label htmlFor="mass">الكتلة m (kg)</Label>
                <Input id="mass" type="number" value={mass} onChange={(e) => setMass(e.target.value)} placeholder="مثال: 2" />
              </div>
            )}
            <div className="space-y-2">
              <Label>المادة (السعة الحرارية)</Label>
              <Select value={selectedMaterial} onValueChange={(v) => { 
                setSelectedMaterial(v); 
                setSpecificHeat(specificHeats[v].value.toString()); 
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(specificHeats).map(([key, val]) => (
                    <SelectItem key={key} value={key}>
                      {val.nameAr} (c = {val.value} J/(kg·K))
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deltaT">تغير درجة الحرارة ΔT (K أو °C)</Label>
              <Input id="deltaT" type="number" value={deltaT} onChange={(e) => setDeltaT(e.target.value)} placeholder="أو أدخل T₁ و T₂" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="T1">T₁ (K)</Label>
                <Input id="T1" type="number" value={T1} onChange={(e) => setT1(e.target.value)} placeholder="البداية" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="T2">T₂ (K)</Label>
                <Input id="T2" type="number" value={T2} onChange={(e) => setT2(e.target.value)} placeholder="النهاية" />
              </div>
            </div>
            {unknown === 'm' && (
              <div className="space-y-2">
                <Label htmlFor="Q">الحرارة Q (J)</Label>
                <Input id="Q" type="number" value={Q} onChange={(e) => setQ(e.target.value)} placeholder="مثال: 50000" />
              </div>
            )}
          </>
        );

      case 'WORK':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="P">الضغط P (Pa)</Label>
              <Input id="P" type="number" value={P} onChange={(e) => setP(e.target.value)} placeholder="مثال: 101325" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="V1">V₁ (m³)</Label>
                <Input id="V1" type="number" value={V1} onChange={(e) => setV1(e.target.value)} placeholder="الحجم الابتدائي" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="V2">V₂ (m³)</Label>
                <Input id="V2" type="number" value={V2} onChange={(e) => setV2(e.target.value)} placeholder="الحجم النهائي" />
              </div>
            </div>
          </>
        );

      case 'FIRST_LAW':
        return (
          <>
            {unknown !== 'Q' && (
              <div className="space-y-2">
                <Label htmlFor="Q">الحرارة Q (J)</Label>
                <Input id="Q" type="number" value={Q} onChange={(e) => setQ(e.target.value)} placeholder="موجب = مكتسبة" />
              </div>
            )}
            {unknown !== 'W' && (
              <div className="space-y-2">
                <Label htmlFor="W">العمل W (J)</Label>
                <Input id="W" type="number" value={W} onChange={(e) => setW(e.target.value)} placeholder="موجب = مستقبل" />
              </div>
            )}
            {unknown !== 'ΔU' && (
              <div className="space-y-2">
                <Label htmlFor="deltaU">تغير الطاقة الداخلية ΔU (J)</Label>
                <Input id="deltaU" type="number" value={deltaU} onChange={(e) => setDeltaU(e.target.value)} placeholder="مثال: 5000" />
              </div>
            )}
          </>
        );

      case 'EFFICIENCY':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="Qh">الحرارة الممتصة من المصدر الساخن Qₕ (J)</Label>
              <Input id="Qh" type="number" value={Qh} onChange={(e) => setQh(e.target.value)} placeholder="مثال: 1000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Qc">الحرارة المفقودة للمصدر البارد Qc (J)</Label>
              <Input id="Qc" type="number" value={Qc} onChange={(e) => setQc(e.target.value)} placeholder="مثال: 600" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="Th">Tₕ (K) - اختياري</Label>
                <Input id="Th" type="number" value={Th} onChange={(e) => setTh(e.target.value)} placeholder="المصدر الساخن" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="Tc">Tc (K) - اختياري</Label>
                <Input id="Tc" type="number" value={Tc} onChange={(e) => setTc(e.target.value)} placeholder="المصدر البارد" />
              </div>
            </div>
          </>
        );

      case 'IDEAL_GAS':
        return (
          <>
            {unknown !== 'P' && (
              <div className="space-y-2">
                <Label htmlFor="P">الضغط P (Pa)</Label>
                <Input id="P" type="number" value={P} onChange={(e) => setP(e.target.value)} placeholder="مثال: 101325" />
              </div>
            )}
            {unknown !== 'V' && (
              <div className="space-y-2">
                <Label htmlFor="V">الحجم V (m³)</Label>
                <Input id="V" type="number" value={V} onChange={(e) => setV(e.target.value)} placeholder="مثال: 0.0224" />
              </div>
            )}
            {unknown !== 'n' && (
              <div className="space-y-2">
                <Label htmlFor="n">كمية المادة n (mol)</Label>
                <Input id="n" type="number" value={n} onChange={(e) => setN(e.target.value)} placeholder="مثال: 1" />
              </div>
            )}
            {unknown !== 'T' && (
              <div className="space-y-2">
                <Label htmlFor="T">درجة الحرارة T (K)</Label>
                <Input id="T" type="number" value={T} onChange={(e) => setT(e.target.value)} placeholder="مثال: 273" />
              </div>
            )}
          </>
        );

      case 'PHASE_CHANGE':
        return (
          <>
            <div className="space-y-2">
              <Label>نوع التحول</Label>
              <Select value={phaseChange} onValueChange={(v) => setPhaseChange(v as 'fusion' | 'vaporization')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fusion">انصهار (جليد → ماء)</SelectItem>
                  <SelectItem value="vaporization">تبخر (ماء → بخار)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {unknown !== 'm' && (
              <div className="space-y-2">
                <Label htmlFor="mass">الكتلة m (kg)</Label>
                <Input id="mass" type="number" value={mass} onChange={(e) => setMass(e.target.value)} placeholder="مثال: 0.5" />
              </div>
            )}
            {unknown === 'm' && (
              <div className="space-y-2">
                <Label htmlFor="Q">الحرارة Q (J)</Label>
                <Input id="Q" type="number" value={Q} onChange={(e) => setQ(e.target.value)} placeholder="مثال: 167000" />
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* عنوان الأداة */}
      <Card className="border-2 border-red-500/20 bg-gradient-to-br from-red-500/5 to-rose-500/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-rose-500">
              <Thermometer className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>حاسبة الديناميكا الحرارية</CardTitle>
              <p className="text-sm text-muted-foreground">Calculateur de Thermodynamique</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* قسم الإدخال */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">المعطيات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* اختيار نوع الحساب */}
            <div className="space-y-2">
              <Label>نوع الحساب</Label>
              <Select value={calculationType} onValueChange={(v) => { setCalculationType(v as ThermodynamicsType); setResult(null); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {thermodynamicsTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex flex-col">
                        <span>{type.label}</span>
                        <span className="text-xs text-muted-foreground">{type.labelFr}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* اختيار المجهول */}
            <div className="space-y-2">
              <Label>المطلوب حسابه</Label>
              <Select value={unknown} onValueChange={(v) => { setUnknown(v as UnknownVar); setResult(null); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableUnknowns().map((u) => (
                    <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* حقول الإدخال */}
            {renderInputFields()}

            {/* أزرار التحكم */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleCalculate} className="flex-1 gap-2">
                <Play className="w-4 h-4" />
                حساب
              </Button>
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                مسح
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* قسم النتائج */}
        {result && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="border-2 border-green-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-green-600">النتيجة</CardTitle>
                  <Badge variant="outline" className="bg-red-50 text-red-700">
                    {result.calculationType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* النتيجة الرئيسية */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">القانون المستخدم</p>
                    <p className="text-lg font-mono font-bold text-primary">{result.formula}</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {result.value.toFixed(4)} {result.unit}
                    </p>
                  </div>
                </div>

                {/* خطوات الحل */}
                {mode !== 'exam' && result.steps.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-500" />
                      خطوات الحل
                    </h4>
                    <div className="space-y-2">
                      {result.steps.map((step, i) => {
                        const combinedText = step.formula ? `${step.titleAr}: $${step.formula}$` : step.titleAr;
                        return (
                          <div key={i} className="p-3 rounded-lg bg-secondary/50 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{step.stepNumber}</Badge>
                            </div>
                            <MathContent content={combinedText} />
                            {step.substitution && (
                              <p className="text-sm font-mono text-muted-foreground pr-6">{step.substitution}</p>
                            )}
                            {step.result && (
                              <p className="text-sm font-bold text-green-600 pr-6">{step.result}</p>
                            )}
                            {step.explanation && mode === 'learning' && (
                              <p className="text-xs text-muted-foreground pr-6 italic">{step.explanation}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* التفسير الفيزيائي */}
                {result.physicalInterpretation && (
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm text-blue-700">{result.physicalInterpretation}</p>
                  </div>
                )}

                {/* تحذيرات */}
                {result.warnings.length > 0 && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                      <div className="space-y-1">
                        {result.warnings.map((warning, i) => (
                          <p key={i} className="text-sm text-red-700">{warning}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* تنبيهات BAC */}
                {result.bacTips.length > 0 && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5" />
                      <div className="space-y-1">
                        {result.bacTips.map((tip, i) => (
                          <p key={i} className="text-sm text-amber-700">{tip}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* معلومات مفيدة */}
      <Card className="bg-gradient-to-br from-red-500/5 to-rose-500/5">
        <CardContent className="p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-red-600" />
            ملخص القوانين الأساسية
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-background/50">
              <p className="font-medium text-red-700">انتقال الحرارة</p>
              <p className="font-mono mt-1">Q = m × c × ΔT</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <p className="font-medium text-red-700">المبدأ الأول</p>
              <p className="font-mono mt-1">ΔU = Q + W</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <p className="font-medium text-red-700">العمل (متساوي الضغط)</p>
              <p className="font-mono mt-1">W = -P × ΔV</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <p className="font-medium text-red-700">قانون الغاز المثالي</p>
              <p className="font-mono mt-1">PV = nRT</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <p className="font-medium text-red-700">المردود</p>
              <p className="font-mono mt-1">η = W/Qₕ = 1 - Qc/Qₕ</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <p className="font-medium text-red-700">مردود كارنو</p>
              <p className="font-mono mt-1">ηc = 1 - Tc/Tₕ</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
