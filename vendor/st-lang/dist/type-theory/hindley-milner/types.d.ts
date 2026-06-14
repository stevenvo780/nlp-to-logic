/** Monotipo del sistema Hindley-Milner: variable, constante, función o constructor aplicado. */
export type Type = {
    kind: 'tvar';
    name: string;
} | {
    kind: 'tconst';
    name: string;
} | {
    kind: 'arrow';
    from: Type;
    to: Type;
} | {
    kind: 'tapp';
    fn: string;
    args: Type[];
};
/** Esquema de tipo polimórfico: cuantificación universal sobre variables de tipo (rank-1). */
export interface TypeScheme {
    forall: string[];
    body: Type;
}
/** Expresión del cálculo λ let-polimórfico: variable, literal, aplicación, lambda, let, letRec e if. */
export type Expr = {
    kind: 'var';
    name: string;
} | {
    kind: 'lit';
    value: number | boolean | string;
} | {
    kind: 'app';
    fn: Expr;
    arg: Expr;
} | {
    kind: 'lam';
    param: string;
    body: Expr;
} | {
    kind: 'let';
    bind: string;
    value: Expr;
    body: Expr;
} | {
    kind: 'letRec';
    defs: Array<{
        name: string;
        body: Expr;
    }>;
    body: Expr;
} | {
    kind: 'if';
    cond: Expr;
    then: Expr;
    else: Expr;
};
/** Constructor de variable de tipo (e.g. `α`). */
export declare const tVar: (name: string) => Type;
/** Constructor de constante de tipo (e.g. `Int`, `Bool`). */
export declare const tConst: (name: string) => Type;
/** Constructor de tipo flecha: `from → to`. */
export declare const tArrow: (from: Type, to: Type) => Type;
/** Constructor de aplicación de constructor de tipo: `fn args...` (e.g. `List Int`). */
export declare const tApp: (fn: string, ...args: Type[]) => Type;
/** Crea un esquema polimórfico cuantificando las variables de `forall` sobre `body`. */
export declare const scheme: (forall: string[], body: Type) => TypeScheme;
/** Envuelve un monotipo como esquema sin variables cuantificadas. */
export declare const mono: (body: Type) => TypeScheme;
/** Constructor de variable de expresión. */
export declare const eVar: (name: string) => Expr;
/** Constructor de literal (número, booleano o string). */
export declare const eLit: (value: number | boolean | string) => Expr;
/** Constructor de aplicación de función: `fn arg`. */
export declare const eApp: (fn: Expr, arg: Expr) => Expr;
/** Constructor de lambda: `λparam. body`. */
export declare const eLam: (param: string, body: Expr) => Expr;
/** Constructor de `let bind = value in body` (introduce polimorfismo). */
export declare const eLet: (bind: string, value: Expr, body: Expr) => Expr;
/** Constructor de `let rec { defs } in body`: definiciones mutuamente recursivas. */
export declare const eLetRec: (defs: Array<{
    name: string;
    body: Expr;
}>, body: Expr) => Expr;
/** Constructor de `if cond then then_ else else_`. */
export declare const eIf: (cond: Expr, then_: Expr, else_: Expr) => Expr;
/** Aplica `fn` a múltiples argumentos de izquierda a derecha: `fn a b c` ≡ `eApp(eApp(fn,a),b,c)`. */
export declare const eAppN: (fn: Expr, ...args: Expr[]) => Expr;
/** Tipo primitivo `Int`. */
export declare const TInt: Type;
/** Tipo primitivo `Bool`. */
export declare const TBool: Type;
/** Tipo primitivo `String`. */
export declare const TStr: Type;
/** Recolecta las variables de tipo libres (no vinculadas) en `t`. */
export declare function typeFreeVars(t: Type, acc?: Set<string>): Set<string>;
/** Recolecta las variables de tipo libres en el cuerpo del esquema excluyendo las cuantificadas. */
export declare function schemeFreeVars(s: TypeScheme): Set<string>;
/** Serializa un tipo a una cadena legible con precedencias correctas para flechas y constructores. */
export declare function typeToString(t: Type): string;
/** Serializa un esquema de tipo a su representación `forall α. T` o simplemente `T` si es mono. */
export declare function schemeToString(s: TypeScheme): string;
/** Entorno de tipos inmutable. Mapea nombres de variables a sus esquemas polimórficos. */
export declare class TypeEnv {
    readonly bindings: Map<string, TypeScheme>;
    constructor(bindings?: Map<string, TypeScheme>);
    extend(name: string, sc: TypeScheme): TypeEnv;
    extendMany(entries: Array<[string, TypeScheme]>): TypeEnv;
    lookup(name: string): TypeScheme | undefined;
    freeVars(): Set<string>;
}
//# sourceMappingURL=types.d.ts.map