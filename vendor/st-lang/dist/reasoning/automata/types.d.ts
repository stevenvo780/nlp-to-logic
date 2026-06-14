export declare const EPSILON: "\u03B5";
export type Symbol = string;
export interface DFA {
    readonly states: Set<string>;
    readonly alphabet: Set<Symbol>;
    /** state → symbol → state. La función puede ser parcial: si falta una
     *  arista para (state, symbol), la palabra es rechazada. */
    readonly transitions: Map<string, Map<Symbol, string>>;
    readonly initial: string;
    readonly accept: Set<string>;
}
export interface NFA {
    readonly states: Set<string>;
    readonly alphabet: Set<Symbol>;
    /** state → symbol (puede ser EPSILON) → P(states). */
    readonly transitions: Map<string, Map<Symbol, Set<string>>>;
    readonly initial: string;
    readonly accept: Set<string>;
    /** Símbolo usado como ε; default `EPSILON` ('ε'). */
    readonly epsilon?: Symbol;
}
export type Regex = {
    kind: 'empty';
} | {
    kind: 'epsilon';
} | {
    kind: 'char';
    c: Symbol;
} | {
    kind: 'concat';
    left: Regex;
    right: Regex;
} | {
    kind: 'union';
    left: Regex;
    right: Regex;
} | {
    kind: 'star';
    arg: Regex;
} | {
    kind: 'plus';
    arg: Regex;
} | {
    kind: 'optional';
    arg: Regex;
};
export interface PDATransition {
    /** Estado origen. */
    readonly state: string;
    /** Símbolo de entrada a consumir; EPSILON = sin consumir. */
    readonly read: Symbol;
    /** Tope de pila a desapilar; EPSILON = sin pop. */
    readonly popTop: Symbol;
    /** Estado destino. */
    readonly nextState: string;
    /** Símbolos a apilar (el último queda en la cima). [] = no push. */
    readonly pushTop: ReadonlyArray<Symbol>;
}
export interface PDA {
    readonly states: Set<string>;
    readonly alphabet: Set<Symbol>;
    readonly stackAlphabet: Set<Symbol>;
    readonly transitions: ReadonlyArray<PDATransition>;
    readonly initial: string;
    readonly initialStack: Symbol;
    /** Aceptación por estado final. */
    readonly accept: Set<string>;
}
//# sourceMappingURL=types.d.ts.map