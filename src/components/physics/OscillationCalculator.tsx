import { useState } from 'react';
import { motion } from 'framer-motion';
import { Waves, Play, RotateCcw, Info, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MathContent } from '@/components/MathContent';
import { solveOscillation, OscillationInput, OscillationResult, PedagogyMode } from '@/lib/physicsEngine';

interface Props { mode: PedagogyMode; }
type OscillationType = 'SIMPLE_HARMONIC' | 'WAVE' | 'PENDULUM' | 'SPRING';
type UnknownVar = 'f' | 'T' | 'λ' | 'v' | 'ω' | 'k' | 'L';

const oscillationTypes = [
  { value: 'SIMPLE_HARMONIC', label: 'حركة توافقية بسيطة' },
  { value: 'WAVE', label: 'موجة' },
  { value: 'PENDULUM', label: 'نواس بسيط' },
  { value: 'SPRING', label: 'جملة نابض-كتلة' },
];

export default function OscillationCalculator({ mode }: Props) {
  const [oscillationType, setOscillationType] = useState<OscillationType>('WAVE');
  const [unknown, setUnknown] = useState<UnknownVar>('v');
  const [frequency, setFrequency] = useState(''); const [period, setPeriod] = useState('');
  const [wavelength, setWavelength] = useState(''); const [velocity, setVelocity] = useState('');
  const [mass, setMass] = useState(''); const [springConstant, setSpringConstant] = useState('');
  const [length, setLength] = useState(''); const [amplitude, setAmplitude] = useState('');
  const [result, setResult] = useState<OscillationResult | null>(null);

  const getAvailableUnknowns = () => {
    const options: Record<OscillationType, { value: UnknownVar; label: string }[]> = {
      'SIMPLE_HARMONIC': [{ value: 'T', label: 'الدور T' }, { value: 'f', label: 'التردد f' }, { value: 'ω', label: 'النبض ω' }],
      'WAVE': [{ value: 'v', label: 'السرعة v' }, { value: 'λ', label: 'طول الموجة λ' }, { value: 'f', label: 'التردد f' }],
      'PENDULUM': [{ value: 'T', label: 'الدور T' }, { value: 'L', label: 'الطول L' }],
      'SPRING': [{ value: 'T', label: 'الدور T' }, { value: 'k', label: 'ثابت الصلابة k' }],
    };
    return options[oscillationType] || [];
  };

  const handleCalculate = () => {
    const input: OscillationInput = { type: oscillationType, unknown, frequency: frequency ? parseFloat(frequency) : undefined, period: period ? parseFloat(period) : undefined, wavelength: wavelength ? parseFloat(wavelength) : undefined, velocity: velocity ? parseFloat(velocity) : undefined, amplitude: amplitude ? parseFloat(amplitude) : undefined, mass: mass ? parseFloat(mass) : undefined, springConstant: springConstant ? parseFloat(springConstant) : undefined, length: length ? parseFloat(length) : undefined };
    setResult(solveOscillation(input, mode));
  };

  const handleReset = () => { setFrequency(''); setPeriod(''); setWavelength(''); setVelocity(''); setMass(''); setSpringConstant(''); setLength(''); setAmplitude(''); setResult(null); };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
        <CardHeader><div className="flex items-center gap-3"><div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500"><Waves className="w-6 h-6 text-white" /></div><CardTitle>محلل الذبذبات والأمواج</CardTitle></div></CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-lg">المعطيات</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>نوع الظاهرة</Label><Select value={oscillationType} onValueChange={(v) => { setOscillationType(v as OscillationType); setResult(null); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{oscillationTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>المطلوب</Label><Select value={unknown} onValueChange={(v) => { setUnknown(v as UnknownVar); setResult(null); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{getAvailableUnknowns().map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}</SelectContent></Select></div>
            
            {oscillationType === 'WAVE' && (<>
              {unknown !== 'f' && <div className="space-y-2"><Label>التردد f (Hz)</Label><Input type="number" value={frequency} onChange={(e) => setFrequency(e.target.value)} placeholder="مثال: 500" /></div>}
              {unknown !== 'λ' && <div className="space-y-2"><Label>طول الموجة λ (m)</Label><Input type="number" value={wavelength} onChange={(e) => setWavelength(e.target.value)} placeholder="مثال: 0.68" /></div>}
              {unknown !== 'v' && <div className="space-y-2"><Label>السرعة v (m/s)</Label><Input type="number" value={velocity} onChange={(e) => setVelocity(e.target.value)} placeholder="مثال: 340" /></div>}
            </>)}
            
            {oscillationType === 'PENDULUM' && (<>
              {unknown !== 'L' && <div className="space-y-2"><Label>طول الخيط L (m)</Label><Input type="number" value={length} onChange={(e) => setLength(e.target.value)} placeholder="مثال: 1" /></div>}
              {unknown !== 'T' && <div className="space-y-2"><Label>الدور T (s)</Label><Input type="number" value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="مثال: 2" /></div>}
            </>)}
            
            {oscillationType === 'SPRING' && (<>
              <div className="space-y-2"><Label>الكتلة m (kg)</Label><Input type="number" value={mass} onChange={(e) => setMass(e.target.value)} placeholder="مثال: 0.5" /></div>
              {unknown !== 'k' && <div className="space-y-2"><Label>ثابت الصلابة k (N/m)</Label><Input type="number" value={springConstant} onChange={(e) => setSpringConstant(e.target.value)} placeholder="مثال: 100" /></div>}
              {unknown !== 'T' && <div className="space-y-2"><Label>الدور T (s)</Label><Input type="number" value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="مثال: 0.44" /></div>}
            </>)}
            
            {oscillationType === 'SIMPLE_HARMONIC' && (<>
              {unknown !== 'f' && <div className="space-y-2"><Label>التردد f (Hz)</Label><Input type="number" value={frequency} onChange={(e) => setFrequency(e.target.value)} placeholder="مثال: 50" /></div>}
              {unknown !== 'T' && <div className="space-y-2"><Label>الدور T (s)</Label><Input type="number" value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="مثال: 0.02" /></div>}
            </>)}
            
            <div className="flex gap-3 pt-4"><Button onClick={handleCalculate} className="flex-1 gap-2"><Play className="w-4 h-4" />حساب</Button><Button variant="outline" onClick={handleReset} className="gap-2"><RotateCcw className="w-4 h-4" />مسح</Button></div>
          </CardContent>
        </Card>

        {result && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="border-2 border-green-500/20"><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-lg text-green-600">النتيجة</CardTitle><Badge variant="outline">{result.oscillationType}</Badge></div></CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 text-center">
                  <p className="text-sm text-muted-foreground">القانون</p>
                  <div className="text-lg font-bold text-primary mx-auto max-w-full">
                    <MathContent content={result.formula} />
                  </div>
                  <p className="text-3xl font-bold text-green-600 mt-2">{result.value.toFixed(4)} {result.unit}</p>
                </div>
                {result.waveEquation && <div className="p-3 rounded-lg bg-purple-500/10"><p className="text-sm font-medium">معادلة الحركة:</p><div className="font-mono text-primary"><MathContent content={result.waveEquation} /></div></div>}
                {result.angularFrequency && <div className="p-3 rounded-lg bg-blue-500/10"><p className="text-sm">النبض: <span className="font-mono font-bold">ω = {result.angularFrequency.toFixed(2)} rad/s</span></p></div>}
                {mode !== 'exam' && result.steps.map((step, i) => {
                  const combinedText = step.formula ? `${step.titleAr}: $${step.formula}$` : step.titleAr;
                  return (
                    <div key={i} className="p-3 rounded-lg bg-secondary/50 space-y-2">
                      <div className="flex items-center gap-2"><Badge variant="outline" className="text-xs">{step.stepNumber}</Badge></div>
                      <MathContent content={combinedText} />
                      {step.result && <p className="text-sm font-bold text-green-600 pr-6">{step.result}</p>}
                    </div>
                  );
                })}
                {result.bacTips.length > 0 && mode === 'learning' && <div className="p-3 rounded-lg bg-amber-500/10"><div className="flex items-start gap-2"><Lightbulb className="w-4 h-4 text-amber-600 mt-0.5" /><div>{result.bacTips.map((tip, i) => <p key={i} className="text-sm text-amber-700">{tip}</p>)}</div></div></div>}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
