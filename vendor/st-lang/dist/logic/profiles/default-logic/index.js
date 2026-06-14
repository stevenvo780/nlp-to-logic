"use strict";
// ============================================================
// ST Default Logic (Reiter) — Barrel export
// ============================================================
//
// Lógica default de Reiter (1980): razonamiento no-monotónico
// basado en reglas `α : β / γ` donde α es el prerequisite, β las
// justificaciones (consistentes con creencias) y γ el consequent.
//
// API pública:
//   - computeExtensions(T): punto fijo del operador Γ_T.
//   - isInExtension(φ, E): pertenencia a una extensión dada.
//   - isSkepticallyEntailed(φ, T): φ en TODAS las extensiones.
//   - isCredulouslyEntailed(φ, T): φ en AL MENOS una extensión.
//
// Casos canónicos cubiertos por tests: Tweety, pingüino, Nixon diamond.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCredulouslyEntailed = exports.isSkepticallyEntailed = exports.isInExtension = exports.isJustificationConsistent = exports.isConsistent = exports.negate = exports.normalizeLiteral = exports.computeExtensions = exports.DEFAULT_MAX_DEFAULTS = exports.DEFAULT_MAX_EXTENSIONS = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "DEFAULT_MAX_EXTENSIONS", { enumerable: true, get: function () { return types_1.DEFAULT_MAX_EXTENSIONS; } });
Object.defineProperty(exports, "DEFAULT_MAX_DEFAULTS", { enumerable: true, get: function () { return types_1.DEFAULT_MAX_DEFAULTS; } });
var extensions_1 = require("./extensions");
Object.defineProperty(exports, "computeExtensions", { enumerable: true, get: function () { return extensions_1.computeExtensions; } });
Object.defineProperty(exports, "normalizeLiteral", { enumerable: true, get: function () { return extensions_1.normalizeLiteral; } });
Object.defineProperty(exports, "negate", { enumerable: true, get: function () { return extensions_1.negate; } });
Object.defineProperty(exports, "isConsistent", { enumerable: true, get: function () { return extensions_1.isConsistent; } });
Object.defineProperty(exports, "isJustificationConsistent", { enumerable: true, get: function () { return extensions_1.isJustificationConsistent; } });
var entailment_1 = require("./entailment");
Object.defineProperty(exports, "isInExtension", { enumerable: true, get: function () { return entailment_1.isInExtension; } });
Object.defineProperty(exports, "isSkepticallyEntailed", { enumerable: true, get: function () { return entailment_1.isSkepticallyEntailed; } });
Object.defineProperty(exports, "isCredulouslyEntailed", { enumerable: true, get: function () { return entailment_1.isCredulouslyEntailed; } });
//# sourceMappingURL=index.js.map