import { useMemo, useState } from 'react';
import { BlockMath } from 'react-katex';
import { QuizEngine, createSessionSeed, Difficulty } from '@/lib/quizEngine';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';

const difficultyOptions: Difficulty[] = ['easy', 'medium', 'hard'];

const initialEngine = new QuizEngine();

export default function QuizPlayer() {
  const [sessionSeed] = useState(() => createSessionSeed());
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [seedIndex, setSeedIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{ selectedIndex: number; isCorrect: boolean } | null>(null);

  const question = useMemo(() => {
    return initialEngine.generateQuestion({ seed: `${sessionSeed}-${seedIndex}`, difficulty });
  }, [sessionSeed, seedIndex, difficulty]);

  const handleNext = () => {
    setShowAnswer(false);
    setLastAnswer(null);
    setSeedIndex((prev) => prev + 1);
  };

  const handleAnswer = (selectedIndex: number, isCorrect: boolean) => {
    setLastAnswer({ selectedIndex, isCorrect });
    setShowAnswer(true);
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <header className="space-y-3 text-right">
        <p className="text-sm text-slate-400">Quiz Engine • جلسة جديدة</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">محرك الاختبار الإجرائي</h1>
        <p className="max-w-2xl text-slate-300 leading-7">
          اختبر نفسك في أسئلة رياضية متغيرة تلقائياً مع محرك لا يعيد نفس القالب مرتين متتاليتين.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-[1fr,280px]">
        {/* Main question display */}
        {question.format === 'multiple-choice' && question.choices ? (
          <>
            <MultipleChoiceQuestion question={question} onAnswer={handleAnswer} disabled={lastAnswer !== null} />
            <aside className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl ring-1 ring-white/5">
              <div className="space-y-3 text-right">
                <h2 className="text-lg font-semibold text-slate-100">التحكم</h2>
                <div className="flex flex-wrap gap-2">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level as Difficulty)}
                      className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                        difficulty === level
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                السؤال التالي
              </button>

              {lastAnswer && (
                <div className={`rounded-2xl p-3 text-center text-sm font-semibold ${
                  lastAnswer.isCorrect
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {lastAnswer.isCorrect ? '✓ صحيح!' : '✕ خاطئ'}
                </div>
              )}

              <div className="space-y-3 text-right text-slate-300 border-t border-white/10 pt-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">نصائح</p>
                <ul className="space-y-2 text-xs leading-5">
                  <li>• اختر الصعوبة المناسبة لك</li>
                  <li>• كل سؤال يتضمن إجابة صحيحة واختيارات غير صحيحة</li>
                  <li>• لا تتكرر الأسئلة في نفس الجلسة</li>
                </ul>
              </div>
            </aside>
          </>
        ) : (
          /* Fallback for free-answer format (backward compatibility) */
          <>
            <article className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-xl ring-1 ring-white/5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 mb-4">
                <div>
                  <p className="text-sm text-slate-400">الموضوع</p>
                  <p className="text-lg font-semibold text-slate-100 capitalize">{question.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">الصعوبة</p>
                  <p className="text-lg font-semibold text-slate-100">{question.difficulty}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-right text-slate-200 leading-relaxed">{question.problem}</div>
                {question.latex && (
                  <div className="overflow-x-auto rounded-3xl bg-slate-900/80 border border-white/10 p-5 math-isolate">
                    <div dir="ltr">
                      <BlockMath math={question.latex} />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  سؤال جديد
                </button>
                <button
                  type="button"
                  onClick={() => setShowAnswer((prev) => !prev)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyan-400"
                >
                  {showAnswer ? 'إخفاء الإجابة' : 'عرض الإجابة'}
                </button>
              </div>

              {showAnswer && (
                <div className="mt-5 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-5 text-right text-slate-100">
                  <p className="text-sm text-slate-300 mb-2">الإجابة المتوقعة</p>
                  <p className="font-mono text-base text-slate-100 break-words">{question.solution ?? question.answer}</p>
                </div>
              )}
            </article>

            <aside className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl ring-1 ring-white/5">
              <div className="space-y-3 text-right">
                <h2 className="text-lg font-semibold text-slate-100">التحكم</h2>
                <div className="space-y-2">
                  <label className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-3">
                    <span className="text-sm text-slate-300">مستوى الصعوبة</span>
                    <select
                      value={difficulty}
                      onChange={(event) => setDifficulty(event.target.value as Difficulty)}
                      className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-slate-100 outline-none"
                    >
                      {difficultyOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="space-y-3 text-right text-slate-300">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">تعليمات</p>
                <ul className="space-y-2 text-sm leading-6">
                  <li>• اسحب أكثر من سؤال للحصول على تنوع عالٍ.</li>
                  <li>• صعوبة كل سؤال تُعدل تلقائياً.</li>
                  <li>• الاحفظات تُمنع ضمن الجلسة الحالية.</li>
                </ul>
              </div>
            </aside>
          </>
        )}
      </section>
    </div>
  );
}
