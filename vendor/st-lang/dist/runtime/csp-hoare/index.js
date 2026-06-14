"use strict";
// ============================================================
// CSP Hoare — Comunicating Sequential Processes (Hoare 1978/1985)
// ============================================================
// Cálculo de procesos basado en eventos atómicos sincronizados.
// A diferencia del π-cálculo (centrado en pasar nombres), CSP modela
// concurrencia mediante la ocurrencia coordinada de nombres de evento
// compartidos en el alfabeto del paralelo.
//
// Semánticas implementadas:
//   • Traces — qué secuencias de eventos visibles pueden ocurrir.
//   • Failures — pares (traza, refusal) que capturan no-determinismo.
//   • Refinement — P ⊑_T Q y P ⊑_F Q según las semánticas anteriores.
//
// Ejemplos canónicos: máquina expendedora, filósofos cenando.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.diningPhilosophers = exports.philosopher = exports.vendingMachineLoop = exports.vendingMachine = exports.refinesFailures = exports.refinesTraces = exports.isLiveLocked = exports.isDeadlocked = exports.failures = exports.traces = exports.internalResolutions = exports.step = exports.nextEvents = exports.alphabet = exports.processVar = exports.recursion = exports.rename = exports.hide = exports.sequence = exports.interleave = exports.parallel = exports.internal = exports.choice = exports.prefix = exports.SKIP = exports.STOP = exports.TICK = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "TICK", { enumerable: true, get: function () { return types_1.TICK; } });
var semantics_1 = require("./semantics");
Object.defineProperty(exports, "STOP", { enumerable: true, get: function () { return semantics_1.STOP; } });
Object.defineProperty(exports, "SKIP", { enumerable: true, get: function () { return semantics_1.SKIP; } });
Object.defineProperty(exports, "prefix", { enumerable: true, get: function () { return semantics_1.prefix; } });
Object.defineProperty(exports, "choice", { enumerable: true, get: function () { return semantics_1.choice; } });
Object.defineProperty(exports, "internal", { enumerable: true, get: function () { return semantics_1.internal; } });
Object.defineProperty(exports, "parallel", { enumerable: true, get: function () { return semantics_1.parallel; } });
Object.defineProperty(exports, "interleave", { enumerable: true, get: function () { return semantics_1.interleave; } });
Object.defineProperty(exports, "sequence", { enumerable: true, get: function () { return semantics_1.sequence; } });
Object.defineProperty(exports, "hide", { enumerable: true, get: function () { return semantics_1.hide; } });
Object.defineProperty(exports, "rename", { enumerable: true, get: function () { return semantics_1.rename; } });
Object.defineProperty(exports, "recursion", { enumerable: true, get: function () { return semantics_1.recursion; } });
Object.defineProperty(exports, "processVar", { enumerable: true, get: function () { return semantics_1.processVar; } });
Object.defineProperty(exports, "alphabet", { enumerable: true, get: function () { return semantics_1.alphabet; } });
Object.defineProperty(exports, "nextEvents", { enumerable: true, get: function () { return semantics_1.nextEvents; } });
Object.defineProperty(exports, "step", { enumerable: true, get: function () { return semantics_1.step; } });
Object.defineProperty(exports, "internalResolutions", { enumerable: true, get: function () { return semantics_1.internalResolutions; } });
var analysis_1 = require("./analysis");
Object.defineProperty(exports, "traces", { enumerable: true, get: function () { return analysis_1.traces; } });
Object.defineProperty(exports, "failures", { enumerable: true, get: function () { return analysis_1.failures; } });
Object.defineProperty(exports, "isDeadlocked", { enumerable: true, get: function () { return analysis_1.isDeadlocked; } });
Object.defineProperty(exports, "isLiveLocked", { enumerable: true, get: function () { return analysis_1.isLiveLocked; } });
Object.defineProperty(exports, "refinesTraces", { enumerable: true, get: function () { return analysis_1.refinesTraces; } });
Object.defineProperty(exports, "refinesFailures", { enumerable: true, get: function () { return analysis_1.refinesFailures; } });
var examples_1 = require("./examples");
Object.defineProperty(exports, "vendingMachine", { enumerable: true, get: function () { return examples_1.vendingMachine; } });
Object.defineProperty(exports, "vendingMachineLoop", { enumerable: true, get: function () { return examples_1.vendingMachineLoop; } });
Object.defineProperty(exports, "philosopher", { enumerable: true, get: function () { return examples_1.philosopher; } });
Object.defineProperty(exports, "diningPhilosophers", { enumerable: true, get: function () { return examples_1.diningPhilosophers; } });
//# sourceMappingURL=index.js.map