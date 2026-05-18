import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Atom, Zap, Waves, Thermometer, Activity, Ruler, BookOpen, GraduationCap, Target, ChevronRight, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import NavigationBreadcrumb from '@/components/NavigationBreadcrumb';
import MotionCalculator from '@/components/physics/MotionCalculator';
import CircuitCalculator from '@/components/physics/CircuitCalculator';
import OscillationCalculator from '@/components/physics/OscillationCalculator';
import ThermodynamicsCalculator from '@/components/physics/ThermodynamicsCalculator';
import PhysicsConstants from '@/components/physics/PhysicsConstants';
import OpticsCalculator from '@/components/physics/OpticsCalculator';
import NuclearCalculator from '@/components/physics/NuclearCalculator';
import { PedagogyMode } from '@/lib/physicsEngine';

const physicsTools = [
  { id: 'motion', icon: Activity, titleAr: 'محلل الحركة', description: 'MRU, MRUA, السقوط الحر', color: 'from-blue-500 to-cyan-500', available: true },
  { id: 'circuits', icon: Zap, titleAr: 'الدارات الكهربائية', description: 'قانون أوم، التوالي، التوازي', color: 'from-yellow-500 to-orange-500', available: true },
  { id: 'oscillations', icon: Waves, titleAr: 'الذبذبات والأمواج', description: 'الحركة التوافقية، الأمواج', color: 'from-purple-500 to-pink-500', available: true },
  { id: 'thermodynamics', icon: Thermometer, titleAr: 'الديناميكا الحرارية', description: 'الحرارة، العمل، الطاقة', color: 'from-red-500 to-rose-500', available: true },
  { id: 'optics', icon: Eye, titleAr: 'البصريات الهندسية', description: 'العدسات، المرايا، الانكسار', color: 'from-sky-500 to-indigo-500', available: true },
  { id: 'nuclear', icon: Atom, titleAr: 'الفيزياء النووية', description: 'التفكك، العمر النصفي، طاقة الربط', color: 'from-green-500 to-lime-500', available: true },
  { id: 'constants', icon: Ruler, titleAr: 'الثوابت والوحدات', description: 'ثوابت فيزيائية، تحويل الوحدات', color: 'from-emerald-500 to-teal-500', available: true },
];

export default function Physics() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [pedagogyMode, setPedagogyMode] = useState<PedagogyMode>('learning');

  // Read URL parameters on mount
  useEffect(() => {
    const toolParam = searchParams.get('tool');
    const modeParam = searchParams.get('mode') as PedagogyMode | null;
    
    if (toolParam && physicsTools.some(t => t.id === toolParam)) {
      setSelectedTool(toolParam);
    }
    if (modeParam && ['learning', 'revision', 'exam'].includes(modeParam)) {
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
      case 'motion': return <MotionCalculator mode={pedagogyMode} />;
      case 'circuits': return <CircuitCalculator mode={pedagogyMode} />;
      case 'oscillations': return <OscillationCalculator mode={pedagogyMode} />;
      case 'thermodynamics': return <ThermodynamicsCalculator mode={pedagogyMode} />;
      case 'optics': return <OpticsCalculator mode={pedagogyMode} />;
      case 'nuclear': return <NuclearCalculator mode={pedagogyMode} />;
      case 'constants': return <PhysicsConstants />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
            <Atom className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">الفيزياء</h1>
        </div>
        <p className="text-muted-foreground">الحاسبة الفيزيائية التعليمية - BAC علوم تجريبية</p>
      </motion.div>

      <Card className="border-2 border-primary/20">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">وضع الحل:</span>
            <div className="flex gap-2">
              {[
                { mode: 'learning' as const, icon: BookOpen, label: 'تعلم' },
                { mode: 'revision' as const, icon: GraduationCap, label: 'مراجعة' },
                { mode: 'exam' as const, icon: Target, label: 'امتحان' },
              ].map(({ mode, icon: Icon, label }) => (
                <Badge key={mode} variant={pedagogyMode === mode ? 'default' : 'outline'} className="cursor-pointer px-4 py-2" onClick={() => handleModeChange(mode)}>
                  <Icon className="w-4 h-4 ml-2" />{label}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedTool ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          <NavigationBreadcrumb
            items={[
              { label: 'الفيزياء', path: '/physics' },
              { label: physicsTools.find(t => t.id === selectedTool)?.titleAr || '', isCurrent: true },
            ]}
            onBack={handleBackToList}
            showBackButton
          />
          {renderToolContent()}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {physicsTools.map((tool, index) => {
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
