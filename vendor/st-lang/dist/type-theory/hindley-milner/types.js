"use strict";
// ============================================================
// Hindley-Milner — Tipos, esquemas, expresiones y entorno
// ============================================================
//
// Sistema de tipos let-polimórfico estilo Damas-Milner. La sintaxis
// está dividida en dos niveles:
//
//   τ  ::= α | C | τ → τ | C τ ...        (monotipos)
//   σ  ::= τ | ∀α. σ                       (esquemas de tipo)
//
// Sólo el `let` introduce esquemas: el cuerpo de un λ recibe siempre
// un monotipo. Esa restricción es lo que mantiene decidible la
// inferencia (rank-1).
//
// Las expresiones son STLC + literales + `let` polimórfico + `letRec`
// (puntos fijos múltiples) + condicional `if`. La regla operacional
// es estándar; aquí sólo nos interesa el tipado.
//
// Convenciones de impresión:
//   - tvar usa el nombre crudo (α, β, t1, ...).
//   - tapp se imprime `C a b c` salvo el caso n=0 (`C`).
//   - arrow asocia a la derecha; con paréntesis si el dominio es
//     a su vez arrow o tapp con args.
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeEnv = exports.TStr = exports.TBool = exports.TInt = exports.eAppN = exports.eIf = exports.eLetRec = exports.eLet = exports.eLam = exports.eApp = exports.eLit = exports.eVar = exports.mono = exports.scheme = exports.tApp = exports.tArrow = exports.tConst = exports.tVar = void 0;
exports.typeFreeVars = typeFreeVars;
exports.schemeFreeVars = schemeFreeVars;
exports.typeToString = typeToString;
exports.schemeToString = schemeToString;
// ---------- Constructores convenientes ----------
/** Constructor de variable de tipo (e.g. `α`). */
const tVar = (name) => ({ kind: 'tvar', name });
exports.tVar = tVar;
/** Constructor de constante de tipo (e.g. `Int`, `Bool`). */
const tConst = (name) => ({ kind: 'tconst', name });
exports.tConst = tConst;
/** Constructor de tipo flecha: `from → to`. */
const tArrow = (from, to) => ({ kind: 'arrow', from, to });
exports.tArrow = tArrow;
/** Constructor de aplicación de constructor de tipo: `fn args...` (e.g. `List Int`). */
const tApp = (fn, ...args) => ({ kind: 'tapp', fn, args });
exports.tApp = tApp;
/** Crea un esquema polimórfico cuantificando las variables de `forall` sobre `body`. */
const scheme = (forall, body) => ({ forall, body });
exports.scheme = scheme;
/** Envuelve un monotipo como esquema sin variables cuantificadas. */
const mono = (body) => ({ forall: [], body });
exports.mono = mono;
/** Constructor de variable de expresión. */
const eVar = (name) => ({ kind: 'var', name });
exports.eVar = eVar;
/** Constructor de literal (número, booleano o string). */
const eLit = (value) => ({ kind: 'lit', value });
exports.eLit = eLit;
/** Constructor de aplicación de función: `fn arg`. */
const eApp = (fn, arg) => ({ kind: 'app', fn, arg });
exports.eApp = eApp;
/** Constructor de lambda: `λparam. body`. */
const eLam = (param, body) => ({ kind: 'lam', param, body });
exports.eLam = eLam;
/** Constructor de `let bind = value in body` (introduce polimorfismo). */
const eLet = (bind, value, body) => ({
    kind: 'let',
    bind,
    value,
    body,
});
exports.eLet = eLet;
/** Constructor de `let rec { defs } in body`: definiciones mutuamente recursivas. */
const eLetRec = (defs, body) => ({
    kind: 'letRec',
    defs,
    body,
});
exports.eLetRec = eLetRec;
/** Constructor de `if cond then then_ else else_`. */
const eIf = (cond, then_, else_) => ({
    kind: 'if',
    cond,
    then: then_,
    else: else_,
});
exports.eIf = eIf;
/** Aplica `fn` a múltiples argumentos de izquierda a derecha: `fn a b c` ≡ `eApp(eApp(fn,a),b,c)`. */
const eAppN = (fn, ...args) => args.reduce(exports.eApp, fn);
exports.eAppN = eAppN;
/** Tipo primitivo `Int`. */
exports.TInt = (0, exports.tConst)('Int');
/** Tipo primitivo `Bool`. */
exports.TBool = (0, exports.tConst)('Bool');
/** Tipo primitivo `String`. */
exports.TStr = (0, exports.tConst)('String');
// ---------- Variables libres de un Type / TypeScheme ----------
/** Recolecta las variables de tipo libres (no vinculadas) en `t`. */
function typeFreeVars(t, acc = new Set()) {
    switch (t.kind) {
        case 'tvar':
            acc.add(t.name);
            return acc;
        case 'tconst':
            return acc;
        case 'arrow':
            typeFreeVars(t.from, acc);
            typeFreeVars(t.to, acc);
            return acc;
        case 'tapp':
            for (const a of t.args)
                typeFreeVars(a, acc);
            return acc;
    }
}
/** Recolecta las variables de tipo libres en el cuerpo del esquema excluyendo las cuantificadas. */
function schemeFreeVars(s) {
    const fv = typeFreeVars(s.body);
    for (const b of s.forall)
        fv.delete(b);
    return fv;
}
// ---------- Impresión legible ----------
/** Serializa un tipo a una cadena legible con precedencias correctas para flechas y constructores. */
function typeToString(t) {
    switch (t.kind) {
        case 'tvar':
            return t.name;
        case 'tconst':
            return t.name;
        case 'arrow': {
            // type application asocia más fuerte que ->; sólo el dominio
            // siendo a su vez una flecha exige paréntesis.
            const lhs = t.from.kind === 'arrow' ? `(${typeToString(t.from)})` : typeToString(t.from);
            return `${lhs} -> ${typeToString(t.to)}`;
        }
        case 'tapp': {
            if (t.args.length === 0)
                return t.fn;
            // dentro de un tapp, cualquier argumento que sea arrow o tapp con args
            // necesita paréntesis para evitar ambigüedad (`List List a` vs `List (List a)`).
            const parts = t.args.map((a) => a.kind === 'arrow' || (a.kind === 'tapp' && a.args.length > 0)
                ? `(${typeToString(a)})`
                : typeToString(a));
            return `${t.fn} ${parts.join(' ')}`;
        }
    }
}
/** Serializa un esquema de tipo a su representación `forall α. T` o simplemente `T` si es mono. */
function schemeToString(s) {
    if (s.forall.length === 0)
        return typeToString(s.body);
    return `forall ${s.forall.join(' ')}. ${typeToString(s.body)}`;
}
// ---------- Entorno de tipos ----------
// Inmutable: extend() devuelve un nuevo TypeEnv que comparte estructura
// con el anterior. El test de `freeVars()` recorre todos los schemes
// para soportar generalización correcta.
/** Entorno de tipos inmutable. Mapea nombres de variables a sus esquemas polimórficos. */
class TypeEnv {
    bindings;
    constructor(bindings = new Map()) {
        this.bindings = bindings;
    }
    extend(name, sc) {
        const next = new Map(this.bindings);
        next.set(name, sc);
        return new TypeEnv(next);
    }
    extendMany(entries) {
        const next = new Map(this.bindings);
        for (const [n, s] of entries)
            next.set(n, s);
        return new TypeEnv(next);
    }
    lookup(name) {
        return this.bindings.get(name);
    }
    freeVars() {
        const acc = new Set();
        for (const sc of this.bindings.values()) {
            for (const v of schemeFreeVars(sc))
                acc.add(v);
        }
        return acc;
    }
}
exports.TypeEnv = TypeEnv;
//# sourceMappingURL=types.js.map