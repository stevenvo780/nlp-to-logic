"use strict";
// ============================================================
// G3 Sequent Calculus — Entrada publica del perfil
// ============================================================
//
// Este perfil expone el calculo de secuentes G3 (Gentzen reformulado
// por Kleene) para logica proposicional clasica. La interfaz que se
// reexporta es minima y suficiente para integrarlo desde otros perfiles
// o pruebas:
//
//   import { proveFormula, proveSequent, proofToLatex }
//     from 'src/profiles/sequent-g3';
Object.defineProperty(exports, "__esModule", { value: true });
exports.formulaKey = exports.normalizeForG3 = exports.proofToLatex = exports.proveFormula = exports.proveSequent = void 0;
var prover_1 = require("./prover");
Object.defineProperty(exports, "proveSequent", { enumerable: true, get: function () { return prover_1.proveSequent; } });
Object.defineProperty(exports, "proveFormula", { enumerable: true, get: function () { return prover_1.proveFormula; } });
var latex_1 = require("./latex");
Object.defineProperty(exports, "proofToLatex", { enumerable: true, get: function () { return latex_1.proofToLatex; } });
var normalize_1 = require("./normalize");
Object.defineProperty(exports, "normalizeForG3", { enumerable: true, get: function () { return normalize_1.normalizeForG3; } });
Object.defineProperty(exports, "formulaKey", { enumerable: true, get: function () { return normalize_1.formulaKey; } });
//# sourceMappingURL=index.js.map