/** Tipo base de un tipo refinado: primitivo o flecha entre tipos refinados. */
export type BaseType = 'Int' | 'Bool' | 'String' | {
    kind: 'arrow';
    from: RefType;
    to: RefType;
};
/** Tipo refinado `{ binding : base | predicate }`. */
export interface RefType {
    base: BaseType;
    /** Nombre de la variable de binding usada por el predicado (e.g. "x"). */
    binding: string;
    /** Predicado P(binding); cadena vacía o "true" significa "sin refinamiento". */
    predicate: string;
}
/** Término del lenguaje de refinamiento (AST). */
export type RTerm = {
    kind: 'lit';
    value: number | boolean | string;
} | {
    kind: 'var';
    name: string;
} | {
    kind: 'binop';
    op: '+' | '-' | '*' | '<' | '<=' | '>' | '>=' | '==' | '!=' | '&&' | '||';
    left: RTerm;
    right: RTerm;
} | {
    kind: 'if';
    cond: RTerm;
    then: RTerm;
    else: RTerm;
} | {
    kind: 'lam';
    param: string;
    paramType: RefType;
    body: RTerm;
} | {
    kind: 'app';
    fn: RTerm;
    arg: RTerm;
} | {
    kind: 'let';
    bind: string;
    bindType?: RefType;
    value: RTerm;
    body: RTerm;
};
/** Construye el tipo refinado `{ binding : Int | predicate }`. */
export declare const tInt: (binding?: string, predicate?: string) => RefType;
/** Construye el tipo refinado `{ binding : Bool | predicate }`. */
export declare const tBool: (binding?: string, predicate?: string) => RefType;
/** Construye el tipo refinado `{ binding : String | predicate }`. */
export declare const tString: (binding?: string, predicate?: string) => RefType;
/**
 * Construye un tipo refinado flecha `{ binding : (from -> to) | predicate }`.
 * @param from - Tipo del parámetro.
 * @param to - Tipo del resultado.
 */
export declare const tArrow: (from: RefType, to: RefType, binding?: string, predicate?: string) => RefType;
/**
 * Construye un tipo refinado a partir de sus partes.
 * @param base - Tipo base (primitivo o flecha).
 * @param binding - Nombre de la variable de binding.
 * @param predicate - Predicado textual sobre la variable.
 */
export declare const refine: (base: BaseType, binding: string, predicate: string) => RefType;
/** Crea un literal (número, booleano o cadena). */
export declare const rLit: (value: number | boolean | string) => RTerm;
/** Crea una referencia a variable por nombre. */
export declare const rVar: (name: string) => RTerm;
/**
 * Crea una expresión binaria con operador `op`.
 * @param op - Operador aritmético, de comparación o lógico.
 */
export declare const rBinop: (op: Extract<RTerm, {
    kind: "binop";
}>["op"], left: RTerm, right: RTerm) => RTerm;
/** Crea una expresión condicional `if cond then t else e`. */
export declare const rIf: (cond: RTerm, t: RTerm, e: RTerm) => RTerm;
/** Crea una abstracción lambda con tipo refinado para el parámetro. */
export declare const rLam: (param: string, paramType: RefType, body: RTerm) => RTerm;
/** Crea una aplicación de función a argumento. */
export declare const rApp: (fn: RTerm, arg: RTerm) => RTerm;
/** Crea un `let bind = value in body` con anotación de tipo opcional. */
export declare const rLet: (bind: string, value: RTerm, body: RTerm, bindType?: RefType) => RTerm;
/**
 * Comprueba igualdad estructural de dos `BaseType`.
 * Para flechas, delega en `eqRefType` para los subtipos.
 */
export declare function eqBase(a: BaseType, b: BaseType): boolean;
/**
 * Comprueba igualdad estructural de dos `RefType` (ignora predicados;
 * la equivalencia semántica la maneja el subtipado).
 */
export declare function eqRefType(a: RefType, b: RefType): boolean;
/** Serializa un `BaseType` en notación legible (e.g. `Int`, `(T) -> (U)`). */
export declare function baseToString(b: BaseType): string;
/** Serializa un `RefType` como `{ v : B | P }` (sin predicado si es trivial). */
export declare function refTypeToString(t: RefType): string;
/** Serializa un `RTerm` en notación legible para debugging y mensajes de error. */
export declare function termToString(t: RTerm): string;
//# sourceMappingURL=types.d.ts.map