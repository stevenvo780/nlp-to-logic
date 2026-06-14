/** Término del lenguaje HoTT: cubre MLTT (Π, Σ, Nat), tipos identidad como espacios de caminos, HITs pedagógicos (S¹, Σ) y el axioma de univalencia. */
export type HoTTTerm = {
    kind: 'var';
    name: string;
} | {
    kind: 'universe';
    level: number;
} | {
    kind: 'pi';
    bind: string;
    domain: HoTTTerm;
    codomain: HoTTTerm;
} | {
    kind: 'lam';
    bind: string;
    domain: HoTTTerm;
    body: HoTTTerm;
} | {
    kind: 'app';
    fn: HoTTTerm;
    arg: HoTTTerm;
} | {
    kind: 'sigma';
    bind: string;
    first: HoTTTerm;
    second: HoTTTerm;
} | {
    kind: 'pair';
    fst: HoTTTerm;
    snd: HoTTTerm;
} | {
    kind: 'fst';
    pair: HoTTTerm;
} | {
    kind: 'snd';
    pair: HoTTTerm;
} | {
    kind: 'nat';
} | {
    kind: 'zero';
} | {
    kind: 'succ';
    arg: HoTTTerm;
} | {
    kind: 'path';
    type: HoTTTerm;
    left: HoTTTerm;
    right: HoTTTerm;
} | {
    kind: 'refl';
    term: HoTTTerm;
} | {
    kind: 'transport';
    family: HoTTTerm;
    path: HoTTTerm;
    term: HoTTTerm;
} | {
    kind: 'pathSym';
    path: HoTTTerm;
} | {
    kind: 'pathConcat';
    left: HoTTTerm;
    right: HoTTTerm;
} | {
    kind: 'ap';
    fn: HoTTTerm;
    path: HoTTTerm;
} | {
    kind: 'jElim';
    motive: HoTTTerm;
    baseCase: HoTTTerm;
    path: HoTTTerm;
} | {
    kind: 'circle';
} | {
    kind: 'baseOfCircle';
} | {
    kind: 'loopOfCircle';
} | {
    kind: 'suspension';
    type: HoTTTerm;
} | {
    kind: 'north';
    type: HoTTTerm;
} | {
    kind: 'south';
    type: HoTTTerm;
} | {
    kind: 'meridian';
    type: HoTTTerm;
    point: HoTTTerm;
} | {
    kind: 'ua';
    equiv: HoTTTerm;
};
/** Constructor de variable HoTT referenciada por nombre. */
export declare const hVar: (name: string) => HoTTTerm;
/** Constructor del universo jerárquico Typeₙ (default: Type₀). */
export declare const hUniverse: (level?: number) => HoTTTerm;
/** Constructor del tipo Π (función dependiente): `Π(bind : domain). codomain`. */
export declare const hPi: (bind: string, domain: HoTTTerm, codomain: HoTTTerm) => HoTTTerm;
/** Constructor de lambda con dominio anotado: `λ(bind : domain). body`. */
export declare const hLam: (bind: string, domain: HoTTTerm, body: HoTTTerm) => HoTTTerm;
/** Constructor de aplicación de función: `fn arg`. */
export declare const hApp: (fn: HoTTTerm, arg: HoTTTerm) => HoTTTerm;
/** Constructor del tipo Σ (par dependiente): `Σ(bind : first). second`. */
export declare const hSigma: (bind: string, first: HoTTTerm, second: HoTTTerm) => HoTTTerm;
/** Constructor de par dependiente: `⟨fst, snd⟩`. */
export declare const hPair: (fst: HoTTTerm, snd: HoTTTerm) => HoTTTerm;
/** Proyección de la primera componente de un par dependiente. */
export declare const hFst: (pair: HoTTTerm) => HoTTTerm;
/** Proyección de la segunda componente de un par dependiente. */
export declare const hSnd: (pair: HoTTTerm) => HoTTTerm;
/** Tipo de los números naturales en HoTT (tipo inductivo). */
export declare const hNat: () => HoTTTerm;
/** Constante cero del tipo Nat en HoTT. */
export declare const hZero: () => HoTTTerm;
/** Constructor sucesor del tipo Nat en HoTT. */
export declare const hSucc: (arg: HoTTTerm) => HoTTTerm;
/** Constructor del tipo de caminos: `Path type left right` (espacio de caminos entre `left` y `right`). */
export declare const hPath: (type: HoTTTerm, left: HoTTTerm, right: HoTTTerm) => HoTTTerm;
/** Camino reflexivo (constante): `refl(term) : Path A term term`. */
export declare const hRefl: (term: HoTTTerm) => HoTTTerm;
/** Transporte a lo largo de un camino: mueve `term` de la fibra `family left` a `family right`. */
export declare const hTransport: (family: HoTTTerm, path: HoTTTerm, term: HoTTTerm) => HoTTTerm;
/** Inversión de camino: dado `p : Path A x y` produce `p⁻¹ : Path A y x`. */
export declare const hPathSym: (path: HoTTTerm) => HoTTTerm;
/** Concatenación de caminos: `p · q : Path A x z` dado `p : Path A x y` y `q : Path A y z`. */
export declare const hPathConcat: (left: HoTTTerm, right: HoTTTerm) => HoTTTerm;
/** Functorialidad: `ap f p : Path B (f x) (f y)` dado `f : A → B` y `p : Path A x y`. */
export declare const hAp: (fn: HoTTTerm, path: HoTTTerm) => HoTTTerm;
/** Eliminador J: principio inductivo del tipo identidad en HoTT. */
export declare const hJElim: (motive: HoTTTerm, baseCase: HoTTTerm, path: HoTTTerm) => HoTTTerm;
/** HIT S¹: el círculo, tipo inductivo superior con un punto base y un loop. */
export declare const hCircle: () => HoTTTerm;
/** Punto base de S¹: `base : S¹`. */
export declare const hBaseOfCircle: () => HoTTTerm;
/** Generador del loop de S¹: `loop : Path S¹ base base`. */
export declare const hLoopOfCircle: () => HoTTTerm;
/** Tipo suspensión ΣA (HIT): colapsa `A` añadiendo dos polos y meridianos. */
export declare const hSuspension: (type: HoTTTerm) => HoTTTerm;
/** Polo norte de la suspensión de `type`. */
export declare const hNorth: (type: HoTTTerm) => HoTTTerm;
/** Polo sur de la suspensión de `type`. */
export declare const hSouth: (type: HoTTTerm) => HoTTTerm;
/** Meridiano de la suspensión: `meridian a : Path north south` para cada `a : type`. */
export declare const hMeridian: (type: HoTTTerm, point: HoTTTerm) => HoTTTerm;
/** Axioma de univalencia: `ua(equiv) : Path U A B` dada una equivalencia `equiv : A ≃ B`. */
export declare const hUa: (equiv: HoTTTerm) => HoTTTerm;
/** Tipo flecha no-dependiente: `from → to` (azúcar sobre Π con bind ignorado). */
export declare const hArrow: (from: HoTTTerm, to: HoTTTerm) => HoTTTerm;
/** Comprueba si la variable `name` ocurre libre en el término HoTT `term`. */
export declare function occursFreeHoTT(name: string, term: HoTTTerm): boolean;
/** Recolecta el conjunto de variables libres del término HoTT dado. */
export declare function freeVarsHoTT(term: HoTTTerm, acc?: Set<string>): Set<string>;
/** Serializa un término HoTT a una cadena legible usando notación matemática estándar. */
export declare function termToStringHoTT(t: HoTTTerm): string;
//# sourceMappingURL=types.d.ts.map