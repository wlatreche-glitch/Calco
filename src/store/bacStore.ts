import { create } from 'zustand';
import { STREAMS } from '@/lib/bacData';

export type GradeMap = Record<string, number | null>;

interface BacState {
  streamId: string;
  target: number;
  grades: GradeMap;
  setStream: (id: string) => void;
  setTarget: (n: number) => void;
  setGrade: (subjectId: string, value: number | null) => void;
  resetGrades: () => void;
  applySolved: (solved: Record<string, number>) => void;
}

const initialGrades = (streamId: string): GradeMap => {
  const s = STREAMS.find((x) => x.id === streamId)!;
  const g: GradeMap = {};
  s.subjects.forEach((sub) => (g[sub.id] = null));
  return g;
};

export const useBacStore = create<BacState>((set) => ({
  streamId: 'sci',
  target: 14,
  grades: initialGrades('sci'),
  setStream: (id) => set({ streamId: id, grades: initialGrades(id) }),
  setTarget: (n) => set({ target: n }),
  setGrade: (subjectId, value) =>
    set((st) => ({ grades: { ...st.grades, [subjectId]: value } })),
  resetGrades: () => set((st) => ({ grades: initialGrades(st.streamId) })),
  applySolved: (solved) =>
    set((st) => {
      const next = { ...st.grades };
      Object.entries(solved).forEach(([k, v]) => (next[k] = v));
      return { grades: next };
    }),
}));
