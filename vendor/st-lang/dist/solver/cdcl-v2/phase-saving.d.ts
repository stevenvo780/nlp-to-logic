export declare class PhaseSaver {
    /** 1 = positivo, 0 = negativo. -1 codificado como 0 en la práctica. */
    private readonly phase;
    readonly numVars: number;
    private readonly initialPhase;
    constructor(numVars: number, initialPhase?: 0 | 1);
    /** Guarda la polaridad efectivamente asignada al literal `lit`. */
    save(lit: number): void;
    /** Polaridad guardada (0 o 1) para la variable. */
    getPhase(v: number): 0 | 1;
    /** Literal a probar en branching: var positiva si phase=1, negativa si phase=0. */
    pickLit(v: number): number;
}
//# sourceMappingURL=phase-saving.d.ts.map