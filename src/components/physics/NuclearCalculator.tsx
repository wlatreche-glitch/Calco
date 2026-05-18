import { useState } from 'react';
import { motion } from 'framer-motion';
import { Atom, Play, RotateCcw, Info, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PedagogyMode } from '@/lib/physicsEngine';

interface Props {
  mode: PedagogyMode;
}

type NuclearType = 'DECAY' | 'ACTIVITY' | 'HALF_LIFE' | 'ENERGY' | 'BINDING_ENERGY';

interface NuclearResult {
  value: number;
  unit: string;
  formula: string;
  steps: { title: string; content: string }[];
  tips: string[];
  graphData?: { time: number; N: number; A: number }[];
}

const nuclearTypes = [
  { value: 'DECAY', label: 'التفكك الإشعاعي N(t)', labelFr: 'Décroissance radioactive' },
  { value: 'ACTIVITY', label: 'النشاط الإشعاعي A(t)', labelFr: 'Activité radioactive' },
  { value: 'HALF_LIFE', label: 'العمر النصفي t½', labelFr: 'Demi-vie' },
  { value: 'ENERGY', label: 'طاقة التفاعل النووي', labelFr: 'Énergie de réaction' },
  { value: 'BINDING_ENERGY', label: 'طاقة الربط', labelFr: 'Énergie de liaison' },
];

// الثوابت النووية
const CONSTANTS = {
  NA: 6.022e23,    // عدد أفوغادرو
  u: 1.66054e-27,  // وحدة الكتلة الذرية (kg)
  c: 3e8,          // سرعة الضوء (m/s)
  MeV_per_u: 931.5, // MeV لكل وحدة كتلة ذرية
  mp: 1.00728,     // كتلة البروتون (u)
  mn: 1.00866,     // كتلة النيوترون (u)
};

