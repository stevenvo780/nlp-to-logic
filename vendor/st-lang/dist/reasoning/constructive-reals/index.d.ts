export interface CReal {
    /**
     * Devuelve una aproximación dyádica de x con error < 2^{-precision}.
     * numerator / denominator ≈ x, denominator = 2^precision.
     */
    approx(precision: number): {
        numerator: bigint;
        denominator: bigint;
    };
}
/** Eleva 2 a un entero no negativo. */
declare function pow2(n: number): bigint;
/**
 * Divide entero con "round half away from zero".
 *   shiftRight(x, k) ≈ x / 2^k redondeado.
 * Garantiza |shiftRight(x,k) - x/2^k| ≤ 1/2.
 */
declare function shiftRight(x: bigint, k: number): bigint;
/**
 * Calcula el número de bits del entero (|x| en binario).
 * bitLength(0) = 0, bitLength(1) = 1, bitLength(7) = 3, bitLength(8) = 4.
 */
declare function bitLength(x: bigint): number;
export declare function fromInt(n: number | bigint): CReal;
export declare function fromRational(p: number | bigint, q: number | bigint): CReal;
export declare function neg(a: CReal): CReal;
export declare function abs(a: CReal): CReal;
/**
 * add(a,b) a precisión p:
 *   pedimos a y b a precisión p+2.
 *   error de cada uno < 2^{-(p+2)} → error en a+b < 2·2^{-(p+2)} = 2^{-(p+1)}.
 *   Al pasar de escala p+2 a p (shift de 2), introducimos error
 *   de redondeo ≤ 1/2 en la unidad p, = 2^{-(p+1)}.
 *   Total: < 2^{-(p+1)} + 2^{-(p+1)} = 2^{-p}.  ✓
 */
export declare function add(a: CReal, b: CReal): CReal;
export declare function sub(a: CReal, b: CReal): CReal;
/**
 * mul(a,b) a precisión p:
 *   Necesitamos cotas sobre |a| y |b|. Tomamos una aproximación gruesa
 *   a precisión 0 para estimar el tamaño en bits.
 *   Sean |a| ≤ 2^A, |b| ≤ 2^B (con A,B no-negativos).
 *   Trabajamos a precisión p + A + B + 3.
 *   En esa escala el producto cabe y la cota de error queda < 2^{-p}.
 *
 *   Detalle del error: si â = a + ε_a con |ε_a| < 2^{-w} y análogamente
 *   para b̂ (w = work precision en los operandos), entonces
 *      â·b̂ - a·b = a·ε_b + b·ε_a + ε_a·ε_b.
 *   |a·ε_b| ≤ 2^A · 2^{-w}, idem para b.
 *   Eligiendo w = p + A + B + 3 ese error queda < 2·2^{-(p+B+3)}
 *   acotado holgadamente por 2^{-(p+1)}, y el shift final añade otro
 *   2^{-(p+1)}, dando < 2^{-p}.
 */
export declare function mul(a: CReal, b: CReal): CReal;
/**
 * div(a,b) a precisión p (b ≠ 0).
 *   Encontramos k tal que |b| ≥ 2^{-k}.
 *   Necesitamos también cota superior A_bits sobre |a|.
 *   Trabajamos a precisión w = p + 2k + A_bits + 4.
 *
 *   Si â = a + ε_a, b̂ = b + ε_b, entonces
 *     â/b̂ - a/b = (ε_a · b - a · ε_b) / (b · b̂).
 *   |b · b̂| ≥ (2^{-k}) · (2^{-k} - 2^{-w}) ≥ 2^{-2k-1}.
 *   |ε_a · b| ≤ 2^{-w} · (|b̂|+2^{-w}).
 *   |a · ε_b| ≤ |â+2^{-w}| · 2^{-w}.
 *   Tomando w = p + 2k + A_bits + 4 acotamos por < 2^{-p}.
 */
export declare function div(a: CReal, b: CReal): CReal;
/**
 * sqrt(a) para a ≥ 0. Si a < 0 (detectado con cota), lanza.
 * Implementación: Newton-Raphson en bigint sobre x² = N donde
 * N = aprox(a) a precisión 2·prec + buffer. La raíz cuadrada entera
 * de N da nuestra aproximación a √a a precisión prec.
 */
