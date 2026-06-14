"use strict";
// ============================================================
// ST LTL-SAT — Procedimiento de decisión LTL vía tableau
// ============================================================
// API pública:
//   isSatisfiable(φ): { sat, witness? }   — SAT explícito con lazo
//   isValid(φ): boolean                   — ¬sat(¬φ)
//   toBuchi(φ): { states, accepting }     — estimación de tamaño
//
// Operadores soportados: atom, ¬, ∧, ∨, X, F, G, U, R. El operador
// derivado W (weak until) está disponible vía `weakUntil(φ,ψ)` y se
// expande a `(φ U ψ) ∨ G φ` en la entrada.
// ============================================================
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transitions = exports.enumerateAtoms = exports.closure = exports.toNNF = exports.toBuchi = exports.isValid = exports.isSatisfiable = void 0;
__exportStar(require("./types"), exports);
var sat_1 = require("./sat");
Object.defineProperty(exports, "isSatisfiable", { enumerable: true, get: function () { return sat_1.isSatisfiable; } });
Object.defineProperty(exports, "isValid", { enumerable: true, get: function () { return sat_1.isValid; } });
Object.defineProperty(exports, "toBuchi", { enumerable: true, get: function () { return sat_1.toBuchi; } });
var tableau_1 = require("./tableau");
Object.defineProperty(exports, "toNNF", { enumerable: true, get: function () { return tableau_1.toNNF; } });
Object.defineProperty(exports, "closure", { enumerable: true, get: function () { return tableau_1.closure; } });
Object.defineProperty(exports, "enumerateAtoms", { enumerable: true, get: function () { return tableau_1.enumerateAtoms; } });
Object.defineProperty(exports, "transitions", { enumerable: true, get: function () { return tableau_1.transitions; } });
//# sourceMappingURL=index.js.map