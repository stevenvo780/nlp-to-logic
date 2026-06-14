"use strict";
// ============================================================
// ST CTL — punto de entrada público del perfil.
// ============================================================
// API:
//   modelCheckCTL(M, φ)   → Map<stateId, holds>
//   satisfiesCTL(M, φ)    → boolean (φ vale en todos los iniciales)
//   generateWitness(M, φ, state) → string[] | null
//   ctlToString(φ)        → notación textual
//
// La estructura de Kripke se asume finita. El algoritmo de labelling es
// O(|φ| · (|S| + |R|)).
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateWitness = exports.satisfiesCTL = exports.modelCheckCTL = exports.ctlToString = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "ctlToString", { enumerable: true, get: function () { return types_1.ctlToString; } });
var check_1 = require("./check");
Object.defineProperty(exports, "modelCheckCTL", { enumerable: true, get: function () { return check_1.modelCheckCTL; } });
Object.defineProperty(exports, "satisfiesCTL", { enumerable: true, get: function () { return check_1.satisfiesCTL; } });
var witness_1 = require("./witness");
Object.defineProperty(exports, "generateWitness", { enumerable: true, get: function () { return witness_1.generateWitness; } });
//# sourceMappingURL=index.js.map