import { useState } from 'react';
import { motion } from 'framer-motion';
import { Table2, Play, RotateCcw, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { generateTableOfValues, PedagogyMode } from '@/lib/linearFunctionEngine';

interface Props { mode: PedagogyMode }

const examples = [
  { func: '2x + 1', min: -3, max: 3 },
  { func: '-x + 4', min: -2, max: 4 },
  { func: '3x', min: -3, max: 3 },
  { func: '0.5x - 1', min: -4, max: 4 },
];

export default function TableOfValues({ mode }: Props) {
  const [funcInput, setFuncInput] = useState('');
  const [xMin, setXMin] = useState('-3');
  const [xMax, setXMax] = useState('3');
  const [result, setResult] = useState<ReturnType<typeof generateTableOfValues> | null>(null);

  const handle = () => {
    if (!funcInput.trim()) return;
    const min = parseFloat(xMin) || -3;
    const max = parseFloat(xMax) || 3;
    if (min >= max) return;
    setResult(generateTableOfValues(funcInput, min, max, mode));
  };

  const reset = () => { setFuncInput(''); setResult(null); };

  const loadExample = (ex: typeof examples[0]) => {
    setFuncInput(ex.func);
    setXMin(ex.min.toString());
    setXMax(ex.max.toString());
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">إنشاء جدول القيم</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>الدالة</Label>
              <div className="flex gap-2 items-center">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">f(x) =</span>
                <Input
                  value={funcInput}
                  onChange={e => setFuncInput(e.target.value)}
                  placeholder="مثال: 2x + 1"
                  className="text-lg font-mono text-center"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>x الأدنى</Label>
                <Input value={xMin} onChange={e => setXMin(e.target.value)} type="number" className="font-mono text-center" dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label>x الأعلى</Label>
                <Input value={xMax} onChange={e => setXMax(e.target.value)} type="number" className="font-mono text-center" dir="ltr" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">أمثلة سريعة:</Label>
              <div className="flex flex-wrap gap-2">
                {examples.map(ex => (
                  <Badge
                    key={ex.func} variant="outline"
                    className="cursor-pointer hover:bg-primary/10 font-mono text-xs"
                    onClick={() => loadExample(ex)}
                  >{ex.func}</Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handle} className="flex-1 gap-2"><Play className="w-4 h-4" /> إنشاء الجدول</Button>
              <Button variant="outline" onClick={reset} className="gap-2"><RotateCcw className="w-4 h-4" /> مسح</Button>
            </div>
          </CardContent>
        </Card>

        {/* Result Table */}
        {result && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {result.errors.length > 0 ? (
              <Card className="border-2 border-destructive/20">
                <CardContent className="p-4 text-destructive">{result.errors[0]}</CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-indigo-500/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">جدول القيم</CardTitle>
                    <Badge variant="secondary">f(x) = {result.a}x {result.b >= 0 ? '+' : ''}{result.b}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm font-mono">
                      <thead>
                        <tr>
                          <td className="border border-border bg-muted px-3 py-2 font-bold text-center">x</td>
                          {result.rows.map(row => (
                            <td key={row.x} className="border border-border bg-muted px-3 py-2 font-bold text-center">
                              {row.x}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="border border-border bg-primary/10 px-3 py-2 font-bold text-center text-primary">f(x)</td>
                          {result.rows.map(row => (
                            <td key={row.x} className="border border-border px-3 py-2 text-center font-semibold">
                              {row.fx}
                            </td>
                          ))}
                        </tr>
                      </thead>
                    </table>
                  </div>

                  {/* Calculation steps in learning mode */}
                  {mode === 'learning' && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium">تفاصيل الحساب:</p>
                      {result.rows.map(row => (
                        <p key={row.x} className="text-xs font-mono text-muted-foreground bg-secondary/30 px-2 py-1 rounded">
                          {row.calculationSteps}
                        </p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>

      {/* Tips */}
      {mode === 'learning' && (
        <Card className="border-2 border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="space-y-1 text-sm text-amber-700">
                <p>💡 لرسم الخط المستقيم يكفي نقطتان فقط</p>
                <p>💡 اختر قيم x بسيطة (أعداد صحيحة) لتسهيل الحساب</p>
                <p>💡 اختر دائماً x = 0 لإيجاد نقطة التقاطع مع محور y</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
