export interface OperationSymbol {
    readonly name: string;
    readonly arity: number;
}
export interface Signature {
    readonly operations: ReadonlyArray<OperationSymbol>;
}
export interface Algebra<T> {
    readonly signature: Signature;
    readonly carrier: ReadonlyArray<T>;
    readonly operations: ReadonlyMap<string, (...args: T[]) => T>;
    readonly eq?: (a: T, b: T) => boolean;
}
/**
 * Verifica que la signatura no tenga símbolos duplicados ni aridades
 * negativas.
 */
export declare function isValidSignature(sig: Signature): boolean;
/**
 * Verifica que `A` interpreta cada símbolo de su signatura y que
 * las operaciones son totales y cerradas sobre el carrier.
 *
 * Para aridad n, se enumeran |A|^n tuplas — usar sólo con carriers
 * finitos pequeños (n·|A|^aridad <= ~10⁶).
 */
export declare function isAlgebra<T>(A: Algebra<T>): boolean;
declare function enumerateTuples<T>(carrier: ReadonlyArray<T>, arity: number): T[][];
export interface Homomorphism<T1, T2> {
    readonly source: Algebra<T1>;
    readonly target: Algebra<T2>;
    readonly map: (x: T1) => T2;
}
/**
 * Verifica que `h` preserva todas las operaciones:
 *   h(f^A(a₁,…,aₙ)) = f^B(h(a₁),…,h(aₙ)) para toda tupla y operación f.
 *
 * Requiere signaturas idénticas en source y target (mismos nombres y
 * aridades).
 */
export declare function isHomomorphism<T1, T2>(h: Homomorphism<T1, T2>): boolean;
/**
 * Imagen de un homomorfismo: { h(a) : a ∈ A }, deduplicada por igualdad
 * del target.
 */
export declare function image<T1, T2>(h: Homomorphism<T1, T2>): T2[];
/**
 * Kernel: relación de equivalencia ker h = { (a,b) : h(a) = h(b) }.
 * Devuelve sólo pares (a,b) con a ≠ b (incluyendo (b,a)); los reflexivos
 * son implícitos.
 */
export declare function kernel<T1, T2>(h: Homomorphism<T1, T2>): Array<[T1, T1]>;
export interface Congruence<T> {
    readonly algebra: Algebra<T>;
    readonly relation: ReadonlyArray<[T, T]>;
}
/**
 * θ es congruencia sii es:
 *   1) reflexiva   : (a,a) ∈ θ para todo a ∈ A
 *   2) simétrica   : (a,b) ∈ θ ⇒ (b,a) ∈ θ
 *   3) transitiva  : (a,b),(b,c) ∈ θ ⇒ (a,c) ∈ θ
 *   4) compatible  : (aᵢ,bᵢ) ∈ θ ⇒ (f(a₁,…,aₙ), f(b₁,…,bₙ)) ∈ θ
 *
 * La relación puede entregarse minimamente (sólo pares relevantes); aquí
 * se verifica el cierre completo asumiendo la relación dada.
 */
export declare function isCongruence<T>(c: Congruence<T>): boolean;
/**
 * Calcula las clases de equivalencia inducidas por una relación
 * (asumida ya transitiva-y-simétrica; el módulo `isCongruence` valida
 * el caso). Cada clase es un T[] (en el orden del carrier).
 */
export declare function equivalenceClasses<T>(c: Congruence<T>): T[][];
/**
 * Álgebra cociente A/θ. El carrier son las clases de equivalencia; cada
 * operación se eleva representando la clase por su primer elemento.
 *
 * No verifica que la relación sea congruencia; usar `isCongruence` antes.
 */
export declare function quotientAlgebra<T>(c: Congruence<T>): Algebra<T[]>;
export type Term = {
    readonly op: string;
    readonly args: ReadonlyArray<Term>;
} | {
    readonly var: string;
};
export declare function isVarTerm(t: Term): t is {
    readonly var: string;
};
export declare function isOpTerm(t: Term): t is {
    readonly op: string;
    readonly args: ReadonlyArray<Term>;
};
export declare function termToString(t: Term): string;
export declare function termEquals(t1: Term, t2: Term): boolean;
/**
 * Substitución t[x ↦ σ(x)]: reemplaza cada variable por su término.
 * Variables fuera de `sub` quedan intactas.
 */
