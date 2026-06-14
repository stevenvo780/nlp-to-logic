"use strict";
// ============================================================
// ST Bisimulation — barrel público.
// ============================================================
// API:
//   paigeTarjan(lts)              → BisimulationResult
//   areBisimilar(lts, s, t)       → boolean
//   quotientLTS(lts)              → LTS mínimo módulo ~
//   strongBisimulation(L1, L2)    → boolean
//   weakBisimulation(lts, tau)    → BisimulationResult (oculta τ)
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.weakBisimulation = exports.strongBisimulation = exports.quotientLTS = exports.areBisimilar = exports.paigeTarjan = void 0;
var paige_tarjan_1 = require("./paige-tarjan");
Object.defineProperty(exports, "paigeTarjan", { enumerable: true, get: function () { return paige_tarjan_1.paigeTarjan; } });
var operations_1 = require("./operations");
Object.defineProperty(exports, "areBisimilar", { enumerable: true, get: function () { return operations_1.areBisimilar; } });
Object.defineProperty(exports, "quotientLTS", { enumerable: true, get: function () { return operations_1.quotientLTS; } });
Object.defineProperty(exports, "strongBisimulation", { enumerable: true, get: function () { return operations_1.strongBisimulation; } });
Object.defineProperty(exports, "weakBisimulation", { enumerable: true, get: function () { return operations_1.weakBisimulation; } });
//# sourceMappingURL=index.js.map