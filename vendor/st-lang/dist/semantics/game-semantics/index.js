"use strict";
// ============================================================
// Game semantics IPC — Punto de entrada público
// ============================================================
//
// Juegos dialógicos (Lorenzen-Felscher) para Intuitionistic
// Propositional Calculus. Una fórmula φ es válida en IPC sii el
// Proponente tiene estrategia ganadora en el juego dialógico
// sobre φ.
Object.defineProperty(exports, "__esModule", { value: true });
exports.toIntuit = exports.traceToString = exports.play = exports.winningStrategy = exports.ipcToString = exports.ipcEquals = exports.ipcKey = exports.ipcNot = exports.ipcImplies = exports.ipcOr = exports.ipcAnd = exports.ipcBottom = exports.ipcAtom = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "ipcAtom", { enumerable: true, get: function () { return types_1.ipcAtom; } });
Object.defineProperty(exports, "ipcBottom", { enumerable: true, get: function () { return types_1.ipcBottom; } });
Object.defineProperty(exports, "ipcAnd", { enumerable: true, get: function () { return types_1.ipcAnd; } });
Object.defineProperty(exports, "ipcOr", { enumerable: true, get: function () { return types_1.ipcOr; } });
Object.defineProperty(exports, "ipcImplies", { enumerable: true, get: function () { return types_1.ipcImplies; } });
Object.defineProperty(exports, "ipcNot", { enumerable: true, get: function () { return types_1.ipcNot; } });
Object.defineProperty(exports, "ipcKey", { enumerable: true, get: function () { return types_1.ipcKey; } });
Object.defineProperty(exports, "ipcEquals", { enumerable: true, get: function () { return types_1.ipcEquals; } });
Object.defineProperty(exports, "ipcToString", { enumerable: true, get: function () { return types_1.ipcToString; } });
var strategy_1 = require("./strategy");
Object.defineProperty(exports, "winningStrategy", { enumerable: true, get: function () { return strategy_1.winningStrategy; } });
Object.defineProperty(exports, "play", { enumerable: true, get: function () { return strategy_1.play; } });
Object.defineProperty(exports, "traceToString", { enumerable: true, get: function () { return strategy_1.traceToString; } });
var convert_1 = require("./convert");
Object.defineProperty(exports, "toIntuit", { enumerable: true, get: function () { return convert_1.toIntuit; } });
//# sourceMappingURL=index.js.map