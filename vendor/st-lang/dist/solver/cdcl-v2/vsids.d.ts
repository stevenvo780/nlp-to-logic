export declare class VSIDS {
    readonly activity: Float64Array;
    readonly numVars: number;
    private varInc;
    private readonly decay;
    constructor(numVars: number, decay?: number);
    /** Inicializa activities por frecuencia de aparición en las cláusulas dadas. */
    initFromClauses(clauses: ReadonlyArray<Int32Array>): void;
    /** Incrementa la activity de la variable y dispara rescaling si hace falta. */
    bump(v: number): void;
    /** Aumenta varInc para que próximos bumps pesen más (decay efectivo). */
    decayStep(): void;
    /** Variable libre (varVal[v]==0) con mayor activity, 0 si no hay. */
    pick(varVal: Int8Array): number;
    /** Acceso al incremento actual (para tests). */
    get currentInc(): number;
    private rescale;
}
//# sourceMappingURL=vsids.d.ts.map