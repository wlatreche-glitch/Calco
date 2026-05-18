import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Star, Clock, Sparkles } from 'lucide-react';
import { getFavorites, getRecent, toggleFavorite } from '@/lib/userPrefs';

type Item = { path: string; label: string; emoji?: string; tag?: string };

const ALL: Item[] = [
  { path: '/equations', label: 'المعادلات', emoji: '🧮', tag: 'رياضيات' },
  { path: '/functions', label: 'الدوال', emoji: '🧠', tag: 'رياضيات' },
  { path: '/graph', label: 'الرسم البياني', emoji: '📈', tag: 'رياضيات' },
  { path: '/sequences', label: 'المتتاليات', emoji: '∑', tag: 'رياضيات' },
  { path: '/matrices', label: 'المصفوفات', emoji: '🔢', tag: 'رياضيات' },
  { path: '/statistics', label: 'الإحصاء والاحتمالات', emoji: '📊', tag: 'رياضيات' },
  { path: '/physics', label: 'الفيزياء', emoji: '⚛️', tag: 'علوم' },
  { path: '/bac-chemistry', label: 'الكيمياء', emoji: '🧪', tag: 'علوم' },
  { path: '/exercises', label: 'التمارين', emoji: '🎲', tag: 'مراجعة' },
  { path: '/coach', label: 'Calco Coach', emoji: '🤖', tag: 'مراجعة' },
  { path: '/bem-math', label: 'رياضيات متوسط', emoji: '🏫', tag: 'BEM' },
  { path: '/bem-physics', label: 'فيزياء متوسط', emoji: '⚓', tag: 'BEM' },
];

export default function SmartSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [favs, setFavs] = useState<string[]>(getFavorites());
  const recents = getRecent();

  useEffect(() => {
    if (!open) setQ('');
    if (open) setFavs(getFavorites());
  }, [open]);

  const filtered = useMemo(() => {
    if (!q.trim()) return [];
    const term = q.trim().toLowerCase();
    return ALL.filter((i) => i.label.toLowerCase().includes(term) || i.tag?.toLowerCase().includes(term));
  }, [q]);

  const favItems = ALL.filter((i) => favs.includes(i.path));
  const recentItems = recents.map((p) => ALL.find((i) => i.path === p)).filter(Boolean) as Item[];

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-4" onClick={onClose}>
      <div dir="rtl" onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
        <div className="flex items-center gap-2 p-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن أداة… (مثال: الدوال، فيزياء)"
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary"><X className="w-4 h-4" /></button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {q ? (
            <Section title="نتائج البحث" icon={<Sparkles className="w-4 h-4" />} items={filtered} favs={favs} setFavs={setFavs} onClose={onClose} empty="لا توجد نتائج." />
          ) : (
            <>
              <Section title="المفضلة" icon={<Star className="w-4 h-4 text-amber-500" />} items={favItems} favs={favs} setFavs={setFavs} onClose={onClose} empty="أضف أدوات للمفضلة بالنقر على ⭐." />
              <Section title="المستخدمة مؤخرًا" icon={<Clock className="w-4 h-4 text-sky-500" />} items={recentItems} favs={favs} setFavs={setFavs} onClose={onClose} empty="لا يوجد سجل بعد." />
              <Section title="كل الأدوات" icon={<Sparkles className="w-4 h-4 text-violet-500" />} items={ALL} favs={favs} setFavs={setFavs} onClose={onClose} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, items, favs, setFavs, onClose, empty }: {
  title: string; icon: React.ReactNode; items: Item[]; favs: string[];
  setFavs: (f: string[]) => void; onClose: () => void; empty?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 text-xs font-bold text-muted-foreground uppercase tracking-wide">{icon}{title}</div>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground p-2">{empty}</p>
      ) : (
        <ul className="space-y-1">
          {items.map((i) => (
            <li key={i.path + i.label} className="flex items-center gap-2">
              <Link to={i.path} onClick={onClose} className="flex-1 flex items-center gap-2 p-2.5 rounded-xl bg-secondary/40 hover:bg-secondary text-sm font-medium transition">
                <span className="text-lg">{i.emoji}</span>
                <span className="flex-1">{i.label}</span>
                {i.tag && <span className="text-[10px] px-2 py-0.5 rounded-full bg-background text-muted-foreground">{i.tag}</span>}
              </Link>
              <button
                onClick={() => setFavs(toggleFavorite(i.path))}
                aria-label="مفضلة"
                className="p-2 rounded-xl hover:bg-secondary"
              >
                <Star className={`w-4 h-4 ${favs.includes(i.path) ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}