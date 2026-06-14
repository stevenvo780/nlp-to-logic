"use strict";
// ============================================================
// ST Hybrid Logic — API pública del fragmento H(@, ↓, ∃)
// ============================================================
// Hybrid logic = modal logic + nominales (i, j, k) + @-operator +
// ↓-binder + ∃-world quantifier. Permite hablar internamente de
// mundos identificables — útil para razonar sobre identidad de
// estados en sistemas Kripke (procesos, módulos epistémicos).
//
// Este módulo es independiente del ProfileRegistry textual (igual
// que description-logic): provee la semántica relacional y un
// decisor de satisfacibilidad por búsqueda finita acotada.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSatisfiable = exports.isSatisfiableInFrame = exports.satisfies = exports.formulaToString = exports.existsWorld = exports.down = exports.at = exports.diamond = exports.box = exports.implies = exports.or = exports.and = exports.not = exports.nominal = exports.atom = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "atom", { enumerable: true, get: function () { return types_1.atom; } });
Object.defineProperty(exports, "nominal", { enumerable: true, get: function () { return types_1.nominal; } });
Object.defineProperty(exports, "not", { enumerable: true, get: function () { return types_1.not; } });
Object.defineProperty(exports, "and", { enumerable: true, get: function () { return types_1.and; } });
Object.defineProperty(exports, "or", { enumerable: true, get: function () { return types_1.or; } });
Object.defineProperty(exports, "implies", { enumerable: true, get: function () { return types_1.implies; } });
Object.defineProperty(exports, "box", { enumerable: true, get: function () { return types_1.box; } });
Object.defineProperty(exports, "diamond", { enumerable: true, get: function () { return types_1.diamond; } });
Object.defineProperty(exports, "at", { enumerable: true, get: function () { return types_1.at; } });
Object.defineProperty(exports, "down", { enumerable: true, get: function () { return types_1.down; } });
Object.defineProperty(exports, "existsWorld", { enumerable: true, get: function () { return types_1.existsWorld; } });
Object.defineProperty(exports, "formulaToString", { enumerable: true, get: function () { return types_1.formulaToString; } });
var semantics_1 = require("./semantics");
Object.defineProperty(exports, "satisfies", { enumerable: true, get: function () { return semantics_1.satisfies; } });
Object.defineProperty(exports, "isSatisfiableInFrame", { enumerable: true, get: function () { return semantics_1.isSatisfiableInFrame; } });
var sat_1 = require("./sat");
Object.defineProperty(exports, "isSatisfiable", { enumerable: true, get: function () { return sat_1.isSatisfiable; } });
//# sourceMappingURL=index.js.map