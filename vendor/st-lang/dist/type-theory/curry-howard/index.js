"use strict";
// ============================================================
// ST Curry-Howard — Punto de entrada público
// ============================================================
//
// Correspondencia Curry-Howard sobre λ-cálculo simplemente tipado:
//   - λ-terms anotados con tipos = pruebas en deducción natural
//   - inferType: λ-term → proposición probada
//   - termToProof / proofToTerm: conversión bidireccional
//   - reduceBeta / normalize: normalización (β + proyecciones + case)
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProofConversionError = exports.proofIsConsistent = exports.proofToTerm = exports.termToProof = exports.substituteTerm = exports.freeVars = exports.isNormal = exports.normalize = exports.reduceBeta = exports.isInferError = exports.inferType = exports.termToString = exports.typeToString = exports.eqType = exports.absurd = exports.cse = exports.inr = exports.inl = exports.snd = exports.fst = exports.pair = exports.abs = exports.app = exports.vr = exports.bottom = exports.sum = exports.product = exports.arrow = exports.atom = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "atom", { enumerable: true, get: function () { return types_1.atom; } });
Object.defineProperty(exports, "arrow", { enumerable: true, get: function () { return types_1.arrow; } });
Object.defineProperty(exports, "product", { enumerable: true, get: function () { return types_1.product; } });
Object.defineProperty(exports, "sum", { enumerable: true, get: function () { return types_1.sum; } });
Object.defineProperty(exports, "bottom", { enumerable: true, get: function () { return types_1.bottom; } });
Object.defineProperty(exports, "vr", { enumerable: true, get: function () { return types_1.vr; } });
Object.defineProperty(exports, "app", { enumerable: true, get: function () { return types_1.app; } });
Object.defineProperty(exports, "abs", { enumerable: true, get: function () { return types_1.abs; } });
Object.defineProperty(exports, "pair", { enumerable: true, get: function () { return types_1.pair; } });
Object.defineProperty(exports, "fst", { enumerable: true, get: function () { return types_1.fst; } });
Object.defineProperty(exports, "snd", { enumerable: true, get: function () { return types_1.snd; } });
Object.defineProperty(exports, "inl", { enumerable: true, get: function () { return types_1.inl; } });
Object.defineProperty(exports, "inr", { enumerable: true, get: function () { return types_1.inr; } });
Object.defineProperty(exports, "cse", { enumerable: true, get: function () { return types_1.cse; } });
Object.defineProperty(exports, "absurd", { enumerable: true, get: function () { return types_1.absurd; } });
Object.defineProperty(exports, "eqType", { enumerable: true, get: function () { return types_1.eqType; } });
Object.defineProperty(exports, "typeToString", { enumerable: true, get: function () { return types_1.typeToString; } });
Object.defineProperty(exports, "termToString", { enumerable: true, get: function () { return types_1.termToString; } });
var infer_1 = require("./infer");
Object.defineProperty(exports, "inferType", { enumerable: true, get: function () { return infer_1.inferType; } });
Object.defineProperty(exports, "isInferError", { enumerable: true, get: function () { return infer_1.isInferError; } });
var reduce_1 = require("./reduce");
Object.defineProperty(exports, "reduceBeta", { enumerable: true, get: function () { return reduce_1.reduceBeta; } });
Object.defineProperty(exports, "normalize", { enumerable: true, get: function () { return reduce_1.normalize; } });
Object.defineProperty(exports, "isNormal", { enumerable: true, get: function () { return reduce_1.isNormal; } });
Object.defineProperty(exports, "freeVars", { enumerable: true, get: function () { return reduce_1.freeVars; } });
Object.defineProperty(exports, "substituteTerm", { enumerable: true, get: function () { return reduce_1.substituteTerm; } });
var proof_1 = require("./proof");
Object.defineProperty(exports, "termToProof", { enumerable: true, get: function () { return proof_1.termToProof; } });
Object.defineProperty(exports, "proofToTerm", { enumerable: true, get: function () { return proof_1.proofToTerm; } });
Object.defineProperty(exports, "proofIsConsistent", { enumerable: true, get: function () { return proof_1.proofIsConsistent; } });
Object.defineProperty(exports, "ProofConversionError", { enumerable: true, get: function () { return proof_1.ProofConversionError; } });
//# sourceMappingURL=index.js.map