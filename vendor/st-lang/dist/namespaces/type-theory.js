"use strict";
/**
 * Namespace: TypeTheory
 *
 * Sistemas de tipos y cálculos lambda — correspondencia Curry-Howard,
 * System F polimórfico, MLTT (Martin-Löf), λ-calc puro, combinadores SKI,
 * NBE (normalization by evaluation), refinement types.
 *
 * Importa así:
 *   import { TypeTheory } from '@stevenvo780/st-lang';
 *   const t = TypeTheory.systemF.typeOf(term);
 *   const proof = TypeTheory.curryHoward.termToProof(lam);
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.higherOrderUnify = exports.refinementTypes = exports.nbe = exports.combinatorsSKI = exports.lambdaCalc = exports.mltt = exports.systemF = exports.curryHoward = void 0;
const curryHoward = __importStar(require("../type-theory/curry-howard"));
exports.curryHoward = curryHoward;
const systemF = __importStar(require("../type-theory/system-f"));
exports.systemF = systemF;
const mltt = __importStar(require("../type-theory/mltt"));
exports.mltt = mltt;
const lambdaCalc = __importStar(require("../type-theory/lambda-calc"));
exports.lambdaCalc = lambdaCalc;
const combinatorsSKI = __importStar(require("../type-theory/combinators-ski"));
exports.combinatorsSKI = combinatorsSKI;
const nbe = __importStar(require("../type-theory/nbe"));
exports.nbe = nbe;
const refinementTypes = __importStar(require("../type-theory/refinement-types"));
exports.refinementTypes = refinementTypes;
const higherOrderUnify = __importStar(require("../proof-systems/higher-order-unify"));
exports.higherOrderUnify = higherOrderUnify;
//# sourceMappingURL=type-theory.js.map