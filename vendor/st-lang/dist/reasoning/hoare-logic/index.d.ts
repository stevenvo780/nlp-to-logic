/** Operadores binarios del lenguaje IMP: aritméticos, relacionales y lógicos. */
export type ImpBinop = '+' | '-' | '*' | '/' | '%' | '<' | '<=' | '>' | '>=' | '==' | '!=' | '&&' | '||';
/** Expresión del lenguaje IMP: constante, booleano, variable o aplicación de operador. */
export type ImpExpr = {
    kind: 'const';
    value: number;
} | {
    kind: 'bool';
    value: boolean;
} | {
    kind: 'var';
    name: string;
} | {
    kind: 'binop';
    op: ImpBinop;
    left: ImpExpr;
    right: ImpExpr;
} | {
    kind: 'not';
    arg: ImpExpr;
};
/** Sentencia del lenguaje IMP: skip, asignación, secuencia, condicional y bucle while con invariante opcional. */
export type ImpStmt = {
    kind: 'skip';
} | {
    kind: 'assign';
    var: string;
    expr: ImpExpr;
} | {
    kind: 'seq';
    first: ImpStmt;
    second: ImpStmt;
} | {
    kind: 'if';
    cond: ImpExpr;
    then: ImpStmt;
    else: ImpStmt;
} | {
    kind: 'while';
    cond: ImpExpr;
    invariant?: ImpExpr;
    body: ImpStmt;
};
/** Tripleta de Hoare {P} stmt {Q}: precondición, comando y postcondición. */
export interface HoareTriple {
    pre: ImpExpr;
    stmt: ImpStmt;
    post: ImpExpr;
}
/** Constructor de literal numérico IMP. */
export declare const num: (n: number) => ImpExpr;
/** Constructor de literal booleano IMP. */
export declare const bool: (b: boolean) => ImpExpr;
/** Constructor de referencia a variable IMP por nombre. */
export declare const v: (name: string) => ImpExpr;
/** Constructor de operación binaria IMP. */
export declare const binop: (op: ImpBinop, left: ImpExpr, right: ImpExpr) => ImpExpr;
/** Constructor de negación de expresión IMP. */
export declare const not: (arg: ImpExpr) => ImpExpr;
/** Constructor de conjunción lógica IMP: `left && right`. */
export declare const and: (left: ImpExpr, right: ImpExpr) => ImpExpr;
/** Constructor de disyunción lógica IMP: `left || right`. */
export declare const or: (left: ImpExpr, right: ImpExpr) => ImpExpr;
/** Constructor de igualdad IMP: `left == right`. */
export declare const eq: (left: ImpExpr, right: ImpExpr) => ImpExpr;
/** Constructor de menor estricto IMP: `left < right`. */
export declare const lt: (left: ImpExpr, right: ImpExpr) => ImpExpr;
/** Constructor de menor o igual IMP: `left <= right`. */
export declare const le: (left: ImpExpr, right: ImpExpr) => ImpExpr;
/** Instrucción `skip` (no-op). */
export declare const skip: () => ImpStmt;
/** Instrucción de asignación: `varName := expr`. */
export declare const assign: (varName: string, expr: ImpExpr) => ImpStmt;
/** Secuencia de instrucciones (asociativa a la derecha). Con 0 args devuelve `skip`. */
export declare function seq(...stmts: ImpStmt[]): ImpStmt;
/** Instrucción condicional `if cond then then_ else else_`. */
export declare const ifS: (cond: ImpExpr, then_: ImpStmt, else_: ImpStmt) => ImpStmt;
/** Instrucción `while cond body` con invariante opcional para verificación. */
export declare const whileS: (cond: ImpExpr, body: ImpStmt, invariant?: ImpExpr) => ImpStmt;
/** Sustitución sintáctica `expr[replacement/varName]` en expresiones IMP. */
export declare function substitute(expr: ImpExpr, varName: string, replacement: ImpExpr): ImpExpr;
/** Variables libres en la expresión IMP `expr`. Acumula en `acc` (o devuelve un nuevo Set). */
export declare function freeVars(expr: ImpExpr, acc?: Set<string>): Set<string>;
/** Variables mencionadas en la instrucción IMP `stmt` (asignadas y/o leídas). */
export declare function stmtVars(stmt: ImpStmt, acc?: Set<string>): Set<string>;
/** Estado concreto de IMP: mapa de variables a valores enteros (variables no definidas = 0). */
export type State = Record<string, number>;
/** Evalúa la expresión IMP `expr` en el estado `state`. Devuelve un número o booleano. */
export declare function evalExpr(expr: ImpExpr, state: State): number | boolean;
/** Error de ejecución en IMP (e.g. timeout por bucle infinito). */
export type ExecError = {
    error: string;
};
/** Ejecuta `stmt` sobre `state` con un límite de `maxSteps` pasos. Devuelve el estado final o un error. */
export declare function execStmt(stmt: ImpStmt, state: State, maxSteps?: number): State | ExecError;
/** Precondición más débil `wp(stmt, post)`. Para while requiere invariant anotado; sin él devuelve `false`. */
export declare function wp(stmt: ImpStmt, post: ImpExpr): ImpExpr;
/** Postcondición más fuerte aproximada `sp(stmt, pre)`. Para x := E cuando E no menciona x; sino devuelve `true`. */
export declare function spExtension(stmt: ImpStmt, pre: ImpExpr): ImpExpr;
/** Genera las condiciones de verificación (VCs) para la tripla de Hoare: pre, wp global y VCs de loops. */
export declare function generateVCs(triple: HoareTriple): ImpExpr[];
/** Resultado de `verifyTriple`: validez, lista de VCs y fallos con contraejemplo. */
export interface VerificationResult {
    valid: boolean;
    vcs: ImpExpr[];
    failures: Array<{
        vc: ImpExpr;
        state?: State;
    }>;
}
/** Opciones para `verifyTriple`: tamaño de muestreo, rango de enteros, semilla y estados extra. */
export interface VerifyOptions {
    samples?: number;
    /** Rango de muestreo entero para variables (inclusive en ambos extremos). */
    range?: [number, number];
    /** Semilla determinista; si no, se usa Math.random. */
    seed?: number;
    /** Estados explícitos extra que el caller quiere verificar siempre. */
    seedStates?: State[];
}
/** Verifica la tripla `{pre} stmt {post}` por muestreo aleatorio de estados. */
export declare function verifyTriple(triple: HoareTriple, opts?: VerifyOptions): VerificationResult;
/**
 * Swap x ↔ y vía variable temporal `t`.
 *   t := x; x := y; y := t
 * Tripleta canónica: {x = a ∧ y = b} swap {x = b ∧ y = a}
 */
