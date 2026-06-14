import type { Term, FreshSupply } from '../../runtime/anti-unification';
/**
 * Resultado de generalización: el statement (puede ser string con
 * placeholders fresh), el conteo de variables abstractas
 * introducidas y un flag de si la generalización es no-trivial
 * (e.g. produjo placeholders).
 */
export interface GeneralizationResult {
    statement: string;
    abstractionLevel: number;
    nonTrivial: boolean;
}
/**
 * Generaliza una lista de instancias concretas vía anti-unification
 * sobre términos. Útil cuando el caller ya parsea fórmulas a un AST
 * `Term`.
 */
export declare function generalizeTerms(instances: Term[], freshSupply?: FreshSupply): GeneralizationResult;
/**
 * Generaliza una lista de fórmulas string. Tokeniza, alinea
 * posicionalmente, y donde haya desacuerdo introduce un placeholder
 * fresh. Si la tokenización produce arrays de distinta longitud, no
 * intenta align: devuelve el primer string y nonTrivial = false.
 *
 * Tabla de desacuerdos: si el mismo par (a, b) reaparece, recibe el
 * mismo placeholder (consistencia, propiedad LGG).
 *
 * Para igualar reservadas (operadores, paréntesis) en todas las
 * instancias, esas posiciones se mantienen literales. Solo los
 * tokens-identificador se generalizan.
 */
export declare function generalizeFormulas(instances: string[]): GeneralizationResult;
/**
 * Generaliza un grupo (lista de strings de conclusión, repetida
 * tantas veces como instancias haya), opcionalmente capeando el
 * abstractionLevel máximo.
 *
 * Si `preserveSemantic` está activo y la generalización no es
 * instanciable de vuelta para cubrir todas las instancias, devuelve
 * el literal de la primera instancia con abstractionLevel = 0.
 */
export declare function generalizeLemma(conclusions: string[], options?: {
    maxAbstractionLevel?: number;
    preserveSemantic?: boolean;
}): GeneralizationResult;
//# sourceMappingURL=generalizer.d.ts.map