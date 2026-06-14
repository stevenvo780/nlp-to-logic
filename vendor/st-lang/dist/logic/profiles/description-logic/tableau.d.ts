import { DLConcept, DLKnowledgeBase } from './types';
import { conceptToString } from './nnf';
/**
 * Decide si `concept` es satisfacible (eventualmente bajo la KB).
 * Construye un tableau iniciando con un individuo fresco x : concept,
 * y aplica las reglas hasta cerrar todas las ramas o encontrar una abierta.
 */
export declare function isSatisfiable(concept: DLConcept, kb?: DLKnowledgeBase): boolean;
/**
 * Decide si `sub ⊑ sup` (bajo la KB). Equivale a: ¬(sub ⊓ ¬sup) es válida,
 * o sea, `sub ⊓ ¬sup` es insatisfacible.
 */
export declare function isSubsumed(sub: DLConcept, sup: DLConcept, kb?: DLKnowledgeBase): boolean;
/**
 * Decide si `individual` es instancia de `concept` bajo la KB.
 * Equivale a: KB ∪ {individual : ¬concept} es inconsistente.
 */
export declare function isInstance(individual: string, concept: DLConcept, kb: DLKnowledgeBase): boolean;
/**
 * Clasificación: produce taxonomía de conceptos atómicos de la KB.
 * Devuelve Map<conceptName, Set<conceptName>> donde `Set` contiene
 * los conceptos atómicos que subsumen al name (es decir: superconceptos).
 * ⊤ y ⊥ se incluyen siempre.
 */
export declare function classify(kb: DLKnowledgeBase): Map<string, Set<string>>;
export { conceptToString };
//# sourceMappingURL=tableau.d.ts.map