export declare function sqrt(a: CReal): CReal;
/** Raíz cuadrada entera (floor) de n ≥ 0 vía Newton. */
declare function isqrt(n: bigint): bigint;
/**
 * compareWithEpsilon(a, b, epsPrec):
 *   Si |a - b| < 2^{-epsPrec}, devuelve 0 (indistinguibles).
 *   Si a > b + 2^{-epsPrec}, devuelve 1.
 *   Si a < b - 2^{-epsPrec}, devuelve -1.
 *
 *   Implementación: comparamos aproximaciones a precisión epsPrec + 3.
 *   |aw/2^w - a| < 2^{-w}, idem b. Entonces
 *     (aw - bw)/2^w  está dentro de  (a - b) ± 2·2^{-w}.
 *   Eligiendo w = epsPrec + 3:
 *     • Si (aw - bw) > 2^{w - epsPrec} + 2 = 8 + 2 = 10 (en escala w),
 *       entonces a - b > 2^{-epsPrec}, devolvemos 1.
 *     • Análogo para -10.
 *     • En otro caso, devolvemos 0.
 */
export declare function compareWithEpsilon(a: CReal, b: CReal, epsilonPrecision: number): -1 | 0 | 1;
/**
 * toString(r, digits): representación decimal con `digits` dígitos
 * después del punto. Usa precisión binaria suficiente:
 *   2^p > 10^digits  ⇔  p > digits · log2(10) ≈ digits · 3.322.
 * Tomamos p = ceil(digits · 4) + 8 para holgura.
 */
export declare function toString(r: CReal, digits: number): string;
/**
 * exp(x) = Σ x^k / k!. Para que la serie converja rápido reducimos
 * primero el argumento: escribimos x = q · ln(2) + r con |r| ≤ ln(2)/2
 * usando q = round(x / ln(2)). Luego exp(x) = 2^q · exp(r).
 *
 * Para esta versión inicial hacemos una reducción más simple: si
 * |x| > 1, dividimos por 2^k hasta que |x/2^k| < 1, calculamos
 * exp(x/2^k) por serie, y elevamos al cuadrado k veces (exp(y)² = exp(2y)).
 * Esto mantiene la convergencia de la serie acotada a ~prec términos.
 */
export declare function exp(x: CReal): CReal;
export declare function log(x: CReal): CReal;
export declare function sin(x: CReal): CReal;
export declare function cos(x: CReal): CReal;
/**
 * pow(a, b) = exp(b · log(a)) para a > 0.
 * Caso especial: si b es un entero, hacemos exponenciación rápida
 * sobre CReal para evitar log de a (lo que permite a ≤ 0 si b es entero).
 */
export declare function pow(a: CReal, b: CReal | number): CReal;
export declare const PI: CReal;
export declare const E: CReal;
export declare const SQRT2: CReal;
/** @internal Exposed for whitebox tests. */
export declare const __internals: {
    shiftRight: typeof shiftRight;
    bitLength: typeof bitLength;
    isqrt: typeof isqrt;
    pow2: typeof pow2;
};
/** Crea un CReal desde un número racional (float). Usa fromInt para enteros. */
export declare function fromFloat(q: number): CReal;
/**
 * Extrae el valor numérico de un CReal.
 * `precision` es el número de bits fraccionarios solicitados (como pasa `x.approx(p)`).
 * Para evitar desbordamiento al convertir bigint → number, se acota internamente a 63 bits.
 * Valores por encima de 63 sólo añaden cómputo sin mejorar la representación en float64.
 */
export declare function toNumber(x: CReal, precision?: number): number;
/**
 * Retorna true si podemos demostrar constructivamente que x < y
 * a la precisión dada (bits fraccionarios).
 */
export declare function approxLT(x: CReal, y: CReal, precision: number): boolean;
/**
 * Retorna true si |x - y| < 2^{-precision+1} (aproximadamente iguales
 * a la precisión dada).
 */
export declare function approxEq(x: CReal, y: CReal, precision: number): boolean;
/** El real constructivo cero. */
export declare const zero: CReal;
/** El real constructivo uno. */
export declare const one: CReal;
export {};
//# sourceMappingURL=index.d.ts.map