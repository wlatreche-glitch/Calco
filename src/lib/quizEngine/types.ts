export type Difficulty = 'easy' | 'medium' | 'hard';

export type Distribution = 'uniform' | 'int' | 'float' | 'normal';

export type QuestionFormat = 'free-answer' | 'multiple-choice';

export interface ParameterSpec {
  name: string;
  min?: number;
  max?: number;
  distribution?: Distribution;
  note?: string;
}

export interface GeneratedQuestion {
  id: string;
  seed: string;
  signature: string;
  category: string;
  difficulty: Difficulty;
  format?: QuestionFormat;
  problem: string;
  latex?: string;
  solution?: string;
  answer: string | number | any;
  distractors?: any[];
  choices?: (string | number | any)[];
  correctIndex?: number;
  metadata?: Record<string, any>;
}

export interface Template {
  id: string;
  category: string;
  difficultyWeights?: Partial<Record<Difficulty, number>>;
  parameterSpec?: ParameterSpec[];
  generate: (opts: {
    seed: string;
    difficulty: Difficulty;
    avoidSignatures?: string[];
  }) => GeneratedQuestion;
  renderHints?: string[];
}

export interface SubjectGenerator {
  generate: (params: {
    seed: string;
    difficulty: Difficulty;
    avoidSignatures?: string[];
  }) => GeneratedQuestion;
}
