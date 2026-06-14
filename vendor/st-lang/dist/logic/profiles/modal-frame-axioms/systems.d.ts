import { FrameAxiom, ModalFormula, ModalSystem } from './types';
/**
 * Devuelve los axiomas que caracterizan al sistema nombrado.
 *
 * Para sistemas no listados (e.g. "K45", "KTB5") usar directamente
 * {@link tableauWithAxioms} con la combinación deseada.
 */
export declare function systemAxioms(system: ModalSystem): FrameAxiom[];
/**
 * ¿`phi` es satisfacible en el sistema `system`?
 *
 * Equivale a: ¿existe un modelo Kripke cuyo frame cumple los
 * axiomas y cuya raíz fuerza `phi`?
 */
export declare function isSatisfiable(phi: ModalFormula, system: ModalSystem): boolean;
/**
 * ¿`phi` es válida en el sistema `system`?
 *
 * Equivale a: ¬(¬phi satisfacible) — si el tableau de ¬φ cierra
 * en todas las ramas, φ es teorema del sistema.
 */
export declare function isValid(phi: ModalFormula, system: ModalSystem): boolean;
/**
 * Esquema del axioma como fórmula concreta sobre un átomo dado.
 * Útil para verificar que cada axioma es válido en su sistema
 * mínimo.
 */
export declare function axiomFormula(axiom: FrameAxiom, p: ModalFormula): ModalFormula;
//# sourceMappingURL=systems.d.ts.map