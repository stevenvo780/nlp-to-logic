/** Valor que puede almacenarse en el heap de separación: entero, dirección o null. */
export type SLValue = {
    kind: 'int';
    value: number;
} | {
    kind: 'addr';
    loc: number;
} | {
    kind: 'null';
};
/** Constructor de valor entero del heap de separación. */
export declare function intVal(value: number): SLValue;
/** Constructor de valor dirección del heap de separación. */
export declare function addrVal(loc: number): SLValue;
/** Singleton null del heap de separación (puntero nulo). */
export declare function nullVal(): SLValue;
/** Igualdad estructural entre dos valores del heap de separación. */
export declare function valueEquals(a: SLValue, b: SLValue): boolean;
/** Convierte un SLValue a una clave string estable para Maps. */
export declare function valueKey(v: SLValue): string;
/** Devuelve la dirección de un SLValue si es addr, o null en cualquier
 * otro caso. La null-location no se direcciona. */
export declare function asLoc(v: SLValue): number | null;
/** Heap finito de separación: mapa inmutable de direcciones (number) a valores SL. */
export interface Heap {
    readonly map: ReadonlyMap<number, SLValue>;
    domain(): number[];
    has(loc: number): boolean;
    read(loc: number): SLValue | undefined;
    write(loc: number, val: SLValue): Heap;
    delete(loc: number): Heap;
    size(): number;
    clone(): Heap;
}
/** Crea un heap vacío. */
export declare function newHeap(): Heap;
/** Crea un heap a partir de una lista de pares `[dirección, valor]`. */
export declare function fromMap(entries: Array<[number, SLValue]>): Heap;
/** Dos heaps son disjuntos sii sus dominios no se intersectan. */
export declare function disjoint(h1: Heap, h2: Heap): boolean;
/** Unión disjunta `h1 ⊎ h2`. Devuelve null si los heaps comparten alguna
 * dirección — la unión disjunta sólo está definida cuando son disjoint. */
export declare function combine(h1: Heap, h2: Heap): Heap | null;
/** Igualdad estructural de heaps. */
export declare function heapEquals(h1: Heap, h2: Heap): boolean;
/** Enumera todas las particiones del heap en `(h1, h2)` con `h1 ⊎ h2 = h`. */
export declare function splits(h: Heap): Array<{
    h1: Heap;
    h2: Heap;
}>;
/** Fórmula de separación lógica (SL). Cubre emp, pointsTo, star (*), magic wand (-*), cuantificadores y lógica proposicional pura. */
export type SLFormula = {
    kind: 'emp';
} | {
    kind: 'pointsTo';
    loc: SLValue;
    val: SLValue;
} | {
    kind: 'star';
    left: SLFormula;
    right: SLFormula;
} | {
    kind: 'magicWand';
    left: SLFormula;
    right: SLFormula;
} | {
    kind: 'pure';
    expression: string;
    predicate: PurePredicate;
} | {
    kind: 'and';
    left: SLFormula;
    right: SLFormula;
} | {
    kind: 'or';
    left: SLFormula;
    right: SLFormula;
} | {
    kind: 'implies';
    left: SLFormula;
    right: SLFormula;
} | {
    kind: 'not';
    body: SLFormula;
} | {
    kind: 'exists';
    bind: string;
    body: SLFormula;
} | {
    kind: 'forall';
    bind: string;
    body: SLFormula;
};
/** Predicado puro de SL: función JavaScript que evalúa una condición sobre la valuación de variables. */
export type PurePredicate = (val: SLValuation) => boolean;
/** Heap vacío: `emp`. La fórmula que vale sobre el heap vacío. */
export declare const emp: () => SLFormula;
/** `loc ↦ val` — `loc` apunta a `val` (heap de un solo celda). */
export declare const pointsTo: (loc: SLValue, val: SLValue) => SLFormula;
/** Conjunción separante `P * Q`: `P` y `Q` valen sobre sub-heaps disjuntos cuya unión es el heap total. */
export declare const star: (left: SLFormula, right: SLFormula) => SLFormula;
/** Magic wand `P -* Q`: para cualquier heap disjunto que satisfaga `P`, la unión satisface `Q`. */
export declare const magicWand: (left: SLFormula, right: SLFormula) => SLFormula;
/** Fórmula pura `[expr]`: condición sin acceso al heap, evaluada por `predicate`. */
export declare const pure: (expression: string, predicate: PurePredicate) => SLFormula;
/** Conjunción clásica de dos fórmulas SL (no separante). */
export declare const andF: (left: SLFormula, right: SLFormula) => SLFormula;
/** Disyunción de dos fórmulas SL. */
export declare const orF: (left: SLFormula, right: SLFormula) => SLFormula;
/** Implicación clásica entre dos fórmulas SL. */
export declare const impliesF: (left: SLFormula, right: SLFormula) => SLFormula;
/** Negación de una fórmula SL. */
export declare const notF: (body: SLFormula) => SLFormula;
/** Cuantificador existencial sobre una variable de valuación. */
export declare const existsF: (bind: string, body: SLFormula) => SLFormula;
/** Cuantificador universal sobre una variable de valuación. */
export declare const forallF: (bind: string, body: SLFormula) => SLFormula;
/** Serializa una fórmula SL a su representación textual estándar. */
export declare function formulaToString(f: SLFormula): string;
/** Serializa un valor SL (int, addr, null) a texto legible. */
export declare function valueToString(v: SLValue): string;
/** Mapa de variables de SL a valores; permite atar variables lógicas durante la evaluación. */
export interface SLValuation {
    [varName: string]: SLValue;
}
/** Devuelve una copia del valuation con `name → v`. */
export declare function bind(val: SLValuation, name: string, v: SLValue): SLValuation;
/** `satisfies(P, h, ν)` — el modelo `(h, ν)` satisface la fórmula P. */
export declare function satisfies(formula: SLFormula, heap: Heap, val: SLValuation): boolean;
/** Comando de SL: operación de heap que puede modificar el heap y/o la valuación de variables. */
export interface SLCommand {
    kind: 'alloc' | 'free' | 'load' | 'store' | 'skip' | 'assign';
    /** Variable destino para `alloc`/`load`/`assign`. */
    variable?: string;
    /** Nombre de la variable que apunta a la celda para `free`/`load`/`store`. */
    location?: string;
    /** Valor a almacenar (para `alloc`, `store`, `assign`). */
    value?: SLValue;
}
/** Tripla de Hoare para SL: `{ pre } cmd { post }`. */
export interface SLTriple {
    pre: SLFormula;
    cmd: SLCommand;
    post: SLFormula;
}
/** Resultado de ejecutar un comando paso-a-paso sobre `(heap, val)`. */
export interface ExecResult {
    ok: boolean;
    heap: Heap;
    val: SLValuation;
    /** Memory fault — el comando accedió a una celda fuera del dominio. */
    fault: boolean;
    reason?: string;
}
/** Ejecuta un único comando de forma small-step. */
export declare function executeCommand(cmd: SLCommand, heap: Heap, val: SLValuation): ExecResult;
/** Opciones para `checkTriple`: heaps candidatos, tamaño de muestreo y semilla RNG. */
export interface CheckTripleOptions {
    /** Heaps candidatos a probar como precondición. Si no se da, se generan. */
    candidates?: Array<{
        heap: Heap;
        val: SLValuation;
    }>;
    /** Cantidad de heaps aleatorios pequeños para muestrear. */
    samples?: number;
    /** Semilla para el RNG (LCG simple) — reproducibilidad. */
    seed?: number;
}
/** Resultado de `checkTriple`: validez (o contraejemplo encontrado) y cantidad de modelos evaluados. */
export interface CheckTripleResult {
    valid: boolean;
    counterexample?: {
        heap: Heap;
        val: SLValuation;
        reason: string;
    };
    modelsChecked: number;
}
/** Verifica una tripla `{P} c {Q}` por muestreo finito: enumera modelos
 * (heap, val) que satisfagan P, los ejecuta y comprueba Q sobre el
 * estado final. Devuelve `valid: false` con contraejemplo al primer
 * fallo. No es completo — es una verificación de testing/random. */
