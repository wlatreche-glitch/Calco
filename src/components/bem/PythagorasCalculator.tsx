import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Triangle, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { solvePythagoras, PythagorasInput, GeometryResult, PedagogyMode } from '@/lib/geometryEngine';
import TrigonometrySection from './TrigonometrySection';
import PythagorasDiagram from './geometry/PythagorasDiagram';

interface PythagorasCalculatorProps {
  mode: PedagogyMode;
}

export default function PythagorasCalculator({ mode }: PythagorasCalculatorProps) {
  const [pythMode, setPythMode] = useState<'direct' | 'converse' | 'findSide' | 'findAngle'>('direct');
  const [rightAngle, setRightAngle] = useState<'A' | 'B' | 'C'>('A');
  const [sideA, setSideA] = useState('');
  const [sideB, setSideB] = useState('');
  const [sideC, setSideC] = useState('');
  const [result, setResult] = useState<GeometryResult | null>(null);

  const handleSolve = () => {
    const input: PythagorasInput = {
      mode: pythMode as 'direct' | 'converse',
      sideA: sideA ? parseFloat(sideA) : undefined,
      sideB: sideB ? parseFloat(sideB) : undefined,
      sideC: sideC ? parseFloat(sideC) : undefined,
      rightAngleAt: pythMode === 'direct' ? rightAngle : undefined
    };

    const solution = solvePythagoras(input, mode);
    setResult(solution);
  };

  const handleClear = () => {
    setSideA('');
    setSideB('');
    setSideC('');
    setResult(null);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <Card className="border-2 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10">
              <Triangle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <CardTitle className="text-xl">نظرية فيثاغورس</CardTitle>
              <p className="text-sm text-muted-foreground">المباشرة والعكسية</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Mode Selection */}
      <Tabs value={pythMode} onValueChange={(v) => { setPythMode(v as 'direct' | 'converse' | 'findSide' | 'findAngle'); setResult(null); }}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="direct" className="text-xs">حساب ضلع</TabsTrigger>
          <TabsTrigger value="converse" className="text-xs">إثبات قائم</TabsTrigger>
          <TabsTrigger value="findSide" className="text-xs">ضلع من زاوية</TabsTrigger>
          <TabsTrigger value="findAngle" className="text-xs">زاوية من أطوال</TabsTrigger>
        </TabsList>

        <TabsContent value="direct" className="space-y-4">
          {/* Diagram */}
          <PythagorasDiagram 
            rightAngleAt={rightAngle}
            sideA={sideA ? parseFloat(sideA) : undefined}
            sideB={sideB ? parseFloat(sideB) : undefined}
            sideC={sideC ? parseFloat(sideC) : undefined}
          />

          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Right angle selector */}
              <div className="space-y-2">
                <Label>الزاوية القائمة في:</Label>
                <Select value={rightAngle} onValueChange={(v) => setRightAngle(v as 'A' | 'B' | 'C')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">الرأس A (الوتر BC)</SelectItem>
                    <SelectItem value="B">الرأس B (الوتر AC)</SelectItem>
                    <SelectItem value="C">الرأس C (الوتر AB)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Info box */}
              <div className="flex items-start gap-2 p-3 bg-emerald-500/10 rounded-lg text-sm">
                <Lightbulb className="w-4 h-4 text-emerald-500 mt-0.5" />
                <p>أدخل ضلعين واترك الثالث فارغاً لحسابه</p>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>BC {rightAngle === 'A' && <Badge variant="secondary" className="text-xs mr-1">الوتر</Badge>}</Label>
                  <Input
                    type="number"
                    placeholder="مثال: 5"
                    value={sideA}
                    onChange={(e) => setSideA(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>AC {rightAngle === 'B' && <Badge variant="secondary" className="text-xs mr-1">الوتر</Badge>}</Label>
                  <Input
                    type="number"
                    placeholder="مثال: 12"
                    value={sideB}
                    onChange={(e) => setSideB(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>AB {rightAngle === 'C' && <Badge variant="secondary" className="text-xs mr-1">الوتر</Badge>}</Label>
                  <Input
                    type="number"
                    placeholder="مثال: 13"
                    value={sideC}
                    onChange={(e) => setSideC(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="converse" className="space-y-4">
          {/* Diagram */}
          <PythagorasDiagram 
            rightAngleAt="A"
            sideA={sideA ? parseFloat(sideA) : undefined}
            sideB={sideB ? parseFloat(sideB) : undefined}
            sideC={sideC ? parseFloat(sideC) : undefined}
          />

          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Info box */}
              <div className="flex items-start gap-2 p-3 bg-purple-500/10 rounded-lg text-sm">
                <Lightbulb className="w-4 h-4 text-purple-500 mt-0.5" />
                <p>أدخل أطوال الأضلاع الثلاثة للتحقق من أن المثلث قائم</p>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>BC</Label>
                  <Input
                    type="number"
                    placeholder="مثال: 5"
                    value={sideA}
                    onChange={(e) => setSideA(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>AC</Label>
                  <Input
                    type="number"
                    placeholder="مثال: 12"
                    value={sideB}
                    onChange={(e) => setSideB(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>AB</Label>
                  <Input
                    type="number"
                    placeholder="مثال: 13"
                    value={sideC}
                    onChange={(e) => setSideC(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trigonometry tabs */}
        <TabsContent value="findSide">
          <TrigonometrySection mode={mode} trigMode="findSide" />
        </TabsContent>

        <TabsContent value="findAngle">
          <TrigonometrySection mode={mode} trigMode="findAngle" />
        </TabsContent>
      </Tabs>

      {/* Action Buttons - only for Pythagoras tabs */}
      {(pythMode === 'direct' || pythMode === 'converse') && (
        <>
          <div className="flex gap-3">
            <Button onClick={handleSolve} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
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

                    <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="font-bold text-emerald-700">النتيجة النهائية</span>
                      </div>
                      <p className="text-lg font-semibold">{result.finalAnswer}</p>
                    </div>

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
        </>
      )}
      {/* Rules Card */}
      {mode === 'learning' && (
        <Card className="border-2 border-emerald-500/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              قواعد نظرية فيثاغورس والنسب المثلثية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">نظرية فيثاغورس المباشرة:</p>
                <p className="font-mono text-primary text-xs">إذا كان المثلث قائماً في C:</p>
                <p className="font-mono text-primary text-xs mt-1">AB² = AC² + BC²</p>
                <p className="text-muted-foreground mt-1">مربع الوتر = مجموع مربعي الضلعين</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">عكس نظرية فيثاغورس:</p>
                <p className="font-mono text-primary text-xs">إذا AB² = AC² + BC²</p>
                <p className="text-muted-foreground mt-1">فإن المثلث ABC قائم في C</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">النسب المثلثية:</p>
                <p className="font-mono text-primary text-xs">sin(α) = المقابل / الوتر</p>
                <p className="font-mono text-primary text-xs">cos(α) = المجاور / الوتر</p>
                <p className="font-mono text-primary text-xs">tan(α) = المقابل / المجاور</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">القيم الخاصة:</p>
                <p className="font-mono text-primary text-xs">sin(30°) = 1/2 ، cos(30°) = √3/2</p>
                <p className="font-mono text-primary text-xs">sin(45°) = cos(45°) = √2/2</p>
                <p className="font-mono text-primary text-xs">sin(60°) = √3/2 ، cos(60°) = 1/2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
