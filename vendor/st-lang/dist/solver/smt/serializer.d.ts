import type { Formula, FormulaKind } from '../../types';
import type { SMTLogic, SMTSort, ToSMTLIBOptions, ConstDeclaration } from './types';
declare const ARITHMETIC_KINDS: ReadonlySet<FormulaKind>;
declare const BOOLEAN_KINDS: ReadonlySet<FormulaKind>;
/** Selecciona el sort por defecto para una constante a partir de la lógica. */
export declare function defaultSortFor(logic: SMTLogic): SMTSort;
/**
 * Traduce una fórmula ST a su representación SMT-LIB v2.
 *
 * Por defecto devuelve sólo el cuerpo (sin set-logic ni check-sat) para que el
 * caller decida cómo ensamblarlo. Con `full: true` produce un script SMT-LIB
 * autocontenido (declaraciones de constantes + assert + check-sat).
 */
export declare function toSMTLIB(formula: Formula, opts?: ToSMTLIBOptions): string;
/** Extrae las declaraciones inferidas para una fórmula. Útil para el backend. */
export declare function inferDeclarations(formula: Formula, logic?: SMTLogic): ConstDeclaration[];
/** Helper público para emitir una declaración SMT-LIB. */
export declare function emitDeclareConst(name: string, sort: SMTSort, bvWidth?: number): string;
/** Re-exporta el set de kinds booleanos para uso interno de backends. */
export { BOOLEAN_KINDS, ARITHMETIC_KINDS };
//# sourceMappingURL=serializer.d.ts.map