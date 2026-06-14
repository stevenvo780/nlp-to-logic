/**
 * Calcula el LBD de una cláusula dado el nivel de decisión actual de cada
 * variable. Usa un buffer compartido `seenLevels` (reseteado internamente
 * cada llamada) para evitar allocaciones repetidas.
 *
 * Si una variable no está asignada (level = -1), no se cuenta.
 */
export declare function computeLBD(clause: Int32Array, varLevel: Int32Array, seenBuffer: Uint8Array): number;
/**
 * Metadatos de una cláusula aprendida usados para decidir si conservarla.
 */
export interface LearnedMeta {
    /** Índice en el array de cláusulas. */
    index: number;
    /** LBD calculado al momento del aprendizaje (y opcionalmente actualizado). */
    lbd: number;
    /** Activity de la cláusula (analogía VSIDS para cláusulas). */
    activity: number;
    /** True si actualmente "bloquea" la asignación de alguna variable (no descartable). */
    locked: boolean;
    /** Longitud de la cláusula (útil como tiebreaker). */
    length: number;
}
/**
 * Selecciona cláusulas a eliminar de un conjunto de aprendidas.
 *
 * Política: preservar siempre las "glue clauses" (LBD <= 2). Del resto,
 * ordenar por (lbd desc, activity asc, length desc) y eliminar la mitad
 * con menor utilidad. Cláusulas locked nunca se eliminan.
 *
 * Retorna los `index` (relativos a `metas`) a eliminar.
 */
export declare function selectClausesToRemove(metas: ReadonlyArray<LearnedMeta>, lbdProtectThreshold?: number): number[];
//# sourceMappingURL=lbd.d.ts.map