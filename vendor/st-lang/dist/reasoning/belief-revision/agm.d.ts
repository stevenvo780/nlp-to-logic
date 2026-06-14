import type { BeliefSet, PartialOrder } from './types';
/**
 * Construye un belief set a partir de un arreglo de fórmulas iniciales.
 * Duplicados sintácticos se colapsan automáticamente.
 */
export declare function newBeliefSet(initial: string[]): BeliefSet;
/**
 * ¿Es K consistente? (la conjunción de todas sus fórmulas es satisfactible)
 */
export declare function isConsistent(K: BeliefSet): boolean;
/**
 * ¿K implica lógicamente φ?
 * φ se pasa como cadena (se parsea con la misma sintaxis que las creencias).
 */
export declare function entails(K: BeliefSet, phi: string): boolean;
/**
 * Expansion: K + φ.
 * Definición AGM: K + φ = Cn(K ∪ {φ}).
 * Sobre belief bases: añadimos φ al conjunto sintáctico (sin clausurar).
 * NO garantiza consistencia (el caller suele preferir `revise` en su lugar).
 */
export declare function expand(K: BeliefSet, phi: string): BeliefSet;
/**
 * Contraction: K - φ.
 * Definición AGM: K - φ es el mayor subconjunto de K que NO implica φ.
 *
 * Casos especiales:
 * - Si φ es tautología (vacuidad K-5): K - φ = K (no se puede remover).
 * - Si K no implica φ: K - φ = K.
 * - En cualquier otro caso: se aplica partial-meet con `ordering`.
 *
 * El parámetro opcional `ordering` define el "epistemic entrenchment":
 * fórmulas con mayor número son más arraigadas y se preservan primero.
 */
export declare function contract(K: BeliefSet, phi: string, ordering?: PartialOrder): BeliefSet;
/**
 * Revision: K * φ.
 * Identidad de Levi: K * φ = (K - ¬φ) + φ.
 *
 * Garantiza:
 * - K2 (éxito): φ ∈ K * φ.
 * - K5 (consistencia): si φ es consistente, K * φ es consistente.
 *
 * El parámetro `ordering` se usa para la contracción interna por ¬φ.
 */
export declare function revise(K: BeliefSet, phi: string, ordering?: PartialOrder): BeliefSet;
/**
 * Verifica una versión finitizada del postulado K1 (cierre lógico):
 * para cada φ ∈ K, K entails φ (autocontención lógica).
 * En belief bases puras esto es trivial; aquí adicionalmente exigimos
 * que K sea consistente o que cada fórmula sea bien-formada.
 */
export declare function verifyClosure(K: BeliefSet): boolean;
/**
 * K2 (éxito): φ ∈ Cn(K * φ).
 * Tras revisar por φ, el belief set debe implicar φ.
 */
export declare function verifySuccess(K_revised: BeliefSet, phi: string): boolean;
/**
 * K3 (inclusión): K * φ ⊆ K + φ.
 * Toda fórmula derivable de K * φ debe ser derivable de K + φ.
 * Para belief bases finitas, basta verificar que cada formula sintáctica
 * de K_revised sea derivable desde K ∪ {φ}.
 */
export declare function verifyInclusion(K_revised: BeliefSet, K: BeliefSet, phi: string): boolean;
/**
 * Helper utilitario: devuelve K como arreglo ordenado de fórmulas
 * (útil para tests, debugging, hashing estable).
 */
export declare function beliefSetToArray(K: BeliefSet): string[];
/**
 * Serialización canónica de un belief set: ordena alfabéticamente y
 * normaliza cada fórmula vía `formulaToString` sobre su AST parseado.
 */
export declare function canonicalize(K: BeliefSet): string;
//# sourceMappingURL=agm.d.ts.map