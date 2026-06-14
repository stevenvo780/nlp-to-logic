import type { Formula } from '../../types';
import type { CountermodelMinOptions, MinimalCountermodel } from './types';
/**
 * Minimiza un contramodelo: devuelve el subconjunto más pequeño de
 * asignaciones que aún hace `evaluator(asg) === false` para toda
 * completación de las variables removidas.
 *
 * @param _formula  AST de la fórmula (queda en la firma para
 *                  compatibilidad y futura especialización; el motor
 *                  trata el evaluator como caja negra).
 * @param fullCounter Contramodelo total: asignación que falsifica F.
 * @param evaluator Función que devuelve `true` si la fórmula es válida
 *                  bajo la asignación total dada.
 * @param opts      Algoritmo y maxSteps.
 */
export declare function minimizeCountermodel(_formula: Formula, fullCounter: Record<string, boolean>, evaluator: (asg: Record<string, boolean>) => boolean, opts?: CountermodelMinOptions): MinimalCountermodel;
//# sourceMappingURL=minimize.d.ts.map