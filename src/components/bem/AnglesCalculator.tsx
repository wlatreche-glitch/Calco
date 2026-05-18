import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Compass, Triangle, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { solveAngles, AnglesInput, GeometryResult, PedagogyMode } from '@/lib/geometryEngine';
import AnglesDiagram from './geometry/AnglesDiagram';

interface AnglesCalculatorProps {
  mode: PedagogyMode;
}

export default function AnglesCalculator({ mode }: AnglesCalculatorProps) {
  const [calcType, setCalcType] = useState<'parallel_transversal' | 'triangle_sum' | 'isosceles' | 'equilateral'>('parallel_transversal');
  const [givenAngle, setGivenAngle] = useState('');
  const [angleType, setAngleType] = useState<'corresponding' | 'alternate' | 'co_interior'>('corresponding');
  const [angle1, setAngle1] = useState('');
  const [angle2, setAngle2] = useState('');
  const [vertexAngle, setVertexAngle] = useState('');
  const [baseAngle, setBaseAngle] = useState('');
  const [result, setResult] = useState<GeometryResult | null>(null);

  const handleSolve = () => {
    const input: AnglesInput = {
      type: calcType,
      givenAngle: givenAngle ? parseFloat(givenAngle) : undefined,
      angleType: calcType === 'parallel_transversal' ? angleType : undefined,
      angle1: angle1 ? parseFloat(angle1) : undefined,
      angle2: angle2 ? parseFloat(angle2) : undefined,
      vertexAngle: vertexAngle ? parseFloat(vertexAngle) : undefined,
      baseAngle: baseAngle ? parseFloat(baseAngle) : undefined
    };

    const solution = solveAngles(input, mode);
    setResult(solution);
  };

  const handleClear = () => {
    setGivenAngle('');
    setAngle1('');
    setAngle2('');
    setVertexAngle('');
    setBaseAngle('');
    setResult(null);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <Card className="border-2 border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/10">
              <Compass className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-xl">الزوايا والمثلثات</CardTitle>
              <p className="text-sm text-muted-foreground">حساب الزوايا وخصائص المثلثات</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Type Selection */}
      <Tabs value={calcType} onValueChange={(v) => { setCalcType(v as typeof calcType); setResult(null); }}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="parallel_transversal">مستقيمان متوازيان</TabsTrigger>
          <TabsTrigger value="triangle_sum">مجموع زوايا المثلث</TabsTrigger>
          <TabsTrigger value="isosceles">متساوي الساقين</TabsTrigger>
          <TabsTrigger value="equilateral">متساوي الأضلاع</TabsTrigger>
        </TabsList>

        <TabsContent value="parallel_transversal" className="space-y-4">
          {/* Diagram */}
          <AnglesDiagram 
            type="parallel_transversal"
            angleType={angleType}
            givenAngle={givenAngle ? parseFloat(givenAngle) : undefined}
          />

          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start gap-2 p-3 bg-orange-500/10 rounded-lg text-sm">
                <Lightbulb className="w-4 h-4 text-orange-500 mt-0.5" />
                <p>مستقيمان متوازيان يقطعهما قاطع</p>
              </div>

              <div className="space-y-2">
                <Label>نوع الزاويتين</Label>
                <Select value={angleType} onValueChange={(v) => setAngleType(v as typeof angleType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corresponding">متناظرتان (متساويتان)</SelectItem>
                    <SelectItem value="alternate">متبادلتان داخلياً (متساويتان)</SelectItem>
                    <SelectItem value="co_interior">داخليتان من جهة واحدة (متتامتان)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>الزاوية المعطاة (بالدرجات)</Label>
                <Input
                  type="number"
                  placeholder="مثال: 60"
                  value={givenAngle}
                  onChange={(e) => setGivenAngle(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="triangle_sum" className="space-y-4">
          {/* Diagram */}
          <AnglesDiagram type="triangle_sum" />

          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg text-sm">
                <Triangle className="w-4 h-4 text-blue-500 mt-0.5" />
                <p>أدخل زاويتين لحساب الزاوية الثالثة</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الزاوية الأولى (°)</Label>
                  <Input
                    type="number"
                    placeholder="مثال: 45"
                    value={angle1}
                    onChange={(e) => setAngle1(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>الزاوية الثانية (°)</Label>
                  <Input
                    type="number"
                    placeholder="مثال: 60"
                    value={angle2}
                    onChange={(e) => setAngle2(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="isosceles" className="space-y-4">
          {/* Diagram */}
          <AnglesDiagram type="isosceles" />

          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start gap-2 p-3 bg-purple-500/10 rounded-lg text-sm">
                <Triangle className="w-4 h-4 text-purple-500 mt-0.5" />
                <p>في المثلث متساوي الساقين، زاويتا القاعدة متساويتان</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>زاوية الرأس (°)</Label>
                  <Input
                    type="number"
                    placeholder="أو اتركه فارغاً"
                    value={vertexAngle}
                    onChange={(e) => { setVertexAngle(e.target.value); setBaseAngle(''); }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>زاوية القاعدة (°)</Label>
                  <Input
                    type="number"
                    placeholder="أو اتركه فارغاً"
                    value={baseAngle}
                    onChange={(e) => { setBaseAngle(e.target.value); setVertexAngle(''); }}
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                أدخل إحدى الزاويتين فقط
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equilateral" className="space-y-4">
          {/* Diagram */}
          <AnglesDiagram type="equilateral" />

          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start gap-2 p-3 bg-emerald-500/10 rounded-lg text-sm">
                <Triangle className="w-4 h-4 text-emerald-500 mt-0.5" />
                <p>في المثلث المتساوي الأضلاع، جميع الزوايا متساوية</p>
              </div>

              <div className="p-4 bg-secondary/50 rounded-lg text-center">
                <p className="text-muted-foreground">اضغط على "حساب" لمعرفة قيمة كل زاوية</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleSolve} className="flex-1 bg-orange-600 hover:bg-orange-700">
          <Compass className="w-4 h-4 ml-2" />
          حساب
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
                    <span className="font-bold text-emerald-700">النتيجة</span>
                  </div>
                  <p className="text-lg font-semibold">{result.finalAnswer}</p>
                </div>

                {/* Justification */}
                {result.justification && mode === 'learning' && (
                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <p className="text-sm font-medium text-blue-700">📝 التعليل:</p>
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
        <Card className="border-2 border-orange-500/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              قواعد الزوايا والمثلثات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">مجموع زوايا المثلث:</p>
                <p className="font-mono text-primary">α + β + γ = 180°</p>
                <p className="text-muted-foreground mt-1">في أي مثلث</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">الزوايا المتناظرة:</p>
                <p className="text-muted-foreground">إذا كان مستقيمان متوازيان يقطعهما قاطع</p>
                <p className="text-muted-foreground mt-1">فالزوايا المتناظرة متساوية</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">الزوايا المتبادلة داخلياً:</p>
                <p className="text-muted-foreground">متساوية عند التوازي</p>
                <p className="font-mono text-primary text-xs mt-1">α = β</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">الداخليتان من جهة واحدة:</p>
                <p className="text-muted-foreground">متتامتان (مجموعهما 180°)</p>
                <p className="font-mono text-primary text-xs mt-1">α + β = 180°</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">متساوي الساقين:</p>
                <p className="text-muted-foreground">زاويتا القاعدة متساويتان</p>
                <p className="font-mono text-primary text-xs mt-1">زاوية الرأس + 2 × زاوية القاعدة = 180°</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">متساوي الأضلاع:</p>
                <p className="text-muted-foreground">جميع الزوايا متساوية</p>
                <p className="font-mono text-primary text-xs mt-1">كل زاوية = 60°</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
