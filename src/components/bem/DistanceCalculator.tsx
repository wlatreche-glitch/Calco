import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ruler, Circle, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { solveDistance, DistanceInput, GeometryResult, PedagogyMode } from '@/lib/geometryEngine';
import DistanceDiagram from './geometry/DistanceDiagram';

interface DistanceCalculatorProps {
  mode: PedagogyMode;
}

export default function DistanceCalculator({ mode }: DistanceCalculatorProps) {
  const [calcType, setCalcType] = useState<'distance' | 'radius' | 'diameter'>('distance');
  const [x1, setX1] = useState('');
  const [y1, setY1] = useState('');
  const [x2, setX2] = useState('');
  const [y2, setY2] = useState('');
  const [radius, setRadius] = useState('');
  const [diameter, setDiameter] = useState('');
  const [result, setResult] = useState<GeometryResult | null>(null);

  const handleSolve = () => {
    const input: DistanceInput = {
      type: calcType,
      x1: x1 ? parseFloat(x1) : undefined,
      y1: y1 ? parseFloat(y1) : undefined,
      x2: x2 ? parseFloat(x2) : undefined,
      y2: y2 ? parseFloat(y2) : undefined,
      radius: radius ? parseFloat(radius) : undefined,
      diameter: diameter ? parseFloat(diameter) : undefined
    };

    const solution = solveDistance(input, mode);
    setResult(solution);
  };

  const handleClear = () => {
    setX1('');
    setY1('');
    setX2('');
    setY2('');
    setRadius('');
    setDiameter('');
    setResult(null);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10">
              <Ruler className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">المسافات ونصف القطر</CardTitle>
              <p className="text-sm text-muted-foreground">حساب الأبعاد الهندسية</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Type Selection */}
      <Tabs value={calcType} onValueChange={(v) => { setCalcType(v as 'distance' | 'radius' | 'diameter'); setResult(null); }}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="distance">المسافة</TabsTrigger>
          <TabsTrigger value="radius">نصف القطر</TabsTrigger>
          <TabsTrigger value="diameter">القطر</TabsTrigger>
        </TabsList>

        <TabsContent value="distance" className="space-y-4">
          {/* Diagram */}
          <DistanceDiagram 
            type="distance"
            x1={x1 ? parseFloat(x1) : undefined}
            y1={y1 ? parseFloat(y1) : undefined}
            x2={x2 ? parseFloat(x2) : undefined}
            y2={y2 ? parseFloat(y2) : undefined}
          />

          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Info box */}
              <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg text-sm">
                <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5" />
                <p>أدخل إحداثيات النقطتين لحساب المسافة بينهما</p>
              </div>

              {/* Point A */}
              <div className="space-y-2">
                <Label className="font-medium">النقطة A</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">x₁</Label>
                    <Input
                      type="number"
                      placeholder="مثال: 2"
                      value={x1}
                      onChange={(e) => setX1(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">y₁</Label>
                    <Input
                      type="number"
                      placeholder="مثال: 3"
                      value={y1}
                      onChange={(e) => setY1(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Point B */}
              <div className="space-y-2">
                <Label className="font-medium">النقطة B</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">x₂</Label>
                    <Input
                      type="number"
                      placeholder="مثال: 6"
                      value={x2}
                      onChange={(e) => setX2(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">y₂</Label>
                    <Input
                      type="number"
                      placeholder="مثال: 6"
                      value={y2}
                      onChange={(e) => setY2(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radius" className="space-y-4">
          {/* Diagram */}
          <DistanceDiagram 
            type="radius"
            diameter={diameter ? parseFloat(diameter) : undefined}
          />

          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Info box */}
              <div className="flex items-start gap-2 p-3 bg-purple-500/10 rounded-lg text-sm">
                <Circle className="w-4 h-4 text-purple-500 mt-0.5" />
                <p>أدخل القطر لحساب نصف القطر</p>
              </div>

              <div className="space-y-2">
                <Label>القطر (d)</Label>
                <Input
                  type="number"
                  placeholder="مثال: 10"
                  value={diameter}
                  onChange={(e) => setDiameter(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diameter" className="space-y-4">
          {/* Diagram */}
          <DistanceDiagram 
            type="diameter"
            radius={radius ? parseFloat(radius) : undefined}
          />

          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Info box */}
              <div className="flex items-start gap-2 p-3 bg-orange-500/10 rounded-lg text-sm">
                <Circle className="w-4 h-4 text-orange-500 mt-0.5" />
                <p>أدخل نصف القطر لحساب القطر</p>
              </div>

              <div className="space-y-2">
                <Label>نصف القطر (r)</Label>
                <Input
                  type="number"
                  placeholder="مثال: 5"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleSolve} className="flex-1 bg-blue-600 hover:bg-blue-700">
          <Ruler className="w-4 h-4 ml-2" />
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
                    <p className="text-sm">{result.justification}</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
      {/* Rules Card */}
      {mode === 'learning' && (
        <Card className="border-2 border-blue-500/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              قواعد المسافات والدائرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">المسافة بين نقطتين:</p>
                <p className="font-mono text-primary text-xs">d = √((x₂-x₁)² + (y₂-y₁)²)</p>
                <p className="text-muted-foreground mt-1">في معلم متعامد ومتجانس</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">منتصف قطعة مستقيم:</p>
                <p className="font-mono text-primary text-xs">I((x₁+x₂)/2 , (y₁+y₂)/2)</p>
                <p className="text-muted-foreground mt-1">إحداثيات المنتصف</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">نصف القطر والقطر:</p>
                <p className="font-mono text-primary">d = 2r</p>
                <p className="text-muted-foreground mt-1">القطر = ضعف نصف القطر</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">محيط الدائرة:</p>
                <p className="font-mono text-primary">P = 2πr = πd</p>
                <p className="text-muted-foreground mt-1">π ≈ 3.14159</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
