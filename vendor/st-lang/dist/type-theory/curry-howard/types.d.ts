/** Tipo proposicional / tipo simple en la correspondencia Curry-Howard: átomo, flecha →, producto ∧, suma ∨ y ⊥. */
export type PropType = {
    kind: 'atom';
    name: string;
} | {
    kind: 'arrow';
    from: PropType;
    to: PropType;
} | {
    kind: 'product';
    left: PropType;
    right: PropType;
} | {
    kind: 'sum';
    left: PropType;
    right: PropType;
} | {
    kind: 'bottom';
};
/** Término del λ-cálculo con tipos simples (Curry-Howard): variable, aplicación, abstracción, pares, sumas y absurdo. */
export type LambdaTerm = {
    kind: 'var';
    name: string;
} | {
    kind: 'app';
    fn: LambdaTerm;
    arg: LambdaTerm;
} | {
    kind: 'abs';
    param: string;
    paramType: PropType;
    body: LambdaTerm;
} | {
    kind: 'pair';
    fst: LambdaTerm;
    snd: LambdaTerm;
} | {
    kind: 'fst';
    pair: LambdaTerm;
} | {
    kind: 'snd';
    pair: LambdaTerm;
} | {
    kind: 'inl';
    left: LambdaTerm;
    rightType: PropType;
} | {
    kind: 'inr';
    right: LambdaTerm;
    leftType: PropType;
} | {
    kind: 'case';
    scrutinee: LambdaTerm;
    leftBind: string;
    leftBody: LambdaTerm;
    rightBind: string;
    rightBody: LambdaTerm;
} | {
    kind: 'absurd';
    proofOfFalse: LambdaTerm;
    resultType: PropType;
};
/**
 * Reglas de deducción natural del sistema proposicional (Curry-Howard).
 * `'axiom'` = hipótesis del contexto; `'→I'`/`'→E'` = implicación; `'∧I'`/`'∧E-*'` = conjunción;
 * `'∨I-*'`/`'∨E'` = disyunción; `'⊥E'` = ex falso quodlibet.
 */
export type ProofRule = 'axiom' | '→I' | '→E' | '∧I' | '∧E-L' | '∧E-R' | '∨I-L' | '∨I-R' | '∨E' | '⊥E';
/** Árbol de prueba en deducción natural: cada nodo lleva la regla, la conclusión y sub-árboles (premisas). */
export interface ProofTree {
    rule: ProofRule;
    conclusion: PropType;
    premises: ProofTree[];
    discharged?: {
        name: string;
        type: PropType;
    }[];
    assumption?: string;
}
/** Contexto de tipado: mapa de nombres de variables a tipos proposicionales. */
export type Context = Record<string, PropType>;
/** Tipo atómico (variable proposicional). */
export declare const atom: (name: string) => PropType;
/** Tipo flecha `from → to` (implicación). */
export declare const arrow: (from: PropType, to: PropType) => PropType;
/** Tipo producto `left ∧ right` (conjunción). */
export declare const product: (left: PropType, right: PropType) => PropType;
/** Tipo suma `left ∨ right` (disyunción). */
export declare const sum: (left: PropType, right: PropType) => PropType;
/** Tipo bottom `⊥` (falsedad / tipo vacío). */
export declare const bottom: () => PropType;
/** Variable λ. */
export declare const vr: (name: string) => LambdaTerm;
/** Aplicación de función (modus ponens). */
export declare const app: (fn: LambdaTerm, arg: LambdaTerm) => LambdaTerm;
/** Abstracción λ (implicación-intro): `λparam:paramType. body`. */
export declare const abs: (param: string, paramType: PropType, body: LambdaTerm) => LambdaTerm;
/** Par `⟨f, s⟩` (conjunción-intro). */
export declare const pair: (f: LambdaTerm, s: LambdaTerm) => LambdaTerm;
/** Proyección izquierda `fst(p)` (∧E-L). */
export declare const fst: (p: LambdaTerm) => LambdaTerm;
/** Proyección derecha `snd(p)` (∧E-R). */
export declare const snd: (p: LambdaTerm) => LambdaTerm;
/** Inyección izquierda `inl(left)` (∨I-L); requiere el tipo del lado derecho. */
export declare const inl: (left: LambdaTerm, rightType: PropType) => LambdaTerm;
/** Inyección derecha `inr(right)` (∨I-R); requiere el tipo del lado izquierdo. */
export declare const inr: (right: LambdaTerm, leftType: PropType) => LambdaTerm;
/** Eliminación de disyunción `case scrutinee of inl(lb)→leftBody | inr(rb)→rightBody` (∨E). */
export declare const cse: (scrutinee: LambdaTerm, leftBind: string, leftBody: LambdaTerm, rightBind: string, rightBody: LambdaTerm) => LambdaTerm;
/** Ex falso: dado `proofOfFalse : ⊥`, produce cualquier tipo `resultType` (⊥E). */
export declare const absurd: (proofOfFalse: LambdaTerm, resultType: PropType) => LambdaTerm;
/** Igualdad estructural entre dos tipos proposicionales. */
export declare function eqType(a: PropType, b: PropType): boolean;
/** Serializa un tipo proposicional a texto con notación estándar (→, ∧, ∨, ⊥). */
export declare function typeToString(t: PropType): string;
/** Serializa un término λ a texto con notación estándar (λ, fst, snd, inl, inr, case, absurd). */
export declare function termToString(t: LambdaTerm): string;
//# sourceMappingURL=types.d.ts.map