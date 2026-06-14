import type { CSP } from './types';
/**
 * Aplica AC-3 sobre una copia de los dominios del CSP.
 * Devuelve { consistent, reducedDomains }: si `consistent` es false,
 * el CSP es UNSAT por consistencia de arco (algún dominio quedó vacío).
 *
 * La firma deja los dominios originales intactos: el caller decide si
 * adoptar `reducedDomains` o conservar los originales.
 */
export declare function ac3<V, D>(csp: CSP<V, D>): {
    consistent: boolean;
    reducedDomains: Map<V, D[]>;
};
/**
 * Helper público para uso en backtracking incremental: aplica AC-3
 * sobre un set de dominios ya provisto (mutación in-place permitida)
 * y devuelve `true` si los dominios siguen consistentes.
 */
export declare function ac3InPlace<V, D>(csp: CSP<V, D>, domains: Map<V, D[]>): boolean;
//# sourceMappingURL=ac3.d.ts.map