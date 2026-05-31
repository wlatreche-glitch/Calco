import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Play, RotateCcw, Info, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MathContent } from '@/components/MathContent';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { solveMotion, MotionInput, MotionResult, PedagogyMode } from '@/lib/physicsEngine';

interface Props { mode: PedagogyMode; }
type MotionType = 'MRU' | 'MRUA' | 'FREE_FALL' | 'VERTICAL_THROW';
type UnknownVar = 'v' | 'v0' | 'a' | 't' | 'x' | 'h';

const motionTypes = [
  { value: 'MRU', label: 'حركة منتظمة (MRU)' },
  { value: 'MRUA', label: 'حركة متغيرة بانتظام (MRUA)' },
  { value: 'FREE_FALL', label: 'سقوط حر' },
  { value: 'VERTICAL_THROW', label: 'رمي شاقولي' },
];

export default function MotionCalculator({ mode }: Props) {
  const [motionType, setMotionType] = useState<MotionType>('MRUA');
  const [unknown, setUnknown] = useState<UnknownVar>('x');
  const [v0, setV0] = useState(''); const [v, setV] = useState(''); const [a, setA] = useState('');
  const [t, setT] = useState(''); const [x0, setX0] = useState('0'); const [h, setH] = useState('');
  const [result, setResult] = useState<MotionResult | null>(null);
  const [activeGraph, setActiveGraph] = useState<'position' | 'velocity'>('position');

  const getAvailableUnknowns = () => {
    const options: Record<MotionType, { value: UnknownVar; label: string }[]> = {
      'MRU': [{ value: 'x', label: 'الموضع x' }, { value: 't', label: 'الزمن t' }],
      'MRUA': [{ value: 'x', label: 'الموضع x' }, { value: 'v', label: 'السرعة v' }, { value: 'a', label: 'التسارع a' }, { value: 't', label: 'الزمن t' }],
      'FREE_FALL': [{ value: 'h', label: 'الارتفاع h' }, { value: 'v', label: 'السرعة v' }, { value: 't', label: 'الزمن t' }],
      'VERTICAL_THROW': [{ value: 'h', label: 'الارتفاع الأقصى h_max' }],
    };
    return options[motionType] || [];
  };

  const handleCalculate = () => {
    const input: MotionInput = { type: motionType, unknown, v0: v0 ? parseFloat(v0) : undefined, v: v ? parseFloat(v) : undefined, a: a ? parseFloat(a) : undefined, t: t ? parseFloat(t) : undefined, x0: x0 ? parseFloat(x0) : undefined, h: h ? parseFloat(h) : undefined };
    setResult(solveMotion(input, mode));
  };

  const handleReset = () => { setV0(''); setV(''); setA(''); setT(''); setX0('0'); setH(''); setResult(null); };
  const getGraphData = () => result?.graphData ? result.graphData.time.map((ti, i) => ({ time: ti.toFixed(2), position: result.graphData.position[i].toFixed(2), velocity: result.graphData.velocity[i].toFixed(2) })) : [];

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
        <CardHeader><div className="flex items-center gap-3"><div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500"><Activity className="w-6 h-6 text-white" /></div><CardTitle>محلل الحركة</CardTitle></div></CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-lg">المعطيات</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>نوع الحركة</Label><Select value={motionType} onValueChange={(v) => { setMotionType(v as MotionType); setResult(null); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{motionTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>المطلوب</Label><Select value={unknown} onValueChange={(v) => { setUnknown(v as UnknownVar); setResult(null); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{getAvailableUnknowns().map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>السرعة الابتدائية v₀ (m/s)</Label><Input type="number" value={v0} onChange={(e) => setV0(e.target.value)} placeholder="مثال: 0" /></div>
            {motionType === 'MRUA' && <div className="space-y-2"><Label>التسارع a (m/s²)</Label><Input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="مثال: 2" /></div>}
            {unknown !== 't' && <div className="space-y-2"><Label>الزمن t (s)</Label><Input type="number" value={t} onChange={(e) => setT(e.target.value)} placeholder="مثال: 5" /></div>}
            {(motionType === 'FREE_FALL' && unknown === 't') && <div className="space-y-2"><Label>الارتفاع h (m)</Label><Input type="number" value={h} onChange={(e) => setH(e.target.value)} placeholder="مثال: 45" /></div>}
            <div className="flex gap-3 pt-4"><Button onClick={handleCalculate} className="flex-1 gap-2"><Play className="w-4 h-4" />حساب</Button><Button variant="outline" onClick={handleReset} className="gap-2"><RotateCcw className="w-4 h-4" />مسح</Button></div>
          </CardContent>
        </Card>

        {result && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="border-2 border-green-500/20"><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-lg text-green-600">النتيجة</CardTitle><Badge variant="outline">{result.motionType}</Badge></div></CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 text-center">
                  <p className="text-sm text-muted-foreground">القانون</p>
                  <div className="text-lg font-bold text-primary mx-auto max-w-full">
                    <MathContent content={result.formula} />
                  </div>
                  <p className="text-3xl font-bold text-green-600 mt-2">{result.value.toFixed(3)} {result.unit}</p>
                </div>
                {mode !== 'exam' && result.steps.map((step, i) => {
                  const combinedText = step.formula ? `${step.titleAr}: $${step.formula}$` : step.titleAr;
                  return (
                    <div key={i} className="p-3 rounded-lg bg-secondary/50 space-y-2">
                      <div className="flex items-center gap-2"><Badge variant="outline" className="text-xs">{step.stepNumber}</Badge></div>
                      <MathContent content={combinedText} />
                      {step.substitution && <p className="text-sm font-mono text-muted-foreground pr-6">{step.substitution}</p>}
                      {step.result && <p className="text-sm font-bold text-green-600 pr-6">{step.result}</p>}
                    </div>
                  );
                })}
                {result.physicalInterpretation && <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"><p className="text-sm text-blue-700">{result.physicalInterpretation}</p></div>}
                {result.bacTips.length > 0 && mode === 'learning' && <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20"><div className="flex items-start gap-2"><Lightbulb className="w-4 h-4 text-amber-600 mt-0.5" /><div>{result.bacTips.map((tip, i) => <p key={i} className="text-sm text-amber-700">{tip}</p>)}</div></div></div>}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {result?.graphData && (
        <Card><CardHeader><div className="flex items-center justify-between"><CardTitle className="text-lg">الرسوم البيانية</CardTitle>
          <Tabs value={activeGraph} onValueChange={(v) => setActiveGraph(v as typeof activeGraph)}><TabsList><TabsTrigger value="position">x(t)</TabsTrigger><TabsTrigger value="velocity">v(t)</TabsTrigger></TabsList></Tabs>
        </div></CardHeader>
          <CardContent><div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={getGraphData()}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="time" /><YAxis /><Tooltip /><Line type="monotone" dataKey={activeGraph} stroke={activeGraph === 'position' ? '#3b82f6' : '#10b981'} strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div></CardContent>
        </Card>
      )}
    </div>
  );
}
