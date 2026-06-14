import type { DLTerm, DLFormula, State, CompOp } from './ast';
/** Evalúa un término sobre un estado concreto. */
export declare function evalTerm(t: DLTerm, s: State): number;
/** Evalúa una comparación con tolerancia. */
export declare function evalComp(op: CompOp, a: number, b: number): boolean;
/**
 * Evalúa una fórmula proposicional / aritmética (sin modalidades) sobre
 * un estado concreto. Para fórmulas con [α]/⟨α⟩ se requiere el motor de
 * tableau (`tableau.ts`).
 */
export declare function evalQuantifierFree(f: DLFormula, s: State): boolean;
/** Substitución de un término por otro dentro de un término. */
export declare function substTerm(t: DLTerm, varName: string, replacement: DLTerm): DLTerm;
/** Substitución dentro de una fórmula (sólo a través de comparaciones). */
export declare function substFormula(f: DLFormula, varName: string, replacement: DLTerm): DLFormula;
//# sourceMappingURL=semantics.d.ts.map