import type { SMTLogic, SMTModel, SMTResult, SMTSort } from '../smt/types';
import type { AsyncSMTBackend, AvailableSMTRuntime, Z3WasmBackendOptions } from './types';
/**
 * `isZ3Available()` intenta inicializar z3-solver y devuelve true si
 * obtiene un Context utilizable. No lanza. Útil para skip de tests y
 * detección de runtime.
 */
export declare function isZ3Available(): Promise<boolean>;
/**
 * Detector unificado de runtime SMT con preferencia por el WASM in-process.
 * - z3-wasm si la WASM bind carga.
 * - z3-subprocess o cvc5-subprocess si hay binario en PATH.
 * - 'none' si no hay nada.
 */
export declare function detectAvailableSMT(): Promise<AvailableSMTRuntime>;
/**
 * Z3WasmBackend — wrapper sobre z3-solver con interfaz AsyncSMTBackend.
 *
 * Modelo de estado:
 *  - Mantiene un único `Solver` Z3 cuyo stack push/pop se sincroniza con
 *    `scopes[]` del host (espejo). Esto permite re-hidratar el solver con
 *    `solver.reset()` + replay de scopes si fuera necesario (no se hace
 *    en el flujo normal, sólo en `reset()`).
 *  - `assertFormula(body)` mete `(assert body)` en el solver actual,
 *    pero también lo registra en `scopes[top].assertions` por trazabilidad.
 *  - `getUnsatCore()` requiere haber usado `assertNamed(name, body)`:
 *    estos asserts se envuelven en `(=> <track> <body>)` y se pasan como
 *    assumption literals al check(). El core devuelto es la lista de
 *    nombres `track`.
 */
export declare class Z3WasmBackend implements AsyncSMTBackend {
    readonly name = "z3-wasm";
    private readonly ctx;
    private solver;
    private readonly logic;
    private readonly produceUnsatCore;
    private readonly produceModels;
    private readonly timeoutMs;
    private scopes;
    /** Tracks declarados como Bool y usados como assumption literals. */
    private trackNames;
    private lastModel;
    private lastUnsatCore;
    private lastStatistics;
    private constructor();
    /** Crea un backend nuevo. Falla si z3-solver no puede inicializarse. */
    static create(logicOrOptions?: SMTLogic | Z3WasmBackendOptions): Promise<Z3WasmBackend>;
    /** Resetea el solver (drop all asserts y scopes). */
    reset(): void;
    push(): void;
    pop(levels?: number): void;
    declareConst(name: string, sort: SMTSort, bvWidth?: number): void;
    /**
     * Inserta una aserción directa (sin tracking). El cuerpo es SMT-LIB v2
     * SIN envolver en `(assert ...)`.
     */
    assertFormula(smtlib: string): void;
    /**
     * Aserción nombrada para participar de unsat core. El `trackName` se
     * declara como Bool fresco y la aserción real se mete como
     * `(=> trackName body)`. En checkSat() esos tracks se pasan como
     * assumption literals.
     */
    assertNamed(trackName: string, smtlib: string): void;
    checkSat(): Promise<SMTResult>;
    getModel(): SMTModel | undefined;
    getUnsatCore(): string[];
    /**
     * `setOption` envuelve `solver.set(key, value)`. Acepta los nombres
     * estándar Z3 (ej. `timeout`, `random_seed`).
     */
    setOption(key: string, value: string | number | boolean): void;
    /** Devuelve la última snapshot de stats Z3 capturada en checkSat(). */
    getStatistics(): Record<string, number>;
    /**
     * Cierra el solver liberando memoria WASM. Después de close() el
     * backend no debe usarse.
     */
    close(): void;
    private buildSolver;
    private currentScope;
    private formatDecl;
    private extractModel;
    private extractUnsatCore;
    private extractStatistics;
}
//# sourceMappingURL=z3-wasm-backend.d.ts.map