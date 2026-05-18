import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  analyze,
  bumpStreak,
  calcoFeedback,
  CoachState,
  levelOf,
  loadState,
  QuizQuestion,
  saveState,
  unitAr,
  UnitStat,
  generateQuiz,
} from '@/lib/coachEngine';
import CalcoMascot from '@/components/CalcoMascot';
import { MathContent } from '@/components/MathContent';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Flame, Zap, Trophy, RotateCcw, Target, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Subject = 'physics' | 'chemistry' | 'math';
type Phase = 'setup' | 'loading' | 'quiz' | 'result';

const SUBJECTS: { id: Subject; label: string; emoji: string; gradient: string }[] = [
  { id: 'physics', label: 'فيزياء', emoji: '⚛️', gradient: 'from-violet-500 to-fuchsia-500' },
  { id: 'chemistry', label: 'كيمياء', emoji: '🧪', gradient: 'from-rose-500 to-orange-500' },
  { id: 'math', label: 'رياضيات', emoji: '∑', gradient: 'from-cyan-500 to-blue-500' },
];

export default function CalcoCoach() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [subject, setSubject] = useState<Subject>('physics');
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [reveal, setReveal] = useState(false);
  const [coach, setCoach] = useState<CoachState>(() => loadState());
  const [recoveryUnit, setRecoveryUnit] = useState<string | undefined>(undefined);

  useEffect(() => saveState(coach), [coach]);

  const startQuiz = async (forcedUnit?: string, qty = count) => {
    setPhase('loading');
    setRecoveryUnit(forcedUnit);
    try {
      const data = generateQuiz(subject, forcedUnit, qty, forcedUnit ? 'easy' : 'medium');
      if (!data?.questions?.length) throw new Error('لا توجد أسئلة');
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(null));
      setIdx(0);
      setPicked(null);
      setReveal(false);
      setPhase('quiz');
    } catch (e: any) {
      toast.error(e?.message || 'تعذر توليد الكويز');
      setPhase('setup');
    }
  };

  const choose = (i: number) => {
    if (reveal) return;
    setPicked(i);
    setReveal(true);
    const next = [...answers];
    next[idx] = i;
    setAnswers(next);
    if (i === questions[idx].answer) {
      setCoach((s) => ({ ...s, xp: s.xp + 10 }));
    }
  };

  const nextQ = () => {
    if (idx + 1 >= questions.length) {
      // finish
      setCoach((s) => bumpStreak({ ...s, xp: s.xp + 50 }));
      setPhase('result');
    } else {
      setIdx(idx + 1);
      setPicked(null);
      setReveal(false);
    }
  };

  const result = useMemo(
    () => (phase === 'result' ? analyze(questions, answers) : null),
    [phase, questions, answers]
  );

  return (
    <div dir="rtl" className="min-h-[calc(100vh-4rem)] -mx-4 px-4 py-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-950 text-white">
      <div className="max-w-2xl mx-auto space-y-5">
        <Header coach={coach} />

        <AnimatePresence mode="wait">
          {phase === 'setup' && (
            <SetupView
              key="setup"
              subject={subject}
              setSubject={setSubject}
              count={count}
              setCount={setCount}
              onStart={() => startQuiz()}
            />
          )}
          {phase === 'loading' && <LoadingView key="loading" />}
          {phase === 'quiz' && questions[idx] && (
            <QuizView
              key={`q-${idx}`}
              q={questions[idx]}
              idx={idx}
              total={questions.length}
              picked={picked}
              reveal={reveal}
              onChoose={choose}
              onNext={nextQ}
            />
          )}
          {phase === 'result' && result && (
            <ResultView
              key="result"
              result={result}
              onRecovery={(u) => {
                setCoach((s) =>
                  s.fixedUnits.includes(u) ? s : { ...s, xp: s.xp + 100, fixedUnits: [...s.fixedUnits, u] }
                );
                startQuiz(u, 5);
              }}
              onRestart={() => setPhase('setup')}
              recoveryUnit={recoveryUnit}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Header({ coach }: { coach: CoachState }) {
  const lvl = levelOf(coach.xp);
  return (
    <div className="rounded-2xl p-4 bg-white/5 backdrop-blur border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xs opacity-70">المستوى</div>
            <div className="font-extrabold">{lvl.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Stat icon={<Zap className="w-4 h-4 text-yellow-300" />} label="XP" value={coach.xp} />
          <Stat icon={<Flame className="w-4 h-4 text-orange-400" />} label="Streak" value={coach.streak} />
        </div>
      </div>
      <div className="mt-3">
        <Progress value={lvl.pct} className="h-2 bg-white/10" />
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-center">
      <div className="flex items-center gap-1 justify-center">{icon}<span className="text-xs opacity-80">{label}</span></div>
      <div className="font-extrabold leading-none mt-1">{value}</div>
    </div>
  );
}

function SetupView({
  subject,
  setSubject,
  count,
  setCount,
  onStart,
}: {
  subject: Subject;
  setSubject: (s: Subject) => void;
  count: number;
  setCount: (n: number) => void;
  onStart: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
      <div className="text-center space-y-2">
        <div className="flex justify-center"><CalcoMascot size={120} /></div>
        <h1 className="text-3xl font-black flex items-center gap-2 justify-center">
          <Sparkles className="w-7 h-7 text-yellow-300" /> Calco Coach
        </h1>
        <p className="opacity-80 text-sm">كويز ذكي للمراجعة الشاملة + تدريب علاجي على نقاط ضعفك</p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {SUBJECTS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSubject(s.id)}
            className={`relative rounded-2xl p-3 border transition-all text-center ${
              subject === s.id ? 'border-white/60 bg-white/15 scale-[1.02]' : 'border-white/10 bg-white/5'
            }`}
          >
            <div className={`mx-auto mb-1 w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-xl shadow-lg`}>
              {s.emoji}
            </div>
            <div className="font-bold text-sm">{s.label}</div>
          </button>
        ))}
      </div>

      <div className="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div className="text-sm opacity-80 mb-2">عدد الأسئلة</div>
        <div className="flex gap-2">
          {[5, 10, 15, 20].map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={`flex-1 py-2 rounded-xl font-bold ${count === n ? 'bg-gradient-to-r from-cyan-500 to-violet-500' : 'bg-white/10'}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={onStart}
        className="w-full h-14 text-lg font-black rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 hover:opacity-90 shadow-xl shadow-pink-500/30"
      >
        🔥 ابدأ الكويز الشامل
      </Button>
    </motion.div>
  );
}

function LoadingView() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16 space-y-4">
      <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <CalcoMascot size={140} />
      </motion.div>
      <div className="flex items-center justify-center gap-2 text-lg font-bold">
        <Loader2 className="w-5 h-5 animate-spin" /> Calco يحضّر لك أسئلة ذكية…
      </div>
    </motion.div>
  );
}

function QuizView({
  q, idx, total, picked, reveal, onChoose, onNext,
}: {
  q: QuizQuestion;
  idx: number;
  total: number;
  picked: number | null;
  reveal: boolean;
  onChoose: (i: number) => void;
  onNext: () => void;
}) {
  const correct = reveal && picked === q.answer;
  const wrong = reveal && picked !== null && picked !== q.answer;
  const mood = !reveal ? '🤔' : correct ? '😎' : '😡';
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} className="space-y-4">
      <div className="flex items-center justify-between text-sm opacity-80">
        <span>سؤال {idx + 1} / {total}</span>
        <span className="px-2 py-1 rounded-lg bg-white/10 border border-white/10">{unitAr(q.unit)}</span>
      </div>
      <Progress value={((idx + (reveal ? 1 : 0)) / total) * 100} className="h-2 bg-white/10" />

      <div className="rounded-3xl p-5 bg-white/5 backdrop-blur border border-white/10 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="text-4xl select-none" aria-hidden>{mood}</div>
          <h2 className="text-lg font-bold leading-relaxed flex-1">
            <MathContent content={q.q} />
          </h2>
        </div>

        <div className="mt-4 space-y-2">
          {q.options.map((opt, i) => {
            const isCorrect = reveal && i === q.answer;
            const isPicked = picked === i;
            const cls = isCorrect
              ? 'border-emerald-400 bg-emerald-500/20'
              : isPicked && wrong
              ? 'border-rose-400 bg-rose-500/20'
              : 'border-white/10 bg-white/5 hover:bg-white/10';
            return (
              <button
                key={i}
                disabled={reveal}
                onClick={() => onChoose(i)}
                className={`w-full text-right p-3 rounded-xl border transition-all font-medium ${cls}`}
              >
                <span className="inline-block w-6 h-6 rounded-full bg-white/10 text-center text-xs leading-6 ms-2">
                  {['أ', 'ب', 'ج', 'د'][i]}
                </span>
                <MathContent content={opt} />
              </button>
            );
          })}
        </div>

        {reveal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-sm">
            <div className="font-bold mb-2">💡 شرح:</div>
            <MathContent content={q.explain} asSteps />
          </motion.div>
        )}
      </div>

      <Button
        onClick={onNext}
        disabled={!reveal}
        className="w-full h-12 text-base font-black rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 disabled:opacity-40"
      >
        {idx + 1 >= total ? '✅ عرض النتائج' : 'التالي →'}
      </Button>
    </motion.div>
  );
}

function ResultView({
  result, onRecovery, onRestart, recoveryUnit,
}: {
  result: { score: number; total: number; units: UnitStat[]; weakest?: string };
  onRecovery: (u: string) => void;
  onRestart: () => void;
  recoveryUnit?: string;
}) {
  const fb = calcoFeedback(result.units);
  const pct = Math.round((result.score / result.total) * 100);
  const mood = pct >= 80 ? '😎' : pct >= 50 ? '🤔' : '😢';
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-4">
      <div className="rounded-3xl p-5 bg-gradient-to-br from-violet-600/30 to-cyan-500/20 border border-white/10 text-center">
        <div className="text-6xl mb-2">{mood}</div>
        <div className="text-sm opacity-80">نتيجتك</div>
        <div className="text-5xl font-black">{result.score} / {result.total}</div>
        <div className="text-lg font-bold mt-1">{pct}%</div>
      </div>

      <div className="rounded-2xl p-4 bg-white/5 border border-white/10 space-y-2">
        <div className="font-bold flex items-center gap-2"><Sparkles className="w-4 h-4 text-yellow-300" /> تحليل الوحدات</div>
        {result.units.map((u) => {
          const color = u.level === 'strong' ? 'from-emerald-500 to-teal-500'
            : u.level === 'medium' ? 'from-amber-500 to-orange-500'
            : 'from-rose-500 to-pink-500';
          return (
            <div key={u.unit} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold">{unitAr(u.unit)}</span>
                <span className="opacity-80">{u.correct}/{u.total} • {Math.round(u.ratio * 100)}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${color}`} style={{ width: `${u.ratio * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl p-4 bg-white/5 border border-white/10">
        <div className="flex items-start gap-3">
          <CalcoMascot size={64} float={false} glow={false} />
          <div className="flex-1 space-y-1 text-sm">
            <div className="font-extrabold">{fb.main}</div>
            {fb.lines.map((l, i) => <div key={i}>{l}</div>)}
            {recoveryUnit && (
              <div className="mt-2 text-emerald-300 font-bold">+100 XP لإصلاح {unitAr(recoveryUnit)} 🎉</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {result.weakest && (
          <Button
            onClick={() => onRecovery(result.weakest!)}
            className="h-12 rounded-2xl font-black bg-gradient-to-r from-rose-500 to-orange-500"
          >
            <Target className="w-4 h-4" /> تدريب على {unitAr(result.weakest)}
          </Button>
        )}
        <Button onClick={onRestart} className="h-12 rounded-2xl font-black bg-gradient-to-r from-cyan-500 to-violet-500">
          <RotateCcw className="w-4 h-4" /> كويز شامل جديد
        </Button>
      </div>
    </motion.div>
  );
}