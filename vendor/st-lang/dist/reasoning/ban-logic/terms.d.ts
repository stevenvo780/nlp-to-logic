import type { BANFormula, BANTerm } from './types';
/** Crea un principal BAN: agente con identidad nominal (e.g. Alice, Bob). */
export declare const principal: (name: string) => BANTerm;
/** Crea una clave BAN. Si `shared` = [A, B], representa la clave simétrica K_{AB} (= K_{BA}). */
export declare const key: (name: string, shared?: [string, string]) => BANTerm;
/** Crea un nonce BAN (número usado una vez, evidencia de frescura). */
export declare const nonce: (name: string) => BANTerm;
/** Crea un átomo BAN (valor opaco / constante del dominio de mensajes). */
export declare const atom: (name: string) => BANTerm;
/** Crea un mensaje BAN compuesto de una lista de sub-términos. */
export declare const message: (...content: BANTerm[]) => BANTerm;
/** Crea un término cifrado `{msg}_k`: el mensaje `msg` bajo la clave `k`. */
export declare const encrypted: (msg: BANTerm, k: BANTerm) => BANTerm;
/** Crea un término hasheado `H(msg)`. */
export declare const hashed: (msg: BANTerm) => BANTerm;
/** Crea un término compuesto de partes (concatenación de mensajes). */
export declare const compound: (...parts: BANTerm[]) => BANTerm;
/** `p |≡ f` — el principal `p` cree la fórmula `f`. */
export declare const believes: (p: BANTerm, f: BANFormula) => BANFormula;
/** `p ◁ w` — el principal `p` ve el término `w` (lo recibió en el mensaje). */
export declare const sees: (p: BANTerm, w: BANTerm) => BANFormula;
/** `p |~ f` — el principal `p` alguna vez dijo la fórmula `f`. */
export declare const said: (p: BANTerm, f: BANFormula) => BANFormula;
/** `p |~ w` — el principal `p` alguna vez dijo el mensaje `w`. */
export declare const saidMessage: (p: BANTerm, w: BANTerm) => BANFormula;
/** `p |⇒ f` — el principal `p` tiene jurisdicción sobre la fórmula `f`. */
export declare const jurisdiction: (p: BANTerm, f: BANFormula) => BANFormula;
/** `#(w)` — el término `w` es fresco (generado en esta sesión de protocolo). */
export declare const fresh: (w: BANTerm) => BANFormula;
/** `a ↔K b` — `k` es la clave compartida entre los agentes `a` y `b` (simétrico). */
export declare const sharedKey: (a: BANTerm, b: BANTerm, k: BANTerm) => BANFormula;
/** `|→k p` — `k` es la clave pública del principal `p`. */
export declare const publicKey: (p: BANTerm, k: BANTerm) => BANFormula;
/** `a ⇌s b` — `s` es el secreto compartido entre los agentes `a` y `b` (simétrico). */
export declare const sharedSecret: (a: BANTerm, b: BANTerm, s: BANTerm) => BANFormula;
/** `p |⇒ f` — el principal `p` controla (tiene autoridad sobre) la fórmula `f`. */
export declare const controls: (p: BANTerm, f: BANFormula) => BANFormula;
/** Conjunción de dos fórmulas BAN: `left ∧ right`. */
export declare const formulaAnd: (left: BANFormula, right: BANFormula) => BANFormula;
/** Igualdad estructural entre dos términos BAN. Las claves compartidas son simétricas: K_{AB} = K_{BA}. */
export declare function termEquals(a: BANTerm, b: BANTerm): boolean;
/** Igualdad estructural entre dos fórmulas BAN. Los predicados sharedKey y sharedSecret son simétricos en sus agentes. */
export declare function formulaEquals(a: BANFormula, b: BANFormula): boolean;
/** Comprueba si `target` está en la lista de fórmulas BAN `state` (usando igualdad estructural). */
export declare function hasFormula(state: ReadonlyArray<BANFormula>, target: BANFormula): boolean;
/** Serializa un término BAN a su representación textual estándar. */
export declare function termToString(t: BANTerm): string;
/** Serializa una fórmula BAN a su representación textual estándar. */
export declare function formulaToString(f: BANFormula): string;
//# sourceMappingURL=terms.d.ts.map