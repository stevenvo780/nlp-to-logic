import type { AntiUnificationResult, FreshSupply, Term } from './types';
/**
 * Fuente default de variables frescas: _g0, _g1, _g2, …
 *
 * Se devuelve una NUEVA instancia por llamada para evitar estado
 * compartido entre invocaciones de antiUnify.
 */
export declare function defaultFreshSupply(prefix?: string): FreshSupply;
/**
 * Anti-unification de dos términos.
 *
 * Devuelve el lgg (least general generalization) junto con las
 * sustituciones de izquierda y derecha que reconstruyen los
 * términos originales.
 *
 * Complejidad: O(|t1| + |t2|) tiempo si la tabla se implementa con
 * hashing O(1). Usamos `termKey` que serializa, así que es
 * O((|t1| + |t2|)·k) donde k es el tamaño del subtérmino más grande
 * que aparezca en un desacuerdo.
 */
export declare function antiUnify(t1: Term, t2: Term, freshSupply?: FreshSupply): AntiUnificationResult;
//# sourceMappingURL=anti-unify.d.ts.map