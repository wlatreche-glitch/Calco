import { motion, AnimatePresence } from 'framer-motion';
import { useBacStore } from '@/store/bacStore';
import { STREAMS } from '@/lib/bacData';
import {
  computeAverage,
  statusMessage,
  bestSubjectToImprove,
  solveMissing,
} from '@/lib/bacEngine';
import { Sparkles, Target, TrendingUp, Wand2, Share2, RotateCcw } from 'lucide-react';
import { useMemo } from 'react';
import { toast } from 'sonner';

export default function LiveResultPanel() {
  const { streamId, target, grades, applySolved, resetGrades } = useBacStore();
  const stream = STREAMS.find((s) => s.id === streamId)!;
  const result = useMemo(() => computeAverage(stream, grades), [stream, grades]);
  const best = useMemo(() => bestSubjectToImprove(stream, grades), [stream, grades]);
  const status = statusMessage(result.average, target, result.filledCount);

  const pct = Math.min(100, (result.average / 20) * 100);
  const targetPct = Math.min(100, (target / 20) * 100);

  const onSolve = () => {
    const r = solveMissing(stream, grades, target);
    if (!r.ok) {
      toast.error(r.reason || 'تعذر حساب الحل');
      return;
    }
    applySolved(r.solved);
    toast.success('تم اقتراح علامات المواد الفارغة 🎯');
  };

  const onShare = async () => {
    const text = `🎯 معدلي في الباك (Calco)\nالشعبة: ${stream.name}\nالهدف: ${target}\nالمعدل الحالي: ${result.average.toFixed(2)}/20\n${best ? `أفضل مادة لرفع المعدل: ${best.subject.name}` : ''}\nجرب الحاسبة 👇\n${typeof window !== 'undefined' ? window.location.origin : ''}`;
    try {
      if (navigator.share) await navigator.share({ title: 'Calco', text });
      else {
        await navigator.clipboard.writeText(text);
        toast.success('تم نسخ بطاقة النتيجة 📋');
      }
    } catch {}
  };

  return (
    <div
      className="rounded-3xl p-5 text-white relative overflow-hidden"
      style={{ background: 'var(--gradient-calco)' }}
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold">معدلك المباشر</span>
          </div>
          <span className="text-xs bg-white/15 px-2 py-1 rounded-full flex items-center gap-1">
            <Target className="w-3 h-3" /> الهدف {target}
          </span>
        </div>

        <div className="flex items-end gap-2 mb-2">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={result.average.toFixed(2)}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              className="text-5xl font-black tabular-nums"
            >
              {result.average.toFixed(2)}
            </motion.span>
          </AnimatePresence>
          <span className="text-lg opacity-80 mb-1">/ 20</span>
        </div>

        {/* Progress bar with target marker */}
        <div className="relative h-3 bg-white/15 rounded-full overflow-hidden mb-3">
          <motion.div
            className="absolute inset-y-0 right-0 bg-white rounded-full"
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', damping: 20 }}
            style={{ left: 'auto' }}
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-calco-yellow"
            style={{ right: `${targetPct}%` }}
            title={`الهدف: ${target}`}
          />
        </div>

        <p className="text-sm font-medium mb-3 min-h-[1.25rem]">{status}</p>

        {best && (
          <div className="bg-white/10 rounded-xl p-3 mb-3 flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 shrink-0" />
            <span>
              ركز على <b>{best.subject.name}</b> — كل +1 يضيف{' '}
              <b>+{best.gainPerPoint.toFixed(2)}</b> للمعدل
            </span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onSolve}
            className="bg-white text-calco-deep rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-1 hover:scale-[1.02] active:scale-95 transition"
          >
            <Wand2 className="w-4 h-4" /> حلّ ذكي
          </button>
          <button
            onClick={onShare}
            className="bg-white/15 hover:bg-white/25 rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-1"
          >
            <Share2 className="w-4 h-4" /> مشاركة
          </button>
          <button
            onClick={resetGrades}
            className="bg-white/15 hover:bg-white/25 rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-1"
          >
            <RotateCcw className="w-4 h-4" /> تصفير
          </button>
        </div>

        <p className="text-[11px] opacity-75 mt-2 text-center">
          {result.filledCount}/{result.totalCount} مادة مدخلة
        </p>
      </div>
    </div>
  );
}
