import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, BookOpen, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MathInput from '@/components/MathInput';
import SolutionSteps from '@/components/SolutionSteps';
import NavigationBreadcrumb from '@/components/NavigationBreadcrumb';
import { MathContent } from '@/components/MathContent';
import { solveEquation, simplifyExpression, SolverResult } from '@/lib/mathEngine';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const equationExamples = [
  '2x + 3 = 7',
  'x - 5 = 10',
  '3x + 2 = 2x + 5',
  'x^2 - 4 = 0',
  'x^2 + 2x - 3 = 0',
  '2x^2 - 8 = 0'
];

const simplifyExamples = [
  '2x + 3x',
  '(x + 2)(x - 2)',
  'x^2 + 2x + x^2',
  '3(x + 2) - 2x',
  '(2x)^2 + 4x'
];

export default function Equations() {
  const [result, setResult] = useState<SolverResult | null>(null);
  const [showDetailed, setShowDetailed] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSolveEquation = (equation: string) => {
    setLoading(true);
    setTimeout(() => {
      const solution = solveEquation(equation);
      setResult(solution);
      setLoading(false);
    }, 500);
  };

  const handleSimplify = (expression: string) => {
    setLoading(true);
    setTimeout(() => {
      const solution = simplifyExpression(expression);
      setResult(solution);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb Navigation */}
      <NavigationBreadcrumb
        items={[
          { label: 'رياضيات الباكالوريا', path: '/bac-math' },
          { label: 'حل المعادلات', isCurrent: true },
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
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 mb-4">
          <Calculator className="w-5 h-5" />
          <span className="font-medium">حل المعادلات</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">حل المعادلات الجبرية</h1>
        <p className="text-muted-foreground">
          أدخل المعادلة واحصل على الحل مع شرح مفصل لكل خطوة
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="card-elevated p-6">
        <Tabs defaultValue="solve" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="solve" className="gap-2">
              <Zap className="w-4 h-4" />
              حل المعادلات
            </TabsTrigger>
            <TabsTrigger value="simplify" className="gap-2">
              <BookOpen className="w-4 h-4" />
              تبسيط التعابير
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solve" className="space-y-6">
            <MathInput
              placeholder="أدخل المعادلة مثل: 2x + 3 = 7"
              onSubmit={handleSolveEquation}
              examples={equationExamples}
              loading={loading}
            />
            
            <div className="text-sm text-muted-foreground space-y-1">
              <p>💡 <strong>نصائح:</strong></p>
              <ul className="list-disc list-inside mr-4 space-y-1">
                <li>استخدم <code className="bg-secondary px-1 rounded">x</code> كمتغير</li>
                <li>للتربيع استخدم <code className="bg-secondary px-1 rounded">x^2</code></li>
                <li>يجب أن تحتوي المعادلة على علامة <code className="bg-secondary px-1 rounded">=</code></li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="simplify" className="space-y-6">
            <MathInput
              placeholder="أدخل التعبير للتبسيط مثل: 2x + 3x"
              onSubmit={handleSimplify}
              examples={simplifyExamples}
              loading={loading}
            />
            
            <div className="text-sm text-muted-foreground space-y-1">
              <p>💡 <strong>نصائح:</strong></p>
              <ul className="list-disc list-inside mr-4 space-y-1">
                <li>للضرب استخدم <code className="bg-secondary px-1 rounded">*</code> أو اكتب مباشرة <code className="bg-secondary px-1 rounded">2x</code></li>
                <li>للأقواس: <code className="bg-secondary px-1 rounded">(x + 2)(x - 1)</code></li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">النتيجة</h2>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showDetailed}
                onChange={(e) => setShowDetailed(e.target.checked)}
                className="rounded border-border"
              />
              <span>عرض الخطوات المفصلة</span>
            </label>
          </div>
          
          <SolutionSteps result={result} showDetailed={showDetailed} />
        </motion.div>
      )}

      {/* Educational Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-elevated p-6">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
              📘
            </span>
            المعادلات الخطية
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            الصيغة العامة: <span className="math-display"><MathContent content="ax + b = c" /></span>
          </p>
          <p className="text-sm text-secondary-foreground">
            لحل المعادلة الخطية، نعزل المتغير x بنقل الحدود الثابتة إلى الطرف الآخر.
          </p>
        </div>

        <div className="card-elevated p-6">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              📗
            </span>
            المعادلات التربيعية
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            الصيغة العامة: <span className="math-display"><MathContent content="ax^2 + bx + c = 0" /></span>
          </p>
          <p className="text-sm text-secondary-foreground">
            نستخدم صيغة المميز Δ = b² - 4ac لتحديد عدد الحلول وطبيعتها.
          </p>
        </div>
      </div>
    </div>
  );
}
