import { registry } from './registry';
import { polynomialDerivativeTemplate } from './templates/polynomialDerivativeTemplate';
import { polynomialIntegralTemplate } from './templates/polynomialIntegralTemplate';
import { limitTemplate } from './templates/limitTemplate';
import { sequenceTemplate } from './templates/sequenceTemplate';
import { probabilityTemplate } from './templates/probabilityTemplate';
import { vectorTemplate } from './templates/vectorTemplate';
import { geometryTemplate } from './templates/geometryTemplate';

export function initializeRegistry() {
  registry.register(polynomialDerivativeTemplate);
  registry.register(polynomialIntegralTemplate);
  registry.register(limitTemplate);
  registry.register(sequenceTemplate);
  registry.register(probabilityTemplate);
  registry.register(vectorTemplate);
  registry.register(geometryTemplate);
}
