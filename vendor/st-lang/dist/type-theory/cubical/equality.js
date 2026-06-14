"use strict";
// ============================================================
// Cubical — α-equivalencia e igualdad definicional (αβ)
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.alphaEqCubical = alphaEqCubical;
exports.alphaBetaEqCubical = alphaBetaEqCubical;
const normalize_1 = require("./normalize");
const substitute_1 = require("./substitute");
let alphaCounter = 0;
function alphaEqCubical(a, b) {
    if (a.kind !== b.kind)
        return false;
    switch (a.kind) {
        case 'i0':
        case 'i1':
            return true;
        case 'universe':
            return a.level === b.level;
        case 'var':
        case 'iVar':
            return a.name === b.name;
        case 'iNeg':
            return alphaEqCubical(a.arg, b.arg);
        case 'iMin':
        case 'iMax': {
            const bb = b;
            return alphaEqCubical(a.left, bb.left) && alphaEqCubical(a.right, bb.right);
        }
        case 'pathP': {
            const bb = b;
            return (alphaEqCubical(a.family, bb.family) &&
                alphaEqCubical(a.left, bb.left) &&
                alphaEqCubical(a.right, bb.right));
        }
        case 'pLam': {
            const bb = b;
            if (a.bind === bb.bind)
                return alphaEqCubical(a.body, bb.body);
            const fresh = `__αc${alphaCounter++}`;
            return alphaEqCubical((0, substitute_1.substituteCubical)(a.body, a.bind, { kind: 'iVar', name: fresh }), (0, substitute_1.substituteCubical)(bb.body, bb.bind, { kind: 'iVar', name: fresh }));
        }
        case 'pApp': {
            const bb = b;
            return alphaEqCubical(a.path, bb.path) && alphaEqCubical(a.arg, bb.arg);
        }
        case 'glue': {
            const bb = b;
            return alphaEqCubical(a.equiv, bb.equiv) && alphaEqCubical(a.partial, bb.partial);
        }
        case 'pi': {
            const bb = b;
            if (!alphaEqCubical(a.domain, bb.domain))
                return false;
            if (a.bind === bb.bind)
                return alphaEqCubical(a.codomain, bb.codomain);
            const fresh = `__αc${alphaCounter++}`;
            return alphaEqCubical((0, substitute_1.substituteCubical)(a.codomain, a.bind, { kind: 'var', name: fresh }), (0, substitute_1.substituteCubical)(bb.codomain, bb.bind, { kind: 'var', name: fresh }));
        }
        case 'lam': {
            const bb = b;
            if (!alphaEqCubical(a.domain, bb.domain))
                return false;
            if (a.bind === bb.bind)
                return alphaEqCubical(a.body, bb.body);
            const fresh = `__αc${alphaCounter++}`;
            return alphaEqCubical((0, substitute_1.substituteCubical)(a.body, a.bind, { kind: 'var', name: fresh }), (0, substitute_1.substituteCubical)(bb.body, bb.bind, { kind: 'var', name: fresh }));
        }
        case 'app': {
            const bb = b;
            return alphaEqCubical(a.fn, bb.fn) && alphaEqCubical(a.arg, bb.arg);
        }
    }
}
function alphaBetaEqCubical(a, b) {
    return alphaEqCubical((0, normalize_1.normalizeCubical)(a), (0, normalize_1.normalizeCubical)(b));
}
//# sourceMappingURL=equality.js.map