export default function NuclearCalculator({ mode }: Props) {
  const [nuclearType, setNuclearType] = useState<NuclearType>('DECAY');
  const [N0, setN0] = useState<string>('');
  const [halfLife, setHalfLife] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [lambda, setLambda] = useState<string>('');
  const [activity, setActivity] = useState<string>('');
  const [massNumber, setMassNumber] = useState<string>('');
  const [atomicNumber, setAtomicNumber] = useState<string>('');
  const [nucleusMass, setNucleusMass] = useState<string>('');
  const [massDefect, setMassDefect] = useState<string>('');
  const [result, setResult] = useState<NuclearResult | null>(null);

  const handleCalculate = () => {
    let calculatedResult: NuclearResult | null = null;

    switch (nuclearType) {
      case 'DECAY': {
        const n0 = parseFloat(N0);
        let t12 = parseFloat(halfLife);
        const t = parseFloat(time);
        
        // λ = ln(2) / t½
        const lambdaVal = Math.log(2) / t12;
        // N(t) = N₀ × e^(-λt)
        const Nt = n0 * Math.exp(-lambdaVal * t);
        // A(t) = λ × N(t)
        const At = lambdaVal * Nt;
        
        // Generate graph data
        const graphData = [];
        const maxTime = t12 * 5;
        for (let i = 0; i <= 50; i++) {
          const ti = (i / 50) * maxTime;
          const Ni = n0 * Math.exp(-lambdaVal * ti);
          const Ai = lambdaVal * Ni;
          graphData.push({ time: ti, N: Ni / n0, A: Ai / (lambdaVal * n0) });
        }

        calculatedResult = {
          value: Nt,
          unit: 'نواة',
          formula: 'N(t) = N₀ × e^(-λt)',
          steps: [
            { title: 'المعطيات', content: `N₀ = ${n0.toExponential(2)} | t½ = ${t12} | t = ${t}` },
            { title: 'حساب ثابت التفكك', content: `λ = ln(2)/t½ = ln(2)/${t12} = ${lambdaVal.toExponential(4)} s⁻¹` },
            { title: 'تطبيق قانون التفكك', content: `N(t) = ${n0.toExponential(2)} × e^(-${lambdaVal.toExponential(4)} × ${t})` },
            { title: 'النتيجة', content: `N(${t}) = ${Nt.toExponential(4)} نواة` },
            { title: 'النشاط المرافق', content: `A(${t}) = λ × N(t) = ${At.toExponential(4)} Bq` },
          ],
          tips: [
            `بعد ${t12} (عمر نصفي واحد)، يتبقى نصف الأنوية: N = N₀/2`,
            `بعد n عمر نصفي: N = N₀/2ⁿ`,
            'النشاط A يتناقص بنفس طريقة تناقص N',
          ],
          graphData,
        };
        break;
      }
      
      case 'ACTIVITY': {
        const a0 = parseFloat(activity);
        const t12 = parseFloat(halfLife);
        const t = parseFloat(time);
        
        const lambdaVal = Math.log(2) / t12;
        const At = a0 * Math.exp(-lambdaVal * t);
        
        calculatedResult = {
          value: At,
          unit: 'Bq',
          formula: 'A(t) = A₀ × e^(-λt)',
          steps: [
            { title: 'المعطيات', content: `A₀ = ${a0.toExponential(2)} Bq | t½ = ${t12} | t = ${t}` },
            { title: 'حساب ثابت التفكك', content: `λ = ln(2)/t½ = ${lambdaVal.toExponential(4)} s⁻¹` },
            { title: 'تطبيق قانون التفكك', content: `A(t) = A₀ × e^(-λt)` },
            { title: 'النتيجة', content: `A(${t}) = ${At.toExponential(4)} Bq` },
          ],
          tips: [
            '1 Bq = تفكك واحد في الثانية',
            '1 Ci = 3.7 × 10¹⁰ Bq (نشاط 1 غرام من الراديوم)',
          ],
        };
        break;
      }
      
      case 'HALF_LIFE': {
        const lambdaVal = parseFloat(lambda);
        const t12 = Math.log(2) / lambdaVal;
        
        calculatedResult = {
          value: t12,
          unit: 's',
          formula: 't½ = ln(2) / λ',
          steps: [
            { title: 'المعطيات', content: `λ = ${lambdaVal.toExponential(4)} s⁻¹` },
            { title: 'تطبيق العلاقة', content: `t½ = ln(2) / λ = 0.693 / ${lambdaVal.toExponential(4)}` },
            { title: 'النتيجة', content: `t½ = ${t12.toExponential(4)} s` },
          ],
          tips: [
            'العمر النصفي هو الزمن اللازم لتفكك نصف الأنوية',
            'كلما زاد λ، قل العمر النصفي (تفكك أسرع)',
          ],
        };
        break;
      }
      
      case 'BINDING_ENERGY': {
        const A = parseFloat(massNumber);
        const Z = parseFloat(atomicNumber);
        const mNucleus = parseFloat(nucleusMass);
        
        // الكتلة النظرية = Z × mp + (A-Z) × mn
        const mTheoretical = Z * CONSTANTS.mp + (A - Z) * CONSTANTS.mn;
        // النقص الكتلي
        const deltaM = mTheoretical - mNucleus;
        // طاقة الربط
        const El = deltaM * CONSTANTS.MeV_per_u;
        // طاقة الربط لكل نوكليون
        const ElPerNucleon = El / A;
        
        calculatedResult = {
          value: El,
          unit: 'MeV',
          formula: 'Eₗ = Δm × c² = Δm × 931.5 MeV/u',
          steps: [
            { title: 'المعطيات', content: `A = ${A} | Z = ${Z} | m = ${mNucleus} u` },
            { title: 'حساب الكتلة النظرية', content: `m_th = Z × mₚ + (A-Z) × mₙ = ${Z} × ${CONSTANTS.mp} + ${A-Z} × ${CONSTANTS.mn} = ${mTheoretical.toFixed(5)} u` },
            { title: 'النقص الكتلي', content: `Δm = m_th - m = ${mTheoretical.toFixed(5)} - ${mNucleus} = ${deltaM.toFixed(5)} u` },
            { title: 'طاقة الربط الكلية', content: `Eₗ = Δm × 931.5 = ${El.toFixed(2)} MeV` },
            { title: 'طاقة الربط لكل نوكليون', content: `Eₗ/A = ${El.toFixed(2)} / ${A} = ${ElPerNucleon.toFixed(2)} MeV/نوكليون` },
          ],
          tips: [
            'كلما زادت طاقة الربط لكل نوكليون، زاد استقرار النواة',
            'أكثر الأنوية استقراراً: Fe-56 (حوالي 8.8 MeV/نوكليون)',
            'النوى الخفيفة (H, He) والثقيلة (U) أقل استقراراً',
          ],
        };
        break;
      }
      
      case 'ENERGY': {
        const deltaM = parseFloat(massDefect);
        const E = Math.abs(deltaM) * CONSTANTS.MeV_per_u;
        const isExothermic = deltaM > 0;
        
        calculatedResult = {
          value: E,
          unit: 'MeV',
          formula: 'E = |Δm| × c² = |Δm| × 931.5 MeV/u',
          steps: [
            { title: 'المعطيات', content: `Δm = ${deltaM} u` },
            { title: 'تطبيق علاقة أينشتاين', content: `E = |Δm| × c²` },
            { title: 'التحويل', content: `E = |${deltaM}| × 931.5 MeV/u` },
            { title: 'النتيجة', content: `E = ${E.toFixed(4)} MeV` },
          ],
          tips: [
            isExothermic 
              ? 'Δm > 0 ← تفاعل ناشر للطاقة (exothermique)' 
              : 'Δm < 0 ← تفاعل ماص للطاقة (endothermique)',
            '1 u = 931.5 MeV/c²',
            'قانون انحفاظ الطاقة الكلية: E_repos + E_cinétique = cste',
          ],
        };
        break;
      }
    }

    setResult(calculatedResult);
  };

  const handleReset = () => {
    setN0('');
    setHalfLife('');
    setTime('');
    setLambda('');
    setActivity('');
    setMassNumber('');
    setAtomicNumber('');
    setNucleusMass('');
    setMassDefect('');
    setResult(null);
  };

  const renderInputFields = () => {
    switch (nuclearType) {
      case 'DECAY':
        return (
          <>
            <div className="space-y-2">
              <Label>عدد الأنوية الابتدائي N₀</Label>
              <Input type="number" value={N0} onChange={(e) => setN0(e.target.value)} placeholder="مثال: 1e20" />
            </div>
            <div className="space-y-2">
              <Label>العمر النصفي t½ (s)</Label>
              <Input type="number" value={halfLife} onChange={(e) => setHalfLife(e.target.value)} placeholder="مثال: 3600" />
            </div>
            <div className="space-y-2">
              <Label>الزمن t (s)</Label>
              <Input type="number" value={time} onChange={(e) => setTime(e.target.value)} placeholder="مثال: 7200" />
            </div>
          </>
        );
      
      case 'ACTIVITY':
        return (
          <>
            <div className="space-y-2">
              <Label>النشاط الابتدائي A₀ (Bq)</Label>
              <Input type="number" value={activity} onChange={(e) => setActivity(e.target.value)} placeholder="مثال: 1e10" />
            </div>
            <div className="space-y-2">
              <Label>العمر النصفي t½ (s)</Label>
              <Input type="number" value={halfLife} onChange={(e) => setHalfLife(e.target.value)} placeholder="مثال: 3600" />
            </div>
            <div className="space-y-2">
              <Label>الزمن t (s)</Label>
              <Input type="number" value={time} onChange={(e) => setTime(e.target.value)} placeholder="مثال: 7200" />
            </div>
          </>
        );
      
      case 'HALF_LIFE':
        return (
          <div className="space-y-2">
            <Label>ثابت التفكك λ (s⁻¹)</Label>
            <Input type="number" value={lambda} onChange={(e) => setLambda(e.target.value)} placeholder="مثال: 1.93e-4" />
          </div>
        );
      
      case 'BINDING_ENERGY':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>العدد الكتلي A</Label>
                <Input type="number" value={massNumber} onChange={(e) => setMassNumber(e.target.value)} placeholder="مثال: 56" />
              </div>
              <div className="space-y-2">
                <Label>العدد الذري Z</Label>
                <Input type="number" value={atomicNumber} onChange={(e) => setAtomicNumber(e.target.value)} placeholder="مثال: 26" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>كتلة النواة m (u)</Label>
              <Input type="number" value={nucleusMass} onChange={(e) => setNucleusMass(e.target.value)} placeholder="مثال: 55.9349" />
            </div>
          </>
        );
      
      case 'ENERGY':
        return (
          <div className="space-y-2">
            <Label>النقص الكتلي Δm (u)</Label>
            <Input type="number" value={massDefect} onChange={(e) => setMassDefect(e.target.value)} placeholder="مثال: 0.0186" />
            <p className="text-xs text-muted-foreground">Δm = Σm(متفاعلات) - Σm(نواتج)</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* عنوان الأداة */}
      <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-500/5 to-lime-500/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-lime-500">
              <Atom className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>الفيزياء النووية</CardTitle>
              <p className="text-sm text-muted-foreground">Physique Nucléaire</p>
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
            <div className="space-y-2">
              <Label>نوع الحساب</Label>
              <Select value={nuclearType} onValueChange={(v) => { setNuclearType(v as NuclearType); setResult(null); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {nuclearTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span>{type.label}</span>
                      <span className="text-xs text-muted-foreground mr-2">({type.labelFr})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {renderInputFields()}

            <div className="flex gap-3 pt-4">
              <Button onClick={handleCalculate} className="flex-1 gap-2">
                <Play className="w-4 h-4" />حساب
              </Button>
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <RotateCcw className="w-4 h-4" />مسح
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* قسم النتائج */}
        {result && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="border-2 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-lg text-green-600">النتيجة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <p className="text-sm text-muted-foreground mb-1">القانون</p>
                  <p className="font-mono font-bold text-primary">{result.formula}</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {result.value.toExponential(4)} {result.unit}
                  </p>
                </div>

                {mode !== 'exam' && (
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Info className="w-4 h-4 text-blue-500" />خطوات الحل
                    </h4>
                    {result.steps.map((step, i) => {
                      const combinedText = step.content ? `${step.title}: $${step.content}$` : step.title;
                      return (
                        <div key={i} className="p-3 rounded-lg bg-secondary/50">
                          <MathContent content={combinedText} />
                        </div>
                      );
                    })}
                  </div>
                )}

                {result.tips.length > 0 && mode === 'learning' && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5" />
                      <div className="space-y-1">
                        {result.tips.map((tip, i) => (
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

      {/* الرسم البياني للتفكك */}
      {result?.graphData && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">منحنى التفكك الإشعاعي</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.graphData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="time" 
                      label={{ value: 't', position: 'insideBottom', offset: -5 }}
                      stroke="hsl(var(--muted-foreground))"
                      tickFormatter={(v) => v.toFixed(0)}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      label={{ value: 'N/N₀, A/A₀', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                      formatter={(value: number) => value.toFixed(4)}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="N" name="N/N₀" stroke="#22c55e" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="A" name="A/A₀" stroke="#3b82f6" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>المنحنى يوضح التناقص الأسي لعدد الأنوية والنشاط مع الزمن</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* معلومات مفيدة */}
      <Card className="bg-gradient-to-br from-green-500/5 to-lime-500/5">
        <CardContent className="p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-green-600" />
            القوانين الأساسية
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-background/50">
              <p className="font-medium text-green-700">قانون التفكك</p>
              <p className="font-mono mt-1">N(t) = N₀ × e^(-λt)</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <p className="font-medium text-green-700">العلاقة بين t½ و λ</p>
              <p className="font-mono mt-1">t½ = ln(2)/λ ≈ 0.693/λ</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <p className="font-medium text-green-700">النشاط الإشعاعي</p>
              <p className="font-mono mt-1">A = λ × N = -dN/dt</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <p className="font-medium text-green-700">طاقة الربط</p>
              <p className="font-mono mt-1">Eₗ = Δm × c²</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <p className="font-medium text-green-700">بعد n عمر نصفي</p>
              <p className="font-mono mt-1">N = N₀/2ⁿ</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <p className="font-medium text-green-700">ثوابت مفيدة</p>
              <p className="font-mono mt-1 text-xs">1 u = 931.5 MeV/c²</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
