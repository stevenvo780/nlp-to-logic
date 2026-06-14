import type { DLFormula, State } from './ast';
export interface DLOptions {
    /** Profundidad máxima al desenrollar loops `α*`. */
    loopUnfold?: number;
    /** Cantidad de muestras temporales para evaluar ODEs continuas. */
    odeSamples?: number;
    /** Horizonte temporal máximo a explorar en ODEs. */
    odeHorizon?: number;
    /** Cantidad de valores muestrales para `x := *`. */
    nondetSamples?: number[];
    /** Estados iniciales explícitos. Si vacío, se genera una malla cubriendo las variables relevantes. */
    initialStates?: State[];
    /** Valores muestrales por defecto para construir la malla de iniciales. */
    initialMesh?: number[];
}
/** Decisión: la fórmula es válida (vale en todo estado muestreado). */
export interface DLCheckResult {
    status: 'valid' | 'invalid' | 'satisfiable' | 'unsatisfiable' | 'unknown';
    /** Contramodelo o testigo si aplica. */
    witness?: State;
    /** Cantidad de estados muestreados. */
    statesChecked: number;
}
/**
 * Decide si `f` es válida sobre toda la malla muestreada (criterio de
 * validez universal acotada). Si encuentra contraejemplo lo retorna.
 * Si algún estado resulta 'unknown' (ODE no soportada) y ninguno produce
 * contraejemplo, retorna {status:'unknown'} para no afirmar validez sin respaldo.
 */
export declare function checkValid(f: DLFormula, opts?: DLOptions): DLCheckResult;
/** Decide si `f` es satisfacible en algún estado muestreado. */
export declare function checkSatisfiable(f: DLFormula, opts?: DLOptions): DLCheckResult;
/**
 * Evalúa la fórmula en un estado específico — útil para casos donde el
 * usuario quiere chequear desde una pre-condición concreta.
 * Retorna `'unknown'` si la evaluación topa con una ODE no soportada.
 */
export declare function evalInState(f: DLFormula, s: State, opts?: DLOptions): boolean | 'unknown';
/** Re-export utilitario: lista de variables relevantes en la fórmula. */
export declare function relevantVariables(f: DLFormula): string[];
//# sourceMappingURL=tableau.d.ts.map