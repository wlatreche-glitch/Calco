import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Play, RotateCcw, Lightbulb, AlertTriangle, Divide, Plus, Minus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  solveRadicalExpression, 
  solveFractionExpression,
  PedagogyMode 
} from '@/lib/middleSchoolMathEngine';

interface Props {
  mode: PedagogyMode;
}

const exampleRadicals = ['√50', '√18 + √8', '3√2 + 5√2', '√72 - √32', '2√75 + 3√12'];
const exampleFractions = ['1/2 + 1/3', '5/6 - 1/4', '2/3 × 4/5', '3/4 ÷ 2/3', '1/2 + 2/3 - 1/6'];

export default function NumberOperations({ mode }: Props) {
  const [activeTab, setActiveTab] = useState('radicals');
  const [radicalInput, setRadicalInput] = useState('');
  const [fractionInput, setFractionInput] = useState('');
  const [radicalResult, setRadicalResult] = useState<ReturnType<typeof solveRadicalExpression> | null>(null);
  const [fractionResult, setFractionResult] = useState<ReturnType<typeof solveFractionExpression> | null>(null);

  const handleRadicalSolve = () => {
    if (!radicalInput.trim()) return;
    const result = solveRadicalExpression(radicalInput, mode);
    setRadicalResult(result);
  };

  const handleFractionSolve = () => {
    if (!fractionInput.trim()) return;
    const result = solveFractionExpression(fractionInput, mode);
    setFractionResult(result);
  };

  const handleReset = () => {
    setRadicalInput('');
    setFractionInput('');
    setRadicalResult(null);
    setFractionResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>العمليات على الأعداد والجذور</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">الكسور، الأعداد الناطقة، الجذور التربيعية</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="radicals" className="gap-2">
            <span>√</span> الجذور التربيعية
          </TabsTrigger>
          <TabsTrigger value="fractions" className="gap-2">
            <Divide className="w-4 h-4" /> الكسور
          </TabsTrigger>
        </TabsList>

        {/* Radicals Tab */}
        <TabsContent value="radicals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">تبسيط الجذور</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>أدخل التعبير الجذري</Label>
                  <Input
                    value={radicalInput}
                    onChange={(e) => setRadicalInput(e.target.value)}
                    placeholder="مثال: √50 + √18"
                    className="text-lg font-mono text-center"
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground">
                    استخدم √ للجذر، + للجمع، - للطرح
                  </p>
                </div>

                {/* Quick Examples */}
                <div className="space-y-2">
                  <Label className="text-sm">أمثلة سريعة:</Label>
                  <div className="flex flex-wrap gap-2">
                    {exampleRadicals.map((ex) => (
                      <Badge
                        key={ex}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10 font-mono"
                        onClick={() => setRadicalInput(ex)}
                      >
                        {ex}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleRadicalSolve} className="flex-1 gap-2">
                    <Play className="w-4 h-4" /> حساب
                  </Button>
                  <Button variant="outline" onClick={handleReset} className="gap-2">
                    <RotateCcw className="w-4 h-4" /> مسح
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Radical Result */}
            {radicalResult && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="border-2 border-green-500/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-green-600">النتيجة</CardTitle>
                      <Badge variant="outline">تبسيط الجذور</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Main Result */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 text-center">
                      <p className="text-sm text-muted-foreground">النتيجة المبسطة</p>
                      <p className="text-3xl font-bold font-mono text-green-600 mt-2">
                        {radicalResult.simplifiedForm}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        ≈ {radicalResult.decimalValue.toFixed(4)}
                      </p>
                    </div>

                    {/* Steps */}
                    {mode !== 'exam' && radicalResult.steps.map((step, i) => (
                      <div key={i} className="p-3 rounded-lg bg-secondary/50 space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{step.stepNumber}</Badge>
                          <span className="font-medium text-sm">{step.titleAr}</span>
                        </div>
                        {step.explanation && (
                          <p className="text-sm text-muted-foreground pr-6">{step.explanation}</p>
                        )}
                        {step.formula && (
                          <p className="text-sm font-mono text-primary pr-6">{step.formula}</p>
                        )}
                        {step.result && (
                          <p className="text-sm font-bold text-green-600 pr-6">{step.result}</p>
                        )}
                        {step.warning && (
                          <p className="text-sm text-amber-600 pr-6 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> {step.warning}
                          </p>
                        )}
                      </div>
                    ))}

                    {/* Tips */}
                    {radicalResult.tips.length > 0 && mode === 'learning' && (
                      <div className="p-3 rounded-lg bg-amber-500/10">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5" />
                          <div>
                            {radicalResult.tips.map((tip, i) => (
                              <p key={i} className="text-sm text-amber-700">{tip}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Errors */}
                    {radicalResult.errors.length > 0 && (
                      <div className="p-3 rounded-lg bg-red-500/10">
                        {radicalResult.errors.map((err, i) => (
                          <p key={i} className="text-sm text-red-600 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> {err}
                          </p>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Rules Card */}
          {mode === 'learning' && (
            <Card className="border-2 border-blue-500/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  قواعد الجذور التربيعية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <p className="font-medium mb-2">تبسيط الجذر:</p>
                    <p className="font-mono text-primary">√(a×b) = √a × √b</p>
                    <p className="text-muted-foreground mt-1">نبحث عن مربع كامل</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <p className="font-medium mb-2">جمع الجذور:</p>
                    <p className="font-mono text-primary">a√n + b√n = (a+b)√n</p>
                    <p className="text-muted-foreground mt-1">فقط إذا كانت متشابهة</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <p className="font-medium mb-2">ضرب الجذور:</p>
                    <p className="font-mono text-primary">√a × √b = √(a×b)</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <p className="font-medium mb-2">قسمة الجذور:</p>
                    <p className="font-mono text-primary">√a ÷ √b = √(a/b)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Fractions Tab */}
        <TabsContent value="fractions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">العمليات على الكسور</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>أدخل التعبير الكسري</Label>
                  <Input
                    value={fractionInput}
                    onChange={(e) => setFractionInput(e.target.value)}
                    placeholder="مثال: 1/2 + 1/3"
                    className="text-lg font-mono text-center"
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground">
                    استخدم / للكسر، + للجمع، - للطرح، × للضرب، ÷ للقسمة
                  </p>
                </div>

                {/* Quick Examples */}
                <div className="space-y-2">
                  <Label className="text-sm">أمثلة سريعة:</Label>
                  <div className="flex flex-wrap gap-2">
                    {exampleFractions.map((ex) => (
                      <Badge
                        key={ex}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10 font-mono"
                        onClick={() => setFractionInput(ex)}
                      >
                        {ex}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleFractionSolve} className="flex-1 gap-2">
                    <Play className="w-4 h-4" /> حساب
                  </Button>
                  <Button variant="outline" onClick={handleReset} className="gap-2">
                    <RotateCcw className="w-4 h-4" /> مسح
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Fraction Result */}
            {fractionResult && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="border-2 border-green-500/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-green-600">النتيجة</CardTitle>
                      <Badge variant="outline">عمليات الكسور</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Main Result */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 text-center">
                      <p className="text-sm text-muted-foreground">النتيجة</p>
                      <p className="text-3xl font-bold font-mono text-green-600 mt-2">
                        {fractionResult.result.denominator === 1 
                          ? fractionResult.result.numerator 
                          : `${fractionResult.result.numerator}/${fractionResult.result.denominator}`}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        ≈ {fractionResult.decimalValue.toFixed(4)}
                      </p>
                    </div>

                    {/* Steps */}
                    {mode !== 'exam' && fractionResult.steps.map((step, i) => (
                      <div key={i} className="p-3 rounded-lg bg-secondary/50 space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{step.stepNumber}</Badge>
                          <span className="font-medium text-sm">{step.titleAr}</span>
                        </div>
                        {step.explanation && (
                          <p className="text-sm text-muted-foreground pr-6">{step.explanation}</p>
                        )}
                        {step.formula && (
                          <p className="text-sm font-mono text-primary pr-6">{step.formula}</p>
                        )}
                        {step.result && (
                          <p className="text-sm font-bold text-green-600 pr-6">{step.result}</p>
                        )}
                      </div>
                    ))}

                    {/* Tips */}
                    {fractionResult.tips.length > 0 && mode === 'learning' && (
                      <div className="p-3 rounded-lg bg-amber-500/10">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5" />
                          <div>
                            {fractionResult.tips.map((tip, i) => (
                              <p key={i} className="text-sm text-amber-700">{tip}</p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Rules Card */}
          {mode === 'learning' && (
            <Card className="border-2 border-blue-500/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  قواعد الكسور
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <p className="font-medium mb-2 flex items-center gap-2">
                      <Plus className="w-4 h-4" /> الجمع والطرح:
                    </p>
                    <p className="font-mono text-primary text-xs">a/b ± c/d = (ad ± bc)/bd</p>
                    <p className="text-muted-foreground mt-1">توحيد المقامات أولاً</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <p className="font-medium mb-2 flex items-center gap-2">
                      <X className="w-4 h-4" /> الضرب:
                    </p>
                    <p className="font-mono text-primary">a/b × c/d = ac/bd</p>
                    <p className="text-muted-foreground mt-1">بسط × بسط / مقام × مقام</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <p className="font-medium mb-2 flex items-center gap-2">
                      <Divide className="w-4 h-4" /> القسمة:
                    </p>
                    <p className="font-mono text-primary">a/b ÷ c/d = a/b × d/c</p>
                    <p className="text-muted-foreground mt-1">نضرب بمقلوب القاسم</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30">
                    <p className="font-medium mb-2">التبسيط:</p>
                    <p className="text-muted-foreground">نقسم البسط والمقام على PGCD</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
