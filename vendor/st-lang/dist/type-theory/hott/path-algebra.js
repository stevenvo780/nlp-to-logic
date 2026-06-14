"use strict";
// ============================================================
// HoTT — Álgebra de caminos (grupoide ∞)
// ============================================================
//
// Operaciones de alto nivel para construir caminos sin tocar el AST
// directamente, con normalización inmediata de identidades (refl).
Object.defineProperty(exports, "__esModule", { value: true });
exports.refl = refl;
exports.pathInverse = pathInverse;
exports.pathCompose = pathCompose;
exports.isHEquivalence = isHEquivalence;
exports.univalence = univalence;
exports.univalenceWitness = univalenceWitness;
const normalize_1 = require("./normalize");
const infer_1 = require("./infer");
const equality_1 = require("./equality");
function refl(x) {
    return { kind: 'refl', term: x };
}
function pathInverse(path) {
    // Aplicar la β-rule directamente en el constructor para mantener
    // refl como punto fijo del grupo.
    if (path.kind === 'refl')
        return path;
    if (path.kind === 'pathSym')
        return path.path; // involutividad
    return { kind: 'pathSym', path };
}
function pathCompose(p, q) {
    if (p.kind === 'refl')
        return q;
    if (q.kind === 'refl')
        return p;
    return { kind: 'pathConcat', left: p, right: q };
}
/**
 * Chequeo heurístico de h-equivalencia.
 * Una equivalencia verdadera requiere isContr de las fibras, que aquí
 * NO computamos. Aceptamos pares ⟨A, B⟩ : Σ Type. Type con A αβ= B
 * (equivalencia trivial), o cualquier término marcado explícitamente
 * con la estructura ⟨f, ⟨g, ⟨α, β⟩⟩⟩ y posponemos verificación.
 */
function isHEquivalence(f, ctx) {
    const t = (0, infer_1.inferType)(f, ctx);
    if ((0, infer_1.isInferErrorHoTT)(t))
        return false;
    const n = (0, normalize_1.normalizeHoTT)(t);
    // Caso pedagógico mínimo: equivalencia trivial id : A → A.
    if (n.kind === 'pi') {
        return (0, equality_1.alphaBetaEqHoTT)(n.domain, n.codomain);
    }
    // Σ-empaquetado: aceptamos cualquier sigma como candidato.
    return n.kind === 'sigma';
}
/**
 * Postula un path desde una equivalencia. No es computacional:
 * normalizar `transport(P, ua(e), x)` no reduce — eso requiere
 * cubical type theory.
 */
function univalence(equiv) {
    return { kind: 'ua', equiv };
}
function univalenceWitness(equiv) {
    return { equiv, path: univalence(equiv) };
}
//# sourceMappingURL=path-algebra.js.map