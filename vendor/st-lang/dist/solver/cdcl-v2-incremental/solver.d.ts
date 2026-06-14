import type { IncrementalSolveResult, IncrementalSolverOptions, SolverSummary } from './types';
export declare class IncrementalCDCL {
    private numVars;
    private readonly opts;
    private clauses;
    private learnedFlag;
    private learnedMeta;
    private clauseInc;
    private varVal;
    private varLevel;
    private varAnte;
    private trail;
    private trailLim;
    private qHead;
    private watches;
    private vsids;
    private phases;
    private checkpoints;
    private varToAssumption;
    private totalDecisions;
    private totalConflicts;
    private totalLearned;
    constructor(numVars?: number, options?: IncrementalSolverOptions);
    /** Declara y devuelve una variable nueva (1-indexada). */
    newVar(): number;
    /** Agrega una cláusula permanente. Validación: literales !== 0 y |lit| <= numVars. */
    addClause(literals: ReadonlyArray<number>): void;
    /** Crea un checkpoint para rollback con `pop()`. */
    push(): void;
    /** Revierte hasta `levels` checkpoints atrás. Default: 1. */
    pop(levels?: number): void;
    /**
     * Resuelve bajo el conjunto opcional de assumptions.
     *
     * Cada assumption es un literal con signo: positivo = var asumida true,
     * negativo = var asumida false. Si el problema es UNSAT bajo esas
     * assumptions, `failedAssumptions` contiene el subconjunto que produjo
     * el conflicto.
     */
    solve(assumptions?: ReadonlyArray<number>): IncrementalSolveResult;
    /** Devuelve la polaridad de una variable en el último modelo SAT (o undefined). */
    modelValue(varId: number): boolean | undefined;
    /** Limpia todo el estado, dejando 0 vars / 0 cláusulas. */
    reset(): void;
    /** Resumen del estado actual del solver. */
    stats(): SolverSummary;
    private growVarArrays;
    private regrowHeuristics;
    private rebuildWatches;
    private countLearned;
    private rollbackTo;
    private currentLevel;
    private litIsTrue;
    private litIsFalse;
    private enqueue;
    /** Propagación booleana con watched literals. Devuelve índice de cláusula en conflicto o NO_CONFLICT. */
    private propagate;
    private backtrackToLevel;
    /** Reset completo del trail incluyendo asignaciones de nivel 0. Usado entre
     * llamadas a solve() para garantizar idempotencia. */
    private resetAllAssignments;
    private addLearnedClauseAt;
    private runSolve;
    /**
     * Un assumption `lit` está bloqueado: `var(lit)` ya quedó fijada con
     * polaridad opuesta antes de poder decidirlo. Esa fijación puede venir
     * de unidades originales (nivel 0) o de assumptions previas que la
     * forzaron vía propagación. El unsat core no es `[lit]` solo: hay que
     * incluir el cono de antecedentes que volvió `lit` insatisfacible.
     *
     * Recorremos hacia atrás el grafo de implicación desde `var(lit)`,
     * marcando cada variable involucrada, y recolectamos:
     *   - `lit` mismo (la assumption que se intentaba decidir), y
     *   - toda assumption previa cuya variable cayó en el cono.
     *
     * Si el cono no contiene ninguna assumption previa (la base sola ya
     * implica `¬lit`), el core es `[lit]` — correcto: ese único assumption
     * es incompatible con las cláusulas permanentes.
     */
    private deriveCoreFromBlockedAssumption;
    /**
     * Dado un índice de cláusula en conflicto y la lista actual de assumptions
     * enqueued, regresa el subconjunto de assumptions cuya negación está
     * presente (recursivamente, vía antecedentes) en el cone de conflicto.
     *
     * Implementación O(|trail|): marca seen cada variable involucrada en el
     * conflicto, recorre antecedentes hasta agotar; cualquier var marcada cuyo
     * assumption literal sea distinto de 0 entra al core.
     */
    private deriveFailedAssumptions;
    private maybeReduceLearned;
}
//# sourceMappingURL=solver.d.ts.map