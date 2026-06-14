"use strict";
// ============================================================
// ST Information Theory — Toolkit de entropías y divergencias
// ============================================================
//
// Sobre distribuciones simbólicas discretas (`Map<T, number>` con masa
// total ≈ 1) provee:
//
//   • Entropías: Shannon, Rényi(α), min, max, colisión.
//   • Divergencias: KL, JS, total-variation, Hellinger.
//   • Información mutua a partir de distribución conjunta.
//   • Cross-entropy y la relación H(p,q) = H(p) + KL(p ‖ q).
//
// Convenciones de borde:
//   • La probabilidad 0 contribuye 0 a la entropía (lim x·log x = 0).
//   • KL(p ‖ q) es +∞ si existe x con p(x) > 0 y q(x) = 0.
//   • La base por defecto del logaritmo es 2 (bits). También se aceptan
//     'e' (nats), 10 (hartleys/dits) y el alias 'log' = 2.
//   • Validamos con tolerancia EPS_DEFAULT antes de cualquier cómputo
//     que asuma normalización. `normalize` no se llama implícitamente
//     porque queremos que el usuario decida cuándo reescalar.
Object.defineProperty(exports, "__esModule", { value: true });
exports.support = support;
exports.isValidDistribution = isValidDistribution;
exports.normalize = normalize;
exports.shannonEntropy = shannonEntropy;
exports.renyiEntropy = renyiEntropy;
exports.minEntropy = minEntropy;
exports.maxEntropy = maxEntropy;
exports.collisionEntropy = collisionEntropy;
exports.klDivergence = klDivergence;
exports.jsDivergence = jsDivergence;
exports.tvDistance = tvDistance;
exports.hellingerDistance = hellingerDistance;
exports.crossEntropy = crossEntropy;
exports.jointToMarginals = jointToMarginals;
exports.mutualInformation = mutualInformation;
exports.conditionalEntropy = conditionalEntropy;
exports.chainRule = chainRule;
// Tolerancia por defecto para "suma ≈ 1" y comparaciones simétricas.
const EPS_DEFAULT = 1e-9;
// ------------------------------------------------------------
// Soporte y validación
// ------------------------------------------------------------
/** Devuelve los símbolos con probabilidad estrictamente positiva (soporte de `p`). */
function support(p) {
    const out = [];
    for (const [k, v] of p) {
        if (v > 0)
            out.push(k);
    }
    return out;
}
/** `true` si todas las probabilidades son ≥ 0, finitas y su suma difiere de 1 en menos de `eps`. */
function isValidDistribution(p, eps = EPS_DEFAULT) {
    let sum = 0;
    for (const v of p.values()) {
        if (!Number.isFinite(v) || v < 0)
            return false;
        sum += v;
    }
    return Math.abs(sum - 1) <= eps;
}
/**
 * Reescala la distribución `p` para que su masa sea 1.
 * @throws si alguna probabilidad es inválida o la masa total es 0.
 */
function normalize(p) {
    let sum = 0;
    for (const v of p.values()) {
        if (!Number.isFinite(v) || v < 0) {
            throw new Error('normalize: probabilidad inválida (negativa, NaN o infinita)');
        }
        sum += v;
    }
    if (sum === 0) {
        throw new Error('normalize: distribución con masa total 0');
    }
    const out = new Map();
    for (const [k, v] of p) {
        out.set(k, v / sum);
    }
    return out;
}
function logIn(base) {
    switch (base) {
        case 'e':
            return Math.log;
        case 10:
            return Math.log10;
        case 2:
        case 'log':
        default:
            return Math.log2;
    }
}
// ------------------------------------------------------------
// Entropías
// ------------------------------------------------------------
/** Entropía de Shannon: H(p) = −Σ p(x)·log p(x). Convención: 0·log 0 = 0. */
function shannonEntropy(p, base = 2) {
    const log = logIn(base);
    let h = 0;
    for (const v of p.values()) {
        if (v > 0) {
            h -= v * log(v);
        }
    }
    return h;
}
/**
 * Entropía de Rényi de orden `alpha` (α ≥ 0): H_α(p) = 1/(1−α)·log Σ p(x)^α.
 * Límites: α=0 → max-entropy, α=1 → Shannon, α=2 → colisión, α→∞ → min-entropy.
 * @throws si `alpha` es negativo o no finito.
 */
