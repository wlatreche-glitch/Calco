import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, Variable, ChevronRight, BookOpen, GraduationCap, Target, Triangle, Ruler, Compass, Box, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NavigationBreadcrumb from '@/components/NavigationBreadcrumb';
import NumberOperations from '@/components/bem/NumberOperations';
import EquationsSolver from '@/components/bem/EquationsSolver';
import ThalesCalculator from '@/components/bem/ThalesCalculator';
import PythagorasCalculator from '@/components/bem/PythagorasCalculator';
import DistanceCalculator from '@/components/bem/DistanceCalculator';
import AnglesCalculator from '@/components/bem/AnglesCalculator';
import AreaVolumeCalculator from '@/components/bem/AreaVolumeCalculator';
import LinearFunctionsModule from '@/components/bem/LinearFunctionsModule';
import { PedagogyMode } from '@/lib/middleSchoolMathEngine';

const mathTools = [
  { 
    id: 'numbers', 
    icon: Calculator, 
    titleAr: 'العمليات على الأعداد والجذور', 
    description: 'الكسور، الأعداد الناطقة، الجذور التربيعية',
    color: 'from-blue-500 to-cyan-500',
    category: 'algebra'
  },
  { 
    id: 'equations', 
    icon: Variable, 
    titleAr: 'المعادلات والمتراجحات', 
    description: 'حل المعادلات والمتراجحات الخطية',
    color: 'from-purple-500 to-pink-500',
    category: 'algebra'
  },
  { 
    id: 'linear-functions', 
    icon: TrendingUp, 
    titleAr: 'الدوال الخطية والتآلفية', 
    description: 'f(x)=ax · f(x)=ax+b · الرسم البياني · اختبار النقطة',
    color: 'from-sky-500 to-indigo-500',
    category: 'algebra'
  },
  { 
    id: 'thales', 
    icon: Triangle, 
    titleAr: 'نظرية طاليس', 
    description: 'المباشرة والعكسية - حساب الأطوال وإثبات التوازي',
    color: 'from-indigo-500 to-blue-500',
    category: 'geometry'
  },
  { 
    id: 'pythagoras', 
    icon: Triangle, 
    titleAr: 'نظرية فيثاغورس', 
    description: 'حساب الأضلاع وإثبات أن المثلث قائم',
    color: 'from-emerald-500 to-teal-500',
    category: 'geometry'
  },
  { 
    id: 'distance', 
    icon: Ruler, 
    titleAr: 'المسافات ونصف القطر', 
    description: 'حساب المسافة بين نقطتين والقطر',
    color: 'from-sky-500 to-blue-500',
    category: 'geometry'
  },
  { 
    id: 'angles', 
    icon: Compass, 
    titleAr: 'الزوايا والمثلثات', 
    description: 'حساب الزوايا وخصائص المثلثات',
    color: 'from-orange-500 to-amber-500',
    category: 'geometry'
  },
  { 
    id: 'area-volume', 
    icon: Box, 
    titleAr: 'المساحات والحجوم', 
    description: 'مساحة الأشكال وحجم المجسمات',
    color: 'from-violet-500 to-purple-500',
    category: 'geometry'
  },
];

export default function BEMMath() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [pedagogyMode, setPedagogyMode] = useState<PedagogyMode>('learning');

  // Read URL parameters on mount
  useEffect(() => {
    const toolParam = searchParams.get('tool');
    const modeParam = searchParams.get('mode') as PedagogyMode | null;
    
    if (toolParam && mathTools.some(t => t.id === toolParam)) {
      setSelectedTool(toolParam);
    }
    if (modeParam && ['learning', 'practice', 'exam'].includes(modeParam)) {
      setPedagogyMode(modeParam);
    }
  }, [searchParams]);

  // Update URL when tool or mode changes
  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    setSearchParams({ tool: toolId, mode: pedagogyMode });
  };

  const handleModeChange = (mode: PedagogyMode) => {
    setPedagogyMode(mode);
    if (selectedTool) {
      setSearchParams({ tool: selectedTool, mode });
    }
  };

  const handleBackToList = () => {
    setSelectedTool(null);
    setSearchParams({});
  };

  const renderToolContent = () => {
    switch (selectedTool) {
      case 'numbers':
        return <NumberOperations mode={pedagogyMode} />;
      case 'equations':
        return <EquationsSolver mode={pedagogyMode} />;
      case 'linear-functions':
        return <LinearFunctionsModule mode={pedagogyMode} />;
      case 'thales':
        return <ThalesCalculator mode={pedagogyMode} />;
      case 'pythagoras':
        return <PythagorasCalculator mode={pedagogyMode} />;
      case 'distance':
        return <DistanceCalculator mode={pedagogyMode} />;
      case 'angles':
        return <AnglesCalculator mode={pedagogyMode} />;
      case 'area-volume':
        return <AreaVolumeCalculator mode={pedagogyMode} />;
      default:
        return null;
    }
  };

  const algebraTools = mathTools.filter(t => t.category === 'algebra');
  const geometryTools = mathTools.filter(t => t.category === 'geometry');

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">رياضيات 4 متوسط</h1>
        </div>
        <p className="text-muted-foreground">أدوات رياضية تعليمية لشهادة التعليم المتوسط BEM</p>
      </motion.div>

      {/* Pedagogy Mode Selector */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">وضع الحل:</span>
            <div className="flex gap-2">
              {[
                { mode: 'learning' as const, icon: BookOpen, label: 'تعلم', desc: 'شرح كامل' },
                { mode: 'practice' as const, icon: GraduationCap, label: 'تدريب', desc: 'خطوات جزئية' },
                { mode: 'exam' as const, icon: Target, label: 'امتحان', desc: 'نتيجة فقط' },
              ].map(({ mode, icon: Icon, label, desc }) => (
                <Badge 
                  key={mode} 
                  variant={pedagogyMode === mode ? 'default' : 'outline'} 
                  className="cursor-pointer px-4 py-2 flex-col h-auto" 
                  onClick={() => handleModeChange(mode)}
                >
                  <div className="flex items-center gap-1">
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </div>
                  <span className="text-xs opacity-70">{desc}</span>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tool Content or Tool List */}
      {selectedTool ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          <NavigationBreadcrumb
            items={[
              { label: 'رياضيات متوسط', path: '/bem-math' },
              { label: mathTools.find(t => t.id === selectedTool)?.titleAr || '', isCurrent: true },
            ]}
            onBack={handleBackToList}
            showBackButton
          />
          {renderToolContent()}
        </motion.div>
      ) : (
        <div className="space-y-8">
          {/* Algebra Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">الجبر والحساب</h2>
              <Badge variant="secondary">Algèbre</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {algebraTools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <motion.div 
                    key={tool.id} 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className="relative overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] group h-full" 
                      onClick={() => handleToolSelect(tool.id)}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                      <CardHeader className="relative pb-2">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-2 shadow-lg`}>
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
          </div>

          {/* Geometry Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Triangle className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold">الهندسة</h2>
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700">Géométrie</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {geometryTools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <motion.div 
                    key={tool.id} 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: (index + 2) * 0.1 }}
                  >
                    <Card 
                      className="relative overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] group h-full" 
                      onClick={() => handleToolSelect(tool.id)}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                      <CardHeader className="relative pb-2">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-2 shadow-lg`}>
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
          </div>
        </div>
      )}
    </div>
  );
}
