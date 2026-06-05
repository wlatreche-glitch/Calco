import { describe, expect, it } from 'vitest';
import { TemplateRegistry } from './registry';
import { polynomialDerivativeTemplate } from './templates/polynomialDerivativeTemplate';

describe('TemplateRegistry', () => {
  it('registers and selects a template by difficulty', () => {
    const registry = new TemplateRegistry();
    registry.register(polynomialDerivativeTemplate);
    const template = registry.pickRandomTemplate('seed-test', 'easy', 'derivatives');
    expect(template).toBeDefined();
    expect(template?.id).toBe('poly-derivative-v1');
  });

  it('throws when registering duplicate template ids', () => {
    const registry = new TemplateRegistry();
    registry.register(polynomialDerivativeTemplate);
    expect(() => registry.register(polynomialDerivativeTemplate)).toThrow();
  });
});
