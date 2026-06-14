import type { AntiUnificationResult, FreshSupply, Term } from './types';
import { applySubst } from './term-utils';
/**
 * Variante "detailed" del n-way lgg.
 *
 * Devuelve la generalización y un array `substs` de longitud n tal
 * que substs[i] aplicada al generalization reproduce el término i.
 */
export interface AntiUnificationManyResult {
    generalization: Term;
    substs: Map<string, Term>[];
    variables: string[];
}
/**
 * Anti-unification n-aria. Reduce con la versión binaria.
 *
 * Para n=0 lanza error (no hay generalización sensata).
 * Para n=1 devuelve el término sin variables nuevas.
 */
export declare function antiUnifyMany(terms: Term[], freshSupply?: FreshSupply): AntiUnificationResult;
/**
 * Versión "detailed" — devuelve las n sustituciones independientes.
 *
 * Esta es la forma más útil para clientes que quieren ver cómo se
 * instancia cada uno de los n términos desde la generalización.
 */
export declare function antiUnifyManyDetailed(terms: Term[], freshSupply?: FreshSupply): AntiUnificationManyResult;
/**
 * Orden de generalidad entre dos términos.
 *
 * Definición: g1 ≤ g2 ⇔ existe sustitución σ con σ(g1) = g2.
 * Es decir, g1 es MÁS GENERAL que g2 (g2 es una instancia de g1).
 *
 * Resultados:
 *   - -1  si g1 es ESTRICTAMENTE más general que g2 (g1 < g2 en
 *         generalidad inversa — equivalente: σ(g1)=g2 pero no
 *         σ'(g2)=g1).
 *   -  0  si son equivalentes módulo renombre (cada uno instancia
 *         del otro vía sustitución de variables).
 *   - +1  si g2 es estrictamente más general que g1.
 *   - null si son INCOMPARABLES (no hay σ en ningún sentido).
 *
 * Nota: la convención del usuario en la spec es
 *   generalizationOrder(X, f(X)) → -1 (X más general).
 * Esto es coherente: X es más general que f(X), y devolvemos -1.
 */
export declare function generalizationOrder(g1: Term, g2: Term): -1 | 0 | 1 | null;
export { applySubst };
//# sourceMappingURL=many.d.ts.map