import { useState } from 'react';
import { motion } from 'framer-motion';
import { Atom, Anchor, Zap, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NavigationBreadcrumb from '@/components/NavigationBreadcrumb';
import ArchimedesCalculator from '@/components/bem/physics/ArchimedesCalculator';
import ElectricityLab from '@/components/bem/physics/ElectricityLab';

const tools = [
  {
    id: 'electricity',
    icon: Zap,
    titleAr: 'مختبر الكهرباء والأمن',
    description: 'التيار المتناوب، راسم الاهتزاز، والأمن الكهربائي',
    color: 'from-orange-600 to-yellow-500',
  },
  {
    id: 'archimedes',
    icon: Anchor,
    titleAr: 'دافعة أرخميدس',
    description: 'الربيعة، خصائص السائل، الطفو، وسلم الرسم',
    color: 'from-blue-600 to-cyan-500',
  },
];

export default function BEMPhysics() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-6" dir="rtl">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg">
            <Atom className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">فيزياء 4 متوسط</h1>
        </div>
        <p className="text-muted-foreground">أدوات فيزيائية تعليمية لشهادة التعليم المتوسط BEM</p>
      </motion.div>

      {selected === 'electricity' ? (
        <div className="space-y-4">
          <NavigationBreadcrumb
            items={[
              { label: 'فيزياء متوسط', path: '/bem-physics' },
              { label: 'مختبر الكهرباء والأمن', isCurrent: true },
            ]}
            onBack={() => setSelected(null)}
            showBackButton
          />
          <ElectricityLab />
        </div>
      ) : selected === 'archimedes' ? (
        <div className="space-y-4">
          <NavigationBreadcrumb
            items={[
              { label: 'فيزياء متوسط', path: '/bem-physics' },
              { label: 'دافعة أرخميدس', isCurrent: true },
            ]}
            onBack={() => setSelected(null)}
            showBackButton
          />
          <ArchimedesCalculator />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div key={tool.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card
                  className="relative overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] group h-full"
                  onClick={() => setSelected(tool.id)}
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
      )}
    </div>
  );
}