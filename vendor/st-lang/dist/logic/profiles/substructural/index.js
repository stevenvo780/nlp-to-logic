"use strict";
// ============================================================
// Substructural Logics — Public entrypoint
// ============================================================
//
// Logicas substructurales (Linear y Affine) con calculo de
// secuentes intuicionistico unilateral. Conectivos multiplicativos
// (⊗, ⊸, 1), aditivos (&, ⊕) y el exponencial bang (!).
//
//   import {
//     LinearFormula,
//     proveLinear,
//     proveAffine,
//   } from 'src/profiles/substructural';
Object.defineProperty(exports, "__esModule", { value: true });
exports.formulaKey = exports.proofToString = exports.proveAffine = exports.proveLinear = void 0;
var prover_1 = require("./prover");
Object.defineProperty(exports, "proveLinear", { enumerable: true, get: function () { return prover_1.proveLinear; } });
Object.defineProperty(exports, "proveAffine", { enumerable: true, get: function () { return prover_1.proveAffine; } });
Object.defineProperty(exports, "proofToString", { enumerable: true, get: function () { return prover_1.proofToString; } });
Object.defineProperty(exports, "formulaKey", { enumerable: true, get: function () { return prover_1.formulaKey; } });
//# sourceMappingURL=index.js.map