import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Play, RotateCcw, Lightbulb, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { analyzeFunction, PedagogyMode } from '@/lib/linearFunctionEngine';

interface Props { mode: PedagogyMode }

const examples = ['3x', '-2x + 5', 'x + 3', '-x - 2', '0.5x + 1', '2x', '-3x + 6'];

export default function FunctionAnalyzer({ mode }: Props) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ReturnType<typeof analyzeFunction> | null>(null);

  const handle = () => {
    if (!input.trim()) return;
    setResult(analyzeFunction(input, mode));
  };

  const reset = () => { setInput(''); setResult(null); };

  const variationColor = result?.variation === 'increasing'
    ? 'text-emerald-600' : result?.variation === 'decreasing'
    ? 'text-red-500' : 'text-muted-foreground';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">تحليل الدالة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>أدخل الدالة</Label>
              <div className="flex gap-2 items-center">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">f(x) =</span>
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handle()}
                  placeholder="مثال: 3x + 2"
                  className="text-lg font-mono text-center"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">أمثلة:</Label>
              <div className="flex flex-wrap gap-2">
                {examples.map(ex => (
                  <Badge
                    key={ex} variant="outline"
                    className="cursor-pointer hover:bg-primary/10 font-mono text-xs"
                    onClick={() => setInput(ex)}
                  >{ex}</Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handle} className="flex-1 gap-2"><Play className="w-4 h-4" /> تحليل</Button>
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
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">نتيجة التحليل</CardTitle>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{result.typeFr}</Badge>
                      <Badge>{result.typeAr}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Summary cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-blue-500/10 text-center">
                      <p className="text-xs text-muted-foreground mb-1">المعامل a (الميل)</p>
                      <p className="text-2xl font-bold text-blue-600 font-mono">{result.a}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-500/10 text-center">
                      <p className="text-xs text-muted-foreground mb-1">الثابت b</p>
                      <p className="text-2xl font-bold text-purple-600 font-mono">{result.b}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/50 text-center">
                      <p className="text-xs text-muted-foreground mb-1">نقطة y</p>
                      <p className="text-lg font-bold font-mono">B(0, {result.yIntercept})</p>
                    </div>
                    <div className="p-3 rounded-xl bg-secondary/50 text-center">
                      <p className="text-xs text-muted-foreground mb-1">نقطة x</p>
                      <p className="text-lg font-bold font-mono">
                        {result.xIntercept !== null ? `A(${result.xIntercept}, 0)` : '—'}
                      </p>
                    </div>
                  </div>

                  {/* Variation */}
                  <div className="p-3 rounded-xl bg-secondary/50 flex items-center gap-3">
                    <TrendingUp className={`w-5 h-5 ${variationColor}`} />
                    <div>
                      <p className="text-xs text-muted-foreground">اتجاه التغيرات</p>
                      <p className={`font-semibold ${variationColor}`}>{result.variationAr}</p>
                    </div>
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
                    </div>
                  ))}

                  {/* Tips */}
                  {result.tips.length > 0 && (
                    <div className="p-3 rounded-lg bg-amber-500/10">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
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
            )}
          </motion.div>
        )}
      </div>

      {/* Rules */}
      {mode === 'learning' && (
        <Card className="border-2 border-sky-500/20 bg-sky-500/5">
          <CardHeader>
            <CardTitle className="text-base text-sky-700">📐 قواعد الدوال الخطية والتآلفية</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="font-semibold text-primary">الدالة الخطية:</p>
              <p className="font-mono bg-secondary/50 px-2 py-1 rounded">f(x) = ax</p>
              <p className="text-muted-foreground">• تمر دائماً بالأصل O(0,0)</p>
              <p className="text-muted-foreground">• a يسمى معامل التناسب</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-primary">الدالة التآلفية:</p>
              <p className="font-mono bg-secondary/50 px-2 py-1 rounded">f(x) = ax + b</p>
              <p className="text-muted-foreground">• b هو الترتيب عند المحور</p>
              <p className="text-muted-foreground">• تقطع محور y في النقطة (0, b)</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-emerald-600">إذا a &gt; 0:</p>
              <p className="text-muted-foreground">↗ الدالة متزايدة على ℝ</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-red-500">إذا a &lt; 0:</p>
              <p className="text-muted-foreground">↘ الدالة متناقصة على ℝ</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
