import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NavigationBreadcrumb from '@/components/NavigationBreadcrumb';
import { MathContent } from '@/components/MathContent';

interface SequenceResult {
  type: 'arithmetic' | 'geometric';
  firstTerm: number;
  commonDiff?: number;
  commonRatio?: number;
  nthTerm: number;
  n: number;
  sum: number;
  formula: string;
  sumFormula: string;
  terms: number[];
}

export default function Sequences() {
  const [type, setType] = useState<'arithmetic' | 'geometric'>('arithmetic');
  const [firstTerm, setFirstTerm] = useState(2);
  const [commonValue, setCommonValue] = useState(3);
  const [n, setN] = useState(10);
  const [result, setResult] = useState<SequenceResult | null>(null);

  const calculate = () => {
    const terms: number[] = [];
    let sum = 0;
    let nthTerm = 0;
    let formula = '';
    let sumFormula = '';

    if (type === 'arithmetic') {
      // Un = U1 + (n-1)d
      nthTerm = firstTerm + (n - 1) * commonValue;
      // Sn = n(U1 + Un)/2
      sum = (n * (firstTerm + nthTerm)) / 2;
      formula = `U_n = ${firstTerm} + (n - 1) \\times ${commonValue} = ${firstTerm} + ${commonValue} n - ${commonValue}`;
      sumFormula = `S_n = \frac{n \left(${firstTerm} + ${nthTerm}\right)}{2}`;

      for (let i = 0; i < Math.min(n, 10); i++) {
        terms.push(firstTerm + i * commonValue);
      }
    } else {
      // Un = U1 × q^(n-1)
      nthTerm = firstTerm * Math.pow(commonValue, n - 1);
      // Sn = U1(1 - q^n)/(1 - q) for q ≠ 1
      if (commonValue === 1) {
        sum = firstTerm * n;
      } else {
        sum = (firstTerm * (1 - Math.pow(commonValue, n))) / (1 - commonValue);
      }
      formula = `U_n = ${firstTerm} \\times ${commonValue}^${n - 1}`;
      sumFormula = `S_n = \frac{${firstTerm} \left(1 - ${commonValue}^${n}\right)}{1 - ${commonValue}}`;

      for (let i = 0; i < Math.min(n, 10); i++) {
        terms.push(firstTerm * Math.pow(commonValue, i));
      }
    }

    setResult({
      type,
      firstTerm,
      commonDiff: type === 'arithmetic' ? commonValue : undefined,
      commonRatio: type === 'geometric' ? commonValue : undefined,
      nthTerm,
      n,
      sum,
      formula,
      sumFormula,
      terms
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb Navigation */}
      <NavigationBreadcrumb
        items={[
          { label: 'رياضيات الباكالوريا', path: '/bac-math' },
          { label: 'المتتاليات', isCurrent: true },
        ]}
        onBack={() => window.history.back()}
        showBackButton
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-rose-500/10 text-rose-600 mb-4">
          <TrendingUp className="w-5 h-5" />
          <span className="font-medium">المتتاليات</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">المتتاليات الحسابية والهندسية</h1>
        <p className="text-muted-foreground">
          حساب الحد العام ومجموع n حد
        </p>
      </motion.div>

      {/* Calculator */}
      <div className="card-elevated p-6">
        <Tabs value={type} onValueChange={(v) => setType(v as 'arithmetic' | 'geometric')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="arithmetic">متتالية حسابية</TabsTrigger>
            <TabsTrigger value="geometric">متتالية هندسية</TabsTrigger>
          </TabsList>

          <TabsContent value="arithmetic" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="arithmetic-first-term" className="block text-sm font-medium mb-2">الحد الأول (U₁)</label>
                <input
                  id="arithmetic-first-term"
                  type="number"
                  value={firstTerm}
                  onChange={(e) => setFirstTerm(Number(e.target.value))}
                  className="input-math"
                />
              </div>
              <div>
                <label htmlFor="arithmetic-common-value" className="block text-sm font-medium mb-2">الأساس (d)</label>
                <input
                  id="arithmetic-common-value"
                  type="number"
                  value={commonValue}
                  onChange={(e) => setCommonValue(Number(e.target.value))}
                  className="input-math"
                />
              </div>
              <div>
                <label htmlFor="arithmetic-n" className="block text-sm font-medium mb-2">عدد الحدود (n)</label>
                <input
                  id="arithmetic-n"
                  type="number"
                  value={n}
                  onChange={(e) => setN(Math.max(1, Number(e.target.value)))}
                  className="input-math"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-secondary/50">
              <p className="text-sm text-muted-foreground mb-2">الصيغة العامة:</p>
              <div className="math-display text-lg font-medium">
                <MathContent content="U_n = U_1 + (n - 1) \times d" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="geometric" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="geometric-first-term" className="block text-sm font-medium mb-2">الحد الأول (U₁)</label>
                <input
                  id="geometric-first-term"
                  type="number"
                  value={firstTerm}
                  onChange={(e) => setFirstTerm(Number(e.target.value))}
                  className="input-math"
                />
              </div>
              <div>
                <label htmlFor="geometric-common-value" className="block text-sm font-medium mb-2">الأساس (q)</label>
                <input
                  id="geometric-common-value"
                  type="number"
                  step="0.1"
                  value={commonValue}
                  onChange={(e) => setCommonValue(Number(e.target.value))}
                  className="input-math"
                />
              </div>
              <div>
                <label htmlFor="geometric-n" className="block text-sm font-medium mb-2">عدد الحدود (n)</label>
                <input
                  id="geometric-n"
                  type="number"
                  value={n}
                  onChange={(e) => setN(Math.max(1, Number(e.target.value)))}
                  className="input-math"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-secondary/50">
              <p className="text-sm text-muted-foreground mb-2">الصيغة العامة:</p>
              <div className="math-display text-lg font-medium">
                <MathContent content="U_n = U_1 \times q^{n - 1}" />
              </div>
            </div>
          </TabsContent>

          <Button onClick={calculate} className="w-full mt-4 btn-hero">
            <Calculator className="w-5 h-5 ml-2" />
            حساب
          </Button>
        </Tabs>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Terms Display */}
          <div className="card-elevated p-6">
            <h3 className="font-bold mb-4">الحدود الأولى:</h3>
            <div className="flex flex-wrap gap-2">
              {result.terms.map((term, i) => (
                <div
                  key={i}
                  className="px-4 py-2 rounded-xl bg-primary/10 text-primary font-mono"
                >
                  <MathContent content={`U_${i + 1} = ${term.toFixed(2)}`} />
                </div>
              ))}
              {result.n > 10 && (
                <div className="px-4 py-2 rounded-xl bg-muted text-muted-foreground">
                  ...
                </div>
              )}
            </div>
          </div>

          {/* Main Results */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-elevated p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">
                  Uₙ
                </span>
                الحد العام
              </h3>
              <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                <p className="text-sm text-muted-foreground mb-1">الصيغة:</p>
                <div className="math-display text-sm mb-3">
                  <MathContent content={result.formula} />
                </div>
                <p className="text-2xl font-bold text-success">
                  U_{result.n} = {result.nthTerm.toFixed(4)}
                </p>
              </div>
            </div>

            <div className="card-elevated p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent text-sm">
                  Sₙ
                </span>
                مجموع n حد
              </h3>
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                <p className="text-sm text-muted-foreground mb-1">الصيغة:</p>
                <div className="math-display text-sm mb-3">
                  <MathContent content={result.sumFormula} />
                </div>
                <p className="text-2xl font-bold text-accent">
                  S_{result.n} = {result.sum.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Educational Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-elevated p-6">
          <h3 className="font-bold mb-3">📘 المتتالية الحسابية</h3>
          <ul className="text-sm text-secondary-foreground space-y-2">
            <li>• كل حد = الحد السابق + الأساس d</li>
            <li>• <MathContent content="U_n = U_1 + (n - 1) d" /></li>
            <li>• <MathContent content="S_n = \frac{n \left(U_1 + U_n\right)}{2}" /></li>
            <li>• التقارب: تتباعد دائماً (إلا إذا d=0)</li>
          </ul>
        </div>

        <div className="card-elevated p-6">
          <h3 className="font-bold mb-3">📗 المتتالية الهندسية</h3>
          <ul className="text-sm text-secondary-foreground space-y-2">
            <li>• كل حد = الحد السابق × الأساس q</li>
            <li>• <MathContent content="U_n = U_1 \times q^{n - 1}" /></li>
            <li>• <MathContent content="S_n = \frac{U_1 \left(1 - q^{n}\right)}{1 - q}" /></li>
            <li>• التقارب: تتقارب إذا |q| &lt; 1</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
