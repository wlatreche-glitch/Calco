import { registry, TemplateRegistry } from './registry';
import { initializeRegistry } from './registrySetup';
import { AntiRepetitionStore } from './antiRepetition';
import type { Difficulty, GeneratedQuestion } from './types';

export interface QuizEngineOptions {
  registry?: TemplateRegistry;
  antiRepetitionStore?: AntiRepetitionStore;
  templateRetryLimit?: number;
}

export interface GenerateQuestionOpts {
  seed: string;
  difficulty: Difficulty;
  category?: string;
}

initializeRegistry();

export class QuizEngine {
  private registry: TemplateRegistry;
  private antiRepetitionStore: AntiRepetitionStore;
  private templateRetryLimit: number;

  constructor(options: QuizEngineOptions = {}) {
    this.registry = options.registry ?? registry;
    this.antiRepetitionStore = options.antiRepetitionStore ?? new AntiRepetitionStore();
    this.templateRetryLimit = options.templateRetryLimit ?? 6;
  }

  registerTemplate(template: Parameters<TemplateRegistry['register']>[0]) {
    this.registry.register(template);
  }

  generateQuestion(opts: GenerateQuestionOpts): GeneratedQuestion {
    const seed = opts.seed;

    for (let attempt = 0; attempt < this.templateRetryLimit; attempt += 1) {
      const attemptSeed = `${seed}-attempt-${attempt}`;
      const template = this.registry.pickRandomTemplate(`${attemptSeed}-template`, opts.difficulty, opts.category);
      if (!template) continue;

      const question = template.generate({
        seed: `${attemptSeed}-${template.id}`,
        difficulty: opts.difficulty,
        avoidSignatures: this.antiRepetitionStore.getRecent(),
      });
      if (!this.antiRepetitionStore.has(question.signature)) {
        this.antiRepetitionStore.add(question.signature);
        return question;
      }
    }

    const fallbackSeed = `${seed}-fallback`;
    const fallbackTemplate = this.registry.pickRandomTemplate(`${fallbackSeed}-template`, opts.difficulty, opts.category);
    if (!fallbackTemplate) {
      throw new Error('No quiz template available for generation');
    }
    const fallbackQuestion = fallbackTemplate.generate({
      seed: `${fallbackSeed}-${fallbackTemplate.id}`,
      difficulty: opts.difficulty,
      avoidSignatures: this.antiRepetitionStore.getRecent(),
    });
    this.antiRepetitionStore.add(fallbackQuestion.signature);
    return fallbackQuestion;
  }
}
