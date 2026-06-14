"use strict";
// ============================================================
// Tactic DSL — tipos, parser y normalizador de fórmulas
// ============================================================
//
// El DSL trabaja con fórmulas como strings (legibles para el user)
// y un AST interno mínimo (`Formula`) que se usa para destructurar
// goals y reducir hipótesis. El parser soporta:
//
//   atom: identificador alfanumérico (P, Q, n, x_1, Nat).
//   implicación  P -> Q   (right-assoc, menor precedencia)
//   disyunción   P \/ Q    (right-assoc)
//   conjunción   P /\ Q    (right-assoc, mayor prec. que \/)
//   negación     ~P
//   constantes   True, False
//   función      f(arg1, arg2)         — opaco, se trata como atom
//   paréntesis   (...)
//
// El parser es deliberadamente pequeño: nos importa poder destructurar
// las fórmulas que los tactics manipulan, no parsear FOL completa.
// Para cosas como `rewrite`, la igualdad se acepta como string `lhs = rhs`.
Object.defineProperty(exports, "__esModule", { value: true });
exports.TacticError = void 0;
exports.parseFormula = parseFormula;
exports.formulaToString = formulaToString;
exports.normalizeFormula = normalizeFormula;
exports.formulaEq = formulaEq;
exports.substitute = substitute;
class TacticError extends Error {
    tactic;
    constructor(tactic, message) {
        super(`[${tactic}] ${message}`);
        this.tactic = tactic;
        this.name = 'TacticError';
    }
}
exports.TacticError = TacticError;
function peek(s) {
    return s.src[s.pos] ?? '';
}
function skipWs(s) {
    while (s.pos < s.src.length && /\s/.test(s.src[s.pos] ?? ''))
        s.pos++;
}
function match(s, lit) {
    skipWs(s);
    if (s.src.startsWith(lit, s.pos)) {
        s.pos += lit.length;
        return true;
    }
    return false;
}
function isIdStart(ch) {
    return /[A-Za-z_]/.test(ch);
}
function isIdPart(ch) {
    return /[A-Za-z0-9_]/.test(ch);
}
function parseIdent(s) {
    skipWs(s);
    if (!isIdStart(peek(s)))
        return null;
    let id = '';
    while (s.pos < s.src.length && isIdPart(peek(s))) {
        id += s.src[s.pos];
        s.pos++;
    }
    return id;
}
// Parses an opaque function-like atom: f(a, b, c) → just folds into a string atom
// so we don't try to reason about argument structure.
function parseAtomOrApp(s) {
    const id = parseIdent(s);
    if (id === null) {
        throw new Error(`expected identifier at pos ${s.pos} in "${s.src}"`);
    }
    if (id === 'True' || id === 'true')
        return { kind: 'true' };
    if (id === 'False' || id === 'false')
        return { kind: 'false' };
    // función opaca
    if (match(s, '(')) {
        const parts = [];
        if (!match(s, ')')) {
            while (true) {
                skipWs(s);
                // recolectar tokens hasta `,` o `)` con balance de paréntesis
                let depth = 0;
                let buf = '';
                while (s.pos < s.src.length) {
                    const ch = peek(s);
                    if (depth === 0 && (ch === ',' || ch === ')'))
                        break;
                    if (ch === '(')
                        depth++;
                    else if (ch === ')')
                        depth--;
                    buf += ch;
                    s.pos++;
                }
                parts.push(buf.trim());
                if (match(s, ','))
                    continue;
                if (match(s, ')'))
                    break;
                throw new Error(`expected ',' or ')' inside application of '${id}'`);
            }
        }
        return { kind: 'atom', name: `${id}(${parts.join(',')})` };
    }
    return { kind: 'atom', name: id };
}
function parsePrimary(s) {
    skipWs(s);
    if (match(s, '(')) {
        const inner = parseImp(s);
        if (!match(s, ')')) {
            throw new Error(`expected ')' at pos ${s.pos} in "${s.src}"`);
        }
        return inner;
    }
    if (match(s, '~') || match(s, '¬')) {
        const body = parsePrimary(s);
        return { kind: 'not', body };
    }
    return parseAtomOrApp(s);
}
// equality binds tightest after primary (e.g. `f(n) = g(n)` should be a single eq)
function parseEq(s) {
    const left = parsePrimary(s);
    skipWs(s);
    if (s.src.startsWith('=', s.pos) && s.src[s.pos + 1] !== '=' && s.src[s.pos + 1] !== '>') {
        s.pos++;
        const right = parsePrimary(s);
        return { kind: 'eq', left, right };
    }
    return left;
}
function parseAnd(s) {
    const left = parseEq(s);
    if (match(s, '/\\') || match(s, '∧') || match(s, '&&')) {
        const right = parseAnd(s);
        return { kind: 'and', left, right };
    }
    return left;
}
function parseOr(s) {
    const left = parseAnd(s);
    if (match(s, '\\/') || match(s, '∨') || match(s, '||')) {
        const right = parseOr(s);
        return { kind: 'or', left, right };
    }
    return left;
}
function parseImp(s) {
    const left = parseOr(s);
    if (match(s, '->') || match(s, '→') || match(s, '⇒')) {
        const right = parseImp(s);
        return { kind: 'imp', left, right };
    }
    return left;
}
function parseFormula(src) {
    const s = { src, pos: 0 };
    const f = parseImp(s);
    skipWs(s);
    if (s.pos !== s.src.length) {
        throw new Error(`unexpected trailing input at pos ${s.pos} in "${src}"`);
    }
    return f;
}
// ---------- Serializer ----------
//
// Forma canónica: usamos '->', '/\', '\/', '~'. Las strings de entrada
// que usan unicode (∧, ∨, →, ¬) se normalizan a ascii al re-imprimirse.
function formulaToString(f) {
    switch (f.kind) {
        case 'atom':
            return f.name;
        case 'true':
            return 'True';
        case 'false':
            return 'False';
        case 'not':
            return `~${formulaToString(f.body)}`;
        case 'and':
            return `(${formulaToString(f.left)} /\\ ${formulaToString(f.right)})`;
        case 'or':
            return `(${formulaToString(f.left)} \\/ ${formulaToString(f.right)})`;
        case 'imp':
            return `(${formulaToString(f.left)} -> ${formulaToString(f.right)})`;
        case 'eq':
            return `${formulaToString(f.left)} = ${formulaToString(f.right)}`;
    }
}
// Normaliza una string a la forma canónica re-parseando y serializando.
// Útil para comparar `P -> P` con `P → P` o con paréntesis extra.
function normalizeFormula(src) {
    try {
        return formulaToString(parseFormula(src));
    }
    catch {
        return src.trim();
    }
}
function formulaEq(a, b) {
    return normalizeFormula(a) === normalizeFormula(b);
}
// ---------- Substitución textual ----------
//
// Para `rewrite`: dado `lhs = rhs`, sustituye ocurrencias de `lhs`
// como string en una fórmula objetivo. Es textual (no αβ-aware) — el
// alcance del DSL no incluye un substituidor capture-avoiding completo
// porque las fórmulas son ASCII opacas.
function substitute(target, lhs, rhs) {
    if (lhs === rhs)
        return target;
    // Word-boundary sensitive replace para identificadores; literal en caso
    // contrario.
    const escaped = lhs.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = /^[A-Za-z_][A-Za-z0-9_]*$/.test(lhs)
        ? new RegExp(`\\b${escaped}\\b`, 'g')
        : new RegExp(escaped, 'g');
    return target.replace(re, rhs);
}
//# sourceMappingURL=types.js.map