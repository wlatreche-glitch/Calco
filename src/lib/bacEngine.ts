import { Stream, Subject, UniversitySpecialty, UniversityStreamKey, universityEngine } from './bacData';
import { GradeMap } from '@/store/bacStore';

export interface AverageResult {
  average: number;
  filledCoef: number;
  totalCoef: number;
  filledCount: number;
  totalCount: number;
}

export function computeAverage(stream: Stream, grades: GradeMap): AverageResult {
  let sum = 0;
  let filledCoef = 0;
  let totalCoef = 0;
  let filledCount = 0;
  for (const s of stream.subjects) {
    totalCoef += s.coef;
    const v = grades[s.id];
    if (v != null && !Number.isNaN(v)) {
      sum += v * s.coef;
      filledCoef += s.coef;
      filledCount++;
    }
  }
  const average = filledCoef > 0 ? sum / filledCoef : 0;
  return { average, filledCoef, totalCoef, filledCount, totalCount: stream.subjects.length };
}

/** Goal solver: fill missing grades to reach target average. */
export function solveMissing(
  stream: Stream,
  grades: GradeMap,
  target: number
): { ok: boolean; solved: Record<string, number>; reason?: string } {
  const missing: Subject[] = stream.subjects.filter((s) => grades[s.id] == null);
  if (missing.length === 0) return { ok: false, solved: {}, reason: 'لا توجد مواد فارغة' };

  const totalCoef = stream.subjects.reduce((a, s) => a + s.coef, 0);
  let knownSum = 0;
  for (const s of stream.subjects) {
    const v = grades[s.id];
    if (v != null) knownSum += v * s.coef;
  }
  const remaining = target * totalCoef - knownSum;

  // weights
  const weights = missing.map((s) => Math.pow(s.coef, 1.2));
  const weightSum = weights.reduce((a, b) => a + b, 0);

  const solved: Record<string, number> = {};
  let clampedAdjustment = 0;
  let unclamped: { id: string; coef: number; weight: number; raw: number }[] = [];

  missing.forEach((s, i) => {
    const share = (remaining * weights[i]) / weightSum;
    const grade = share / s.coef;
    unclamped.push({ id: s.id, coef: s.coef, weight: weights[i], raw: grade });
  });

  // Clamp 0..20 and redistribute the excess across non-clamped subjects (one pass)
  const clamped: Record<string, number | null> = {};
  let excess = 0;
  unclamped.forEach((u) => {
    if (u.raw > 20) {
      excess += (u.raw - 20) * u.coef;
      clamped[u.id] = 20;
    } else if (u.raw < 0) {
      excess += u.raw * u.coef;
      clamped[u.id] = 0;
    } else clamped[u.id] = null;
  });

  const free = unclamped.filter((u) => clamped[u.id] == null);
  const freeWeightSum = free.reduce((a, u) => a + u.weight, 0);
  free.forEach((u) => {
    const add = freeWeightSum > 0 ? (excess * u.weight) / freeWeightSum / u.coef : 0;
    let v = u.raw + add;
    v = Math.max(0, Math.min(20, v));
    solved[u.id] = Math.round(v * 4) / 4; // quarter-point
  });
  unclamped.forEach((u) => {
    if (clamped[u.id] != null) solved[u.id] = clamped[u.id]!;
  });

  // Feasibility check
  const feasible = remaining >= 0 && remaining <= 20 * missing.reduce((a, s) => a + s.coef, 0);
  if (!feasible) {
    return {
      ok: false,
      solved,
      reason: remaining < 0 ? 'الهدف منخفض جدًا — معدلك الحالي أعلى منه' : 'الهدف صعب التحقيق بالمواد المتبقية',
    };
  }
  return { ok: true, solved };
}

export interface ImpactRow {
  subject: Subject;
  impact: number; // coef share
  current: number | null;
  gainPerPoint: number; // average gain if +1
}

export function rankImpact(stream: Stream, grades: GradeMap): ImpactRow[] {
  const totalCoef = stream.subjects.reduce((a, s) => a + s.coef, 0);
  return stream.subjects
    .map((s) => ({
      subject: s,
      impact: s.coef / totalCoef,
      current: grades[s.id] ?? null,
      gainPerPoint: s.coef / totalCoef,
    }))
    .sort((a, b) => b.impact - a.impact);
}

export function bestSubjectToImprove(stream: Stream, grades: GradeMap): ImpactRow | null {
  const ranked = rankImpact(stream, grades).filter(
    (r) => r.current != null && r.current < 18
  );
  if (ranked.length === 0) return null;
  // best = high coef AND room to grow
  return ranked.sort(
    (a, b) => b.impact * (20 - (b.current ?? 0)) - a.impact * (20 - (a.current ?? 0))
  )[0];
}

export function statusMessage(avg: number, target: number, filledCount: number): string {
  if (filledCount === 0) return 'ابدأ بإدخال علاماتك ⚡';
  const diff = avg - target;
  if (diff >= 2) return 'أداء رائع 🚀 تجاوزت هدفك بفارق كبير!';
  if (diff >= 0) return 'ممتاز 🔥 أنت فوق الهدف، استمر!';
  if (diff >= -1) return 'قريب جدًا 🔥 ركز قليلاً وستصل';
  if (diff >= -2) return 'تحتاج جهدًا إضافيًا 💪 ركز على المعاملات الكبيرة';
  return 'الهدف بعيد قليلاً، لا تستسلم 🌟 خطط بذكاء';
}

