import { Link } from 'react-router-dom';
import { Trophy, Flame, Star, ArrowLeft } from 'lucide-react';
import { loadState, levelOf } from '@/lib/coachEngine';
import { getFavorites, getRecent } from '@/lib/userPrefs';

export default function ProgressCard() {
  const s = loadState();
  const lvl = levelOf(s.xp);
  const recent = getRecent().length;
  const favs = getFavorites().length;

  return (
    <section className="rounded-3xl p-5 bg-card border border-border shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold flex items-center gap-2">
          📈 تقدمك في Calco
        </h3>
        <Link to="/coach" className="text-xs font-bold text-primary inline-flex items-center gap-1 hover:underline">
          المزيد <ArrowLeft className="w-3 h-3" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat icon={<Trophy className="w-4 h-4 text-amber-500" />} label="XP" value={s.xp} />
        <Stat icon={<Flame className="w-4 h-4 text-orange-500" />} label="السلسلة" value={s.streak} />
        <Stat icon={<Star className="w-4 h-4 text-violet-500" />} label="المستوى" value={lvl.name} />
        <Stat icon={<Star className="w-4 h-4 text-sky-500" />} label="المفضلة" value={favs} />
      </div>
      <div>
        <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
          <span>التقدم نحو المستوى التالي</span>
          <span>{Math.round(lvl.pct)}%</span>
        </div>
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-calco-violet transition-all" style={{ width: `${lvl.pct}%` }} />
        </div>
      </div>
      {recent === 0 && (
        <p className="text-xs text-muted-foreground">ابدأ باستخدام أداة لتظهر هنا في "المستخدمة مؤخرًا".</p>
      )}
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-secondary/50 p-3">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">{icon}{label}</div>
      <div className="text-lg font-extrabold mt-0.5">{value}</div>
    </div>
  );
}