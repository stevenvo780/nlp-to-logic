import type { FormalContext } from './types';
/**
 * Construye un contexto formal a partir de listas de objetos, atributos y
 * la lista bruta de incidencias.
 *
 * Valida:
 *  - Los identificadores no pueden contener el separador '|'.
 *  - No se admiten objetos o atributos duplicados.
 *  - Cada incidencia [g, m] debe referirse a objetos/atributos declarados.
 */
export declare function createContext(objects: string[], attributes: string[], incidence: Array<[string, string]>): FormalContext;
/**
 * Indica si el objeto `g` tiene el atributo `m` en el contexto.
 * O(1) gracias a la representación como Set de pares codificados.
 */
export declare function hasIncidence(ctx: FormalContext, g: string, m: string): boolean;
/**
 * Operador polar B → B'  (atributos → objetos).
 * Devuelve el conjunto de objetos que poseen TODOS los atributos de `attrs`.
 * Si `attrs` es vacío, el resultado es G (convención: ∀ trivialmente cierto).
 */
export declare function derivativeObjects(ctx: FormalContext, attrs: Set<string>): Set<string>;
/**
 * Operador polar A → A'  (objetos → atributos).
 * Devuelve los atributos compartidos por TODOS los objetos de `objs`.
 * Si `objs` es vacío, el resultado es M.
 */
export declare function derivativeAttributes(ctx: FormalContext, objs: Set<string>): Set<string>;
/**
 * Verifica si (extent, intent) es un concepto formal en `ctx`:
 *   extent' = intent  y  intent' = extent.
 *
 * Equivale a verificar la doble clausura, pero se computa directo desde la
 * relación de incidencia, sin acumular intermedios.
 */
export declare function isConcept(ctx: FormalContext, extent: Set<string>, intent: Set<string>): boolean;
/**
 * Clausura de Galois sobre intents:  B → B'' = (B')'.
 * Idempotente: closeIntent(closeIntent(B)) = closeIntent(B).
 */
export declare function closeIntent(ctx: FormalContext, intent: Set<string>): Set<string>;
/**
 * Clausura sobre extents:  A → A'' = (A')'.
 */
export declare function closeExtent(ctx: FormalContext, extent: Set<string>): Set<string>;
//# sourceMappingURL=context.d.ts.map