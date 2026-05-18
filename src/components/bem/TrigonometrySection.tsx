import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lightbulb, CheckCircle, AlertCircle } from 'lucide-react';
import { solveTrigonometry, TrigonometryInput, GeometryResult, PedagogyMode } from '@/lib/geometryEngine';
import TrigonometryDiagram from './geometry/TrigonometryDiagram';

interface TrigonometrySectionProps {
  mode: PedagogyMode;
  trigMode: 'findSide' | 'findAngle';
}

export default function TrigonometrySection({ mode, trigMode }: TrigonometrySectionProps) {
  const [rightAngle, setRightAngle] = useState<'A' | 'B' | 'C'>('A');
  const [result, setResult] = useState<GeometryResult | null>(null);

  // findSide state
  const [knownAngleVertex, setKnownAngleVertex] = useState<'A' | 'B' | 'C'>('B');
  const [knownAngleDeg, setKnownAngleDeg] = useState('');
  const [knownSideName, setKnownSideName] = useState('');
  const [knownSideValue, setKnownSideValue] = useState('');
  const [targetSideName, setTargetSideName] = useState('');

  // findAngle state
  const [side1Name, setSide1Name] = useState('');
  const [side1Value, setSide1Value] = useState('');
  const [side2Name, setSide2Name] = useState('');
  const [side2Value, setSide2Value] = useState('');
  const [targetAngleVertex, setTargetAngleVertex] = useState<'A' | 'B' | 'C'>('B');

  const availableAngles = (['A', 'B', 'C'] as const).filter(v => v !== rightAngle);
  const sideNames = ['BC', 'AC', 'AB'];

  const handleSolve = () => {
    const input: TrigonometryInput = trigMode === 'findSide' ? {
      mode: 'findSide',
      rightAngleAt: rightAngle,
      knownAngleVertex,
      knownAngleDeg: knownAngleDeg ? parseFloat(knownAngleDeg) : undefined,
      knownSideName,
      knownSideValue: knownSideValue ? parseFloat(knownSideValue) : undefined,
      targetSideName,
    } : {
      mode: 'findAngle',
      rightAngleAt: rightAngle,
      side1Name,
      side1Value: side1Value ? parseFloat(side1Value) : undefined,
      side2Name,
      side2Value: side2Value ? parseFloat(side2Value) : undefined,
      targetAngleVertex,
    };

    setResult(solveTrigonometry(input, mode));
  };

  const handleClear = () => {
    setKnownAngleDeg('');
    setKnownSideValue('');
    setKnownSideName('');
    setTargetSideName('');
    setSide1Name('');
    setSide1Value('');
    setSide2Name('');
    setSide2Value('');
    setResult(null);
  };

  // Update angle vertex if it conflicts with right angle
  const handleRightAngleChange = (v: 'A' | 'B' | 'C') => {
    setRightAngle(v);
    const available = (['A', 'B', 'C'] as const).filter(x => x !== v);
    if (knownAngleVertex === v) setKnownAngleVertex(available[0]);
    if (targetAngleVertex === v) setTargetAngleVertex(available[0]);
    setResult(null);
  };

  return (
    <div className="space-y-4">
      {/* Trigonometry Diagram */}
      <TrigonometryDiagram
        rightAngleAt={rightAngle}
        knownAngleVertex={trigMode === 'findSide' ? knownAngleVertex : undefined}
        targetAngleVertex={trigMode === 'findAngle' ? targetAngleVertex : undefined}
        mode={trigMode}
        knownSideName={trigMode === 'findSide' ? knownSideName : undefined}
        targetSideName={trigMode === 'findSide' ? targetSideName : undefined}
        side1Name={trigMode === 'findAngle' ? side1Name : undefined}
        side2Name={trigMode === 'findAngle' ? side2Name : undefined}
      />

      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Right angle selector */}
          <div className="space-y-2">
            <Label>الزاوية القائمة في:</Label>
            <Select value={rightAngle} onValueChange={(v) => handleRightAngleChange(v as 'A' | 'B' | 'C')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">الرأس A</SelectItem>
                <SelectItem value="B">الرأس B</SelectItem>
                <SelectItem value="C">الرأس C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Info */}
          <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg text-sm">
            <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5" />
            <p>{trigMode === 'findSide' 
              ? 'أدخل زاوية معلومة وضلع معلوم لحساب ضلع آخر باستخدام النسب المثلثية (sin, cos, tan)' 
              : 'أدخل ضلعين معلومين لحساب زاوية باستخدام النسب المثلثية العكسية'}</p>
          </div>

          {trigMode === 'findSide' ? (
            <div className="space-y-4">
              {/* Known angle */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الزاوية المعلومة في:</Label>
                  <Select value={knownAngleVertex} onValueChange={(v) => setKnownAngleVertex(v as 'A' | 'B' | 'C')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAngles.map(v => (
                        <SelectItem key={v} value={v}>الرأس {v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>قيمة الزاوية (°)</Label>
                  <Input type="number" placeholder="مثال: 30" value={knownAngleDeg} onChange={e => setKnownAngleDeg(e.target.value)} />
                </div>
              </div>

              {/* Known side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الضلع المعلوم:</Label>
                  <Select value={knownSideName} onValueChange={setKnownSideName}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الضلع" />
                    </SelectTrigger>
                    <SelectContent>
                      {sideNames.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>قيمة الضلع:</Label>
                  <Input type="number" placeholder="مثال: 5" value={knownSideValue} onChange={e => setKnownSideValue(e.target.value)} />
                </div>
              </div>

              {/* Target side */}
              <div className="space-y-2">
                <Label>الضلع المطلوب:</Label>
                <Select value={targetSideName} onValueChange={setTargetSideName}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الضلع المطلوب" />
                  </SelectTrigger>
                  <SelectContent>
                    {sideNames.filter(s => s !== knownSideName).map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Two known sides */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الضلع الأول:</Label>
                  <Select value={side1Name} onValueChange={setSide1Name}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      {sideNames.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>قيمته:</Label>
                  <Input type="number" placeholder="مثال: 5" value={side1Value} onChange={e => setSide1Value(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الضلع الثاني:</Label>
                  <Select value={side2Name} onValueChange={setSide2Name}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر" />
                    </SelectTrigger>
                    <SelectContent>
                      {sideNames.filter(s => s !== side1Name).map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>قيمته:</Label>
                  <Input type="number" placeholder="مثال: 13" value={side2Value} onChange={e => setSide2Value(e.target.value)} />
                </div>
              </div>

              {/* Target angle */}
              <div className="space-y-2">
                <Label>الزاوية المطلوبة في:</Label>
                <Select value={targetAngleVertex} onValueChange={(v) => setTargetAngleVertex(v as 'A' | 'B' | 'C')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAngles.map(v => (
                      <SelectItem key={v} value={v}>الرأس {v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={handleSolve} className="flex-1 bg-blue-600 hover:bg-blue-700">
          حساب
        </Button>
        <Button variant="outline" onClick={handleClear}>
          مسح
        </Button>
      </div>

      {/* Result */}
      {result && (
        <Card className={`border-2 ${result.success ? 'border-blue-500/30 bg-blue-500/5' : 'border-destructive/30 bg-destructive/5'}`}>
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

                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span className="font-bold text-blue-700">النتيجة النهائية</span>
                  </div>
                  <p className="text-lg font-semibold">{result.finalAnswer}</p>
                </div>

                {result.justification && mode === 'learning' && (
                  <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                    <p className="text-sm font-medium text-purple-700">📝 التعليل الكتابي:</p>
                    <p className="text-sm mt-1">{result.justification}</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
