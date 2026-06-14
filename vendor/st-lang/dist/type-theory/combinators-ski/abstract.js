"use strict";
// ============================================================
// Bracket abstraction: λ-cálculo → SKI
// ============================================================
//
// Algoritmo clásico de Curry para eliminar λ-abstracciones, traducido
// como `lambda x . T  ≡  [x] T` con las reglas:
//
//   [x] x         = I
//   [x] M         = K M             si x ∉ FV(M)
//   [x] (M N)     = S ([x] M) ([x] N)
//
// Es el llamado "algoritmo (abc)" — simple, no optimizado: produce
// términos grandes pero correctos. Hay variantes que aprovechan
// patrones como `[x] (M x) = M` (η) o introducen B, C, W, T, K' para
// reducir tamaño; aquí elegimos la canónica por claridad pedagógica.
//
// `toLambda` hace el camino inverso: codifica S, K, I como las
// λ-abstracciones que los definen. No pretende invertir
// `abstractFromLambda` exactamente — el round-trip es semántico
// (alpha/beta-eta equivalente), no sintáctico.
Object.defineProperty(exports, "__esModule", { value: true });
exports.abstractFromLambda = abstractFromLambda;
exports.toLambda = toLambda;
const types_1 = require("../lambda-calc/types");
const types_2 = require("./types");
// Convierte un λ-término a SKI puro (sólo S, K, I y variables libres).
function abstractFromLambda(t) {
    switch (t.kind) {
        case 'var':
            return (0, types_2.cvar)(t.name);
        case 'app':
            return { kind: 'app', fn: abstractFromLambda(t.fn), arg: abstractFromLambda(t.arg) };
        case 'abs': {
            // [param] body
            const inner = abstractFromLambda(t.body);
            return bracket(t.param, inner);
        }
    }
}
// [x] T  con T ya en SKI.
function bracket(x, t) {
    // [x] x = I
    if (t.kind === 'var' && t.name === x)
        return (0, types_2.I)();
    // [x] M  = K M     si x ∉ FV(M)
    if (!(0, types_2.freeVars)(t).has(x))
        return (0, types_2.app)((0, types_2.K)(), t);
    // En este punto t es necesariamente una aplicación: si fuese una
    // constante S/K/I no tendría FV, y si fuese `var` su nombre ≠ x ya
    // habría caído en la rama K. Mantengo el switch para que TS
    // narrowee y queden cubiertas las ramas restantes.
    switch (t.kind) {
        case 'app':
            // [x] (M N) = S ([x] M) ([x] N)
            return (0, types_2.app)((0, types_2.S)(), bracket(x, t.fn), bracket(x, t.arg));
        case 'var':
        case 'S':
        case 'K':
        case 'I':
            // Inalcanzable por las guardas previas; reproducimos K-rule
            // por defensa para no caer en undefined.
            return (0, types_2.app)((0, types_2.K)(), t);
    }
}
// SKI → λ-cálculo. Codifica S, K, I como sus definiciones lambda
// canónicas y deja las variables libres como variables. Útil para
// round-trip: el resultado, normalizado en λ, debe ser
// alpha-equivalente al término original aplicado a los mismos
// argumentos (la equivalencia es semántica, no sintáctica).
function toLambda(c) {
    switch (c.kind) {
        case 'I':
            // I = λx.x
            return (0, types_1.lam)('x', (0, types_1.v)('x'));
        case 'K':
            // K = λx.λy.x
            return (0, types_1.lam)('x', (0, types_1.lam)('y', (0, types_1.v)('x')));
        case 'S':
            // S = λx.λy.λz. x z (y z)
            return (0, types_1.lam)('x', (0, types_1.lam)('y', (0, types_1.lam)('z', (0, types_1.apN)((0, types_1.v)('x'), (0, types_1.v)('z'), (0, types_1.ap)((0, types_1.v)('y'), (0, types_1.v)('z'))))));
        case 'var':
            return (0, types_1.v)(c.name);
        case 'app':
            return (0, types_1.ap)(toLambda(c.fn), toLambda(c.arg));
    }
}
//# sourceMappingURL=abstract.js.map