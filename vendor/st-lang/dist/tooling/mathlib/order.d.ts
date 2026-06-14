import type { PartialOrder } from './types';
/**
 * Para todo a en `elements`: a ≤ a.
 */
export declare function isReflexive<T>(po: PartialOrder<T>, elements: T[]): boolean;
/**
 * Para todo a,b: a ≤ b ∧ b ≤ a ⇒ a = b.
 * La igualdad se decide con `===` para tipos primitivos; para
 * tipos compuestos se acepta un `eq` custom.
 */
export declare function isAntisymmetric<T>(po: PartialOrder<T>, elements: T[], eq?: (a: T, b: T) => boolean): boolean;
/**
 * Para todo a,b,c: a ≤ b ∧ b ≤ c ⇒ a ≤ c.
 */
export declare function isTransitive<T>(po: PartialOrder<T>, elements: T[]): boolean;
/**
 * Un poset es lattice si cada par {a,b} tiene supremo (join) e
 * ínfimo (meet) dentro de `elements`. Esto verifica existencia
 * estructural usando el orden parcial (no requiere ops explícitas).
 */
export declare function isLattice<T>(po: PartialOrder<T>, elements: T[], eq?: (a: T, b: T) => boolean): boolean;
/**
 * Reporte completo del orden parcial sobre el conjunto dado.
 */
export declare function verifyPartialOrder<T>(po: PartialOrder<T>, elements: T[], eq?: (a: T, b: T) => boolean): {
    valid: boolean;
    failures: string[];
};
//# sourceMappingURL=order.d.ts.map