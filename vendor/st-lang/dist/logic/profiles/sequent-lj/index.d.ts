/** AST de fórmulas proposicionales intuicionistas para el cálculo LJ. */
export type LJFormula = {
    kind: 'atom';
    name: string;
} | {
    kind: 'not';
    arg: LJFormula;
} | {
    kind: 'and';
    left: LJFormula;
    right: LJFormula;
} | {
    kind: 'or';
    left: LJFormula;
    right: LJFormula;
} | {
    kind: 'implies';
    left: LJFormula;
    right: LJFormula;
} | {
    kind: 'bottom';
};
/** Nombres de las reglas del cálculo de secuentes LJ de Gentzen. */
export type LJRule = 'axiom' | 'cut' | 'weakL' | 'contrL' | 'exL' | 'notL' | 'notR' | 'andL' | 'andR' | 'orL' | 'orR-l' | 'orR-r' | 'impL' | 'impR' | 'bottomL';
/**
 * Secuente intuicionista. `right === null` modela el succedente
 * vacio (necesario para regla `notR` y `bottomL` sin formula
 * conclusion).
 */
export interface LJSequent {
    left: LJFormula[];
    right: LJFormula | null;
}
/**
 * Árbol de derivación LJ.
 * Cada nodo registra el secuente meta, la regla aplicada y las sub-derivaciones.
 */
export interface LJProof {
    goal: LJSequent;
    rule: LJRule;
    premises: LJProof[];
    /** Formula del cut (presente solo cuando `rule === 'cut'`). */
    cutFormula?: LJFormula;
    /** Formula principal a la que se aplica la regla. */
    principalFormula?: LJFormula;
}
declare function ljKey(f: LJFormula): string;
declare function eqF(a: LJFormula, b: LJFormula): boolean;
declare function depth(f: LJFormula): number;
/**
 * Demuestra el secuente `seq` en LJ intuicionista (sin cortes).
 * Devuelve `null` si no encuentra derivacion dentro del budget.
 */
export declare function proveLJ(seq: LJSequent, options?: {
    budget?: number;
}): LJProof | null;
/** Atajo: ⊢ φ en LJ. */
/** Atajo: intenta derivar ⊢ φ en LJ (secuente con antecedente vacío). */
export declare function proveLJFormula(formula: LJFormula, options?: {
    budget?: number;
}): LJProof | null;
/** Verifica estructuralmente que un árbol de derivación LJ es correcto. */
export declare function isValid(proof: LJProof): boolean;
/** Devuelve `true` si el árbol de derivación contiene alguna aplicación de la regla cut. */
export declare function hasCut(proof: LJProof): boolean;
/**
 * Elimina cortes de una derivación LJ (Hauptsatz de Gentzen).
 * Usa reducciones principales para los casos estructurales y el prover
 * cut-free como oráculo para los casos permutativos restantes.
 */
export declare function eliminateCut(proof: LJProof): LJProof;
/**
 * Toda derivacion LJ es tambien una derivacion LK (con succedente
 * a lo sumo unitario). La conversion es estructural: copia el arbol,
 * usa right = [φ] o [] segun el secuente intuicionista, y mapea
 * orR-l/orR-r → orR.
 */
export declare function ljToLk(proof: LJProof): unknown;
/**
 * Conversion LK → LJ. Falla cuando la derivacion LK usa
 * multisuccedente esencial (ej. LEM, doble negacion clasica).
 * Estrategia: validar que cada secuente del arbol LK tenga
 * succedente |Δ| ≤ 1; si no, rechazar con motivo.
 */
export declare function lkToLj(lkProof: unknown): LJProof | {
    rejected: string;
};
export declare function glivenkoEmbed(formula: LJFormula): LJFormula;
export { ljKey, eqF as ljEq, depth as ljDepth };
//# sourceMappingURL=index.d.ts.map