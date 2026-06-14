/** Tipo del STLC para NbE: tipo base `base` o flecha `from → to`. */
export type Type = {
    kind: 'base';
    name: string;
} | {
    kind: 'arrow';
    from: Type;
    to: Type;
};
/** Término sintáctico del STLC: variable, abstracción λ o aplicación. */
export type Term = {
    kind: 'var';
    name: string;
} | {
    kind: 'abs';
    param: string;
    paramType: Type;
    body: Term;
} | {
    kind: 'app';
    fn: Term;
    arg: Term;
};
/**
 * Valor semántico del NbE para STLC.
 * `'neutral'` = variable libre o aplicación bloqueada; `'closure'` = λ capturada con entorno léxico.
 */
export type Value = {
    kind: 'neutral';
    head: Neutral;
} | {
    kind: 'closure';
    env: Env;
    param: string;
    paramType: Type;
    body: Term;
};
/** Término neutral: variable libre o aplicación cuya cabeza es neutral. */
export type Neutral = {
    kind: 'var';
    name: string;
} | {
    kind: 'app';
    head: Neutral;
    arg: Value;
};
/** Entorno léxico para NbE: mapa de variables a valores semánticos. */
export type Env = Map<string, Value>;
/** Tipo base (primitivo) con nombre. */
export declare const tBase: (name: string) => Type;
/** Tipo flecha `from → to`. */
export declare const tArr: (from: Type, to: Type) => Type;
/** Variable sintáctica. */
export declare const v: (name: string) => Term;
/** Abstracción λ sintáctica. */
export declare const lam: (param: string, paramType: Type, body: Term) => Term;
/** Aplicación binaria `fn arg`. */
export declare const ap: (fn: Term, arg: Term) => Term;
/** Aplicación n-aria: `apN(f, a, b, c)` = `((f a) b) c`. */
export declare const apN: (head: Term, ...args: Term[]) => Term;
/** Valor neutral de una variable libre `name`. */
export declare const vNeutralVar: (name: string) => Value;
/** Valor neutral a partir de una cabeza neutral. */
export declare const vNeutral: (head: Neutral) => Value;
/** Valor closure (λ semántica) con entorno léxico. */
export declare const vClosure: (env: Env, param: string, paramType: Type, body: Term) => Value;
/** Igualdad α-equivalente entre términos STLC (renombra binders a posiciones canónicas). */
export declare function alphaEq(a: Term, b: Term): boolean;
/** Igualdad estructural entre dos tipos STLC. */
export declare function typeEq(a: Type, b: Type): boolean;
/** Serializa un tipo STLC a texto (flechas asociativas a la derecha). */
export declare function typeToString(t: Type): string;
/** Serializa un término STLC a texto legible. */
export declare function termToString(t: Term): string;
//# sourceMappingURL=types.d.ts.map