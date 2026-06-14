import type { ConstDeclaration, DetectedSolver, DetectionResult, SMTBackend, SMTModel, SMTResult, SMTSort } from './types';
type WhichRunner = (bin: string) => string | undefined;
/**
 * Detecta si hay un solver SMT (z3 o cvc5) disponible en el PATH.
 * No lanza excepción: si no hay solver, devuelve 'none'.
 */
export declare function detectAvailableSMT(): Promise<DetectedSolver>;
/** Variante síncrona que también devuelve el path resuelto. */
export declare function detectAvailableSMTDetailed(which?: WhichRunner): DetectionResult;
export interface SubprocessBackendOptions {
    /** Timeout en ms para cada check-sat. Default 5000. */
    timeoutMs?: number;
    /** Solver forzado (en lugar de detectar). */
    prefer?: DetectedSolver;
    /** Inyector de `which` para tests. */
    which?: WhichRunner;
    /** Si true, levanta warning a console.warn cuando cae a no-op. */
    warnOnUnavailable?: boolean;
}
/**
 * SubprocessSMTBackend invoca `z3 -in` (o cvc5 equivalente) por stdio.
 *
 * Si no encuentra solver, queda en modo no-op:
 *   - checkSat() devuelve 'unknown'
 *   - getModel() devuelve undefined
 *   - getUnsatCore() devuelve []
 *
 * El backend acumula declaraciones y asserts en memoria y los envía al solver
 * en cada checkSat. No mantiene proceso persistente para no introducir leaks
 * en tests; el costo de re-arrancar z3 es <50ms por call y es aceptable.
 */
export declare class SubprocessSMTBackend implements SMTBackend {
    readonly name: string;
    private scopes;
    private lastModel;
    private lastUnsatCore;
    private readonly available;
    private readonly binaryPath;
    private readonly solver;
    private readonly timeoutMs;
    private warnedUnavailable;
    private readonly warnOnUnavailable;
    constructor(opts?: SubprocessBackendOptions);
    reset(): void;
    push(): void;
    pop(levels?: number): void;
    declareConst(name: string, sort: SMTSort): void;
    /** Versión interna para inyectar declaraciones detectadas por el serializer. */
    declareFromInference(decls: ConstDeclaration[]): void;
    assertFormula(smtlib: string): void;
    isAvailable(): boolean;
    checkSat(): SMTResult;
    getModel(): SMTModel | undefined;
    getUnsatCore(): string[];
    private currentScope;
    private buildScript;
    private formatDecl;
    private runSolver;
    private parseOutput;
}
export {};
//# sourceMappingURL=subprocess-backend.d.ts.map