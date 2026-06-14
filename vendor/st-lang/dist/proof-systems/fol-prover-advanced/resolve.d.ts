import type { FOLClause, Substitution } from './types';
export declare function resetRenameCounter(): void;
/**
 * Renombra todas las variables de una cláusula con sufijos frescos, para
 * evitar captura accidental al resolver con otra cláusula.
 */
export declare function renameClause(c: FOLClause): FOLClause;
/**
 * Resolución binaria: une dos cláusulas eliminando un par de literales
 * complementarias unificables. Devuelve cero o más resolventes (uno por par
 * de literales complementarias que unifiquen).
 */
export declare function binaryResolve(a: FOLClause, b: FOLClause): Array<{
    clause: FOLClause;
    sub: Substitution;
}>;
/**
 * Hyperresolución: en un solo paso, elimina **todas** las literales negativas
 * de un "núcleo" (nucleus) usando cláusulas auxiliares positivas (electrons)
 * que sean unitarias o tengan sólo literales positivas. El resultado es una
 * cláusula con sólo literales positivas (positive hyperresolvent).
 *
 * `positive` aquí es una lista; en la práctica el caller pasa cláusulas
 * positivas candidatas y la función produce todos los hyperresolventes
 * posibles del núcleo contra ese conjunto. Para mantener la API del spec,
 * exportamos `hyperresolve(positive, nucleus)` con la primera cláusula como
 * electron (cubre el caso "3 units + nucleus" si se llama en cadena).
 */
export declare function hyperresolve(positive: FOLClause, nucleus: FOLClause): FOLClause[];
export declare function hyperresolveMany(positives: FOLClause[], nucleus: FOLClause): Array<{
    clause: FOLClause;
    sub: Substitution;
    usedElectrons: number[];
}>;
/**
 * Factoring: si dos literales del mismo signo unifican, colapsarlas reduce la
 * cláusula. Indispensable para completar la resolución.
 */
export declare function factor(c: FOLClause): FOLClause[];
export declare function dedupLiterals(c: FOLClause): FOLClause;
/** Detecta cláusulas tautológicas (P ∨ ¬P). */
export declare function isTautology(c: FOLClause): boolean;
//# sourceMappingURL=resolve.d.ts.map