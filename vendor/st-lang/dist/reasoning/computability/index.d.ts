export type TMState = string;
export type TMSymbol = string;
export type Direction = 'L' | 'R' | 'S';
export interface TMTransition {
    readonly fromState: TMState;
    readonly readSymbol: TMSymbol;
    readonly toState: TMState;
    readonly writeSymbol: TMSymbol;
    readonly direction: Direction;
}
export interface TuringMachine {
    readonly states: Set<TMState>;
    readonly alphabet: Set<TMSymbol>;
    readonly tapeAlphabet: Set<TMSymbol>;
    readonly transitions: TMTransition[];
    readonly initialState: TMState;
    readonly acceptStates: Set<TMState>;
    readonly rejectStates?: Set<TMState>;
    readonly blank: TMSymbol;
}
export interface TMConfig {
    readonly state: TMState;
    readonly tape: TMSymbol[];
    readonly head: number;
    readonly step: number;
}
export type StepResult = TMConfig | 'halted-accept' | 'halted-reject' | 'no-transition';
/**
 * Inicializa una configuración a partir de la entrada. La cinta arranca
 * con los símbolos de `input`, cabeza en 0. Si la entrada es vacía la
 * cinta arranca con un blank.
 */
export declare function initialConfig(M: TuringMachine, input: string): TMConfig;
/**
 * Un paso de la TM. Devuelve la próxima configuración o un terminal.
 *   • Si el estado actual ya es de aceptación → 'halted-accept'.
 *   • Si es de rechazo → 'halted-reject'.
 *   • Si no hay transición desde (state, leído) → 'no-transition'.
 */
export declare function step(M: TuringMachine, config: TMConfig): StepResult;
export interface RunResult {
    readonly result: 'accept' | 'reject' | 'timeout' | 'no-transition';
    readonly steps: number;
    readonly finalConfig: TMConfig;
}
/**
 * Corre la TM hasta aceptar, rechazar, agotarse o quedar sin transición.
 * `maxSteps` defaultea a 10_000.
 */
export declare function run(M: TuringMachine, input: string, maxSteps?: number): RunResult;
/**
 * Lista todas las configuraciones generadas, hasta `maxSteps`.
 * Incluye la configuración inicial. No incluye un sentinel para terminal.
 */
export declare function trace(M: TuringMachine, input: string, maxSteps: number): TMConfig[];
/**
 * Lectura útil de la cinta: la subcadena no-blank más larga centrada en
 * la región explorada. Sirve para validar máquinas que escriben output
 * en la cinta (binary increment, reverse, copy, etc.).
 */
export declare function readTape(M: TuringMachine, config: TMConfig): string;
/**
 * Halting acotado: ¿la TM para en ≤ `maxSteps` pasos?
 *   • `true` si para por aceptación, rechazo o falta de transición.
 *   • `false` técnicamente nunca se devuelve aquí — para devolver
 *     `false` con certeza haría falta resolver el halting problem, que
 *     es indecidible. Cuando agotamos el budget devolvemos `'unknown'`.
 * Esta función es semi-decidible: reconoce las máquinas que paran,
 * pero no decide el lenguaje complemento (las que no paran).
 */
export declare function boundedHalts(M: TuringMachine, input: string, maxSteps: number): boolean | 'unknown';
/**
 * Incrementa un número binario (MSB first) en la cinta.
 * Algoritmo: ir al final, retroceder convirtiendo 1→0 mientras haya
 * acarreo; al primer 0 escribir 1 y aceptar. Si todo era 1, escribir
 * 1 al borde izquierdo y aceptar.
 */
export declare function tmBinaryIncrement(): TuringMachine;
/**
 * Acepta sii la cantidad de 1s en la entrada (sobre alfabeto {1}) es par.
 * Estados q0 = par hasta ahora, q1 = impar.
 */
export declare function tmUnaryParity(): TuringMachine;
/**
 * Revierte una cadena sobre {a, b}. Algoritmo:
 *   1. Marcar inicio (Sa, Sb) con un símbolo distintivo.
 *   2. Encontrar el final y desplazar el símbolo del frente al fondo.
 *   3. Repetir hasta agotar.
 * Output: la cinta termina con el reverso de la entrada original.
 *
 * Implementación con cinta auxiliar a la derecha (más simple):
 *   Caminar a la derecha mientras se copian símbolos en orden inverso
 *   tras un separador. Al terminar borrar la entrada original.
 *
 * Para evitar complicaciones, esta versión usa una técnica de
 * "shift left after marking": tras leer un símbolo, lo borra y lo
 * reescribe al final del bloque restante.
 *
 * Nota: este algoritmo es O(n²) en pasos pero correcto.
 */
export declare function tmReverseString(): TuringMachine;
/**
 * Copia w → w#w sobre {a, b}. El '#' se inserta automáticamente y la
 * copia queda a la derecha. Algoritmo análogo a reverse pero copiando
 * en orden directo (marcamos cada símbolo procesado con mayúscula).
 */