export declare function termSubstitute(t: Term, sub: Record<string, Term>): Term;
/**
 * Álgebra de términos T_Σ(X) hasta profundidad `maxDepth`. Útil para
 * generar muestras del álgebra libre — el carrier completo es infinito
 * cuando hay operaciones de aridad ≥ 1.
 *
 * Por defecto `maxDepth=2`: incluye constantes, variables y un nivel
 * de aplicación.
 */
export declare function termAlgebra(signature: Signature, generators: ReadonlyArray<string>, maxDepth?: number): Algebra<Term>;
/**
 * Comprueba si t1 y t2 son iguales módulo el conjunto de ecuaciones
 * `eqs`, aplicando reescritura ingenua hasta profundidad limitada.
 *
 * NO es decidible en general; este checker es una heurística para
 * casos pequeños: aplica cada ecuación en ambas direcciones desde t1
 * y t2 hasta `maxSteps` pasos buscando una forma común.
 */
export declare function termEqualsModulo(t1: Term, t2: Term, eqs: ReadonlyArray<[Term, Term]>, maxSteps?: number): boolean;
export interface Equation {
    readonly left: Term;
    readonly right: Term;
}
/**
 * Variables libres de un término (orden de aparición, deduplicadas).
 */
export declare function freeVars(t: Term): string[];
/**
 * Evalúa un término en un álgebra dado un assignment de variables.
 */
export declare function evalTerm<T>(A: Algebra<T>, t: Term, env: Record<string, T>): T;
/**
 * A ⊨ (t₁ = t₂): para todo assignment de variables libres, evalTerm
 * coincide. Si `samples` es positivo, sólo se prueban `samples` tuplas
 * aleatorias; si es 0 o undefined, se enumeran todas (|A|^k).
 */
export declare function modelsEquation<T>(A: Algebra<T>, eq: Equation, samples?: number): boolean;
/**
 * A pertenece a la variedad V(E) sii A satisface toda ecuación de E.
 *
 * Es la dirección "fácil" de Birkhoff: una variedad puede definirse
 * por ecuaciones, y la pertenencia se verifica ecuación-por-ecuación.
 * El recíproco (clases HSP son ecuacionalmente definibles) es el
 * contenido fuerte del teorema y no se chequea aquí.
 */
export declare function variety<T>(equations: ReadonlyArray<Equation>, A: Algebra<T>): boolean;
/**
 * Signatura de grupos en notación multiplicativa: e (constante),
 * inv (unaria), mul (binaria).
 */
export declare function groupSignature(): Signature;
/**
 * Signatura de anillos: 0, 1 (constantes), neg (unaria), add y mul (binarias).
 */
export declare function ringSignature(): Signature;
/**
 * Signatura de retículos: join y meet (binarias).
 */
export declare function latticeSignature(): Signature;
/**
 * Ecuaciones de grupo (notación multiplicativa, signatura `groupSignature`):
 *   - asociatividad de mul
 *   - identidad por izquierda y derecha
 *   - inverso por izquierda y derecha
 */
export declare function groupEquations(): Equation[];
/**
 * Ecuaciones adicionales para grupos abelianos: conmutatividad de mul.
 */
export declare function abelianEquations(): Equation[];
/**
 * Ecuaciones de anillo conmutativo con unidad sobre `ringSignature`:
 * grupo abeliano por +, monoide conmutativo por ·, distributividad
 * bilateral.
 */
export declare function ringEquations(): Equation[];
/**
 * Ecuaciones de retículo sobre `latticeSignature`: idempotencia,
 * conmutatividad, asociatividad y absorción para join y meet.
 */
export declare function latticeEquations(): Equation[];
/**
 * Construye el álgebra cíclica Z/nZ en la signatura de grupo
 * (`groupSignature`), con `mul` interpretado como suma módulo n.
 */
export declare function cyclicGroupAlgebra(n: number): Algebra<number>;
/**
 * Construye Z/nZ como anillo conmutativo con unidad. Para n=1 colapsa
 * al anillo trivial (0=1).
 */
export declare function cyclicRingAlgebra(n: number): Algebra<number>;
export { enumerateTuples as _enumerateTuples };
/**
 * Calcula el `index` de un elemento en el carrier por la igualdad del
 * álgebra (Object.is o `eq` provisto). Devuelve -1 si no aparece.
 */
export declare function carrierIndex<T>(A: Algebra<T>, x: T): number;
//# sourceMappingURL=index.d.ts.map