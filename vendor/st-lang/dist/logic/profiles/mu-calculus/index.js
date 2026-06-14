"use strict";
// ============================================================
// ST modal μ-calculus — punto de entrada público
// ============================================================
// API:
//   modelCheck(K, φ)        → Set<stateId> que satisfacen φ
//   satisfiesAt(K, φ, s)    → boolean
//   isWellFormed(φ)         → boolean (cerrada + positiva)
//   isClosed(φ) / freeVars(φ) → análisis sintáctico
//   alternationDepth(φ)     → number
//   ctlToMu(ctlFormula)     → MuFormula
//   muToString(φ)           → notación textual
//
// El μ-cálculo subsume CTL, LTL y PDL: cualquier fórmula CTL puede
// traducirse vía `ctlToMu`. Es el "ensemble logic" de la familia
// modal/temporal.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ctlToMu = exports.alternationDepth = exports.freeVars = exports.isPositive = exports.isClosed = exports.isWellFormed = exports.satisfiesAt = exports.modelCheck = exports.muToString = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "muToString", { enumerable: true, get: function () { return types_1.muToString; } });
var check_1 = require("./check");
Object.defineProperty(exports, "modelCheck", { enumerable: true, get: function () { return check_1.modelCheck; } });
Object.defineProperty(exports, "satisfiesAt", { enumerable: true, get: function () { return check_1.satisfiesAt; } });
var wellformed_1 = require("./wellformed");
Object.defineProperty(exports, "isWellFormed", { enumerable: true, get: function () { return wellformed_1.isWellFormed; } });
Object.defineProperty(exports, "isClosed", { enumerable: true, get: function () { return wellformed_1.isClosed; } });
Object.defineProperty(exports, "isPositive", { enumerable: true, get: function () { return wellformed_1.isPositive; } });
Object.defineProperty(exports, "freeVars", { enumerable: true, get: function () { return wellformed_1.freeVars; } });
Object.defineProperty(exports, "alternationDepth", { enumerable: true, get: function () { return wellformed_1.alternationDepth; } });
var ctl_translate_1 = require("./ctl-translate");
Object.defineProperty(exports, "ctlToMu", { enumerable: true, get: function () { return ctl_translate_1.ctlToMu; } });
//# sourceMappingURL=index.js.map