"use strict";
// ============================================================
// BAN Logic — Constructores y equality de términos/fórmulas
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.formulaAnd = exports.controls = exports.sharedSecret = exports.publicKey = exports.sharedKey = exports.fresh = exports.jurisdiction = exports.saidMessage = exports.said = exports.sees = exports.believes = exports.compound = exports.hashed = exports.encrypted = exports.message = exports.atom = exports.nonce = exports.key = exports.principal = void 0;
exports.termEquals = termEquals;
exports.formulaEquals = formulaEquals;
exports.hasFormula = hasFormula;
exports.termToString = termToString;
exports.formulaToString = formulaToString;
/* ── Constructores de términos ── */
/** Crea un principal BAN: agente con identidad nominal (e.g. Alice, Bob). */
const principal = (name) => ({ kind: 'principal', name });
exports.principal = principal;
/** Crea una clave BAN. Si `shared` = [A, B], representa la clave simétrica K_{AB} (= K_{BA}). */
const key = (name, shared) => shared ? { kind: 'key', name, shared } : { kind: 'key', name };
exports.key = key;
/** Crea un nonce BAN (número usado una vez, evidencia de frescura). */
const nonce = (name) => ({ kind: 'nonce', name });
exports.nonce = nonce;
/** Crea un átomo BAN (valor opaco / constante del dominio de mensajes). */
const atom = (name) => ({ kind: 'atom', name });
exports.atom = atom;
/** Crea un mensaje BAN compuesto de una lista de sub-términos. */
const message = (...content) => ({ kind: 'message', content });
exports.message = message;
/** Crea un término cifrado `{msg}_k`: el mensaje `msg` bajo la clave `k`. */
const encrypted = (msg, k) => ({
    kind: 'encrypted',
    message: msg,
    key: k,
});
exports.encrypted = encrypted;
/** Crea un término hasheado `H(msg)`. */
const hashed = (msg) => ({ kind: 'hashed', message: msg });
exports.hashed = hashed;
/** Crea un término compuesto de partes (concatenación de mensajes). */
const compound = (...parts) => ({ kind: 'compound', parts });
exports.compound = compound;
/* ── Constructores de fórmulas ── */
/** `p |≡ f` — el principal `p` cree la fórmula `f`. */
const believes = (p, f) => ({
    kind: 'believes',
    principal: p,
    about: f,
});
exports.believes = believes;
/** `p ◁ w` — el principal `p` ve el término `w` (lo recibió en el mensaje). */
const sees = (p, w) => ({
    kind: 'sees',
    principal: p,
    what: w,
});
exports.sees = sees;
/** `p |~ f` — el principal `p` alguna vez dijo la fórmula `f`. */
const said = (p, f) => ({
    kind: 'said',
    principal: p,
    what: f,
});
exports.said = said;
/** `p |~ w` — el principal `p` alguna vez dijo el mensaje `w`. */
const saidMessage = (p, w) => ({
    kind: 'said-message',
    principal: p,
    what: w,
});
exports.saidMessage = saidMessage;
/** `p |⇒ f` — el principal `p` tiene jurisdicción sobre la fórmula `f`. */
const jurisdiction = (p, f) => ({
    kind: 'jurisdiction',
    principal: p,
    over: f,
});
exports.jurisdiction = jurisdiction;
/** `#(w)` — el término `w` es fresco (generado en esta sesión de protocolo). */
const fresh = (w) => ({ kind: 'fresh', what: w });
exports.fresh = fresh;
/** `a ↔K b` — `k` es la clave compartida entre los agentes `a` y `b` (simétrico). */
const sharedKey = (a, b, k) => ({
    kind: 'sharedKey',
    a,
    b,
    key: k,
});
exports.sharedKey = sharedKey;
/** `|→k p` — `k` es la clave pública del principal `p`. */
const publicKey = (p, k) => ({
    kind: 'publicKey',
    principal: p,
    key: k,
});
exports.publicKey = publicKey;
/** `a ⇌s b` — `s` es el secreto compartido entre los agentes `a` y `b` (simétrico). */
const sharedSecret = (a, b, s) => ({
    kind: 'sharedSecret',
    a,
    b,
    secret: s,
});
exports.sharedSecret = sharedSecret;
/** `p |⇒ f` — el principal `p` controla (tiene autoridad sobre) la fórmula `f`. */
const controls = (p, f) => ({
    kind: 'controls',
    principal: p,
    statement: f,
});
exports.controls = controls;
/** Conjunción de dos fórmulas BAN: `left ∧ right`. */
const formulaAnd = (left, right) => ({
    kind: 'formula-and',
    left,
    right,
});
exports.formulaAnd = formulaAnd;
/* ── Igualdad estructural ── */
/** Igualdad estructural entre dos términos BAN. Las claves compartidas son simétricas: K_{AB} = K_{BA}. */
function termEquals(a, b) {
    if (a.kind !== b.kind)
        return false;
    switch (a.kind) {
        case 'principal':
        case 'nonce':
        case 'atom':
            // narrow b to a kind with .name
            return b.name === a.name;
        case 'key': {
            const bk = b;
            if (bk.name !== a.name)
                return false;
            const as = a.shared;
            const bs = bk.shared;
            if (!as && !bs)
                return true;
            if (!as || !bs)
                return false;
            // Shared pair es bi-direccional: {A,B} == {B,A}.
            return (as[0] === bs[0] && as[1] === bs[1]) || (as[0] === bs[1] && as[1] === bs[0]);
        }
        case 'message': {
            const bm = b;
            if (a.content.length !== bm.content.length)
                return false;
            for (let i = 0; i < a.content.length; i++) {
                const ai = a.content[i];
                const bi = bm.content[i];
                if (!ai || !bi)
                    return false;
                if (!termEquals(ai, bi))
                    return false;
            }
            return true;
        }
        case 'compound': {
            const bc = b;
            if (a.parts.length !== bc.parts.length)
                return false;
            for (let i = 0; i < a.parts.length; i++) {
                const ai = a.parts[i];
                const bi = bc.parts[i];
                if (!ai || !bi)
                    return false;
                if (!termEquals(ai, bi))
                    return false;
            }
            return true;
        }
        case 'encrypted': {
            const be = b;
            return termEquals(a.message, be.message) && termEquals(a.key, be.key);
        }
        case 'hashed': {
            const bh = b;
            return termEquals(a.message, bh.message);
        }
    }
}
/** Igualdad estructural entre dos fórmulas BAN. Los predicados sharedKey y sharedSecret son simétricos en sus agentes. */
function formulaEquals(a, b) {
    if (a.kind !== b.kind)
        return false;
    switch (a.kind) {
        case 'believes': {
            const bb = b;
            return termEquals(a.principal, bb.principal) && formulaEquals(a.about, bb.about);
        }
        case 'sees': {
            const bs = b;
            return termEquals(a.principal, bs.principal) && termEquals(a.what, bs.what);
        }
        case 'said': {
            const bs = b;
            return termEquals(a.principal, bs.principal) && formulaEquals(a.what, bs.what);
        }
        case 'said-message': {
            const bs = b;
            return termEquals(a.principal, bs.principal) && termEquals(a.what, bs.what);
        }
        case 'jurisdiction': {
            const bj = b;
            return termEquals(a.principal, bj.principal) && formulaEquals(a.over, bj.over);
        }
        case 'fresh': {
            const bf = b;
            return termEquals(a.what, bf.what);
        }
        case 'sharedKey': {
            const bs = b;
            // El predicado "A ↔K B" es simétrico en (A,B).
            const ab = termEquals(a.a, bs.a) && termEquals(a.b, bs.b);
            const ba = termEquals(a.a, bs.b) && termEquals(a.b, bs.a);
            return (ab || ba) && termEquals(a.key, bs.key);
        }
        case 'publicKey': {
            const bp = b;
            return termEquals(a.principal, bp.principal) && termEquals(a.key, bp.key);
        }
        case 'sharedSecret': {
            const bs = b;
            const ab = termEquals(a.a, bs.a) && termEquals(a.b, bs.b);
            const ba = termEquals(a.a, bs.b) && termEquals(a.b, bs.a);
            return (ab || ba) && termEquals(a.secret, bs.secret);
        }
        case 'controls': {
            const bc = b;
            return termEquals(a.principal, bc.principal) && formulaEquals(a.statement, bc.statement);
        }
        case 'formula-and': {
            const ba = b;
            return formulaEquals(a.left, ba.left) && formulaEquals(a.right, ba.right);
        }
    }
}
/** Comprueba si `target` está en la lista de fórmulas BAN `state` (usando igualdad estructural). */
function hasFormula(state, target) {
    return state.some((f) => formulaEquals(f, target));
}
/* ── Pretty printing ── */
/** Serializa un término BAN a su representación textual estándar. */
function termToString(t) {
    switch (t.kind) {
        case 'principal':
        case 'nonce':
        case 'atom':
            return t.name;
        case 'key':
            return t.shared ? `K_${t.shared[0]}${t.shared[1]}` : t.name;
        case 'message':
            return `<${t.content.map(termToString).join(', ')}>`;
        case 'compound':
            return `(${t.parts.map(termToString).join(' · ')})`;
        case 'encrypted':
            return `{${termToString(t.message)}}_${termToString(t.key)}`;
        case 'hashed':
            return `H(${termToString(t.message)})`;
    }
}
/** Serializa una fórmula BAN a su representación textual estándar. */
function formulaToString(f) {
    switch (f.kind) {
        case 'believes':
            return `${termToString(f.principal)} |≡ ${formulaToString(f.about)}`;
        case 'sees':
            return `${termToString(f.principal)} ◁ ${termToString(f.what)}`;
        case 'said':
            return `${termToString(f.principal)} |~ ${formulaToString(f.what)}`;
        case 'said-message':
            return `${termToString(f.principal)} |~ ${termToString(f.what)}`;
        case 'jurisdiction':
            return `${termToString(f.principal)} |⇒ ${formulaToString(f.over)}`;
        case 'fresh':
            return `#(${termToString(f.what)})`;
        case 'sharedKey':
            return `${termToString(f.a)} ↔${termToString(f.key)} ${termToString(f.b)}`;
        case 'publicKey':
            return `|→${termToString(f.key)} ${termToString(f.principal)}`;
        case 'sharedSecret':
            return `${termToString(f.a)} ⇌${termToString(f.secret)} ${termToString(f.b)}`;
        case 'controls':
            return `${termToString(f.principal)} |⇒ ${formulaToString(f.statement)}`;
        case 'formula-and':
            return `(${formulaToString(f.left)}) ∧ (${formulaToString(f.right)})`;
    }
}
//# sourceMappingURL=terms.js.map