import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBacStore } from '@/store/bacStore';
import { STREAMS } from '@/lib/bacData';
import { computeAverage, recommendUniversities } from '@/lib/bacEngine';
import { GraduationCap, Lock } from 'lucide-react';

export default function UniversityPanel() {
  const { streamId, grades, target } = useBacStore();
  const stream = STREAMS.find((s) => s.id === streamId)!;
  const { average, filledCount } = useMemo(() => computeAverage(stream, grades), [stream, grades]);
  const recommendations = useMemo(
    () => recommendUniversities(streamId, average, target, stream, grades),
    [streamId, average, target, stream, grades]
  );

  if (filledCount === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border p-6 text-center text-muted-foreground bg-card/50 backdrop-blur-sm">
        <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        أدخل علاماتك لاكتشاف التخصصات الجامعية المناسبة لك 🎓
      </div>
    );
  }

  const highDemand = recommendations.filter((item) => item.category === 'High-demand');
  const mediumDemand = recommendations.filter((item) => item.category === 'Medium-demand');
  const lowDemand = recommendations.filter((item) => item.category === 'Low-demand');
  const summary = recommendations[0];

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/10 backdrop-blur-lg p-5 shadow-xl shadow-black/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 text-sm uppercase tracking-[.2em] text-muted-foreground">
            <GraduationCap className="w-4 h-4 text-calco-violet" />
            توصيات جامعية ذكية
          </div>
          <h3 className="mt-2 font-extrabold text-xl">أفضل التخصصات لك</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            معدل الباك الحالي: {average.toFixed(2)} — الهدف: {target}
          </p>
        </div>
        {summary && (
          <div className="rounded-3xl border border-white/10 bg-white/30 p-4 text-right shadow-sm">
            <p className="text-xs uppercase text-muted-foreground">التوصية الأولى</p>
            <p className="mt-2 font-bold text-base">{summary.specialty.name}</p>
            <p className={`mt-1 text-sm font-semibold ${summary.color}`}>{summary.label}</p>
          </div>
        )}
      </div>

      <div className="grid gap-6">
        {highDemand.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">اختيارات عليا</p>
                <p className="text-xs text-muted-foreground">مجالات عالية الطلب مناسبة لمعدلك</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                {highDemand.length} خيارات
              </span>
            </div>
            <div className="grid gap-3">
              {highDemand.map((item, idx) => {
                const pct = Math.round(item.probability * 100);
                return (
                  <motion.div
                    key={item.specialty.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="rounded-3xl border border-white/10 bg-white/20 p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-3xl bg-calco-violet/10 p-3 text-xl">{item.specialty.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="font-semibold text-sm text-foreground">{item.specialty.name}</p>
                            <p className="text-[11px] uppercase tracking-[.18em] text-muted-foreground mt-1">
                              {item.category} • مستوى {item.specialty.prestigeLevel}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-bold ${item.color}`}>{item.label}</p>
                            <p className="text-xs text-muted-foreground">{pct}% احتمالية</p>
                          </div>
                        </div>
                        <div className="mt-3 text-xs leading-5 text-muted-foreground">
                          {item.message}
                        </div>
                        {item.weightedAverage !== undefined && item.specialty.weightedAverageFormula && (
                          <div className="mt-3 rounded-2xl bg-slate-100/80 p-2 text-[11px] text-slate-600">
                            <p className="font-semibold">المعدل الموزون:</p>
                            <p>{item.weightedAverage.toFixed(2)} ({item.specialty.weightedAverageFormula})</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-slate-200/80 overflow-hidden">
                      <motion.div
                        animate={{ width: `${pct}%` }}
                        transition={{ type: 'spring', damping: 18 }}
                        className="h-full bg-gradient-to-r from-calco-violet via-cyan-500 to-emerald-500"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {mediumDemand.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">خيارات متوسطة</p>
                <p className="text-xs text-muted-foreground">تخصصات واقعية مع بعض الجهد الإضافي</p>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold text-amber-700">
                {mediumDemand.length} خيارات
              </span>
            </div>
            <div className="grid gap-3">
              {mediumDemand.map((item, idx) => {
                const pct = Math.round(item.probability * 100);
                return (
                  <motion.div
                    key={item.specialty.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="rounded-3xl border border-white/10 bg-white/20 p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-3xl bg-calco-violet/10 p-3 text-xl">{item.specialty.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="font-semibold text-sm text-foreground">{item.specialty.name}</p>
                            <p className="text-[11px] uppercase tracking-[.18em] text-muted-foreground mt-1">
                              {item.category} • مستوى {item.specialty.prestigeLevel}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-bold ${item.color}`}>{item.label}</p>
                            <p className="text-xs text-muted-foreground">{pct}% احتمالية</p>
                          </div>
                        </div>
                        <div className="mt-3 text-xs leading-5 text-muted-foreground">
                          {item.message}
                        </div>
                        {item.weightedAverage !== undefined && item.specialty.weightedAverageFormula && (
                          <div className="mt-3 rounded-2xl bg-slate-100/80 p-2 text-[11px] text-slate-600">
                            <p className="font-semibold">المعدل الموزون:</p>
                            <p>{item.weightedAverage.toFixed(2)} ({item.specialty.weightedAverageFormula})</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-slate-200/80 overflow-hidden">
                      <motion.div
                        animate={{ width: `${pct}%` }}
                        transition={{ type: 'spring', damping: 18 }}
                        className="h-full bg-gradient-to-r from-calco-violet via-cyan-500 to-emerald-500"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {lowDemand.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">خيارات منخفضة</p>
                <p className="text-xs text-muted-foreground">تخصصات أسهل للوصول في حال أردت المرونة</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700">
                {lowDemand.length} خيارات
              </span>
            </div>
            <div className="grid gap-3">
              {lowDemand.map((item, idx) => {
                const pct = Math.round(item.probability * 100);
                return (
                  <motion.div
                    key={item.specialty.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className="rounded-3xl border border-white/10 bg-white/20 p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-3xl bg-calco-violet/10 p-3 text-xl">{item.specialty.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="font-semibold text-sm text-foreground">{item.specialty.name}</p>
                            <p className="text-[11px] uppercase tracking-[.18em] text-muted-foreground mt-1">
                              {item.category} • مستوى {item.specialty.prestigeLevel}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-bold ${item.color}`}>{item.label}</p>
                            <p className="text-xs text-muted-foreground">{pct}% احتمالية</p>
                          </div>
                        </div>
                        <div className="mt-3 text-xs leading-5 text-muted-foreground">
                          {item.message}
                        </div>
                        {item.weightedAverage !== undefined && item.specialty.weightedAverageFormula && (
                          <div className="mt-3 rounded-2xl bg-slate-100/80 p-2 text-[11px] text-slate-600">
                            <p className="font-semibold">المعدل الموزون:</p>
                            <p>{item.weightedAverage.toFixed(2)} ({item.specialty.weightedAverageFormula})</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-slate-200/80 overflow-hidden">
                      <motion.div
                        animate={{ width: `${pct}%` }}
                        transition={{ type: 'spring', damping: 18 }}
                        className="h-full bg-gradient-to-r from-calco-violet via-cyan-500 to-emerald-500"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {summary && average < summary.specialty.minAverage && (
        <div className="mt-5 rounded-3xl border border-amber-300/25 bg-amber-100/10 p-4 text-sm text-amber-900">
          💡 {summary.specialty.name} ما زال ممكنًا إذا ركزت على المواد الرئيسية. تحقق من التخصصات الأقل طلبًا المعروضة أدناه لخيارات أقرب للمعدل الحالي.
        </div>
      )}
    </div>
  );
}
