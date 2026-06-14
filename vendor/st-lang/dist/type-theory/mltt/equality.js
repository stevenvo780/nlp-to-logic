"use strict";
// ============================================================
// MLTT — α-equivalencia y igualdad definicional (αβ-equality)
// ============================================================
//
// Igualdad definicional ≡ normalizamos ambos lados (β + ι) y
// comparamos módulo α-renombrado de binders.
Object.defineProperty(exports, "__esModule", { value: true });
exports.alphaEq = alphaEq;
exports.alphaBetaEq = alphaBetaEq;
const normalize_1 = require("./normalize");
const substitute_1 = require("./substitute");
/** α-equivalencia estructural sobre términos (no normaliza). */
function alphaEq(a, b) {
    if (a.kind !== b.kind)
        return false;
    switch (a.kind) {
        case 'var':
            return a.name === b.name;
        case 'universe':
            return a.level === b.level;
        case 'nat':
        case 'zero':
            return true;
        case 'succ':
            return alphaEq(a.arg, b.arg);
        case 'app': {
            const bb = b;
            return alphaEq(a.fn, bb.fn) && alphaEq(a.arg, bb.arg);
        }
        case 'pair': {
            const bb = b;
            return alphaEq(a.fst, bb.fst) && alphaEq(a.snd, bb.snd);
        }
        case 'fst':
        case 'snd': {
            const bb = b;
            return alphaEq(a.pair, bb.pair);
        }
        case 'identity': {
            const bb = b;
            return alphaEq(a.type, bb.type) && alphaEq(a.left, bb.left) && alphaEq(a.right, bb.right);
        }
        case 'refl':
            return alphaEq(a.term, b.term);
        case 'pi':
        case 'sigma': {
            const bb = b;
            const aDom = a.kind === 'pi' ? a.domain : a.first;
            const bDom = bb.kind === 'pi' ? bb.domain : bb.first;
            const aCod = a.kind === 'pi' ? a.codomain : a.second;
            const bCod = bb.kind === 'pi' ? bb.codomain : bb.second;
            if (!alphaEq(aDom, bDom))
                return false;
            if (a.bind === bb.bind)
                return alphaEq(aCod, bCod);
            const fresh = `__α${alphaCounter++}`;
            return alphaEq((0, substitute_1.substitute)(aCod, a.bind, { kind: 'var', name: fresh }), (0, substitute_1.substitute)(bCod, bb.bind, { kind: 'var', name: fresh }));
        }
        case 'lam': {
            const bb = b;
            if (!alphaEq(a.domain, bb.domain))
                return false;
            if (a.bind === bb.bind)
                return alphaEq(a.body, bb.body);
            const fresh = `__α${alphaCounter++}`;
            return alphaEq((0, substitute_1.substitute)(a.body, a.bind, { kind: 'var', name: fresh }), (0, substitute_1.substitute)(bb.body, bb.bind, { kind: 'var', name: fresh }));
        }
    }
}
let alphaCounter = 0;
/**
 * Igualdad αβ (definicional): normaliza ambos y luego compara α.
 * `ctx` reservado para implementaciones futuras (η, definitional unfolding).
 */
function alphaBetaEq(a, b, _ctx) {
    return alphaEq((0, normalize_1.normalize)(a), (0, normalize_1.normalize)(b));
}
//# sourceMappingURL=equality.js.map