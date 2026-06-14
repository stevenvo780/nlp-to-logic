import type { Group, Magma, VerificationResult } from './types';
/**
 * (a · b) · c = a · (b · c) para todo a,b,c en el muestreo.
 */
export declare function isAssociative<T>(m: Magma<T>, elements: T[], eq?: (a: T, b: T) => boolean): boolean;
/**
 * a · b = b · a para todo a,b. Falla rápido si encuentra contraejemplo.
 */
export declare function isCommutative<T>(m: Magma<T>, elements: T[], eq?: (a: T, b: T) => boolean): boolean;
/**
 * Para todo a: id · a = a ∧ a · id = a.
 */
export declare function hasIdentity<T>(m: Magma<T>, elements: T[], id: T, eq?: (a: T, b: T) => boolean): boolean;
/**
 * Para todo a: a · a⁻¹ = id ∧ a⁻¹ · a = id.
 */
export declare function hasInverses<T>(g: Group<T>, elements: T[], eq?: (a: T, b: T) => boolean): boolean;
/**
 * Verifica los 4 axiomas de grupo: clausura (implícita en el tipo),
 * asociatividad, identidad e inversos. Reporta qué axiomas fallaron.
 */
export declare function verifyGroup<T>(g: Group<T>, elements: T[], eq?: (a: T, b: T) => boolean): VerificationResult;
/**
 * Verifica que un grupo es abeliano (verifyGroup + conmutatividad).
 */
export declare function verifyAbelianGroup<T>(g: Group<T>, elements: T[], eq?: (a: T, b: T) => boolean): VerificationResult;
//# sourceMappingURL=group.d.ts.map