"use strict";
// ============================================================
// ST Abduction — Barrel
// ============================================================
//
// Razonamiento abductivo: dado un knowledge base KB y una observación
// O, encontrar la hipótesis mínima H ⊆ Abducibles tal que
// KB ∪ H ⊨ O y KB ∪ H es consistente.
//
// API pública:
//   - `findExplanations(problem, opts?)`  → todas las explicaciones
//   - `bestExplanation(problem, opts?)`   → la mejor según preferencia
//   - `defaultEntails(opts?)`             → oráculo entailment Horn-like
//   - `defaultConsistent(opts?)`          → oráculo consistencia derivado
//
// Tipos: `AbductionProblem`, `Explanation`, `AbductionOptions`,
// `EntailmentOracle`, `ConsistencyOracle`, `Preference`, `Formula`.
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConsistent = exports.defaultEntails = exports.bestExplanation = exports.findExplanations = void 0;
var find_1 = require("./find");
Object.defineProperty(exports, "findExplanations", { enumerable: true, get: function () { return find_1.findExplanations; } });
Object.defineProperty(exports, "bestExplanation", { enumerable: true, get: function () { return find_1.bestExplanation; } });
var entails_1 = require("./entails");
Object.defineProperty(exports, "defaultEntails", { enumerable: true, get: function () { return entails_1.defaultEntails; } });
Object.defineProperty(exports, "defaultConsistent", { enumerable: true, get: function () { return entails_1.defaultConsistent; } });
//# sourceMappingURL=index.js.map