export function admissionProbability(avg: number, min: number, max: number): number {
  if (avg >= max) return 0.95;
  if (avg <= min - 2) return 0.05;
  if (avg <= min) return 0.2;
  const t = (avg - min) / Math.max(1, max - min);
  return Math.min(0.95, Math.max(0.2, 0.2 + t * 0.75));
}

const STREAM_ALIAS: Record<string, UniversityStreamKey> = {
  sci: 'science',
  math: 'math',
  tech: 'technical_math',
  gest: 'management',
  lit: 'literature',
  lang: 'foreign_languages',
};

export interface UniversityRecommendation {
  specialty: UniversitySpecialty;
  probability: number;
  label: string;
  color: string;
  score: number;
  message: string;
  category: string;
  weightedAverage?: number;
}

const AGE_LABELS: Record<string, string> = {
  science: 'التجريبية',
  math: 'الرياضيات',
  technical_math: 'تقني رياضي',
  management: 'تسيير واقتصاد',
  literature: 'آداب وفلسفة',
  foreign_languages: 'لغات أجنبية',
};

const getProbabilityMeta = (prob: number) => {
  if (prob >= 0.75) return { label: 'Strong Chance', color: 'text-emerald-500' };
  if (prob >= 0.5) return { label: 'Good Chance', color: 'text-amber-500' };
  return { label: 'Needs Work', color: 'text-rose-500' };
};

const subjectMatchScore = (importantSubjects: string[], strongest: string[]) => {
  if (importantSubjects.length === 0) return 0;
  const overlap = importantSubjects.filter((subject) => strongest.includes(subject));
  return overlap.length / importantSubjects.length;
};

const recommendationMessage = (
  specialty: UniversitySpecialty,
  avg: number,
  strongSubjects: string[],
  target: number,
  streamId: string
) => {
  const levels = ['Excellent', 'Strong', 'Realistic'];
  const parity = avg >= specialty.minAverage ? levels[0] : avg >= specialty.minAverage - 1 ? levels[1] : levels[2];
  const streamName = AGE_LABELS[STREAM_ALIAS[streamId]] || 'اختصاصك';
  const strongHints = strongSubjects.length ? `مع نقاط قوة في ${strongSubjects.join('، ')}` : 'استنادًا إلى موادك الأساسية';
  const targetHint = target >= specialty.minAverage
    ? 'هدفك يدعم هذا الاتجاه.'
    : 'رفع المعدل سيجعل هذا التخصص أكثر واقعية.';
  const medicalHint = specialty.id === 'medicine' && streamId === 'sci' && avg >= specialty.minAverage
    ? 'الطب خيار معقول جدًا لمعدلك الحالي.'
    : '';
  return `${parity} fit for ${specialty.name} في ${streamName} - ${strongHints}. ${targetHint} ${medicalHint}`.trim();
};

const computeSpecialtyWeightedAverage = (
  specialty: UniversitySpecialty,
  avg: number,
  grades: GradeMap
) => {
  if (!specialty.weightedAverageSubjects?.length) return avg;

  const weightSum = specialty.weightedAverageSubjects.reduce((sum, field) => sum + field.weight, 0);
  const weightedSum = specialty.weightedAverageSubjects.reduce((sum, field) => {
    const value = grades[field.subjectId];
    return sum + (value != null && !Number.isNaN(value) ? value : avg) * field.weight;
  }, 0);
  return (avg + weightedSum) / (1 + weightSum);
};

const specialtyPriorityBoost = (
  streamId: string,
  specialty: UniversitySpecialty,
  avg: number
) => {
  if (streamId === 'sci' && specialty.id === 'medicine' && avg >= specialty.minAverage) {
    return 0.14;
  }
  if (streamId === 'sci' && ['dentistry', 'pharmacy'].includes(specialty.id) && avg >= specialty.minAverage) {
    return 0.08;
  }
  return 0;
};

export function getStrongestSubjects(stream: Stream, grades: GradeMap, count = 2): string[] {
  return stream.subjects
    .map((subject) => ({ id: subject.id, score: grades[subject.id] ?? 0 }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((item) => item.id);
}

export function recommendUniversities(
  streamId: string,
  avg: number,
  target: number,
  stream: Stream,
  grades: GradeMap
): UniversityRecommendation[] {
  const engineKey = STREAM_ALIAS[streamId];
  const specialties = universityEngine[engineKey] ?? [];
  const strongSubjects = getStrongestSubjects(stream, grades, 3);

  return specialties
    .map((specialty) => {
      const weightedAverage = computeSpecialtyWeightedAverage(specialty, avg, grades);
      const probability = admissionProbability(weightedAverage, specialty.minAverage, specialty.maxAverage);
      const subjectFit = subjectMatchScore(specialty.importantSubjects, strongSubjects);
      const targetFit = target >= specialty.minAverage ? 0.1 : 0;
      const boost = specialtyPriorityBoost(streamId, specialty, weightedAverage);
      const baseScore = probability * 0.7 + subjectFit * 0.2 + specialty.prestigeLevel * 0.03 + targetFit + boost;
      const { label, color } = getProbabilityMeta(probability);
      const message = recommendationMessage(specialty, weightedAverage, strongSubjects, target, streamId);
      return {
        specialty,
        probability,
        label,
        color,
        score: Math.min(1, Math.max(0, baseScore)),
        message,
        category: specialty.category,
        weightedAverage,
      };
    })
    .filter((item) => {
      if (avg >= 16) return true;
      if (avg >= 13) return item.specialty.prestigeLevel !== 3 || item.probability >= 0.35;
      return item.specialty.prestigeLevel === 1 || item.probability >= 0.3;
    })
    .sort((a, b) => b.score - a.score || b.probability - a.probability);
}
