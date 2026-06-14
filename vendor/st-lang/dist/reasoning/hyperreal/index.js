"use strict";
// ============================================================
// ST Hyperreal — Lógica probabilística con infinitesimales
// ============================================================
// Modela valores como números hiperreales de primer orden:
//
//   x = standard + infinitesimal · ε
//
// donde ε es un infinitesimal formal con ε² ≈ 0. Esto permite:
//   • distinguir 1 y 1 + ε (probabilidad "casi 1" pero no exacta).
//   • razonar sobre diferencias infinitamente pequeñas sin colapsar
//     al límite estándar.
//   • propagar incertidumbre con cotas inferior/superior conservadoras
//     bajo operadores booleanos probabilísticos.
//
// Aritmética (sólo primer orden en ε; los términos ε² se descartan):
//   (a_s + a_i ε) + (b_s + b_i ε) = (a_s + b_s) + (a_i + b_i) ε
//   (a_s + a_i ε) - (b_s + b_i ε) = (a_s - b_s) + (a_i - b_i) ε
//   (a_s + a_i ε) · (b_s + b_i ε) = a_s b_s + (a_s b_i + a_i b_s) ε
//                                    [+ a_i b_i ε² → 0]
//
// Orden total (lexicográfico standard primero, después infinitesimal):
//   a < b  ⇔  a_s < b_s  ∨  (a_s = b_s ∧ a_i < b_i)
//
// Lógica probabilística hiperreal:
//   p ∧ q = p · q
//   p ∨ q = p + q − p·q       (inclusión-exclusión)
//   ¬p     = 1 − p
//   p → q = ¬p ∨ q = 1 − p + p·q
//
// Propagación de cotas [lower, upper]:
//   AND y OR son monótonas crecientes en ambas variables.
//   NOT invierte y refleja la cota.
//   IMPLIES es decreciente en p y creciente en q ⇒ la cota inferior
//   sale del lado conservador (upper_p, lower_q) y viceversa.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.HR_EPSILON = exports.HR_ONE = exports.HR_ZERO = void 0;
exports.hr = hr;
exports.add = add;
exports.sub = sub;
exports.mul = mul;
exports.compare = compare;
exports.eq = eq;
exports.lt = lt;
exports.gt = gt;
exports.hrAnd = hrAnd;
exports.hrOr = hrOr;
exports.hrNot = hrNot;
exports.hrImplies = hrImplies;
exports.bound = bound;
exports.propagate = propagate;
exports.hrToString = hrToString;
/**
 * Constructs a {@link Hyperreal} from its standard and optional infinitesimal parts.
 * `hr(x)` produces the standard real `x + 0ε`.
 */
function hr(standard, infinitesimal = 0) {
    return { standard, infinitesimal };
}
/** The hyperreal zero: 0 + 0ε. */
exports.HR_ZERO = { standard: 0, infinitesimal: 0 };
/** The hyperreal one: 1 + 0ε. */
exports.HR_ONE = { standard: 1, infinitesimal: 0 };
/** The formal infinitesimal ε: 0 + 1ε. */
exports.HR_EPSILON = { standard: 0, infinitesimal: 1 };
// ── Aritmética ──────────────────────────────────────────────
/** Returns `a + b` (component-wise addition). */
function add(a, b) {
    return {
        standard: a.standard + b.standard,
        infinitesimal: a.infinitesimal + b.infinitesimal,
    };
}
/** Returns `a - b` (component-wise subtraction). */
function sub(a, b) {
    return {
        standard: a.standard - b.standard,
        infinitesimal: a.infinitesimal - b.infinitesimal,
    };
}
/**
 * Returns `a * b`, discarding O(ε²) terms:
 * `(a.s + a.i ε)(b.s + b.i ε) = a.s·b.s + (a.s·b.i + a.i·b.s)·ε`.
 */
function mul(a, b) {
    // (a.s + a.i ε)(b.s + b.i ε) = a.s·b.s + (a.s·b.i + a.i·b.s)·ε + O(ε²)
    return {
        standard: a.standard * b.standard,
        infinitesimal: a.standard * b.infinitesimal + a.infinitesimal * b.standard,
    };
}
/**
 * Compara dos hiperreales lexicográficamente: primero la parte estándar,
 * luego la infinitesimal. Devuelve -1, 0 o 1.
 *
 * Usa una tolerancia ínfima sobre las componentes para absorber el ruido
 * de coma flotante; los infinitesimales formales no se ven afectados
 * porque su magnitud es de orden O(1) en el coeficiente.
 */
