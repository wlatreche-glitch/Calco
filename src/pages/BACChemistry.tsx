import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FlaskConical, ChevronRight, Timer } from 'lucide-react';
import NavigationBreadcrumb from '@/components/NavigationBreadcrumb';
import EquilibriumEvolution from '@/components/chemistry/EquilibriumEvolution';
import KineticsTracker from '@/components/chemistry/KineticsTracker';

const tools = [
  {
    id: 'equilibrium',
    title: 'تطور جملة كيميائية نحو التوازن',
    titleFr: 'Évolution vers l\'équilibre',
    description: 'حل تمارين بستايل الباك: جدول التقدم، x_max، x_f، τ_f، Q_r ومقارنته مع K.',
    icon: FlaskConical,
    component: EquilibriumEvolution,
  },
  {
    id: 'kinetics',
    title: 'المتابعة الزمنية لتحول كيميائي',
    titleFr: 'Suivi temporel d\'une transformation',
    description: 'حل تمارين الحركية: x(t)، x_max، t₁ₐ₂، السرعة الحجمية، المتفاعل المحدّ، فخاخ الباك ومنحنى x=f(t).',
    icon: Timer,
    component: KineticsTracker,
  },
];

export default function BACChemistry() {
  const [params, setParams] = useSearchParams();
  const toolId = params.get('tool');
  const active = tools.find(t => t.id === toolId);

  if (active) {
    const Comp = active.component;
    return (
      <div className="space-y-6" dir="rtl">
        <NavigationBreadcrumb
          items={[
            { label: 'أدوات الكيمياء', path: '/bac-chemistry' },
            { label: active.title, isCurrent: true },
          ]}
          onBack={() => setParams({})}
          showBackButton
        />
        <Comp />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-center py-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <FlaskConical className="w-4 h-4" />
          <span>الكيمياء — التعليم الثانوي (Bac)</span>
        </div>
        <h1 className="text-3xl font-bold gradient-text mb-2">أدوات الكيمياء</h1>
        <p className="text-muted-foreground">اختر أداة لحلّ التمارين خطوة بخطوة بأسلوب الباك الجزائري</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {tools.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.id} to={`/bac-chemistry?tool=${t.id}`}>
              <Card className="hover:border-primary/40 hover:shadow-md transition-all h-full">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="secondary">3 ثانوي</Badge>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{t.title}</h3>
                    <p className="text-xs text-muted-foreground">{t.titleFr}</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}