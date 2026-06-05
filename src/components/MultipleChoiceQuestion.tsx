import { useMemo, useState } from 'react';
import { BlockMath } from 'react-katex';
import type { GeneratedQuestion } from '@/lib/quizEngine';

interface MultipleChoiceQuestionProps {
  question: GeneratedQuestion;
  onAnswer?: (selectedIndex: number, isCorrect: boolean) => void;
  disabled?: boolean;
}

export default function MultipleChoiceQuestion({
  question,
  onAnswer,
  disabled = false,
}: MultipleChoiceQuestionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const isAnswered = selectedIndex !== null;
  const isCorrect = selectedIndex === question.correctIndex;

  const handleSelectChoice = (index: number) => {
    if (disabled || isAnswered) return;
    setSelectedIndex(index);
    onAnswer?.(index, index === question.correctIndex);
  };

  const choiceLabels = ['أ', 'ب', 'ج', 'د'];

  return (
    <article className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-xl ring-1 ring-white/5">
      {/* Problem statement */}
      <div className="space-y-3 text-right">
        <p className="text-sm text-slate-400">السؤال</p>
        <p className="text-base text-slate-200 leading-relaxed">{question.problem}</p>
      </div>

      {/* LaTeX expression if available */}
      {question.latex && (
        <div className="overflow-x-auto rounded-3xl bg-slate-900/80 border border-white/10 p-5 math-isolate">
          <div dir="ltr">
            <BlockMath math={question.latex} />
          </div>
        </div>
      )}

      {/* Multiple choice options */}
      {question.choices && question.choices.length > 0 && (
        <div className="space-y-2 mt-6 pt-4 border-t border-white/10">
          <p className="text-sm text-slate-400 text-right">اختر الإجابة الصحيحة</p>
          <div className="grid gap-2">
            {question.choices.map((choice, index) => {
              const isSelected = selectedIndex === index;
              const choiceCorrect = index === question.correctIndex;
              const showFeedback = isAnswered;
              const isWrongSelection = isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleSelectChoice(index)}
                  disabled={disabled || isAnswered}
                  className={`relative rounded-2xl border-2 p-4 text-right transition-all ${
                    showFeedback
                      ? choiceCorrect
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : isWrongSelection
                          ? 'border-rose-500 bg-rose-500/10'
                          : 'border-white/10 bg-slate-900/50'
                      : isSelected
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-white/10 bg-slate-900/50 hover:border-cyan-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        showFeedback
                          ? choiceCorrect
                            ? 'bg-emerald-500/30 text-emerald-300'
                            : isWrongSelection
                              ? 'bg-rose-500/30 text-rose-300'
                              : 'bg-white/10 text-slate-300'
                          : isSelected
                            ? 'bg-cyan-500/30 text-cyan-300'
                            : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {choiceLabels[index]}
                    </div>
                    <div className="flex-grow text-right">
                      {typeof choice === 'string' ? (
                        <p className="text-sm text-slate-200">{choice}</p>
                      ) : (
                        <p className="text-sm font-mono text-slate-200">{choice}</p>
                      )}
                    </div>
                  </div>

                  {/* Checkmark for correct answer */}
                  {showFeedback && choiceCorrect && (
                    <div className="absolute top-2 left-2 text-emerald-400">✓</div>
                  )}
                  {/* X mark for wrong selection */}
                  {showFeedback && isWrongSelection && (
                    <div className="absolute top-2 left-2 text-rose-400">✕</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Feedback after answering */}
      {isAnswered && (
        <div
          className={`rounded-3xl border-2 p-4 text-right ${
            isCorrect
              ? 'border-emerald-500/30 bg-emerald-500/10'
              : 'border-rose-500/30 bg-rose-500/10'
          }`}
        >
          <p
            className={`text-sm font-semibold ${
              isCorrect ? 'text-emerald-300' : 'text-rose-300'
            }`}
          >
            {isCorrect ? '✓ إجابة صحيحة!' : '✕ إجابة غير صحيحة'}
          </p>
          {question.solution && (
            <p className="text-xs text-slate-300 mt-2">
              الحل الصحيح: <span className="font-mono">{question.solution}</span>
            </p>
          )}
        </div>
      )}
    </article>
  );
}
