import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Square, Box, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { solveAreaVolume, AreaVolumeInput, GeometryResult, PedagogyMode, Shape2D, Solid3D } from '@/lib/geometryEngine';
import ShapeDiagram from './geometry/ShapeDiagram';

interface AreaVolumeCalculatorProps {
  mode: PedagogyMode;
}

const shapes2D = [
  { id: 'rectangle', name: 'مستطيل', fields: ['length', 'width'] },
  { id: 'square', name: 'مربع', fields: ['side'] },
  { id: 'triangle', name: 'مثلث', fields: ['base', 'height'] },
  { id: 'parallelogram', name: 'متوازي أضلاع', fields: ['base', 'height'] },
  { id: 'trapezoid', name: 'شبه منحرف', fields: ['base1', 'base2', 'height'] },
  { id: 'circle', name: 'دائرة', fields: ['radius'] },
];

const solids3D = [
  { id: 'cube', name: 'مكعب', fields: ['side'] },
  { id: 'rectangular_prism', name: 'متوازي مستطيلات', fields: ['length', 'width', 'height'] },
  { id: 'cylinder', name: 'أسطوانة', fields: ['radius', 'height'] },
];

const fieldLabels: Record<string, string> = {
  length: 'الطول (L)',
  width: 'العرض (W)',
  height: 'الارتفاع (H)',
  side: 'طول الضلع (a)',
  base: 'القاعدة (b)',
  base1: 'القاعدة الكبرى (b₁)',
  base2: 'القاعدة الصغرى (b₂)',
  radius: 'نصف القطر (r)',
};

