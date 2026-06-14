/** Sort del cubo λ: `'*'` (tipo/proposición) o `'◻'` (kind/tipo de tipos). */
export type Sort = '*' | '◻';
/** Uno de los 8 sistemas del cubo λ de Barendregt, identificado por su nombre canónico. */
export type CubeSystem = 'lambda' | 'lambda2' | 'lambda-omega-bar' | 'lambda-omega' | 'lambda-P' | 'lambda-P2' | 'lambda-P-omega' | 'lambda-C';
/** Término de un Pure Type System del cubo λ: variable, sort, Π-tipo, λ-abstracción o aplicación. */
export type CubeTerm = {
    kind: 'var';
    name: string;
} | {
    kind: 'sort';
    sort: Sort;
} | {
    kind: 'pi';
    bind: string;
    domain: CubeTerm;
    codomain: CubeTerm;
} | {
    kind: 'lam';
    bind: string;
    domain: CubeTerm;
    body: CubeTerm;
} | {
    kind: 'app';
    fn: CubeTerm;
    arg: CubeTerm;
};
/** Variable de término o tipo. */
export declare const cVar: (name: string) => CubeTerm;
/** Sort arbitrario `'*'` o `'◻'`. */
export declare const cSort: (sort: Sort) => CubeTerm;
/** Sort `*` (tipo/proposición). */
export declare const cStar: CubeTerm;
/** Sort `◻` (kind / tipo de tipos). */
export declare const cBox: CubeTerm;
/** Π-tipo dependiente `Π bind:domain. codomain`. */
export declare const cPi: (bind: string, domain: CubeTerm, codomain: CubeTerm) => CubeTerm;
/** Abstracción dependiente `λ bind:domain. body`. */
export declare const cLam: (bind: string, domain: CubeTerm, body: CubeTerm) => CubeTerm;
/** Aplicación `fn arg`. */
export declare const cApp: (fn: CubeTerm, arg: CubeTerm) => CubeTerm;
/** Flecha no-dependiente: Π (_ : A). B, cuando B no menciona el binder. */
export declare const cArrow: (from: CubeTerm, to: CubeTerm) => CubeTerm;
/** Devuelve `true` si `name` ocurre libre en `term`. */
export declare function occursFree(name: string, term: CubeTerm): boolean;
/** Acumula en `acc` (o devuelve un nuevo Set) el conjunto de variables libres del término. */
export declare function freeVars(term: CubeTerm, acc?: Set<string>): Set<string>;
/** Serializa un término del cubo λ a texto legible (Π, λ, →, sorts). */
export declare function termToString(t: CubeTerm): string;
/** α-equivalencia entre dos términos del cubo λ (renombra binders a índices canónicos). */
export declare function alphaEq(a: CubeTerm, b: CubeTerm): boolean;
/** Contexto de tipado del cubo λ: mapa de variables a sus tipos. */
export type CubeContext = Map<string, CubeTerm>;
/** Crea un contexto vacío para el cubo λ. */
export declare function emptyContext(): CubeContext;
/** Extiende el contexto con `name : type`. Devuelve un nuevo mapa (no muta el original). */
export declare function extendContext(ctx: CubeContext, name: string, type: CubeTerm): CubeContext;
//# sourceMappingURL=types.d.ts.map