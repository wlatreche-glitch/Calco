import { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDown, Zap, Sparkles, Rocket } from 'lucide-react';
import { useBacStore } from '@/store/bacStore';
import { STREAMS } from '@/lib/bacData';
import { rankImpact } from '@/lib/bacEngine';
import StreamSelector from '@/components/bac/StreamSelector';
import TargetSelector from '@/components/bac/TargetSelector';
import SubjectCard from '@/components/bac/SubjectCard';
import LiveResultPanel from '@/components/bac/LiveResultPanel';
import UniversityPanel from '@/components/bac/UniversityPanel';
import CalcoMascot from '@/components/CalcoMascot';
import HeroRevision from '@/components/home/HeroRevision';
import PathCards from '@/components/home/PathCards';
import QuickTools from '@/components/home/QuickTools';
import ToolCategories from '@/components/home/ToolCategories';
import TrustStrip from '@/components/home/TrustStrip';
import Disclaimer from '@/components/home/Disclaimer';
import ProgressCard from '@/components/home/ProgressCard';

export default function Index() {
  const calcRef = useRef<HTMLDivElement>(null);
  const streamId = useBacStore((s) => s.streamId);
  const grades = useBacStore((s) => s.grades);
  const stream = STREAMS.find((s) => s.id === streamId)!;
  const ranked = useMemo(() => rankImpact(stream, grades), [stream, grades]);
  const topImpactIds = new Set(ranked.slice(0, 3).map((r) => r.subject.id));

  const scrollToCalc = () =>
    calcRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div dir="rtl" className="space-y-8">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl py-8 px-5 sm:py-12 text-center"
        style={{ background: 'var(--gradient-calco)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-calco-yellow/30 rounded-full blur-3xl" />
        <div className="relative flex flex-col items-center gap-4 text-white">
          <div className="w-20 h-20 sm:w-24 sm:h-24">
            <CalcoMascot size={96} />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight">
            🔥 كم راح تجيب في الباك؟
          </h1>
          <p className="text-sm sm:text-base opacity-90 max-w-md">
            احسب معدلك، راجع بذكاء، واستعد للبكالوريا مع <b>Calco</b>
          </p>
          <p className="text-xs opacity-80">🤖 أنا Calco… رفيقك نحو النجاح</p>
          <div className="mt-1 flex flex-wrap justify-center gap-3">
            <button
              onClick={scrollToCalc}
              className="bg-white text-calco-deep font-extrabold rounded-2xl px-6 py-3 flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition"
            >
              <Zap className="w-5 h-5 text-calco-yellow fill-calco-yellow" />
              ⚡ احسب معدلي الآن
              <ArrowDown className="w-4 h-4" />
            </button>
            <Link
              to="/coach"
              className="btn-calco-ghost"
            >
              <Rocket className="w-5 h-5" /> 🎯 ابدأ المراجعة
            </Link>
          </div>
        </div>
      </section>

      {/* HERO 2 — Revision */}
      <HeroRevision />

      {/* Choose your path */}
      <PathCards />

      {/* CALCULATOR */}
      <section ref={calcRef} className="space-y-5 scroll-mt-20">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-extrabold flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-calco-violet" />
            اختَر شعبتك
          </h2>
          <StreamSelector />
        </div>

        <div className="flex justify-center">
          <TargetSelector />
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-5">
          {/* Subjects grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stream.subjects.map((s) => (
              <SubjectCard
                key={s.id}
                subject={s}
                highlight={topImpactIds.has(s.id)}
              />
            ))}
          </motion.div>

          {/* Sticky live panel */}
          <div className="lg:sticky lg:top-20 lg:self-start space-y-4">
            <LiveResultPanel />
          </div>
        </div>
      </section>

      {/* UNIVERSITY */}
      <section>
        <UniversityPanel />
      </section>

      {/* QUICK ACCESS TOOLS */}
      <QuickTools />

      {/* PROGRESS */}
      <ProgressCard />

      {/* ALL TOOLS — organized */}
      <ToolCategories />

      {/* TRUST */}
      <TrustStrip />

      {/* DISCLAIMER */}
      <Disclaimer />
    </div>
  );
}
