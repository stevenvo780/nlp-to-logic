import type { FOLLiteral, FOLTerm, Substitution } from './types';
/**
 * Unificación de Robinson con occurs-check. Devuelve la sustitución más
 * general (mgu) o `null` si no unifica.
 *
 * Implementación iterativa sobre una pila de pares (t1,t2) para evitar
 * recursión profunda en cláusulas grandes.
 */
export declare function unify(t1: FOLTerm, t2: FOLTerm): Substitution | null;
export declare function unifyLiterals(l1: FOLLiteral, l2: FOLLiteral): Substitution | null;
export declare function applySubToTerm(t: FOLTerm, sub: Substitution): FOLTerm;
export declare function applySubToLiteral(l: FOLLiteral, sub: Substitution): FOLLiteral;
export declare function termsEqual(a: FOLTerm, b: FOLTerm): boolean;
export declare function literalsEqual(a: FOLLiteral, b: FOLLiteral): boolean;
//# sourceMappingURL=unify.d.ts.map