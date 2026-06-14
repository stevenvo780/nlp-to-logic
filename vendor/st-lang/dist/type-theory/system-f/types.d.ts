/** Tipo en System F: variable atómica, función o cuantificación universal ∀X. */
export type FType = {
    kind: 'atom';
    name: string;
} | {
    kind: 'arrow';
    from: FType;
    to: FType;
} | {
    kind: 'forall';
    bind: string;
    body: FType;
};
/** Término en System F: variable, abstracción, aplicación, Λ-abstracción y aplicación de tipo. */
export type FTerm = {
    kind: 'var';
    name: string;
} | {
    kind: 'abs';
    param: string;
    paramType: FType;
    body: FTerm;
} | {
    kind: 'app';
    fn: FTerm;
    arg: FTerm;
} | {
    kind: 'tabs';
    bind: string;
    body: FTerm;
} | {
    kind: 'tapp';
    fn: FTerm;
    typeArg: FType;
};
/** Crea una variable de tipo atómica con nombre `name`. */
export declare const fAtom: (name: string) => FType;
/** Crea el tipo función `from → to`. */
export declare const fArrow: (from: FType, to: FType) => FType;
/** Crea el tipo `∀bind. body`. */
export declare const fForall: (bind: string, body: FType) => FType;
/** Crea una referencia a variable de término. */
export declare const fVar: (name: string) => FTerm;
/** Crea una abstracción `λparam:paramType. body`. */
export declare const fAbs: (param: string, paramType: FType, body: FTerm) => FTerm;
/** Crea una aplicación de término `fn arg`. */
export declare const fApp: (fn: FTerm, arg: FTerm) => FTerm;
/** Crea una abstracción de tipo `Λbind. body`. */
export declare const fTAbs: (bind: string, body: FTerm) => FTerm;
/** Crea una aplicación de tipo `fn [typeArg]`. */
export declare const fTApp: (fn: FTerm, typeArg: FType) => FTerm;
/**
 * Calcula el conjunto de variables de tipo libres en `t`.
 * @param acc - Acumulador (se modifica in-place y se retorna).
 */
export declare function freeTypeVars(t: FType, acc?: Set<string>): Set<string>;
/**
 * Comprueba α-equivalencia entre dos tipos de System F.
 * `∀X. T` y `∀Y. T[X:=Y]` se consideran iguales.
 */
export declare function alphaEqType(a: FType, b: FType): boolean;
/**
 * Indica si `type` está bien formado: todas sus variables libres están
 * declaradas en el contexto de tipos `ctx`.
 */
export declare function isWellFormed(type: FType, ctx?: Set<string>): boolean;
/** Serializa un `FType` en notación matemática (`∀X. …`, `A → B`). */
export declare function fTypeToString(t: FType): string;
/** Serializa un `FTerm` en notación legible para debugging y mensajes de error. */
export declare function fTermToString(t: FTerm): string;
/**
 * Contexto de tipado de System F.
 * Contiene variables de término (con su tipo) y variables de tipo declaradas (Λ las introduce).
 */
export interface FContext {
    term: Map<string, FType>;
    type: Set<string>;
}
/** Crea un contexto de tipado vacío. */
export declare function emptyContext(): FContext;
/** Crea una copia independiente del contexto para extensiones locales. */
export declare function cloneContext(ctx: FContext): FContext;
//# sourceMappingURL=types.d.ts.map