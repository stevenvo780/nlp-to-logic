/**
 * Término de Martin-Löf Type Theory (MLTT): tipos y términos comparten el mismo universo.
 * Cubre variables, universos jerárquicos, Π, Σ, λ, app, pares, identidad, Nat y constructores numéricos.
 */
export type MLTTTerm = {
    kind: 'var';
    name: string;
} | {
    kind: 'universe';
    level: number;
} | {
    kind: 'pi';
    bind: string;
    domain: MLTTTerm;
    codomain: MLTTTerm;
} | {
    kind: 'lam';
    bind: string;
    domain: MLTTTerm;
    body: MLTTTerm;
} | {
    kind: 'app';
    fn: MLTTTerm;
    arg: MLTTTerm;
} | {
    kind: 'sigma';
    bind: string;
    first: MLTTTerm;
    second: MLTTTerm;
} | {
    kind: 'pair';
    fst: MLTTTerm;
    snd: MLTTTerm;
} | {
    kind: 'fst';
    pair: MLTTTerm;
} | {
    kind: 'snd';
    pair: MLTTTerm;
} | {
    kind: 'identity';
    type: MLTTTerm;
    left: MLTTTerm;
    right: MLTTTerm;
} | {
    kind: 'refl';
    term: MLTTTerm;
} | {
    kind: 'nat';
} | {
    kind: 'zero';
} | {
    kind: 'succ';
    arg: MLTTTerm;
};
/** Variable. */
export declare const mVar: (name: string) => MLTTTerm;
/** Universo `Type level`. */
export declare const mUniverse: (level?: number) => MLTTTerm;
/** Tipo Π dependiente `Π bind:domain. codomain`. */
export declare const mPi: (bind: string, domain: MLTTTerm, codomain: MLTTTerm) => MLTTTerm;
/** Abstracción dependiente `λ bind:domain. body`. */
export declare const mLam: (bind: string, domain: MLTTTerm, body: MLTTTerm) => MLTTTerm;
/** Aplicación `fn arg`. */
export declare const mApp: (fn: MLTTTerm, arg: MLTTTerm) => MLTTTerm;
/** Tipo Σ dependiente `Σ bind:first. second`. */
export declare const mSigma: (bind: string, first: MLTTTerm, second: MLTTTerm) => MLTTTerm;
/** Par dependiente `⟨fst, snd⟩`. */
export declare const mPair: (fst: MLTTTerm, snd: MLTTTerm) => MLTTTerm;
/** Proyección izquierda `fst pair`. */
export declare const mFst: (pair: MLTTTerm) => MLTTTerm;
/** Proyección derecha `snd pair`. */
export declare const mSnd: (pair: MLTTTerm) => MLTTTerm;
/** Tipo identidad `Id(type, left, right)`. */
export declare const mId: (type: MLTTTerm, left: MLTTTerm, right: MLTTTerm) => MLTTTerm;
/** Prueba de reflexividad `refl(term)`. */
export declare const mRefl: (term: MLTTTerm) => MLTTTerm;
/** Tipo de los números naturales `Nat`. */
export declare const mNat: () => MLTTTerm;
/** Constructor `zero : Nat`. */
export declare const mZero: () => MLTTTerm;
/** Sucesor `succ(arg) : Nat`. */
export declare const mSucc: (arg: MLTTTerm) => MLTTTerm;
/** Flecha no-dependiente `from → to` (azúcar: `Π _ : from. to`). */
export declare const mArrow: (from: MLTTTerm, to: MLTTTerm) => MLTTTerm;
/** ¿`name` aparece libre en `term`? */
export declare function occursFree(name: string, term: MLTTTerm): boolean;
/** Conjunto de variables libres. */
export declare function freeVars(term: MLTTTerm, acc?: Set<string>): Set<string>;
export declare function termToString(t: MLTTTerm): string;
//# sourceMappingURL=types.d.ts.map