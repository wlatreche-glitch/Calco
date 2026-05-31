import { useState } from 'react';
import { motion } from 'framer-motion';
import { FunctionSquare, TrendingUp, ArrowDownUp, Search, Infinity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MathInput from '@/components/MathInput';
import SolutionSteps from '@/components/SolutionSteps';
import NavigationBreadcrumb from '@/components/NavigationBreadcrumb';
import FunctionGraph from '@/components/FunctionGraph';
import VariationTable from '@/components/VariationTable';
import SpecialPointsLegend from '@/components/SpecialPointsLegend';
import LimitsTable from '@/components/LimitsTable';
import { calculateDerivative, calculateIntegral, SolverResult } from '@/lib/mathEngine';
import { analyzeFunction, FunctionAnalysis } from '@/lib/functionAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MathContent } from '@/components/MathContent';

const derivativeExamples = [
  'x^2',
  'x^3 + 2x',
  '3x^2 - 4x + 1',
  'x^4 - x^2',
  '2x^3 + 5x^2 - 3x'
];

const integralExamples = [
  'x',
  'x^2',
  '3x^2',
  '2x + 1',
  'x^3'
];

export default function Functions() {
  const [result, setResult] = useState<SolverResult | null>(null);
  const [currentExpression, setCurrentExpression] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGraph, setShowGraph] = useState(true);
  const [showVariationTable, setShowVariationTable] = useState(true);
  const [showSpecialPoints, setShowSpecialPoints] = useState(true);
  const [showAsymptotes, setShowAsymptotes] = useState(true);
  const [showLimits, setShowLimits] = useState(true);
  const [analysis, setAnalysis] = useState<FunctionAnalysis | null>(null);

  const handleDerivative = (expression: string) => {
    setLoading(true);
    setCurrentExpression(expression);
    setTimeout(() => {
      const solution = calculateDerivative(expression);
      const functionAnalysis = analyzeFunction(expression);
      setResult(solution);
      setAnalysis(functionAnalysis);
      setLoading(false);
    }, 500);
  };

  const handleIntegral = (expression: string) => {
    setLoading(true);
    setCurrentExpression(expression);
    setTimeout(() => {
      const solution = calculateIntegral(expression);
      setResult(solution);
      setAnalysis(null);
      setLoading(false);
    }, 500);
  };

  const handleFullStudy = (expression: string) => {
    setLoading(true);
    setCurrentExpression(expression);
    setTimeout(() => {
      const solution = calculateDerivative(expression);
      const functionAnalysis = analyzeFunction(expression);
      setResult(solution);
      setAnalysis(functionAnalysis);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb Navigation */}
      <NavigationBreadcrumb
        items={[
          { label: 'رياضيات الباكالوريا', path: '/bac-math' },
          { label: 'الدوال', isCurrent: true },
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
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 mb-4">
          <FunctionSquare className="w-5 h-5" />
          <span className="font-medium">تحليل الدوال</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">دراسة الدوال الرياضية</h1>
        <p className="text-muted-foreground">
          حساب المشتقات والتكاملات مع رسم بياني تفاعلي
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="card-elevated p-6">
        <Tabs defaultValue="study" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="study" className="gap-2">
              <Search className="w-4 h-4" />
              دراسة كاملة
            </TabsTrigger>
            <TabsTrigger value="derivative" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              الاشتقاق
            </TabsTrigger>
            <TabsTrigger value="integral" className="gap-2">
              <ArrowDownUp className="w-4 h-4" />
              التكامل
            </TabsTrigger>
          </TabsList>

          <TabsContent value="study" className="space-y-6">
            <MathInput
              placeholder="أدخل الدالة لدراستها مثل: x^3 - 3x"
              onSubmit={handleFullStudy}
              examples={derivativeExamples}
              loading={loading}
            />
            
            <div className="text-sm text-muted-foreground space-y-1">
              <p>🔍 <strong>الدراسة الكاملة تشمل:</strong></p>
              <ul className="list-disc list-inside mr-4 space-y-1">
                <li>حساب المشتقة الأولى والثانية</li>
                <li>إيجاد الأصفار والنقاط الحرجة</li>
                <li>جدول التغيرات</li>
                <li>المستقيمات المقاربة</li>
                <li>حساب النهايات عند أطراف المجال</li>
                <li>الرسم البياني التفاعلي مع التكبير والتصغير</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="derivative" className="space-y-6">
            <MathInput
              placeholder="أدخل الدالة للاشتقاق مثل: x^2 + 3x"
              onSubmit={handleDerivative}
              examples={derivativeExamples}
              loading={loading}
            />
            
            <div className="text-sm text-muted-foreground space-y-1">
              <p>💡 <strong>قواعد الاشتقاق الأساسية:</strong></p>
              <ul className="list-disc list-inside mr-4 space-y-1">
                <li><MathContent content="(x^n)' = n \cdot x^{n - 1}" /></li>
                <li><MathContent content="(f + g)' = f' + g'" /></li>
                <li><MathContent content="(c \cdot f)' = c \cdot f'" /></li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="integral" className="space-y-6">
            <MathInput
              placeholder="أدخل الدالة للتكامل مثل: x^2"
              onSubmit={handleIntegral}
              examples={integralExamples}
              loading={loading}
            />
            
            <div className="text-sm text-muted-foreground space-y-1">
              <p>💡 <strong>قواعد التكامل الأساسية:</strong></p>
              <ul className="list-disc list-inside mr-4 space-y-1">
                <li><MathContent content="\int x^n \, dx = \frac{x^{n + 1}}{n + 1} + C" /></li>
                <li><MathContent content="\int (f + g) \, dx = \int f \, dx + \int g \, dx" /></li>
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
          className="space-y-6"
        >
          <div className="card-elevated p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <h2 className="text-xl font-bold">النتيجة</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Switch
                    id="show-graph"
                    checked={showGraph}
                    onCheckedChange={setShowGraph}
                  />
                  <Label htmlFor="show-graph">الرسم البياني</Label>
                </div>
                {analysis && (
                  <>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="show-variation"
                        checked={showVariationTable}
                        onCheckedChange={setShowVariationTable}
                      />
                      <Label htmlFor="show-variation">جدول التغيرات</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="show-points"
                        checked={showSpecialPoints}
                        onCheckedChange={setShowSpecialPoints}
                      />
                      <Label htmlFor="show-points">النقاط الخاصة</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="show-limits"
                        checked={showLimits}
                        onCheckedChange={setShowLimits}
                      />
                      <Label htmlFor="show-limits">النهايات</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="show-asymptotes"
                        checked={showAsymptotes}
                        onCheckedChange={setShowAsymptotes}
                      />
                      <Label htmlFor="show-asymptotes">المقاربات</Label>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <SolutionSteps result={result} showDetailed={true} />
          </div>

          {/* Limits Table */}
          {analysis && showLimits && analysis.limits.length > 0 && (
            <LimitsTable limits={analysis.limits} />
          )}

          {/* Variation Table */}
          {analysis && showVariationTable && (
            <VariationTable
              derivative={analysis.derivative}
              variationTable={analysis.variationTable}
              criticalPoints={analysis.criticalPoints}
            />
          )}

          {/* Special Points Legend */}
          {analysis && showSpecialPoints && (
            <SpecialPointsLegend
              roots={analysis.roots}
              extrema={analysis.extrema}
              inflectionPoints={analysis.inflectionPoints}
              asymptotes={showAsymptotes ? analysis.asymptotes : []}
            />
          )}

          {/* Graph with special points and asymptotes */}
          {showGraph && currentExpression && (
            <FunctionGraph 
              expression={currentExpression}
              specialPoints={analysis ? [...analysis.roots, ...analysis.extrema, ...analysis.inflectionPoints] : []}
              asymptotes={analysis?.asymptotes || []}
              showSpecialPoints={showSpecialPoints}
              showAsymptotes={showAsymptotes}
            />
          )}
        </motion.div>
      )}

      {/* Educational Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card-elevated p-6">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              📈
            </span>
            دراسة دالة كاملة
          </h3>
          <ul className="text-sm text-secondary-foreground space-y-2">
            <li>✓ مجموعة التعريف</li>
            <li>✓ النهايات عند أطراف المجال</li>
            <li>✓ المشتقة وجدول التغيرات</li>
            <li>✓ القيم القصوى (max, min)</li>
            <li>✓ الرسم البياني</li>
          </ul>
        </div>

        <div className="card-elevated p-6">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              🎯
            </span>
            نصائح للبكالوريا
          </h3>
          <ul className="text-sm text-secondary-foreground space-y-2">
            <li>• تذكر دائماً التحقق من مجموعة التعريف</li>
            <li>• ادرس إشارة المشتقة لا قيمتها</li>
            <li>• الرسم البياني يساعد في الفهم</li>
            <li>• تحقق من النتائج بالتعويض</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
