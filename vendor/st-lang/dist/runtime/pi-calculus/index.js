"use strict";
// ============================================================
// ST π-calculus — barrel público.
// ============================================================
// API:
//   freeNames(p)                  → Set<string> de nombres libres
//   boundNames(p)                 → Set<string> de nombres ligados
//   alphaRename(p, oldN, newN)    → AST con α-renaming
//   substitute(p, x, v)           → p[x := v] capture-avoiding
//   reduce(p)                     → PiProcess[] sucesores (un paso →)
//   isDeadlocked(p)               → boolean
//   trace(p, maxSteps?)           → traza determinista
//   structuralCongruence(a, b)    → ≡
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.structuralCongruence = exports.trace = exports.isDeadlocked = exports.reduce = exports.substitute = exports.freshName = exports.alphaRename = exports.boundNames = exports.freeNames = void 0;
var names_1 = require("./names");
Object.defineProperty(exports, "freeNames", { enumerable: true, get: function () { return names_1.freeNames; } });
Object.defineProperty(exports, "boundNames", { enumerable: true, get: function () { return names_1.boundNames; } });
Object.defineProperty(exports, "alphaRename", { enumerable: true, get: function () { return names_1.alphaRename; } });
Object.defineProperty(exports, "freshName", { enumerable: true, get: function () { return names_1.freshName; } });
var substitution_1 = require("./substitution");
Object.defineProperty(exports, "substitute", { enumerable: true, get: function () { return substitution_1.substitute; } });
var reduction_1 = require("./reduction");
Object.defineProperty(exports, "reduce", { enumerable: true, get: function () { return reduction_1.reduce; } });
Object.defineProperty(exports, "isDeadlocked", { enumerable: true, get: function () { return reduction_1.isDeadlocked; } });
Object.defineProperty(exports, "trace", { enumerable: true, get: function () { return reduction_1.trace; } });
var congruence_1 = require("./congruence");
Object.defineProperty(exports, "structuralCongruence", { enumerable: true, get: function () { return congruence_1.structuralCongruence; } });
//# sourceMappingURL=index.js.map