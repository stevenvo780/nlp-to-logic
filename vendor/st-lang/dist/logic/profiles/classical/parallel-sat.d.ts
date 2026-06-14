import type { CDCLResult, SolverStats } from './cdcl';
/** Mensaje del orquestador al worker */
export interface WorkerTask {
    /** Cláusulas flat-packed: [len1, lit1, lit2, ..., len2, lit1, lit2, ...] */
    clauseData: Int32Array;
    numVars: number;
    atomNames: string[];
    timeoutMs: number;
    /** Semilla para variar heurísticas entre workers */
    heuristicSeed: number;
    /** Variante de restart: 0=luby, 1=geometric, 2=fixed */
    restartPolicy: number;
}
/** Mensaje del worker al orquestador */
export interface WorkerResult {
    satisfiable: boolean;
    model?: Record<string, boolean>;
    stats?: SolverStats;
    workerId: number;
}
/**
 * Empaqueta un array de Int32Array clauses en un solo buffer plano.
 * Formato: [clauseLen, lit1, lit2, ..., clauseLen, lit1, ...]
 * Esto permite pasar por SharedArrayBuffer o structured clone sin overhead.
 */
export declare function packClauses(clauses: Int32Array[]): Int32Array;
/**
 * Desempaqueta un buffer plano de vuelta a Int32Array[].
 */
export declare function unpackClauses(packed: Int32Array): Int32Array[];
/**
 * Comprueba si el entorno soporta workers.
 */
export declare function workersAvailable(): boolean;
/**
 * Umbral mínimo de variables para activar paralelismo.
 * Por debajo de este umbral, el overhead de workers no compensa.
 */
export declare const PARALLEL_THRESHOLD = 80;
/**
 * Número máximo de workers a lanzar (limitado por configs de portfolio).
 */
export declare const MAX_WORKERS = 4;
/**
 * Resuelve SAT en paralelo con portfolio racing.
 *
 * @param clauses Cláusulas ya codificadas (post-preprocessing)
 * @param numVars Número de variables
 * @param atomNames Nombres de los átomos originales
 * @param timeoutMs Timeout global
 * @returns Promise con el resultado
 */
export declare function parallelSolve(clauses: Int32Array[], numVars: number, atomNames: string[], timeoutMs: number): Promise<CDCLResult>;
/**
 * Versión síncrona que intenta paralelismo y cae a secuencial.
 * Para integración transparente con el flujo actual de cdcl().
 *
 * NOTA: Esta función solo es útil si el caller puede manejar
 * la Promise. Si no, usar cdclSolve directamente.
 */
export declare function tryParallelSolve(clauses: Int32Array[], numVars: number, atomNames: string[], timeoutMs: number): Promise<CDCLResult> | null;
//# sourceMappingURL=parallel-sat.d.ts.map