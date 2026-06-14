/**
 * ClaimGraph — DAG de claims con detección de ciclos, orden topológico,
 * validación e invalidación propagada.
 */
import type { Claim, ClaimEvaluator, ClaimValidation } from './types';
export declare class CycleError extends Error {
    readonly cycles: string[][];
    constructor(cycles: string[][]);
}
export declare class ClaimGraph {
    private readonly claims;
    add(claim: Claim): void;
    remove(claimId: string): boolean;
    get(claimId: string): Claim | undefined;
    all(): Claim[];
    /**
     * Tarjan SCC. Devuelve sólo las componentes con ciclo (size > 1, o size 1
     * con auto-loop). Un grafo acíclico devuelve [].
     */
    detectCycles(): string[][];
    /**
     * Orden topológico (Kahn) — claims sin dependencias primero, luego sus
     * consumidores. Tira CycleError si hay ciclo.
     *
     * Las dependencias faltantes (referidas pero no en el grafo) se ignoran
     * para el conteo de in-degree — son responsabilidad del evaluator.
     */
    topologicalOrder(): string[];
    /**
     * Valida todas las claims en orden topológico. Si una claim depende de
     * otra ya marcada inválida, se marca inválida con invalidatedBy = lista
     * de root claims inválidas en su árbol de dependencias.
     *
     * El evaluator sólo se invoca para claims cuyas dependencias son todas
     * válidas (short-circuit por propagación).
     */
    validateAll(evaluator: ClaimEvaluator): Promise<ClaimValidation[]>;
    /**
     * Todas las claims que dependen transitivamente de rootClaimId (sus
     * descendientes en el DAG de dependencias). El propio root NO se
     * incluye. Orden determinístico (BFS, alfabético dentro de cada nivel).
     */
    invalidationPath(rootClaimId: string): string[];
}
//# sourceMappingURL=claim-graph.d.ts.map