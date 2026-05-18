import { motion } from 'framer-motion';
import { Subject } from '@/lib/bacData';
import { useBacStore } from '@/store/bacStore';
import { Minus, Plus, Flame } from 'lucide-react';

interface Props {
  subject: Subject;
  highlight?: boolean;
}

export default function SubjectCard({ subject, highlight }: Props) {
  const value = useBacStore((s) => s.grades[subject.id]);
  const setGrade = useBacStore((s) => s.setGrade);

  const change = (delta: number) => {
    const cur = value ?? 10;
    const v = Math.max(0, Math.min(20, +(cur + delta).toFixed(2)));
    setGrade(subject.id, v);
  };

  const onInput = (raw: string) => {
    if (raw === '') return setGrade(subject.id, null);
    const n = parseFloat(raw.replace(',', '.'));
    if (Number.isNaN(n)) return;
    setGrade(subject.id, Math.max(0, Math.min(20, n)));
  };

  const color =
    value == null
      ? 'text-muted-foreground'
      : value >= 14
      ? 'text-emerald-500'
      : value >= 10
      ? 'text-amber-500'
      : 'text-rose-500';

  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className={`rounded-2xl p-3 border bg-card/80 backdrop-blur transition-all ${
        highlight
          ? 'border-calco-violet/50 shadow-[0_0_20px_hsl(var(--calco-violet)/0.25)]'
          : 'border-border'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {highlight && <Flame className="w-4 h-4 text-calco-violet shrink-0" />}
          <span className="font-bold text-sm truncate">{subject.name}</span>
        </div>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
          style={{ background: 'var(--gradient-calco)' }}
        >
          ×{subject.coef}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          aria-label="-"
          onClick={() => change(-0.5)}
          className="w-10 h-10 rounded-xl bg-secondary hover:bg-secondary/70 active:scale-95 transition flex items-center justify-center"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          inputMode="decimal"
          type="text"
          placeholder="—"
          value={value ?? ''}
          onChange={(e) => onInput(e.target.value)}
          className={`flex-1 h-10 rounded-xl bg-background border border-border text-center text-lg font-extrabold focus:outline-none focus:border-primary ${color}`}
        />
        <button
          aria-label="+"
          onClick={() => change(0.5)}
          className="w-10 h-10 rounded-xl bg-secondary hover:bg-secondary/70 active:scale-95 transition flex items-center justify-center"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