export default function AreaVolumeCalculator({ mode }: AreaVolumeCalculatorProps) {
  const [calcType, setCalcType] = useState<'2d' | '3d'>('2d');
  const [selectedShape, setSelectedShape] = useState<Shape2D>('rectangle');
  const [selectedSolid, setSelectedSolid] = useState<Solid3D>('cube');
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<GeometryResult | null>(null);

  const handleSolve = () => {
    const input: AreaVolumeInput = {
      type: calcType,
      shape: calcType === '2d' ? selectedShape : undefined,
      solid: calcType === '3d' ? selectedSolid : undefined,
      length: values.length ? parseFloat(values.length) : undefined,
      width: values.width ? parseFloat(values.width) : undefined,
      height: values.height ? parseFloat(values.height) : undefined,
      base: values.base ? parseFloat(values.base) : undefined,
      base1: values.base1 ? parseFloat(values.base1) : undefined,
      base2: values.base2 ? parseFloat(values.base2) : undefined,
      radius: values.radius ? parseFloat(values.radius) : undefined,
      side: values.side ? parseFloat(values.side) : undefined,
    };

    const solution = solveAreaVolume(input, mode);
    setResult(solution);
  };

  const handleClear = () => {
    setValues({});
    setResult(null);
  };

  const handleValueChange = (field: string, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const currentFields = calcType === '2d' 
    ? shapes2D.find(s => s.id === selectedShape)?.fields || []
    : solids3D.find(s => s.id === selectedSolid)?.fields || [];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10">
              <Box className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl">المساحات والحجوم</CardTitle>
              <p className="text-sm text-muted-foreground">حساب مساحة الأشكال وحجم المجسمات</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 2D/3D Selection */}
      <Tabs value={calcType} onValueChange={(v) => { setCalcType(v as '2d' | '3d'); setValues({}); setResult(null); }}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="2d" className="flex items-center gap-2">
            <Square className="w-4 h-4" />
            المساحات (2D)
          </TabsTrigger>
          <TabsTrigger value="3d" className="flex items-center gap-2">
            <Box className="w-4 h-4" />
            الحجوم (3D)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="2d" className="space-y-4">
          {/* Dynamic Shape Diagram */}
          <ShapeDiagram 
            shape={selectedShape} 
            values={Object.fromEntries(
              Object.entries(values).map(([k, v]) => [k, parseFloat(v) || 0])
            )}
          />

          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Shape selector */}
              <div className="space-y-2">
                <Label>اختر الشكل</Label>
                <Select value={selectedShape} onValueChange={(v) => { setSelectedShape(v as Shape2D); setValues({}); setResult(null); }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {shapes2D.map(shape => (
                      <SelectItem key={shape.id} value={shape.id}>{shape.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Info box */}
              <div className="flex items-start gap-2 p-3 bg-purple-500/10 rounded-lg text-sm">
                <Lightbulb className="w-4 h-4 text-purple-500 mt-0.5" />
                <p>أدخل الأبعاد المطلوبة لحساب المساحة</p>
              </div>

              {/* Dynamic inputs */}
              <div className="grid grid-cols-2 gap-4">
                {currentFields.map(field => (
                  <div key={field} className="space-y-2">
                    <Label>{fieldLabels[field]}</Label>
                    <Input
                      type="number"
                      placeholder="أدخل القيمة"
                      value={values[field] || ''}
                      onChange={(e) => handleValueChange(field, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="3d" className="space-y-4">
          {/* Dynamic Solid Diagram */}
          <ShapeDiagram 
            shape={selectedSolid} 
            values={Object.fromEntries(
              Object.entries(values).map(([k, v]) => [k, parseFloat(v) || 0])
            )}
          />

          <Card>
            <CardContent className="p-4 space-y-4">
              {/* Solid selector */}
              <div className="space-y-2">
                <Label>اختر المجسم</Label>
                <Select value={selectedSolid} onValueChange={(v) => { setSelectedSolid(v as Solid3D); setValues({}); setResult(null); }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {solids3D.map(solid => (
                      <SelectItem key={solid.id} value={solid.id}>{solid.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Info box */}
              <div className="flex items-start gap-2 p-3 bg-cyan-500/10 rounded-lg text-sm">
                <Box className="w-4 h-4 text-cyan-500 mt-0.5" />
                <p>أدخل الأبعاد المطلوبة لحساب الحجم</p>
              </div>

              {/* Dynamic inputs */}
              <div className="grid grid-cols-2 gap-4">
                {currentFields.map(field => (
                  <div key={field} className="space-y-2">
                    <Label>{fieldLabels[field]}</Label>
                    <Input
                      type="number"
                      placeholder="أدخل القيمة"
                      value={values[field] || ''}
                      onChange={(e) => handleValueChange(field, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleSolve} className="flex-1 bg-purple-600 hover:bg-purple-700">
          {calcType === '2d' ? <Square className="w-4 h-4 ml-2" /> : <Box className="w-4 h-4 ml-2" />}
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
        <Card className="border-2 border-purple-500/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              قواعد المساحات والحجوم
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">المستطيل:</p>
                <p className="font-mono text-primary">S = L × W</p>
                <p className="text-muted-foreground mt-1">المحيط: P = 2(L + W)</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">المثلث:</p>
                <p className="font-mono text-primary">S = (b × h) / 2</p>
                <p className="text-muted-foreground mt-1">القاعدة × الارتفاع ÷ 2</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">الدائرة:</p>
                <p className="font-mono text-primary">S = π × r²</p>
                <p className="text-muted-foreground mt-1">المحيط: P = 2π × r</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">شبه المنحرف:</p>
                <p className="font-mono text-primary">S = ((b₁ + b₂) × h) / 2</p>
                <p className="text-muted-foreground mt-1">مجموع القاعدتين × الارتفاع ÷ 2</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">متوازي المستطيلات:</p>
                <p className="font-mono text-primary">V = L × W × H</p>
                <p className="text-muted-foreground mt-1">الطول × العرض × الارتفاع</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">الأسطوانة:</p>
                <p className="font-mono text-primary">V = π × r² × h</p>
                <p className="text-muted-foreground mt-1">مساحة القاعدة × الارتفاع</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
