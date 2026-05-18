import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, BookOpen, GraduationCap, Target, ChevronRight, BarChart3, Sigma, Grid3x3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Equations from '@/pages/Equations';
import Functions from '@/pages/Functions';
import Graph from '@/pages/Graph';
import Sequences from '@/pages/Sequences';
import Matrices from '@/pages/Matrices';
import Statistics from '@/pages/Statistics';

const mathTools = [
  { id: 'equations', icon: Calculator, titleAr: 'المعادلات', description: 'حل المعادلات والمتراجحات الخطية', color: 'from-indigo-500 to-blue-500', available: true },
  { id: 'functions', icon: BookOpen, titleAr: 'الدوال', description: 'تحليل الدوال الخطية والتربيعية', color: 'from-purple-500 to-indigo-500', available: true },
  { id: 'graph', icon: BarChart3, titleAr: 'الرسم البياني', description: 'رسم الدوال وتحليل الرسوم البيانية', color: 'from-cyan-500 to-blue-500', available: true },
  { id: 'sequences', icon: Sigma, titleAr: 'المتتاليات', description: 'المتتاليات الحسابية والهندسية', color: 'from-emerald-500 to-teal-500', available: true },
  { id: 'matrices', icon: Grid3x3, titleAr: 'المصفوفات', description: 'العمليات على المصفوفات وحل الأنظمة', color: 'from-orange-500 to-red-500', available: true },
  { id: 'statistics', icon: BarChart3, titleAr: 'الإحصاء', description: 'الإحصاء والاحتمالات وأدوات التمرين', color: 'from-pink-500 to-rose-500', available: true },
];

export default function BACMath() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  // Read URL parameters on mount
  useEffect(() => {
    const toolParam = searchParams.get('tool');
    
    if (toolParam && mathTools.some(t => t.id === toolParam)) {
      setSelectedTool(toolParam);
    }
  }, [searchParams]);

  // Update URL when tool changes
  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    setSearchParams({ tool: toolId });
  };

  const handleBackToList = () => {
    setSelectedTool(null);
    setSearchParams({});
  };

  const renderToolContent = () => {
    switch (selectedTool) {
      case 'equations': return <Equations />;
      case 'functions': return <Functions />;
      case 'graph': return <Graph />;
      case 'sequences': return <Sequences />;
      case 'matrices': return <Matrices />;
      case 'statistics': return <Statistics />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">رياضيات الباكالوريا</h1>
        </div>
        <p className="text-muted-foreground">ستة أدوات متخصصة لمراجعة الرياضيات</p>
      </motion.div>

      {selectedTool ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          <button onClick={handleBackToList} className="flex items-center gap-2 text-primary hover:underline">
            <ChevronRight className="w-4 h-4 rotate-180" />العودة إلى قائمة الأدوات
          </button>
          {renderToolContent()}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mathTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div key={tool.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="relative overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] group" onClick={() => handleToolSelect(tool.id)}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  <CardHeader className="relative pb-2">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-3 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{tool.titleAr}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative pt-0">
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
