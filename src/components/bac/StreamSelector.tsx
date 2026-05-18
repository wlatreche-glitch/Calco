import { motion } from 'framer-motion';
import { STREAMS } from '@/lib/bacData';
import { useBacStore } from '@/store/bacStore';

export default function StreamSelector() {
  const { streamId, setStream } = useBacStore();
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {STREAMS.map((s) => {
        const active = s.id === streamId;
        return (
          <motion.button
            key={s.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStream(s.id)}
            className={`px-4 py-2 rounded-2xl text-sm font-bold border transition-all ${
              active
                ? 'text-white border-transparent shadow-glow'
                : 'bg-card text-foreground border-border hover:border-primary/50'
            }`}
            style={active ? { background: 'var(--gradient-calco)' } : undefined}
          >
            <span className="ml-1">{s.emoji}</span>
            {s.name}
          </motion.button>
        );
      })}
    </div>
  );
}
