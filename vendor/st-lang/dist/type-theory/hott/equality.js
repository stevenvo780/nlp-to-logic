"use strict";
// ============================================================
// HoTT — α-equivalencia e igualdad definicional (αβ)
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.alphaEqHoTT = alphaEqHoTT;
exports.alphaBetaEqHoTT = alphaBetaEqHoTT;
const normalize_1 = require("./normalize");
const substitute_1 = require("./substitute");
let alphaCounter = 0;
function alphaEqHoTT(a, b) {
    if (a.kind !== b.kind)
        return false;
    switch (a.kind) {
        case 'var':
            return a.name === b.name;
        case 'universe':
            return a.level === b.level;
        case 'nat':
        case 'zero':
        case 'circle':
        case 'baseOfCircle':
        case 'loopOfCircle':
            return true;
        case 'succ':
            return alphaEqHoTT(a.arg, b.arg);
        case 'app': {
            const bb = b;
            return alphaEqHoTT(a.fn, bb.fn) && alphaEqHoTT(a.arg, bb.arg);
        }
        case 'pair': {
            const bb = b;
            return alphaEqHoTT(a.fst, bb.fst) && alphaEqHoTT(a.snd, bb.snd);
        }
        case 'fst':
        case 'snd': {
            const bb = b;
            return alphaEqHoTT(a.pair, bb.pair);
        }
        case 'path': {
            const bb = b;
            return (alphaEqHoTT(a.type, bb.type) &&
                alphaEqHoTT(a.left, bb.left) &&
                alphaEqHoTT(a.right, bb.right));
        }
        case 'refl':
            return alphaEqHoTT(a.term, b.term);
        case 'pi':
        case 'sigma': {
            const bb = b;
            const aDom = a.kind === 'pi' ? a.domain : a.first;
            const bDom = bb.kind === 'pi' ? bb.domain : bb.first;
            const aCod = a.kind === 'pi' ? a.codomain : a.second;
            const bCod = bb.kind === 'pi' ? bb.codomain : bb.second;
            if (!alphaEqHoTT(aDom, bDom))
                return false;
            if (a.bind === bb.bind)
                return alphaEqHoTT(aCod, bCod);
            const fresh = `__αh${alphaCounter++}`;
            return alphaEqHoTT((0, substitute_1.substituteHoTT)(aCod, a.bind, { kind: 'var', name: fresh }), (0, substitute_1.substituteHoTT)(bCod, bb.bind, { kind: 'var', name: fresh }));
        }
        case 'lam': {
            const bb = b;
            if (!alphaEqHoTT(a.domain, bb.domain))
                return false;
            if (a.bind === bb.bind)
                return alphaEqHoTT(a.body, bb.body);
            const fresh = `__αh${alphaCounter++}`;
            return alphaEqHoTT((0, substitute_1.substituteHoTT)(a.body, a.bind, { kind: 'var', name: fresh }), (0, substitute_1.substituteHoTT)(bb.body, bb.bind, { kind: 'var', name: fresh }));
        }
        case 'transport': {
            const bb = b;
            return (alphaEqHoTT(a.family, bb.family) &&
                alphaEqHoTT(a.path, bb.path) &&
                alphaEqHoTT(a.term, bb.term));
        }
        case 'pathSym':
            return alphaEqHoTT(a.path, b.path);
        case 'pathConcat': {
            const bb = b;
            return alphaEqHoTT(a.left, bb.left) && alphaEqHoTT(a.right, bb.right);
        }
        case 'ap': {
            const bb = b;
            return alphaEqHoTT(a.fn, bb.fn) && alphaEqHoTT(a.path, bb.path);
        }
        case 'jElim': {
            const bb = b;
            return (alphaEqHoTT(a.motive, bb.motive) &&
                alphaEqHoTT(a.baseCase, bb.baseCase) &&
                alphaEqHoTT(a.path, bb.path));
        }
        case 'suspension':
        case 'north':
        case 'south':
            return alphaEqHoTT(a.type, b.type);
        case 'meridian': {
            const bb = b;
            return alphaEqHoTT(a.type, bb.type) && alphaEqHoTT(a.point, bb.point);
        }
        case 'ua':
            return alphaEqHoTT(a.equiv, b.equiv);
    }
}
function alphaBetaEqHoTT(a, b, _ctx) {
    return alphaEqHoTT((0, normalize_1.normalizeHoTT)(a), (0, normalize_1.normalizeHoTT)(b));
}
//# sourceMappingURL=equality.js.map