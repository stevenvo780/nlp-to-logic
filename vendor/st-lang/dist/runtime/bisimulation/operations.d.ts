import type { LTS, BisimulationResult } from './types';
/**
 * Devuelve `true` si los estados `s` y `t` caen en el mismo bloque de la
 * partición de bisimulación fuerte. Lanza si alguno no existe en M.
 */
export declare function areBisimilar(lts: LTS, s: string, t: string): boolean;
/**
 * Construye el LTS cociente M/~ donde cada bloque de la partición de
 * bisimulación se convierte en un único estado. Las transiciones se
 * deduplican: si s -a-> t, entonces [s] -a-> [t] aparece una sola vez.
 *
 * El labelling del bloque es el labelling común de sus miembros
 * (todos los miembros tienen el mismo labelling por construcción).
 */
export declare function quotientLTS(lts: LTS): LTS;
/**
 * Verifica si dos LTS son fuertemente bisimilares.
 * Los espacios de estados deben ser disjuntos; si no lo son, los renombramos
 * internamente con prefijos "L:" y "R:".
 *
 * El criterio: en el LTS combinado, los conjuntos iniciales (o, en ausencia
 * de iniciales explícitos, todos los estados) deben quedar particionados de
 * forma que cada estado de L tenga al menos un estado equivalente en R y
 * viceversa. Como API simple, se compara la firma de la partición sobre
 * el LTS combinado: dos LTS son bisimilares como sistemas sii existe una
 * biyección entre sus bloques tal que cada bloque contiene estados de ambos
 * lados (interpretación de "los autómatas son indistinguibles").
 */
export declare function strongBisimulation(lts1: LTS, lts2: LTS): boolean;
/**
 * Bisimulación débil: oculta transiciones τ y satura ⇒ = τ* antes de aplicar
 * Paige-Tarjan. Útil para CCS / process algebras donde τ representa una
 * acción interna no observable.
 *
 * Cuesta O(n³) por la saturación (transitivos τ); para LTS grandes con muchas
 * acciones reales esto es aceptable. La partición resultante es la mayor
 * relación de bisimulación débil.
 */
export declare function weakBisimulation(lts: LTS, tau: string): BisimulationResult;
//# sourceMappingURL=operations.d.ts.map