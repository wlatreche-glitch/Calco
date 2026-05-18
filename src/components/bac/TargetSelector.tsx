import { motion } from 'framer-motion';
import { useBacStore } from '@/store/bacStore';
import { Target } from 'lucide-react';

const PRESETS = [10, 12, 14, 16, 18];

export default function TargetSelector() {
  const { target, setTarget } = useBacStore();
  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      <span className="flex items-center gap-1 text-sm font-bold text-muted-foreground">
        <Target className="w-4 h-4" /> الهدف:
      </span>
      {PRESETS.map((p) => {
        const active = target === p;
        return (
          <motion.button
            key={p}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTarget(p)}
            className={`w-11 h-11 rounded-xl font-bold text-sm transition-all ${
              active
                ? 'text-white shadow-glow'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/70'
            }`}
            style={active ? { background: 'var(--gradient-calco)' } : undefined}
          >
            {p}
          </motion.button>
        );
      })}
      <input
        type="number"
        inputMode="decimal"
        min={0}
        max={20}
        step={0.5}
        value={target}
        onChange={(e) => setTarget(Math.max(0, Math.min(20, parseFloat(e.target.value) || 0)))}
        className="w-16 h-11 rounded-xl bg-secondary text-center font-bold text-sm border border-border focus:border-primary focus:outline-none"
      />
    </div>
  );
}
