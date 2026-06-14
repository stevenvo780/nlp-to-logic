import type { LPProblem } from './types';
/**
 * Convierte un LPProblem arbitrario a forma estándar:
 * maximizar c·x sujeto a Ax ≤ b con x ≥ 0 (sin cotas explícitas).
 * Preserva el sentido original mediante `objective.kind`:
 * si el original era 'minimize', el resultado lo refleja con
 * coeficientes negados (el caller debe negar el valor objetivo
 * al interpretarlo).
 */
export declare function standardForm(lp: LPProblem): LPProblem;
//# sourceMappingURL=standard-form.d.ts.map