import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Play, RotateCcw, Info, Plus, Trash2, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { solveCircuit, CircuitInput, CircuitResult, PedagogyMode } from '@/lib/physicsEngine';
import { MathContent } from '@/components/MathContent';

interface Props { mode: PedagogyMode; }
type CircuitType = 'OHM' | 'SERIES' | 'PARALLEL';
type UnknownVar = 'R' | 'U' | 'I' | 'P' | 'Req';

const circuitTypes = [
  { value: 'OHM', label: 'قانون أوم' },
  { value: 'SERIES', label: 'ربط على التوالي' },
  { value: 'PARALLEL', label: 'ربط على التوازي' },
];

export default function CircuitCalculator({ mode }: Props) {
  const [circuitType, setCircuitType] = useState<CircuitType>('OHM');
  const [unknown, setUnknown] = useState<UnknownVar>('U');
  const [resistances, setResistances] = useState<string[]>(['']);
  const [voltage, setVoltage] = useState('');
  const [current, setCurrent] = useState('');
  const [result, setResult] = useState<CircuitResult | null>(null);

  const getAvailableUnknowns = () => {
    if (circuitType === 'OHM') return [{ value: 'U' as const, label: 'التوتر U' }, { value: 'I' as const, label: 'التيار I' }, { value: 'R' as const, label: 'المقاومة R' }, { value: 'P' as const, label: 'القدرة P' }];
    return [{ value: 'Req' as const, label: 'المقاومة المكافئة Req' }];
  };

  const handleCalculate = () => {
    const input: CircuitInput = { type: circuitType, unknown, resistances: resistances.filter(r => r).map(r => parseFloat(r)), voltage: voltage ? parseFloat(voltage) : undefined, current: current ? parseFloat(current) : undefined };
    setResult(solveCircuit(input, mode));
  };

  const handleReset = () => { setResistances(['']); setVoltage(''); setCurrent(''); setResult(null); };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
        <CardHeader><div className="flex items-center gap-3"><div className="p-2 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500"><Zap className="w-6 h-6 text-white" /></div><CardTitle>حلال الدارات الكهربائية</CardTitle></div></CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-lg">معطيات الدارة</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>نوع الحساب</Label><Select value={circuitType} onValueChange={(v) => { setCircuitType(v as CircuitType); setResult(null); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{circuitTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>المطلوب</Label><Select value={unknown} onValueChange={(v) => { setUnknown(v as UnknownVar); setResult(null); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{getAvailableUnknowns().map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2">
              <div className="flex items-center justify-between"><Label>المقاومات (Ω)</Label>{circuitType !== 'OHM' && <Button variant="ghost" size="sm" onClick={() => setResistances([...resistances, ''])} className="gap-1"><Plus className="w-4 h-4" />إضافة</Button>}</div>
              {resistances.map((r, i) => <div key={i} className="flex gap-2"><Input type="number" value={r} onChange={(e) => { const u = [...resistances]; u[i] = e.target.value; setResistances(u); }} placeholder={`R${i + 1}`} />{resistances.length > 1 && <Button variant="ghost" size="icon" onClick={() => setResistances(resistances.filter((_, j) => j !== i))}><Trash2 className="w-4 h-4 text-red-500" /></Button>}</div>)}
            </div>
            {circuitType === 'OHM' && unknown !== 'U' && <div className="space-y-2"><Label>التوتر U (V)</Label><Input type="number" value={voltage} onChange={(e) => setVoltage(e.target.value)} placeholder="مثال: 12" /></div>}
            {circuitType === 'OHM' && unknown !== 'I' && <div className="space-y-2"><Label>التيار I (A)</Label><Input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="مثال: 0.5" /></div>}
            {circuitType !== 'OHM' && <div className="space-y-2"><Label>توتر المولد U (V) - اختياري</Label><Input type="number" value={voltage} onChange={(e) => setVoltage(e.target.value)} placeholder="لحساب التيارات" /></div>}
            <div className="flex gap-3 pt-4"><Button onClick={handleCalculate} className="flex-1 gap-2"><Play className="w-4 h-4" />حساب</Button><Button variant="outline" onClick={handleReset} className="gap-2"><RotateCcw className="w-4 h-4" />مسح</Button></div>
          </CardContent>
        </Card>

        {result && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="border-2 border-green-500/20"><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-lg text-green-600">النتيجة</CardTitle><Badge variant="outline">{result.circuitType}</Badge></div></CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 text-center">
                  <p className="text-sm text-muted-foreground">القانون</p>
                  <div className="text-lg font-bold text-primary mx-auto max-w-full">
                    <MathContent content={result.formula} />
                  </div>
                  <p className="text-3xl font-bold text-green-600 mt-2">{result.value.toFixed(3)} {result.unit}</p>
                </div>
                {result.totalCurrent !== undefined && <div className="p-3 rounded-lg bg-blue-500/10"><p className="text-sm">التيار الكلي: <span className="font-mono">{result.totalCurrent.toFixed(3)} A</span></p></div>}
                {result.voltageDrops && <div className="p-3 rounded-lg bg-purple-500/10"><p className="text-sm font-medium mb-2">التوترات الجزئية:</p><div className="flex flex-wrap gap-2">{result.voltageDrops.map((v, i) => <Badge key={i} variant="outline" className="font-mono">U{i + 1} = {v.toFixed(2)} V</Badge>)}</div></div>}
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
