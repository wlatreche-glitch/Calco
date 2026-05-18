import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Play, RotateCcw, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { checkPointBelongs, PedagogyMode } from '@/lib/linearFunctionEngine';

interface Props { mode: PedagogyMode }

const examples = [
  { func: '3x - 2', px: 4, py: 10 },
  { func: '2x + 1', px: 3, py: 7 },
  { func: '-x + 5', px: 2, py: 3 },
  { func: 'x + 2', px: 1, py: 5 },
];

export default function PointChecker({ mode }: Props) {
  const [funcInput, setFuncInput] = useState('');
  const [px, setPx] = useState('');
  const [py, setPy] = useState('');
  const [result, setResult] = useState<ReturnType<typeof checkPointBelongs> | null>(null);

  const handle = () => {
    if (!funcInput.trim() || px === '' || py === '') return;
    setResult(checkPointBelongs(funcInput, parseFloat(px), parseFloat(py), mode));
  };

  const loadExample = (ex: typeof examples[0]) => {
    setFuncInput(ex.func);
    setPx(ex.px.toString());
    setPy(ex.py.toString());
    setResult(null);
  };

  const reset = () => { setFuncInput(''); setPx(''); setPy(''); setResult(null); };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">اختبار انتماء نقطة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>الدالة</Label>
              <div className="flex gap-2 items-center">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">f(x) =</span>
                <Input
                  value={funcInput}
                  onChange={e => setFuncInput(e.target.value)}
                  placeholder="مثال: 3x - 2"
                  className="text-lg font-mono text-center"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-secondary/30 space-y-3">
              <p className="text-sm font-medium">إحداثيات النقطة A(x, y)</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">الفاصلة x</Label>
                  <Input value={px} onChange={e => setPx(e.target.value)} type="number" placeholder="x" className="font-mono text-center" dir="ltr" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">الترتيب y</Label>
                  <Input value={py} onChange={e => setPy(e.target.value)} type="number" placeholder="y" className="font-mono text-center" dir="ltr" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">أمثلة:</Label>
              <div className="flex flex-wrap gap-2">
                {examples.map(ex => (
                  <Badge
                    key={`${ex.func}-${ex.px}`} variant="outline"
                    className="cursor-pointer hover:bg-primary/10 text-xs"
                    onClick={() => loadExample(ex)}
                  >f={ex.func}, A({ex.px},{ex.py})</Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handle} className="flex-1 gap-2"><Play className="w-4 h-4" /> اختبار</Button>
              <Button variant="outline" onClick={reset} className="gap-2"><RotateCcw className="w-4 h-4" /> مسح</Button>
            </div>
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {result.errors.length > 0 ? (
              <Card className="border-2 border-destructive/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-5 h-5" />
                    <span>{result.errors[0]}</span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className={`border-2 ${result.belongs ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
                <CardHeader>
                  <CardTitle className="text-lg">النتيجة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Main verdict */}
                  <div className={`p-4 rounded-xl text-center ${result.belongs ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {result.belongs
                        ? <CheckCircle className="w-8 h-8 text-emerald-600" />
                        : <XCircle className="w-8 h-8 text-red-500" />
                      }
                    </div>
                    <p className={`text-lg font-bold ${result.belongs ? 'text-emerald-700' : 'text-red-600'}`}>
                      {result.belongs ? 'النقطة تنتمي ✓' : 'النقطة لا تنتمي ✗'}
                    </p>
                    <p className="text-sm font-mono mt-1">
                      f({result.pointX}) = <strong>{result.fAtX}</strong>
                      {' '}{result.belongs ? '=' : '≠'}{' '}
                      {result.pointY}
                    </p>
                  </div>

                  {/* Steps */}
                  {mode !== 'exam' && result.steps.map((step, i) => (
                    <div key={i} className="p-3 rounded-lg bg-secondary/40 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{step.stepNumber}</Badge>
                        <span className="font-medium text-sm">{step.titleAr}</span>
                      </div>
                      {step.explanation && <p className="text-sm text-muted-foreground pr-6">{step.explanation}</p>}
                      {step.formula && <p className="text-sm font-mono text-primary pr-6">{step.formula}</p>}
                      {step.result && <p className="text-sm font-bold pr-6">{step.result}</p>}
                    </div>
                  ))}

                  {/* Conclusion */}
                  <div className="p-3 rounded-lg bg-secondary/50 border-r-4 border-primary">
                    <p className="text-sm font-semibold mb-1">الاستنتاج:</p>
                    <p className="text-sm">{result.conclusionAr}</p>
                    {mode === 'learning' && (
                      <p className="text-xs text-muted-foreground mt-1 italic">{result.conclusionFr}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>

      {mode === 'learning' && (
        <Card className="border-2 border-sky-500/20 bg-sky-500/5">
          <CardContent className="p-4 text-sm space-y-2">
            <p className="font-semibold text-sky-700">📌 قاعدة الانتماء</p>
            <p className="text-muted-foreground">نقطة M(x₀, y₀) تنتمي للتمثيل البياني للدالة f</p>
            <p className="font-mono bg-secondary/60 px-3 py-1 rounded text-center">
              M ∈ (Cf) ⟺ f(x₀) = y₀
            </p>
            <p className="text-muted-foreground">نحسب f(x₀) ثم نقارن النتيجة مع y₀</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
