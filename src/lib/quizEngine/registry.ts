import type { Difficulty, Template } from './types';
import { createRng } from './seed';

export class TemplateRegistry {
  private templates: Map<string, Template> = new Map();

  register(template: Template) {
    if (this.templates.has(template.id)) {
      throw new Error(`Template with id ${template.id} already registered`);
    }
    this.templates.set(template.id, template);
  }

  get(id: string) {
    return this.templates.get(id);
  }

  list() {
    return Array.from(this.templates.values());
  }

  pickRandomTemplate(seed: string, difficulty: Difficulty, category?: string) {
    const rng = createRng(seed);
    const pool = this.list().filter((template) => {
      if (category && template.category !== category) return false;
      return true;
    });

    if (pool.length === 0) return undefined;
    const weighted = pool.map((template) => ({
      template,
      weight: template.difficultyWeights?.[difficulty] ?? 1,
    }));

    const totalWeight = weighted.reduce((sum, entry) => sum + entry.weight, 0);
    let threshold = rng.random() * totalWeight;
    for (const entry of weighted) {
      threshold -= entry.weight;
      if (threshold <= 0) {
        return entry.template;
      }
    }

    return weighted[weighted.length - 1].template;
  }
}

export const registry = new TemplateRegistry();
