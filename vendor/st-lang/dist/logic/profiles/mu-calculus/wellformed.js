"use strict";
// ============================================================
// μ-calculus — well-formedness y alternation depth
// ============================================================
// Una fórmula μ-cálculo es bien formada cuando:
//   1. Es "cerrada": cada `var` ligada referencia un `μ`/`ν` que la
//      envuelve sintácticamente.
//   2. Es "positiva": cada variable ligada aparece bajo un número PAR
//      de negaciones desde su binder. Esto garantiza monotonía del
//      funcional asociado y la existencia de los puntos fijos por
//      Knaster-Tarski.
//
// Alternation depth: máxima profundidad de anidamiento alternante
// μ/ν con variables libres del binder externo. Aproximación estándar
// (Niwiński/Emerson-Lei): si el body de un μX contiene νY donde Y
// depende sintácticamente de X (o viceversa), la profundidad sube.
// Aquí usamos la versión sintáctica simple: cuento bindings μ/ν
// distintos en el camino raíz→hoja, contando saltos μ↔ν.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWellFormed = isWellFormed;
exports.freeVars = freeVars;
exports.isClosed = isClosed;
exports.isPositive = isPositive;
exports.alternationDepth = alternationDepth;
/**
 * Verifica que una fórmula sea sintácticamente bien formada:
 *  - Cerrada (sin variables libres).
 *  - Positiva en cada variable ligada (paridad par de negaciones).
 *  - Sin shadowing nocivo: rebindings ocultan al outer, lo cual es
 *    legal pero detectable. Aquí lo permitimos.
 */
function isWellFormed(phi) {
    return isClosed(phi) && isPositive(phi);
}
/** Variables libres del término. */
function freeVars(phi) {
    const out = new Set();
    collectFree(phi, new Set(), out);
    return out;
}
function collectFree(phi, bound, out) {
    switch (phi.kind) {
        case 'atom':
            return;
        case 'var':
            if (!bound.has(phi.name))
                out.add(phi.name);
            return;
        case 'not':
            collectFree(phi.arg, bound, out);
            return;
        case 'and':
        case 'or':
            collectFree(phi.left, bound, out);
            collectFree(phi.right, bound, out);
            return;
        case 'box':
        case 'diamond':
            collectFree(phi.arg, bound, out);
            return;
        case 'mu':
        case 'nu': {
            const nextBound = new Set(bound);
            nextBound.add(phi.bind);
            collectFree(phi.body, nextBound, out);
            return;
        }
    }
}
/** Una fórmula es cerrada cuando no tiene variables libres. */
function isClosed(phi) {
    return freeVars(phi).size === 0;
}
/**
 * Una fórmula es positiva cuando toda `var X` ligada por un μ/ν
 * aparece bajo un número par de negaciones desde su binder.
 *
 * Implementación: caminamos el AST con un map `binder → paridad`
 * (0 = par, 1 = impar) que se actualiza al cruzar un `not`. Cuando
 * vemos `var X`, miramos su binder más cercano y verificamos que
 * su paridad relativa sea par.
 */
function isPositive(phi) {
    return checkPositive(phi, new Map(), 0);
}
function checkPositive(phi, parityAt, parityHere) {
    switch (phi.kind) {
        case 'atom':
            return true;
        case 'var': {
            const parityAtBinder = parityAt.get(phi.name);
            if (parityAtBinder === undefined) {
                // Variable libre: no es responsabilidad de positividad detectarlo.
                return true;
            }
            // Paridad relativa = (parityHere - parityAtBinder) mod 2.
            return (parityHere - parityAtBinder) % 2 === 0;
        }
        case 'not':
            return checkPositive(phi.arg, parityAt, (parityHere + 1) % 2);
        case 'and':
        case 'or':
            return (checkPositive(phi.left, parityAt, parityHere) &&
                checkPositive(phi.right, parityAt, parityHere));
        case 'box':
        case 'diamond':
            return checkPositive(phi.arg, parityAt, parityHere);
        case 'mu':
        case 'nu': {
            const next = new Map(parityAt);
            next.set(phi.bind, parityHere);
            return checkPositive(phi.body, next, parityHere);
        }
    }
}
/**
 * Profundidad de alternancia μ/ν. Métrica clásica:
 *   ad(p) = ad(X) = 0
 *   ad(¬φ) = ad(◇φ) = ad(□φ) = ad(φ)
 *   ad(φ ∧ ψ) = ad(φ ∨ ψ) = max(ad(φ), ad(ψ))
 *   ad(μX. φ) = max(1, ad(φ), 1 + maxNuAlt(φ))
 *   ad(νX. φ) = max(1, ad(φ), 1 + maxMuAlt(φ))
 * donde `maxNuAlt(φ)` es la profundidad considerando solo subfórmulas
 * con binder ν cuyo cuerpo menciona la variable ligada externamente,
 * y simétrico para μ.
 *
 * Aquí usamos la versión simplificada y muy usada en práctica
 * (Cleaveland/Steffen): contar el cambio de tipo de binder en el
 * camino sintáctico raíz→hoja.
 */
function alternationDepth(phi) {
    return computeDepth(phi, null);
}
function computeDepth(phi, lastBinder) {
    switch (phi.kind) {
        case 'atom':
        case 'var':
            return 0;
        case 'not':
        case 'box':
        case 'diamond':
            return computeDepth(phi.arg, lastBinder);
        case 'and':
        case 'or':
            return Math.max(computeDepth(phi.left, lastBinder), computeDepth(phi.right, lastBinder));
        case 'mu': {
            const inner = computeDepth(phi.body, 'mu');
            // Mismo tipo de binder consecutivo: pertenece al mismo "segmento"
            // y no aporta alternancia adicional. Cambio (o segmento inicial)
            // suma 1 nivel al conteo del cuerpo.
            return lastBinder === 'mu' ? inner : 1 + inner;
        }
        case 'nu': {
            const inner = computeDepth(phi.body, 'nu');
            return lastBinder === 'nu' ? inner : 1 + inner;
        }
    }
}
//# sourceMappingURL=wellformed.js.map