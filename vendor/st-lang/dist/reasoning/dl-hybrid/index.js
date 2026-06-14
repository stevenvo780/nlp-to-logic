"use strict";
// ============================================================
// ST dL-Hybrid — Reasoning helpers
// ============================================================
// API pública para análisis de invariantes diferenciales (regla de
// Platzer 2010). Estos helpers viven fuera del core del perfil para
// no inflar el bundle del runtime; quien sólo necesite parse + check
// puede ignorarlos.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.describeVerdict = exports.suggestInvariants = exports.checkDifferentialInvariant = void 0;
var invariant_search_1 = require("./invariant-search");
Object.defineProperty(exports, "checkDifferentialInvariant", { enumerable: true, get: function () { return invariant_search_1.checkDifferentialInvariant; } });
Object.defineProperty(exports, "suggestInvariants", { enumerable: true, get: function () { return invariant_search_1.suggestInvariants; } });
Object.defineProperty(exports, "describeVerdict", { enumerable: true, get: function () { return invariant_search_1.describeVerdict; } });
//# sourceMappingURL=index.js.map