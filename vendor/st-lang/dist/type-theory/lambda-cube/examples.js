"use strict";
// ============================================================
// Lambda Cube — Términos canónicos
// ============================================================
//
// Construcciones clásicas de cada vértice del cubo. Cada función
// devuelve un `CubeTerm` directamente; el tipo correspondiente es
// inferible con `inferType` en el sistema apropiado.
Object.defineProperty(exports, "__esModule", { value: true });
exports.polymorphicIdentity = polymorphicIdentity;
exports.polymorphicIdentityType = polymorphicIdentityType;
exports.churchNumeral = churchNumeral;
exports.churchNumeralType = churchNumeralType;
exports.churchPairType = churchPairType;
exports.dependentList = dependentList;
exports.predicateOverNat = predicateOverNat;
exports.typeLevelIdentity = typeLevelIdentity;
exports.typeLevelIdentityKind = typeLevelIdentityKind;
exports.cocPolyIdentityType = cocPolyIdentityType;
const types_1 = require("./types");
/**
 * Identidad polimórfica: λ X:*. λ x:X. x  ∈ λ2.
 * Tipo: Π X:*. X → X.
 */
function polymorphicIdentity() {
    return (0, types_1.cLam)('X', types_1.cStar, (0, types_1.cLam)('x', (0, types_1.cVar)('X'), (0, types_1.cVar)('x')));
}
/** Tipo de la identidad polimórfica: Π X:*. X → X. */
function polymorphicIdentityType() {
    return (0, types_1.cPi)('X', types_1.cStar, (0, types_1.cArrow)((0, types_1.cVar)('X'), (0, types_1.cVar)('X')));
}
/**
 * Encoding Church de un natural `n` en System F:
 *     n = λ X:*. λ s:X→X. λ z:X. s (s (... (s z) ...))   con n aplicaciones
 *
 * Tipo: Π X:*. (X → X) → X → X.
 */
function churchNumeral(n) {
    if (!Number.isInteger(n) || n < 0) {
        throw new Error(`churchNumeral requiere natural ≥ 0, recibió ${n}`);
    }
    const X = (0, types_1.cVar)('X');
    let body = (0, types_1.cVar)('z');
    for (let i = 0; i < n; i++) {
        body = (0, types_1.cApp)((0, types_1.cVar)('s'), body);
    }
    return (0, types_1.cLam)('X', types_1.cStar, (0, types_1.cLam)('s', (0, types_1.cArrow)(X, X), (0, types_1.cLam)('z', X, body)));
}
/** Tipo de un natural Church: Π X:*. (X → X) → X → X. */
function churchNumeralType() {
    const X = (0, types_1.cVar)('X');
    return (0, types_1.cPi)('X', types_1.cStar, (0, types_1.cArrow)((0, types_1.cArrow)(X, X), (0, types_1.cArrow)(X, X)));
}
/**
 * Tipo polimórfico de pares: Π A:*. Π B:*. (Π C:*. (A → B → C) → C) → ...
 * En la versión sencilla devolvemos solo el tipo de "Pair A B":
 *
 *   Π A:*. Π B:*. Π C:*. (A → B → C) → C
 */
function churchPairType() {
    const A = (0, types_1.cVar)('A');
    const B = (0, types_1.cVar)('B');
    const C = (0, types_1.cVar)('C');
    return (0, types_1.cPi)('A', types_1.cStar, (0, types_1.cPi)('B', types_1.cStar, (0, types_1.cPi)('C', types_1.cStar, (0, types_1.cArrow)((0, types_1.cArrow)(A, (0, types_1.cArrow)(B, C)), C))));
}
/**
 * Esquema de "lista dependiente": dado un tipo de vectores indexado
 * por `Nat`, devolvemos el Π típico
 *
 *   Π n : Nat. Vector n
 *
 * Requiere que el contexto declare `Nat : *` y `Vector : Nat → *`.
 * Atención: ambos extremos son `*`, así que esta Π usa la regla
 * (*,*) y queda legal incluso en λ→ una vez que `Vector` está en el
 * contexto. El sabor "dependiente" viene del hecho de que el
 * codominio menciona el binder `n`.
 */
function dependentList() {
    return (0, types_1.cPi)('n', (0, types_1.cVar)('Nat'), (0, types_1.cApp)((0, types_1.cVar)('Vector'), (0, types_1.cVar)('n')));
}
/**
 * Predicado sobre `Nat`: `Π n:Nat. *`. Domino `Nat : *` y codominio
 * `*` (cuyo sort es `◻`). Esa es justo la formación (*,◻) — exclusiva
 * de los vértices con tipos dependientes (λP, λP2, λPω, λC).
 *
 * Requiere `Nat : *` en el contexto.
 */
function predicateOverNat() {
    return (0, types_1.cPi)('n', (0, types_1.cVar)('Nat'), types_1.cStar);
}
/**
 * Operador de tipo `id-type`: λ A:*. A → A  en λω.
 * Tipo: * → *.
 */
function typeLevelIdentity() {
    return (0, types_1.cLam)('A', types_1.cStar, (0, types_1.cArrow)((0, types_1.cVar)('A'), (0, types_1.cVar)('A')));
}
/** Tipo del operador `typeLevelIdentity`: * → *. */
function typeLevelIdentityKind() {
    return (0, types_1.cArrow)(types_1.cStar, types_1.cStar);
}
/**
 * En el Calculus of Constructions, el tipo polimórfico
 *   Π A:*. A → A
 * vive en el universo `*`.
 */
function cocPolyIdentityType() {
    return (0, types_1.cPi)('A', types_1.cStar, (0, types_1.cArrow)((0, types_1.cVar)('A'), (0, types_1.cVar)('A')));
}
//# sourceMappingURL=examples.js.map