function compare(a, b) {
    const EPS = 1e-12;
    const ds = a.standard - b.standard;
    if (ds > EPS)
        return 1;
    if (ds < -EPS)
        return -1;
    const di = a.infinitesimal - b.infinitesimal;
    if (di > EPS)
        return 1;
    if (di < -EPS)
        return -1;
    return 0;
}
/** Returns `true` when `a` and `b` are equal under the lexicographic order. */
function eq(a, b) {
    return compare(a, b) === 0;
}
/** Returns `true` when `a < b` in the hyperreal order. */
function lt(a, b) {
    return compare(a, b) < 0;
}
/** Returns `true` when `a > b` in the hyperreal order. */
function gt(a, b) {
    return compare(a, b) > 0;
}
// ── Lógica probabilística hiperreal ─────────────────────────
/** Probabilistic AND: `p ∧ q = p · q`. */
function hrAnd(p, q) {
    return mul(p, q);
}
/** Probabilistic OR (inclusion-exclusion): `p ∨ q = p + q − p·q`. */
function hrOr(p, q) {
    return sub(add(p, q), mul(p, q));
}
/** Probabilistic NOT: `¬p = 1 − p`. */
function hrNot(p) {
    return sub(exports.HR_ONE, p);
}
/** Probabilistic implication: `p → q = ¬p ∨ q`. */
function hrImplies(p, q) {
    // p → q ≡ ¬p ∨ q
    return hrOr(hrNot(p), q);
}
/**
 * Constructs a validated {@link UncertaintyBound}.
 * @throws When `lower > upper` in the hyperreal order.
 */
function bound(lower, upper) {
    if (compare(lower, upper) > 0) {
        throw new Error(`UncertaintyBound inválido: lower (${lower.standard}+${lower.infinitesimal}ε) > upper (${upper.standard}+${upper.infinitesimal}ε)`);
    }
    return { lower, upper };
}
/**
 * Propaga una operación lógica sobre cotas de incertidumbre.
 *
 * - `and`/`or` requieren `other`; ambas operaciones son monótonas en
 *   sus dos argumentos, por lo que la cota se obtiene aplicando la
 *   operación a (lower, lower) y (upper, upper) respectivamente.
 * - `not` invierte la cota: ¬[a, b] = [1 − b, 1 − a].
 * - `implies` requiere `other`. p → q es decreciente en p y creciente
 *   en q ⇒ lower = (upper_p → lower_q), upper = (lower_p → upper_q).
 */
function propagate(b, op, other) {
    switch (op) {
        case 'and': {
            if (!other)
                throw new Error("propagate('and') requiere el segundo operando");
            return {
                lower: hrAnd(b.lower, other.lower),
                upper: hrAnd(b.upper, other.upper),
            };
        }
        case 'or': {
            if (!other)
                throw new Error("propagate('or') requiere el segundo operando");
            return {
                lower: hrOr(b.lower, other.lower),
                upper: hrOr(b.upper, other.upper),
            };
        }
        case 'not': {
            return {
                lower: hrNot(b.upper),
                upper: hrNot(b.lower),
            };
        }
        case 'implies': {
            if (!other)
                throw new Error("propagate('implies') requiere el segundo operando");
            return {
                lower: hrImplies(b.upper, other.lower),
                upper: hrImplies(b.lower, other.upper),
            };
        }
    }
}
// ── Utilidades de depuración ────────────────────────────────
/** Returns a human-readable string like `"0.9 + 3ε"` or `"1"` (when infinitesimal is 0). */
function hrToString(x) {
    if (x.infinitesimal === 0)
        return `${x.standard}`;
    const sign = x.infinitesimal >= 0 ? '+' : '-';
    const mag = Math.abs(x.infinitesimal);
    return `${x.standard} ${sign} ${mag}ε`;
}
//# sourceMappingURL=index.js.map