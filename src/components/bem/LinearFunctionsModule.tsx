import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Table2, BarChart3, MapPin, GitBranch, BookOpen, Target, GraduationCap, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PedagogyMode } from '@/lib/linearFunctionEngine';
import FunctionAnalyzer from './linear/FunctionAnalyzer';
import TableOfValues from './linear/TableOfValues';
import GraphRenderer from './linear/GraphRenderer';
import PointChecker from './linear/PointChecker';
import EquationFromPoints from './linear/EquationFromPoints';

interface Props { mode: PedagogyMode }

const tools = [
  { id: 'analyzer', icon: TrendingUp, titleAr: 'تحليل الدالة', desc: 'نوع الدالة، المعاملات، اتجاه التغيرات', color: 'from-sky-500 to-blue-600' },
  { id: 'table', icon: Table2, titleAr: 'جدول القيم', desc: 'إنشاء جدول قيم x و f(x)', color: 'from-indigo-500 to-violet-600' },
  { id: 'graph', icon: BarChart3, titleAr: 'الرسم البياني', desc: 'تمثيل الدالة في مستوى إحداثي', color: 'from-purple-500 to-pink-600' },
  { id: 'point', icon: MapPin, titleAr: 'اختبار نقطة', desc: 'هل تنتمي النقطة للتمثيل البياني؟', color: 'from-emerald-500 to-teal-600' },
  { id: 'equation', icon: GitBranch, titleAr: 'معادلة من نقطتين', desc: 'إيجاد f(x) = ax + b من نقطتين', color: 'from-orange-500 to-amber-600' },
];

export default function LinearFunctionsModule({ mode }: Props) {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const renderTool = () => {
    switch (activeTool) {
      case 'analyzer': return <FunctionAnalyzer mode={mode} />;
      case 'table': return <TableOfValues mode={mode} />;
      case 'graph': return <GraphRenderer mode={mode} />;
      case 'point': return <PointChecker mode={mode} />;
      case 'equation': return <EquationFromPoints mode={mode} />;
      default: return null;
    }
  };

  const activeToolInfo = tools.find(t => t.id === activeTool);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-sky-500/20 bg-gradient-to-br from-sky-500/5 to-indigo-500/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>الدوال الخطية والتآلفية</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                f(x) = ax · f(x) = ax + b · المستوى الإحداثي
              </p>
            </div>
            <Badge variant="secondary" className="mr-auto">4 متوسط</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Tool selected view */}
      {activeTool ? (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTool(null)}
              className="flex items-center gap-2 text-primary hover:underline text-sm"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              العودة إلى الأدوات
            </button>
            {activeToolInfo && (
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${activeToolInfo.color} text-white text-sm`}>
                <activeToolInfo.icon className="w-3.5 h-3.5" />
                {activeToolInfo.titleAr}
              </div>
            )}
          </div>
          {renderTool()}
        </motion.div>
      ) : (
        <div className="space-y-4">
          {/* Tools grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Card
                    className="relative overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] group"
                    onClick={() => setActiveTool(tool.id)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                    <CardHeader className="relative pb-2">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-2 shadow-md`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <CardTitle className="text-base">{tool.titleAr}</CardTitle>
                    </CardHeader>
                    <CardContent className="relative pt-0">
                      <p className="text-xs text-muted-foreground">{tool.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Reference */}
          <Card className="border-2 border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                مرجع سريع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="font-semibold text-sky-600">🔵 الدالة الخطية</p>
                  <p className="font-mono bg-secondary/60 px-2 py-1 rounded">f(x) = ax</p>
                  <ul className="text-muted-foreground space-y-1 text-xs list-disc list-inside">
                    <li>تمر بالأصل O(0, 0)</li>
                    <li>a: معامل التناسب (الميل)</li>
                    <li>a &gt; 0: متزايدة | a &lt; 0: متناقصة</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-violet-600">🟣 الدالة التآلفية</p>
                  <p className="font-mono bg-secondary/60 px-2 py-1 rounded">f(x) = ax + b</p>
                  <ul className="text-muted-foreground space-y-1 text-xs list-disc list-inside">
                    <li>تقطع محور y في B(0, b)</li>
                    <li>تقطع محور x في A(−b/a, 0)</li>
                    <li>b: الترتيب عند المحور</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
