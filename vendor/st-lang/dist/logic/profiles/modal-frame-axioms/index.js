"use strict";
// ============================================================
// Modal Frame Axioms — Entrada pública
// ============================================================
//
// Tableau modal extendido con axiomas de frame (T, B, 4, 5, D)
// y composición de sistemas estándar (K, T, D, B, S4, S5, KD45...).
//
// Uso típico:
//
//   import {
//     atom, box, diamond, implies,
//     isValid, isSatisfiable, tableauWithAxioms,
//   } from '@stevenvo780/st-lang/profiles/modal-frame-axioms';
//
//   const p = atom('p');
//   isValid(implies(box(p), p), 'T');      // true
//   isValid(implies(box(p), p), 'K');      // false
//   isValid(implies(box(p), box(box(p))), 'S4'); // true
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiomFormula = exports.isValid = exports.isSatisfiable = exports.systemAxioms = exports.tableauWithAxioms = exports.collectAtoms = exports.formulaToString = exports.formulaEquals = exports.formulaKey = exports.diamond = exports.box = exports.implies = exports.or = exports.and = exports.not = exports.atom = void 0;
var formula_1 = require("./formula");
Object.defineProperty(exports, "atom", { enumerable: true, get: function () { return formula_1.atom; } });
Object.defineProperty(exports, "not", { enumerable: true, get: function () { return formula_1.not; } });
Object.defineProperty(exports, "and", { enumerable: true, get: function () { return formula_1.and; } });
Object.defineProperty(exports, "or", { enumerable: true, get: function () { return formula_1.or; } });
Object.defineProperty(exports, "implies", { enumerable: true, get: function () { return formula_1.implies; } });
Object.defineProperty(exports, "box", { enumerable: true, get: function () { return formula_1.box; } });
Object.defineProperty(exports, "diamond", { enumerable: true, get: function () { return formula_1.diamond; } });
Object.defineProperty(exports, "formulaKey", { enumerable: true, get: function () { return formula_1.formulaKey; } });
Object.defineProperty(exports, "formulaEquals", { enumerable: true, get: function () { return formula_1.formulaEquals; } });
Object.defineProperty(exports, "formulaToString", { enumerable: true, get: function () { return formula_1.formulaToString; } });
Object.defineProperty(exports, "collectAtoms", { enumerable: true, get: function () { return formula_1.collectAtoms; } });
var tableau_1 = require("./tableau");
Object.defineProperty(exports, "tableauWithAxioms", { enumerable: true, get: function () { return tableau_1.tableauWithAxioms; } });
var systems_1 = require("./systems");
Object.defineProperty(exports, "systemAxioms", { enumerable: true, get: function () { return systems_1.systemAxioms; } });
Object.defineProperty(exports, "isSatisfiable", { enumerable: true, get: function () { return systems_1.isSatisfiable; } });
Object.defineProperty(exports, "isValid", { enumerable: true, get: function () { return systems_1.isValid; } });
Object.defineProperty(exports, "axiomFormula", { enumerable: true, get: function () { return systems_1.axiomFormula; } });
//# sourceMappingURL=index.js.map