import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ChevronDown, BookOpen, FlaskConical, Trophy, School } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Tool = { label: string; path: string; emoji?: string };
type Category = { id: string; title: string; icon: any; color: string; tools: Tool[] };

const CATEGORIES: Category[] = [
  {
    id: 'math',
    title: '📘 الرياضيات',
    icon: BookOpen,
    color: 'from-indigo-500 to-blue-500',
    tools: [
      { label: 'المعادلات', path: '/equations', emoji: '🧮' },
      { label: 'الدوال', path: '/functions', emoji: '🧠' },
      { label: 'الرسم البياني', path: '/graph', emoji: '📈' },
      { label: 'المتتاليات', path: '/sequences', emoji: '∑' },
      { label: 'المصفوفات', path: '/matrices', emoji: '🔢' },
      { label: 'الإحصاء والاحتمالات', path: '/statistics', emoji: '📊' },
    ],
  },
  {
    id: 'sciences',
    title: '🧪 العلوم',
    icon: FlaskConical,
    color: 'from-fuchsia-500 to-rose-500',
    tools: [
      { label: 'الفيزياء', path: '/physics', emoji: '⚛️' },
      { label: 'الكيمياء', path: '/bac-chemistry', emoji: '🧪' },
    ],
  },
  {
    id: 'revision',
    title: '📚 المراجعة والتدريب',
    icon: Trophy,
    color: 'from-amber-500 to-orange-500',
    tools: [
      { label: 'التمارين', path: '/exercises', emoji: '🎲' },
      { label: 'Calco Coach', path: '/coach', emoji: '🤖' },
      { label: 'مراجعة الباك', path: '/coach', emoji: '🚀' },
    ],
  },
  {
    id: 'bem',
    title: '🏫 المتوسط',
    icon: School,
    color: 'from-emerald-500 to-teal-500',
    tools: [
      { label: 'رياضيات متوسط', path: '/bem-math', emoji: '🧮' },
      { label: 'دافعة أرخميدس', path: '/bem-physics', emoji: '⚓' },
    ],
  },
];

export default function ToolCategories() {
  const [open, setOpen] = useState<string | null>('math');
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-extrabold">🗂️ كل الأدوات</h3>
      <div className="space-y-3">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isOpen = open === cat.id;
          return (
            <div key={cat.id} className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
              <button
                onClick={() => setOpen(isOpen ? null : cat.id)}
                className="w-full flex items-center gap-3 p-4 text-right hover:bg-secondary/50 transition"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="flex-1 font-extrabold text-base">{cat.title}</h4>
                <span className="text-xs text-muted-foreground">{cat.tools.length} أدوات</span>
                <ChevronDown className={`w-4 h-4 transition ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 border-t border-border/50">
                      {cat.tools.map((t) => (
                        <Link
                          key={t.path + t.label}
                          to={t.path}
                          className="flex items-center gap-2 p-3 rounded-xl bg-secondary/40 hover:bg-secondary text-sm font-medium transition"
                        >
                          <span className="text-lg">{t.emoji}</span>
                          <span>{t.label}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}