export declare function checkTriple(triple: SLTriple, options?: CheckTripleOptions): CheckTripleResult;
/** `ls(x, y)` — list-segment de x a y. Definido por:
 *   ls(x, y) ≡ (x = y ∧ emp) ∨ ∃z. (x ↦ z * ls(z, y))
 *
 * Para mantener semántica computable, se interpreta directamente sobre
 * el heap: existe una cadena de celdas desde `start` a `end` cuyos
 * contenidos son punteros, sin ciclos ni celdas extra. */
export declare function isListSegment(start: SLValue, end: SLValue, heap: Heap): boolean;
/** Predicado SL para list-segment `ls(start, end)`. Se evalúa como
 * predicado puro sobre el heap (cumple `satisfies`). */
export declare function listSegment(start: SLValue, end: SLValue): SLFormula;
/** Evalúa una fórmula con soporte de predicados inductivos sobre forma de
 * heap (ls, tree). Se usa cuando la fórmula contiene `listSegment` o
 * `tree` — `satisfies` solo no basta porque su rama `pure` ignora el heap. */
export declare function satisfiesShape(formula: SLFormula, heap: Heap, val: SLValuation): boolean;
/** `tree(root)` — el heap representa un árbol binario con raíz `root`.
 *   tree(x) ≡ (x = null ∧ emp) ∨ ∃l, r. (x ↦ l * x.next ↦ r * tree(l) * tree(r))
 *
 * Modelo simplificado: cada nodo ocupa 2 celdas consecutivas
 * (loc, loc+1) con los punteros izquierdo y derecho.
 */
export declare function tree(root: SLValue): SLFormula;
/** Comprueba si `heap` representa un árbol binario con raíz `root` (nodos de 2 celdas contiguas). */
export declare function isTree(root: SLValue, heap: Heap): boolean;
/** Frame rule: si `{P} c {Q}` y `c` no modifica las variables libres de
 * `R`, entonces `{P * R} c {Q * R}`. Esta función construye la tripla
 * compuesta — la validación queda a cargo de `checkTriple`. */
export declare function frame(triple: SLTriple, frameFormula: SLFormula): SLTriple;
/** Constructores convenientes para `SLCommand` (skip, assign, alloc, free, load, store). */
export declare const Cmd: {
    skip: () => SLCommand;
    assign: (variable: string, value: SLValue) => SLCommand;
    alloc: (variable: string, value?: SLValue) => SLCommand;
    free: (location: string) => SLCommand;
    load: (variable: string, location: string) => SLCommand;
    store: (location: string, value: SLValue) => SLCommand;
};
//# sourceMappingURL=index.d.ts.map