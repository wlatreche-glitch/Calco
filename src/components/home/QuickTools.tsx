import { Link } from 'react-router-dom';
import { Calculator, FunctionSquare, LineChart, BarChart3, Atom, Zap } from 'lucide-react';

const TOOLS = [
  { path: '/functions', label: 'الدوال', icon: FunctionSquare, badge: '🔥 الأكثر استخدامًا', color: 'from-amber-500 to-orange-500' },
  { path: '/equations', label: 'المعادلات', icon: Calculator, badge: '🎯 مهم للباك', color: 'from-indigo-500 to-violet-500' },
  { path: '/graph', label: 'الرسم البياني', icon: LineChart, badge: '', color: 'from-sky-500 to-indigo-500' },
  { path: '/statistics', label: 'الإحصاء', icon: BarChart3, badge: '', color: 'from-orange-500 to-amber-500' },
  { path: '/physics', label: 'الفيزياء', icon: Atom, badge: 'جديد', color: 'from-fuchsia-500 to-purple-500' },
];

export default function QuickTools() {
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-extrabold flex items-center gap-2">
        <Zap className="w-5 h-5 text-calco-yellow fill-calco-yellow" /> ⚡ أدوات سريعة
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.path}
              to={t.path}
              className={`relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br ${t.color} text-white font-bold shadow-md hover:scale-[1.03] active:scale-95 transition min-h-[96px] flex flex-col justify-between`}
            >
              <Icon className="w-6 h-6" />
              <div>
                <div className="text-sm">{t.label}</div>
                {t.badge && (
                  <div className="mt-1 inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md">
                    {t.badge}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}