function renyiEntropy(p, alpha, base = 2) {
    if (!Number.isFinite(alpha) || alpha < 0) {
        throw new Error('renyiEntropy: α debe ser finito y ≥ 0');
    }
    if (alpha === 1)
        return shannonEntropy(p, base);
    if (alpha === 0)
        return maxEntropy(p, base);
    const log = logIn(base);
    let s = 0;
    for (const v of p.values()) {
        if (v > 0)
            s += Math.pow(v, alpha);
    }
    if (s === 0)
        return 0;
    return log(s) / (1 - alpha);
}
/** Min-entropy: −log max_x p(x). Mide la peor predictibilidad en un solo intento. */
function minEntropy(p, base = 2) {
    const log = logIn(base);
    let max = 0;
    for (const v of p.values()) {
        if (v > max)
            max = v;
    }
    if (max === 0)
        return 0;
    return -log(max);
}
/** Max-entropy (Hartley): log|soporte(p)|, el logaritmo del tamaño del soporte estricto. */
function maxEntropy(p, base = 2) {
    const log = logIn(base);
    const n = support(p).length;
    if (n === 0)
        return 0;
    return log(n);
}
/** Entropía de colisión: Rényi α=2 = −log Σ p(x)². Mide la probabilidad de dos muestras iguales. */
function collisionEntropy(p, base = 2) {
    const log = logIn(base);
    let s = 0;
    for (const v of p.values()) {
        if (v > 0)
            s += v * v;
    }
    if (s === 0)
        return 0;
    return -log(s);
}
// ------------------------------------------------------------
// Divergencias y distancias
// ------------------------------------------------------------
/** Divergencia KL: KL(p ‖ q) = Σ p(x)·log(p(x)/q(x)). Devuelve +∞ si p(x)>0 y q(x)=0. */
function klDivergence(p, q, base = 2) {
    const log = logIn(base);
    let d = 0;
    for (const [k, px] of p) {
        if (px === 0)
            continue;
        const qx = q.get(k) ?? 0;
        if (qx === 0)
            return Number.POSITIVE_INFINITY;
        d += px * log(px / qx);
    }
    return d;
}
/** Divergencia Jensen-Shannon: JS(p,q) = ½ KL(p ‖ m) + ½ KL(q ‖ m), m = ½(p+q). Simétrica, ∈ [0, log 2]. */
function jsDivergence(p, q, base = 2) {
    const m = new Map();
    for (const [k, v] of p)
        m.set(k, (m.get(k) ?? 0) + v);
    for (const [k, v] of q)
        m.set(k, (m.get(k) ?? 0) + v);
    // m = p + q; dividimos por 2 para obtener la mezcla.
    for (const [k, v] of m)
        m.set(k, v / 2);
    return 0.5 * klDivergence(p, m, base) + 0.5 * klDivergence(q, m, base);
}
/** Distancia de variación total: TV(p,q) = ½ Σ |p(x) − q(x)|. ∈ [0, 1]. */
function tvDistance(p, q) {
    const keys = new Set();
    for (const k of p.keys())
        keys.add(k);
    for (const k of q.keys())
        keys.add(k);
    let s = 0;
    for (const k of keys) {
        s += Math.abs((p.get(k) ?? 0) - (q.get(k) ?? 0));
    }
    return s / 2;
}
/** Distancia de Hellinger: H(p,q) = (1/√2)·√(Σ (√p(x) − √q(x))²). ∈ [0, 1]; 0 ⟺ p = q; 1 ⟺ soportes disjuntos. */
function hellingerDistance(p, q) {
    const keys = new Set();
    for (const k of p.keys())
        keys.add(k);
    for (const k of q.keys())
        keys.add(k);
    let s = 0;
    for (const k of keys) {
        const a = Math.sqrt(p.get(k) ?? 0);
        const b = Math.sqrt(q.get(k) ?? 0);
        const d = a - b;
        s += d * d;
    }
    return Math.sqrt(s) / Math.SQRT2;
}
// ------------------------------------------------------------
// Cross-entropy
// ------------------------------------------------------------
/** Cross-entropía: H(p,q) = −Σ p(x)·log q(x) = H(p) + KL(p ‖ q). Devuelve +∞ si p(x)>0 y q(x)=0. */
function crossEntropy(p, q, base = 2) {
    const log = logIn(base);
    let h = 0;
    for (const [k, px] of p) {
        if (px === 0)
            continue;
        const qx = q.get(k) ?? 0;
        if (qx === 0)
            return Number.POSITIVE_INFINITY;
        h -= px * log(qx);
    }
    return h;
}
// ------------------------------------------------------------
// Distribuciones conjuntas e información mutua
// ------------------------------------------------------------
/** Proyecta la distribución conjunta `j` sobre cada eje, devolviendo las marginales `X` e `Y`. */
function jointToMarginals(j) {
    const mX = new Map();
    const mY = new Map();
    for (const [pair, v] of j) {
        const x = pair[0];
        const y = pair[1];
        mX.set(x, (mX.get(x) ?? 0) + v);
        mY.set(y, (mY.get(y) ?? 0) + v);
    }
    return { X: mX, Y: mY };
}
// H(X, Y): entropía conjunta directa sobre la distribución del par.
function jointEntropy(j, base) {
    const log = logIn(base);
    let h = 0;
    for (const v of j.values()) {
        if (v > 0)
            h -= v * log(v);
    }
    return h;
}
/** Información mutua I(X;Y) = Σ p(x,y)·log(p(x,y)/(p(x)·p(y))) = H(X) + H(Y) − H(X,Y). */
function mutualInformation(j, base = 2) {
    const log = logIn(base);
    const { X: mX, Y: mY } = jointToMarginals(j);
    let mi = 0;
    for (const [pair, pxy] of j) {
        if (pxy <= 0)
            continue;
        const px = mX.get(pair[0]) ?? 0;
        const py = mY.get(pair[1]) ?? 0;
        if (px === 0 || py === 0)
            continue;
        mi += pxy * log(pxy / (px * py));
    }
    // Por estabilidad numérica forzamos no-negatividad estricta (puede
    // dar -1e-16 por redondeo en distribuciones independientes).
    return mi < 0 && mi > -1e-12 ? 0 : mi;
}
/** Entropía condicional H(X|Y) o H(Y|X) según `condOn`. H(X|Y) = H(X,Y) − H(Y) ≥ 0. */
function conditionalEntropy(j, condOn, base = 2) {
    const hXY = jointEntropy(j, base);
    const { X: mX, Y: mY } = jointToMarginals(j);
    const hX = shannonEntropy(mX, base);
    const hY = shannonEntropy(mY, base);
    const out = condOn === 'X' ? hXY - hY : hXY - hX;
    return out < 0 && out > -1e-12 ? 0 : out;
}
/**
 * Devuelve los cuatro escalares {hX, hY, hXY, iXY} de la regla de la cadena.
 * Verifica: H(X,Y) = H(X) + H(Y) − I(X;Y).
 */
function chainRule(j, base = 2) {
    const { X: mX, Y: mY } = jointToMarginals(j);
    return {
        hX: shannonEntropy(mX, base),
        hY: shannonEntropy(mY, base),
        hXY: jointEntropy(j, base),
        iXY: mutualInformation(j, base),
    };
}
//# sourceMappingURL=index.js.map