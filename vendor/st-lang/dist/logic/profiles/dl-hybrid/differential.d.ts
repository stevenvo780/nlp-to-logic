import type { Expr as SymExpr } from '../../../runtime/symbolic-diff';
import type { DLTerm, OdeSystem, State } from './ast';
/** Convierte un DLTerm en una Expr del motor symbolic-diff. */
export declare function termToExpr(t: DLTerm): SymExpr;
/**
 * Resultado de intentar resolver un sistema ODE.
 *
 * `constant`  — todos los rhs son constantes (x' = c).
 * `linear`    — sistema desacoplado lineal: cada x' = a*x + b con a, b
 *               constantes y no involucra otras variables del sistema.
 * `unsupported` — fuera del subset decidible.
 */
export type SolutionKind = {
    kind: 'constant';
    rates: Map<string, number>;
} | {
    kind: 'linear';
    coeffs: Map<string, {
        a: number;
        b: number;
    }>;
} | {
    kind: 'unsupported';
    reason: string;
};
/** Verifica si un término es una constante numérica (con simplificación). */
export declare function termIsConstant(t: DLTerm): number | null;
/**
 * Intenta extraer (a, b) tal que `rhs = a*var + b` sobre las constantes
 * (ignora otras variables → en ese caso devuelve null).
 */
export declare function termIsLinearIn(t: DLTerm, varName: string): {
    a: number;
    b: number;
} | null;
/**
 * Clasifica un sistema ODE en uno de los casos solubles cerrados.
 * El sistema debe ser desacoplado: cada x' = f(x) sólo puede mencionar
 * a la propia variable. Acoplamientos genéricos → unsupported.
 */
export declare function classifyOde(system: OdeSystem): SolutionKind;
/**
 * Calcula el estado tras evolucionar la ODE por tiempo t exacto (sin
 * domain check). Sólo soporta `constant` y `linear`. Para no soportadas
 * lanza error — el caller usa `classifyOde` antes.
 */
export declare function flow(system: OdeSystem, initial: State, t: number): State;
/**
 * Derivada de Lie de un término p a lo largo del campo vectorial f
 * definido por la ODE:
 *      L_f(p) = Σᵢ (∂p/∂xᵢ) · fᵢ
 * Si una variable de p no tiene ecuación, su derivada respecto al
 * tiempo es 0 (variable estática).
 */
export declare function lieDerivative(p: DLTerm, system: OdeSystem): SymExpr;
/**
 * Evalúa una Expr de symbolic-diff en un estado concreto. Útil para
 * chequear si la derivada de Lie es ≥ 0 en un punto específico.
 */
export declare function evalSym(e: SymExpr, state: State): number;
//# sourceMappingURL=differential.d.ts.map