import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Play, Flame, Trophy, Clock, Target } from 'lucide-react';
import { loadState, levelOf } from '@/lib/coachEngine';

export default function HeroRevision() {
  const state = loadState();
  const lvl = levelOf(state.xp);
  const chips = [
    { icon: Flame, text: 'الأكثر استخدامًا' },
    { icon: Clock, text: '5 دقائق' },
    { icon: Target, text: 'BAC 2026' },
  ];
  return (
    <section
      className="relative overflow-hidden rounded-3xl px-5 py-8 sm:py-10 text-white"
      style={{ background: 'var(--gradient-hero-bg)' }}
    >
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-calco-violet/30 blur-3xl" />
      <div className="absolute -bottom-12 -left-10 w-56 h-56 rounded-full bg-calco-cyan/25 blur-3xl" />

      <div className="relative space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/15">
            <Rocket className="w-6 h-6 text-calco-yellow" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight">
              🚀 المراجعة النهائية للبكالوريا
            </h2>
            <p className="text-sm opacity-85 mt-1">
              اختبارات ذكية + تحليل سريع + مراجعة مركّزة قبل الباك
            </p>
          </div>
        </div>

        {/* chips */}
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => {
            const Icon = c.icon;
            return (
              <span
                key={c.text}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md"
              >
                <Icon className="w-3.5 h-3.5 text-calco-yellow" />
                {c.text}
              </span>
            );
          })}
        </div>

        {/* progress */}
        <div className="grid grid-cols-3 gap-3">
          <Stat label="XP" value={state.xp} icon={Trophy} />
          <Stat label="السلسلة" value={`${state.streak} 🔥`} icon={Flame} />
          <Stat label="المستوى" value={lvl.name} icon={Target} />
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${lvl.pct}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-gradient-to-r from-calco-yellow via-calco-cyan to-calco-violet"
          />
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            to="/coach"
            className="inline-flex items-center gap-2 bg-calco-yellow text-calco-deep font-extrabold rounded-2xl px-5 py-3 shadow-2xl hover:scale-105 active:scale-95 transition"
          >
            <Play className="w-5 h-5" />
            🎯 ابدأ الكويز
          </Link>
          <Link
            to="/coach"
            className="btn-calco-ghost"
          >
            ⚡ أكمل آخر مراجعة
          </Link>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon: any }) {
  return (
    <div className="rounded-2xl bg-white/8 border border-white/15 backdrop-blur-md px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[11px] opacity-80">
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      <div className="text-base sm:text-lg font-extrabold mt-0.5">{value}</div>
    </div>
  );
}