import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Triangle, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { solveThales, ThalesInput, GeometryResult, PedagogyMode } from '@/lib/geometryEngine';
import ThalesDiagram from './geometry/ThalesDiagram';

interface ThalesCalculatorProps {
  mode: PedagogyMode;
}

export default function ThalesCalculator({ mode }: ThalesCalculatorProps) {
  const [thalesMode, setThalesMode] = useState<'direct' | 'converse'>('direct');
  const [AB, setAB] = useState('');
  const [AC, setAC] = useState('');
  const [AD, setAD] = useState('');
  const [AE, setAE] = useState('');
  const [isParallel, setIsParallel] = useState(true);
  const [configuration, setConfiguration] = useState<'triangle' | 'butterfly'>('triangle');
  const [result, setResult] = useState<GeometryResult | null>(null);

  const handleSolve = () => {
    const input: ThalesInput = {
      mode: thalesMode,
      AB: AB ? parseFloat(AB) : undefined,
      AC: AC ? parseFloat(AC) : undefined,
      AD: AD ? parseFloat(AD) : undefined,
      AE: AE ? parseFloat(AE) : undefined,
      isParallel: thalesMode === 'direct' ? isParallel : undefined
    };

    const solution = solveThales(input, mode);
    setResult(solution);
  };

  const handleClear = () => {
    setAB('');
    setAC('');
    setAD('');
    setAE('');
    setResult(null);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Triangle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">نظرية طاليس</CardTitle>
              <p className="text-sm text-muted-foreground">المباشرة والعكسية</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Mode Selection */}
      <Tabs value={thalesMode} onValueChange={(v) => { setThalesMode(v as 'direct' | 'converse'); setResult(null); }}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="direct">نظرية طاليس المباشرة</TabsTrigger>
          <TabsTrigger value="converse">عكس نظرية طاليس</TabsTrigger>
        </TabsList>

        <TabsContent value="direct" className="space-y-4">
          {/* Diagram */}
          <ThalesDiagram 
            AB={AB ? parseFloat(AB) : undefined}
            AC={AC ? parseFloat(AC) : undefined}
            AD={AD ? parseFloat(AD) : undefined}
            AE={AE ? parseFloat(AE) : undefined}
            isParallel={isParallel}
            configuration={configuration}
          />

          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Configuration selector */}
              <div className="flex items-center gap-2">
                <Label className="font-medium">الشكل:</Label>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={configuration === 'triangle' ? 'default' : 'outline'}
                    onClick={() => setConfiguration('triangle')}
                  >
                    مثلث
                  </Button>
                  <Button
                    size="sm"
                    variant={configuration === 'butterfly' ? 'default' : 'outline'}
                    onClick={() => setConfiguration('butterfly')}
                  >
                    فراشة
                  </Button>
                </div>
              </div>

              {/* Parallel switch */}
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <Label className="font-medium">{configuration === 'butterfly' ? '(BD) // (CE)' : '(DE) // (BC)'}</Label>
                <Switch checked={isParallel} onCheckedChange={setIsParallel} />
              </div>

              {/* Info box */}
              <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg text-sm">
                <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5" />
                <p>أدخل 3 قيم على الأقل لحساب القيمة الرابعة</p>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>AB</Label>
                  <Input
                    type="number"
                    placeholder="مثال: 6"
                    value={AB}
                    onChange={(e) => setAB(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>AC</Label>
                  <Input
                    type="number"
                    placeholder="مثال: 9"
                    value={AC}
                    onChange={(e) => setAC(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>AD</Label>
                  <Input
                    type="number"
                    placeholder="مثال: 4"
                    value={AD}
                    onChange={(e) => setAD(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>AE (مجهول؟)</Label>
                  <Input
                    type="number"
                    placeholder="اتركه فارغاً للحساب"
                    value={AE}
                    onChange={(e) => setAE(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="converse" className="space-y-4">
          {/* Diagram */}
          <ThalesDiagram 
            AB={AB ? parseFloat(AB) : undefined}
            AC={AC ? parseFloat(AC) : undefined}
            AD={AD ? parseFloat(AD) : undefined}
            AE={AE ? parseFloat(AE) : undefined}
            isParallel={false}
            configuration={configuration}
          />

          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Info box */}
              <div className="flex items-start gap-2 p-3 bg-purple-500/10 rounded-lg text-sm">
                <Lightbulb className="w-4 h-4 text-purple-500 mt-0.5" />
                <p>أدخل القيم الأربع لإثبات التوازي أو نفيه</p>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>AB</Label>
                  <Input
                    type="number"
                    placeholder="مثال: 6"
                    value={AB}
                    onChange={(e) => setAB(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>AC</Label>
                  <Input
                    type="number"
                    placeholder="مثال: 9"
                    value={AC}
                    onChange={(e) => setAC(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>AD</Label>
                  <Input
                    type="number"
                    placeholder="مثال: 4"
                    value={AD}
                    onChange={(e) => setAD(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>AE</Label>
                  <Input
                    type="number"
                    placeholder="مثال: 6"
                    value={AE}
                    onChange={(e) => setAE(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleSolve} className="flex-1">
          <Triangle className="w-4 h-4 ml-2" />
          حل
        </Button>
        <Button variant="outline" onClick={handleClear}>
          مسح
        </Button>
      </div>

      {/* Result */}
      {result && (
        <Card className={`border-2 ${result.success ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-destructive/30 bg-destructive/5'}`}>
          <CardContent className="p-4 space-y-4">
            {result.error ? (
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="w-5 h-5" />
                <span>{result.error}</span>
              </div>
            ) : (
              <>
                {/* Steps */}
                {result.steps.length > 0 && (
                  <div className="space-y-3">
                    {result.steps.map((step, index) => (
                      <div key={index} className="p-3 bg-secondary/50 rounded-lg space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{index + 1}</Badge>
                          <span className="font-semibold">{step.title}</span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{step.content}</p>
                        {step.formula && (
                          <p className="text-sm font-mono bg-background/50 p-2 rounded">{step.formula}</p>
                        )}
                        {step.explanation && mode === 'learning' && (
                          <p className="text-xs text-muted-foreground">💡 {step.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Final Answer */}
                <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="font-bold text-emerald-700">النتيجة النهائية</span>
                  </div>
                  <p className="text-lg font-semibold">{result.finalAnswer}</p>
                </div>

                {/* Justification */}
                {result.justification && mode === 'learning' && (
                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <p className="text-sm font-medium text-blue-700">📝 التعليل الكتابي:</p>
                    <p className="text-sm mt-1">{result.justification}</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
      {/* Rules Card */}
      {mode === 'learning' && (
        <Card className="border-2 border-indigo-500/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              قواعد نظرية طاليس
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">نظرية طاليس المباشرة:</p>
                <p className="font-mono text-primary text-xs">إذا (DE) // (BC) فإن:</p>
                <p className="font-mono text-primary text-xs mt-1">AD/AB = AE/AC = DE/BC</p>
                <p className="text-muted-foreground mt-1">تساوي النسب عند التوازي</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">عكس نظرية طاليس:</p>
                <p className="font-mono text-primary text-xs">إذا AD/AB = AE/AC</p>
                <p className="font-mono text-primary text-xs mt-1">وكانت النقاط بالترتيب نفسه</p>
                <p className="text-muted-foreground mt-1">فإن (DE) // (BC)</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">شكل المثلث:</p>
                <p className="text-muted-foreground">D ∈ [AB] و E ∈ [AC]</p>
                <p className="text-muted-foreground mt-1">النقاط من نفس جهة الرأس A</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">شكل الفراشة:</p>
                <p className="text-muted-foreground">D و B من جهتين مختلفتين لـ A</p>
                <p className="text-muted-foreground mt-1">E و C من جهتين مختلفتين لـ A</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
