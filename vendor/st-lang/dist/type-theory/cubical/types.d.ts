/**
 * Término de la Teoría de Tipos Cubical (CTT-Lite).
 * Cubre el intervalo I con extremos i0/i1, operaciones ∧/∨/~, caminos PathP,
 * abstracción/aplicación de path, glue (univalencia computacional) y MLTT base (Π, λ, app, universo).
 */
export type CubicalTerm = {
    kind: 'i0';
} | {
    kind: 'i1';
} | {
    kind: 'iVar';
    name: string;
} | {
    kind: 'iMin';
    left: CubicalTerm;
    right: CubicalTerm;
} | {
    kind: 'iMax';
    left: CubicalTerm;
    right: CubicalTerm;
} | {
    kind: 'iNeg';
    arg: CubicalTerm;
} | {
    kind: 'pathP';
    family: CubicalTerm;
    left: CubicalTerm;
    right: CubicalTerm;
} | {
    kind: 'pLam';
    bind: string;
    body: CubicalTerm;
} | {
    kind: 'pApp';
    path: CubicalTerm;
    arg: CubicalTerm;
} | {
    kind: 'glue';
    equiv: CubicalTerm;
    partial: CubicalTerm;
} | {
    kind: 'var';
    name: string;
} | {
    kind: 'universe';
    level: number;
} | {
    kind: 'pi';
    bind: string;
    domain: CubicalTerm;
    codomain: CubicalTerm;
} | {
    kind: 'lam';
    bind: string;
    domain: CubicalTerm;
    body: CubicalTerm;
} | {
    kind: 'app';
    fn: CubicalTerm;
    arg: CubicalTerm;
};
/** Extremo inferior del intervalo `i0 : I`. */
export declare const cI0: () => CubicalTerm;
/** Extremo superior del intervalo `i1 : I`. */
export declare const cI1: () => CubicalTerm;
/** Variable de intervalo `name : I`. */
export declare const cIVar: (name: string) => CubicalTerm;
/** Mínimo de intervalo `left ∧ right` (conexión). */
export declare const cIMin: (left: CubicalTerm, right: CubicalTerm) => CubicalTerm;
/** Máximo de intervalo `left ∨ right` (conexión). */
export declare const cIMax: (left: CubicalTerm, right: CubicalTerm) => CubicalTerm;
/** Negación de intervalo `~arg` (involución: `~i0 = i1`). */
export declare const cINeg: (arg: CubicalTerm) => CubicalTerm;
/** `PathP family left right` — tipo de caminos dependientes sobre la familia `family`. */
export declare const cPathP: (family: CubicalTerm, left: CubicalTerm, right: CubicalTerm) => CubicalTerm;
/** Abstracción de camino `λi. body` donde `bind` es la variable de intervalo. */
export declare const cPLam: (bind: string, body: CubicalTerm) => CubicalTerm;
/** Aplicación de camino `path @ arg` (evaluación en un punto del intervalo). */
export declare const cPApp: (path: CubicalTerm, arg: CubicalTerm) => CubicalTerm;
/** Glue: construcción precursora de univalencia computacional con equivalencia `equiv` y parcial `partial`. */
export declare const cGlue: (equiv: CubicalTerm, partial: CubicalTerm) => CubicalTerm;
/** Variable del cálculo de tipos. */
export declare const cVar: (name: string) => CubicalTerm;
/** Universo de tipos de nivel `level` (default 0). */
export declare const cUniverse: (level?: number) => CubicalTerm;
/** Tipo Π dependiente `Π (bind : domain). codomain`. */
export declare const cPi: (bind: string, domain: CubicalTerm, codomain: CubicalTerm) => CubicalTerm;
/** Abstracción dependiente `λ (bind : domain). body`. */
export declare const cLam: (bind: string, domain: CubicalTerm, body: CubicalTerm) => CubicalTerm;
/** Aplicación de término `fn arg`. */
export declare const cApp: (fn: CubicalTerm, arg: CubicalTerm) => CubicalTerm;
/** Flecha no dependiente `from → to` (azúcar para `cPi('_', from, to)`). */
export declare const cArrow: (from: CubicalTerm, to: CubicalTerm) => CubicalTerm;
/** Devuelve `true` si el término `t` es una expresión pura del intervalo I (i0, i1, iVar, iMin, iMax, iNeg). */
export declare function isIntervalExpr(t: CubicalTerm): boolean;
/** Devuelve `true` si `name` ocurre libre en `term`. */
export declare function occursFreeCubical(name: string, term: CubicalTerm): boolean;
/** Acumula en `acc` (o devuelve un nuevo Set) el conjunto de variables libres del término. */
export declare function freeVarsCubical(term: CubicalTerm, acc?: Set<string>): Set<string>;
/** Serializa un término CTT-Lite a su representación textual estándar. */
export declare function termToStringCubical(t: CubicalTerm): string;
//# sourceMappingURL=types.d.ts.map