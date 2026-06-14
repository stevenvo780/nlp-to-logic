export interface AnalysisResult {
    /** Cláusula aprendida. learned[0] es el literal asertivo (a propagar tras backtrack). */
    learned: Int32Array;
    /** Nivel de decisión al que retroceder (0 si la cláusula es unitaria). */
    btLevel: number;
    /** Variables que fueron "bumped" durante el análisis (para que VSIDS las premie). */
    bumped: number[];
}
/** Función mínima requerida del solver para acceder al antecedente de cada lit. */
export interface ConflictContext {
    /** Array de cláusulas indexadas por índice (mutable, learned clauses incluidas). */
    clauses: ReadonlyArray<Int32Array>;
    /** Trail completo de literales asignados en orden. */
    trail: ReadonlyArray<number>;
    /** Nivel de decisión actual. */
    currentLevel: number;
    /** Nivel de decisión en que se asignó cada variable (1-indexado, -1 si libre). */
    varLevel: Int32Array;
    /** Cláusula antecedente que propagó cada variable (-1 si fue decisión). */
    varAnte: Int32Array;
}
/**
 * Analiza un conflicto usando el esquema 1UIP.
 *
 * @param conflictCi cláusula que entró en conflicto durante BCP.
 * @param ctx contexto inmutable del solver (trail, levels, antecedents).
 * @returns cláusula aprendida + nivel de backtrack + variables bumpeadas.
 *
 * Si retorna learned.length === 0 y btLevel === -1, el solver debe interpretar
 * UNSAT raíz (conflicto en nivel 0).
 */
export declare function analyzeConflict1UIP(conflictCi: number, ctx: ConflictContext): AnalysisResult;
//# sourceMappingURL=clause-learning.d.ts.map