export declare function tmCopy(): TuringMachine;
/**
 * Suma con `a` en binario y `b` en unario, formato "<a>+<b>" donde
 *   a ∈ {0,1}* (MSB-first), b ∈ {1}*.
 *
 * Mantener `b` unario evita la coreografía de decremento binario (que
 * agrega ~10 estados sin enseñar nada nuevo) y muestra claramente la
 * técnica de "incrementar `a` una vez por cada token de `b`".
 *
 * Algoritmo:
 *   1. Ir al final.
 *   2. Si la última posición es '1' (un token de b), borrarlo y entrar
 *      en `incA`: incrementar `a` y luego volver al final.
 *   3. Si la última posición es '+' (b vacío), borrarlo: la cinta queda
 *      con sólo `a` (el resultado).
 */
export declare function tmAddBinary(): TuringMachine;
export type PRFn = {
    kind: 'zero';
} | {
    kind: 'succ';
} | {
    kind: 'proj';
    n: number;
    i: number;
} | {
    kind: 'comp';
    outer: PRFn;
    inner: PRFn[];
} | {
    kind: 'rec';
    base: PRFn;
    step: PRFn;
};
/**
 * Semántica de PRF:
 *   • zero()           = 0
 *   • succ(x)          = x + 1
 *   • U^n_i(x1..xn)    = x_i
 *   • comp(h, g1..gk)(x1..xn) = h(g1(x1..xn), ..., gk(x1..xn))
 *   • rec(base, step):
 *       f(0, x1..xn)     = base(x1..xn)
 *       f(y+1, x1..xn)   = step(y, f(y, x1..xn), x1..xn)
 *
 * El argumento "iterado" es el primero (convención común). `args[0]` es
 * el contador en `rec`.
 */
export declare function evalPR(f: PRFn, args: number[]): number;
/**
 * Suma: add(0, y) = y, add(x+1, y) = succ(add(x, y))
 *   base = U^1_1 (identidad en y)
 *   step = succ ∘ U^3_2 (toma f(x,y) y le aplica succ)
 *
 * En nuestra convención args[0] es el contador → add(x, y).
 */
export declare const PR_ADD: PRFn;
/**
 * Multiplicación: mul(0, y) = 0, mul(x+1, y) = add(mul(x,y), y)
 *   base = zero (después de proyectar y fuera)
 *   step = add(f(x,y), y)
 *
 * base: el caso 0 → 0. Es la función constante 0 sobre 1 argumento:
 *   const0(y) = zero ∘ U^1_1, pero zero ignora sus argumentos.
 *   En este eval, zero retorna 0 sin importar args.
 */
export declare const PR_MUL: PRFn;
export declare const PR_POW: PRFn;
/**
 * Predecesor: pred(0) = 0, pred(x+1) = x.
 *   rec con base = zero, step = U^2_1 (devuelve y, el contador previo).
 */
export declare const PR_PREDECESSOR: PRFn;
/**
 * Factorial: fact(0) = 1, fact(x+1) = mul(succ(x), fact(x)).
 *
 * En recursión: contador y, acumulador f(y), sin args extra. Step recibe
 * (y, f(y)) y debe devolver mul(succ(y), f(y)).
 *
 * Cuidado: aquí args[0]=y es el "k" del bucle (0-indexed), por lo que
 * succ(y) = y+1 = el siguiente número a multiplicar.
 */
export declare const PR_FACT: PRFn;
/**
 * Función de Ackermann (Peter):
 *   A(0, n) = n + 1
 *   A(m+1, 0) = A(m, 1)
 *   A(m+1, n+1) = A(m, A(m+1, n))
 *
 * Crece más rápido que toda PRF: A(m, n) es la prueba canónica de que
 * existen funciones recursivas totales no primitivas recursivas.
 *
 * Implementación iterativa por stack para esquivar el call-stack JS.
 */
export declare function ackermann(m: number, n: number): number;
/**
 * Test heurístico de "esta función podría ser PR": evalúa la función
 * sobre `samples` puntos pequeños y la compara con el patrón de
 * crecimiento de Ackermann (que escapa a PR). Es estrictamente una
 * heurística — no es un decisor.
 *
 *   • Si la función supera a A(samples, samples) en algún punto pequeño
 *     → likely = false (probablemente no es PR).
 *   • Si nunca crece más rápido que cuadrático/exponencial moderado →
 *     likely = true.
 */
export declare function isInPR(f: (n: number) => number, samples?: number): {
    likely: boolean;
    estimate?: number;
};
/**
 * Rice (1953): toda propiedad **no trivial** sobre el lenguaje aceptado
 * por una TM (es decir, sobre el comportamiento input/output observable)
 * es **indecidible**.
 *
 * No podemos *decidir* la propiedad — eso es justo lo que el teorema
 * niega. Lo que sí podemos es **verificar el predicado de Rice**: la
 * propiedad debe ser
 *
 *   1. extensional (depende sólo del lenguaje, no del código),
 *   2. no vacía (alguna TM la satisface),
 *   3. no total (alguna TM no la satisface).
 *
 * Esta función toma el predicado, lo evalúa sobre un muestreo finito de
 * TMs conocidas y, si encuentra una `M0` que la satisface y una `M1`
 * que no, devuelve `undecidable = true` con explicación. Si todas las
 * TMs de la muestra dan la misma respuesta no podemos concluir nada
 * (la propiedad podría ser trivial, o la muestra puede ser muy chica).
 */
export declare function riceWitness(property: (m: TuringMachine) => boolean, sampleSize?: number): {
    undecidable: boolean;
    explanation: string;
};
//# sourceMappingURL=index.d.ts.map