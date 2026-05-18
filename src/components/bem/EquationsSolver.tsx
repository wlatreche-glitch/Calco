import { useState } from 'react';
import { motion } from 'framer-motion';
import { Variable, Play, RotateCcw, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  solveLinearEquation, 
  solveLinearInequality,
  PedagogyMode 
} from '@/lib/middleSchoolMathEngine';

interface Props {
  mode: PedagogyMode;
}

const exampleEquations = ['3x + 7 = 22', '5x - 4 = 2x + 11', '2(x - 3) = 8', '4x = 20', 'x/2 + 3 = 7'];
const exampleInequalities = ['2x - 3 > 7', '-3x ≤ 9', 'x + 5 < 2x - 1', '4x - 2 ≥ 10', '-2x > 6'];

export default function EquationsSolver({ mode }: Props) {
  const [activeTab, setActiveTab] = useState('equations');
  const [equationInput, setEquationInput] = useState('');
  const [inequalityInput, setInequalityInput] = useState('');
  const [equationResult, setEquationResult] = useState<ReturnType<typeof solveLinearEquation> | null>(null);
  const [inequalityResult, setInequalityResult] = useState<ReturnType<typeof solveLinearInequality> | null>(null);

  const handleEquationSolve = () => {
    if (!equationInput.trim()) return;
    const result = solveLinearEquation(equationInput, mode);
    setEquationResult(result);
  };

  const handleInequalitySolve = () => {
    if (!inequalityInput.trim()) return;
    const result = solveLinearInequality(inequalityInput, mode);
    setInequalityResult(result);
  };

  const handleReset = () => {
    setEquationInput('');
    setInequalityInput('');
    setEquationResult(null);
    setInequalityResult(null);
  };

  // Number line visualization for inequalities
  const NumberLine = ({ result }: { result: ReturnType<typeof solveLinearInequality> }) => {
    const { solutionInterval } = result;
    if (!solutionInterval.left && solutionInterval.left !== 0) return null;
    
    const value = solutionInterval.leftIncluded ? solutionInterval.left : solutionInterval.right;
    const isLeftBound = solutionInterval.right === Infinity;
    
    return (
      <div className="p-4 rounded-lg bg-secondary/30">
        <p className="text-sm font-medium mb-4 text-center">التمثيل على مستقيم الأعداد:</p>
        <div className="relative h-12">
          {/* Number line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-foreground/30 -translate-y-1/2" />
          
          {/* Arrows */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2">
            <div className="w-0 h-0 border-t-4 border-b-4 border-r-8 border-transparent border-r-foreground/30" />
          </div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2">
            <div className="w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-foreground/30" />
          </div>
          
          {/* Solution region */}
          {isLeftBound ? (
            <div className="absolute top-1/2 left-1/2 right-4 h-2 bg-green-500/50 -translate-y-1/2 rounded-r" />
          ) : (
            <div className="absolute top-1/2 left-4 right-1/2 h-2 bg-green-500/50 -translate-y-1/2 rounded-l" />
          )}
          
          {/* Point */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className={`w-4 h-4 rounded-full border-2 ${
              solutionInterval.leftIncluded || solutionInterval.rightIncluded
                ? 'bg-green-500 border-green-600'
                : 'bg-background border-green-500'
            }`} />
            <span className="absolute top-6 left-1/2 -translate-x-1/2 text-sm font-mono whitespace-nowrap">
              {typeof value === 'number' && isFinite(value) ? value.toFixed(2) : ''}
            </span>
          </div>
          
          {/* Labels */}
          <span className="absolute top-6 left-2 text-xs text-muted-foreground">-∞</span>
          <span className="absolute top-6 right-2 text-xs text-muted-foreground">+∞</span>
        </div>
        
        <div className="mt-8 text-center text-sm">
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" /> منطقة الحل
            <span className="w-3 h-3 rounded-full border-2 border-green-500 bg-background mr-4" /> غير مشمول
            <span className="w-3 h-3 rounded-full bg-green-500" /> مشمول
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-pink-500/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Variable className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>المعادلات والمتراجحات الخطية</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">حل المعادلات والمتراجحات من الدرجة الأولى</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="equations" className="gap-2">
            <span>=</span> المعادلات
          </TabsTrigger>
          <TabsTrigger value="inequalities" className="gap-2">
            <span>{'<'}</span> المتراجحات
          </TabsTrigger>
        </TabsList>

        {/* Equations Tab */}
        <TabsContent value="equations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">حل معادلة خطية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>أدخل المعادلة</Label>
                  <Input
                    value={equationInput}
                    onChange={(e) => setEquationInput(e.target.value)}
                    placeholder="مثال: 3x + 7 = 22"
                    className="text-lg font-mono text-center"
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground">
                    معادلة من الشكل: ax + b = c أو ax + b = cx + d
                  </p>
                </div>

                {/* Quick Examples */}
                <div className="space-y-2">
                  <Label className="text-sm">أمثلة سريعة:</Label>
                  <div className="flex flex-wrap gap-2">
                    {exampleEquations.map((ex) => (
                      <Badge
                        key={ex}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10 font-mono"
                        onClick={() => setEquationInput(ex)}
                      >
                        {ex}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleEquationSolve} className="flex-1 gap-2">
                    <Play className="w-4 h-4" /> حل
                  </Button>
                  <Button variant="outline" onClick={handleReset} className="gap-2">
                    <RotateCcw className="w-4 h-4" /> مسح
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Equation Result */}
            {equationResult && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="border-2 border-green-500/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-green-600">النتيجة</CardTitle>
                      <Badge variant="outline">معادلة خطية</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Main Result */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 text-center">
                      <p className="text-sm text-muted-foreground">مجموعة الحل</p>
                      <p className="text-3xl font-bold font-mono text-green-600 mt-2">
                        {equationResult.solutionSet}
                      </p>
                    </div>

                    {/* Steps */}
                    {mode !== 'exam' && equationResult.steps.map((step, i) => (
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
                          <p className="text-sm font-bold text-green-600 pr-6 flex items-center gap-1">
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

                    {/* Verification */}
                    {equationResult.verification && mode === 'learning' && (
                      <div className="p-3 rounded-lg bg-blue-500/10 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-700">{equationResult.verification}</span>
                      </div>
                    )}

                    {/* Tips */}
                    {equationResult.tips.length > 0 && mode === 'learning' && (
                      <div className="p-3 rounded-lg bg-amber-500/10">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5" />
                          <div>
                            {equationResult.tips.map((tip, i) => (
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
        </TabsContent>

        {/* Inequalities Tab */}
        <TabsContent value="inequalities" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">حل متراجحة خطية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>أدخل المتراجحة</Label>
                  <Input
                    value={inequalityInput}
                    onChange={(e) => setInequalityInput(e.target.value)}
                    placeholder="مثال: 2x - 3 > 7"
                    className="text-lg font-mono text-center"
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground">
                    استخدم {'<'} أو {'>'} أو ≤ أو ≥
                  </p>
                </div>

                {/* Quick Examples */}
                <div className="space-y-2">
                  <Label className="text-sm">أمثلة سريعة:</Label>
                  <div className="flex flex-wrap gap-2">
                    {exampleInequalities.map((ex) => (
                      <Badge
                        key={ex}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10 font-mono"
                        onClick={() => setInequalityInput(ex)}
                      >
                        {ex}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleInequalitySolve} className="flex-1 gap-2">
                    <Play className="w-4 h-4" /> حل
                  </Button>
                  <Button variant="outline" onClick={handleReset} className="gap-2">
                    <RotateCcw className="w-4 h-4" /> مسح
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Inequality Result */}
            {inequalityResult && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="border-2 border-green-500/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-green-600">النتيجة</CardTitle>
                      <Badge variant="outline">متراجحة خطية</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Main Result */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 text-center">
                      <p className="text-sm text-muted-foreground">مجموعة الحل</p>
                      <p className="text-3xl font-bold font-mono text-green-600 mt-2">
                        {inequalityResult.solutionSet}
                      </p>
                    </div>

                    {/* Sign Change Warning */}
                    {inequalityResult.signChanged && (
                      <div className="p-3 rounded-lg bg-amber-500/20 border border-amber-500/30">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-amber-600" />
                          <p className="text-sm font-medium text-amber-700">
                            تم تغيير اتجاه المتراجحة بسبب القسمة على عدد سالب!
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Steps */}
                    {mode !== 'exam' && inequalityResult.steps.map((step, i) => (
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

                    {/* Number Line */}
                    {mode !== 'exam' && <NumberLine result={inequalityResult} />}

                    {/* Tips */}
                    {inequalityResult.tips.length > 0 && mode === 'learning' && (
                      <div className="p-3 rounded-lg bg-amber-500/10">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5" />
                          <div>
                            {inequalityResult.tips.map((tip, i) => (
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
        </TabsContent>
      </Tabs>

      {/* Rules Card */}
      {mode === 'learning' && (
        <Card className="border-2 border-purple-500/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              قواعد حل المعادلات والمتراجحات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">المعادلات:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• نجمع حدود x في طرف</li>
                  <li>• نجمع الأعداد في الطرف الآخر</li>
                  <li>• نقسم على معامل x</li>
                  <li>• نتحقق بالتعويض</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="font-medium mb-2">المتراجحات:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• نفس خطوات المعادلة</li>
                  <li>• ⚠️ عند الضرب/القسمة بعدد سالب</li>
                  <li>• نغير اتجاه المتراجحة</li>
                  <li>• نمثل الحل على مستقيم الأعداد</li>
                </ul>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 md:col-span-2">
                <p className="font-medium mb-2">رموز المجالات:</p>
                <div className="flex flex-wrap gap-4">
                  <span className="font-mono">]a ; b[ = غير مشمولين</span>
                  <span className="font-mono">[a ; b] = مشمولين</span>
                  <span className="font-mono">[a ; b[ = a مشمول، b غير مشمول</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
