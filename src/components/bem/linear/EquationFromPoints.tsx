import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Play, RotateCcw, Lightbulb, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { findEquationFromPoints, PedagogyMode } from '@/lib/linearFunctionEngine';

interface Props { mode: PedagogyMode }

const examples = [
  { x1: 1, y1: 2, x2: 3, y2: 6 },
  { x1: 0, y1: 1, x2: 2, y2: 5 },
  { x1: -1, y1: 3, x2: 2, y2: -3 },
  { x1: 1, y1: 4, x2: 3, y2: 4 },
];

export default function EquationFromPoints({ mode }: Props) {
  const [x1, setX1] = useState('');
  const [y1, setY1] = useState('');
  const [x2, setX2] = useState('');
  const [y2, setY2] = useState('');
  const [result, setResult] = useState<ReturnType<typeof findEquationFromPoints> | null>(null);

  const handle = () => {
    if (x1 === '' || y1 === '' || x2 === '' || y2 === '') return;
    setResult(findEquationFromPoints(
      parseFloat(x1), parseFloat(y1),
      parseFloat(x2), parseFloat(y2),
      mode
    ));
  };

  const loadExample = (ex: typeof examples[0]) => {
    setX1(ex.x1.toString()); setY1(ex.y1.toString());
    setX2(ex.x2.toString()); setY2(ex.y2.toString());
    setResult(null);
  };

  const reset = () => { setX1(''); setY1(''); setX2(''); setY2(''); setResult(null); };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">إيجاد المعادلة من نقطتين</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Point A */}
              <div className="p-3 rounded-xl bg-blue-500/10 space-y-3">
                <p className="text-sm font-semibold text-blue-700 text-center">النقطة A</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-4">x₁</Label>
                    <Input value={x1} onChange={e => setX1(e.target.value)} type="number" placeholder="x₁" className="font-mono text-center text-sm h-8" dir="ltr" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-4">y₁</Label>
                    <Input value={y1} onChange={e => setY1(e.target.value)} type="number" placeholder="y₁" className="font-mono text-center text-sm h-8" dir="ltr" />
                  </div>
                </div>
              </div>
              {/* Point B */}
              <div className="p-3 rounded-xl bg-purple-500/10 space-y-3">
                <p className="text-sm font-semibold text-purple-700 text-center">النقطة B</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-4">x₂</Label>
                    <Input value={x2} onChange={e => setX2(e.target.value)} type="number" placeholder="x₂" className="font-mono text-center text-sm h-8" dir="ltr" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs w-4">y₂</Label>
                    <Input value={y2} onChange={e => setY2(e.target.value)} type="number" placeholder="y₂" className="font-mono text-center text-sm h-8" dir="ltr" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">أمثلة:</Label>
              <div className="flex flex-wrap gap-2">
                {examples.map((ex, i) => (
                  <Badge
                    key={i} variant="outline"
                    className="cursor-pointer hover:bg-primary/10 text-xs"
                    onClick={() => loadExample(ex)}
                  >A({ex.x1},{ex.y1}) B({ex.x2},{ex.y2})</Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handle} className="flex-1 gap-2"><Play className="w-4 h-4" /> إيجاد المعادلة</Button>
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
              <Card className="border-2 border-violet-500/20">
                <CardHeader>
                  <CardTitle className="text-lg">معادلة الخط</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Main result */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 text-center">
                    {result.isVertical ? (
                      <>
                        <p className="text-xs text-muted-foreground mb-1">خط عمودي</p>
                        <p className="text-2xl font-bold font-mono text-violet-700">{result.equation}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-muted-foreground mb-1">معادلة الدالة</p>
                        <p className="text-2xl font-bold font-mono text-violet-700">{result.equation}</p>
                        <div className="flex justify-center gap-6 mt-3 text-sm">
                          <span>a = <strong>{result.a}</strong></span>
                          <span>b = <strong>{result.b}</strong></span>
                        </div>
                      </>
                    )}
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
                      {step.result && (
                        <p className="text-sm font-bold text-emerald-600 pr-6 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> {step.result}
                        </p>
                      )}
                      {step.warning && (
                        <p className="text-sm text-amber-600 pr-6 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {step.warning}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Tips */}
                  {result.tips.length > 0 && (
                    <div className="p-3 rounded-lg bg-amber-500/10">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        <div className="space-y-1">
                          {result.tips.map((tip, i) => <p key={i} className="text-sm text-amber-700">{tip}</p>)}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>

      {mode === 'learning' && (
        <Card className="border-2 border-violet-500/20 bg-violet-500/5">
          <CardContent className="p-4 space-y-3 text-sm">
            <p className="font-semibold text-violet-700">📐 طريقة إيجاد معادلة الخط من نقطتين</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-2 rounded-lg bg-secondary/60 space-y-1">
                <p className="font-medium text-xs text-primary">الخطوة 1: حساب الميل</p>
                <p className="font-mono text-xs">a = (y₂−y₁)/(x₂−x₁)</p>
              </div>
              <div className="p-2 rounded-lg bg-secondary/60 space-y-1">
                <p className="font-medium text-xs text-primary">الخطوة 2: حساب b</p>
                <p className="font-mono text-xs">b = y₁ − a×x₁</p>
              </div>
              <div className="p-2 rounded-lg bg-secondary/60 space-y-1">
                <p className="font-medium text-xs text-primary">الخطوة 3: كتابة المعادلة</p>
                <p className="font-mono text-xs">f(x) = ax + b</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