export declare function programSwap(): ImpStmt;
/**
 * Factorial:  r := 1; k := 0; while k < n do { k := k+1; r := r * k }
 * Tripleta:   {n = N ∧ N ≥ 0} fact {r = N!}
 * Invariant:  k ≤ n ∧ r = k!  (codificable como r = k!, k entre 0 y n)
 *
 * Como la lógica de Hoare aquí no tiene factorial nativo, exponemos el
 * código y el invariant en forma `r > 0 ∧ k ≤ n` (suficiente para
 * los tests de mantenimiento sintácticos con muestreo: el ejecutor
 * confirma corrección concreta para n pequeños).
 */
export declare function programFactorial(): ImpStmt;
/**
 * GCD por algoritmo de Euclides con restas:
 *   while x != y do { if x > y then x := x - y else y := y - x }
 * Invariant: gcd(x, y) = gcd(a, b). Como no tenemos gcd nativo,
 * usamos como invariant `x ≥ 1 ∧ y ≥ 1` (mantenido por restas
 * positivas cuando x ≠ y y ambos positivos al entrar).
 */
export declare function programGCD(): ImpStmt;
/**
 * Búsqueda lineal:
 *   i := 0; found := 0;
 *   while i < n && found == 0 do {
 *     if a == target then found := 1 else skip;
 *     i := i + 1
 *   }
 * Modelo simplificado: `a` representa el elemento actual (no un array;
 * el AST de IMP no tiene arrays). Sirve como esqueleto pedagógico
 * para discutir el invariant `i ≤ n` y la post `found == 1 ∨ i == n`.
 */
export declare function programLinearSearch(): ImpStmt;
/** Calcula el factorial de `n` en enteros (JavaScript). Solo para tests. */
export declare function factorial(n: number): number;
/** Máximo común divisor de `a` y `b` (Euclides). Solo para tests. */
export declare function gcd(a: number, b: number): number;
//# sourceMappingURL=index.d.ts.map