"use strict";
// ============================================================
// ST Planning — Barrel
// ============================================================
//
// Planificación clásica STRIPS / PDDL light.
//
// API pública:
//   - `bfsPlan(problem, opts?)`       → BFS, plan de menor longitud
//   - `aStarPlan(problem, opts?)`     → A*, plan de menor costo
//   - `ground(action, bindings)`      → instanciar schema
//   - `applyAction(state, ground)`    → estado sucesor
//   - `goalSatisfied(state, goal)`    → goal ⊆ state
//   - `fastForwardHeuristic(...)`     → heurística FF por niveles
//   - `makeFFHeuristic(problem)`      → curry FF al problema
//   - `goalCountHeuristic`            → |goal\state| trivial
//
// Tipos: `STRIPSAction`, `STRIPSProblem`, `Plan`, `PlanStep`,
// `GroundedAction`, `Heuristic`, `PlannerOptions`, `AStarOptions`.
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFFHeuristic = exports.goalCountHeuristic = exports.fastForwardHeuristic = exports.substituteVars = exports.preconditionsSatisfied = exports.groundAll = exports.ground = exports.goalSatisfied = exports.applyAction = exports.aStarPlan = exports.hashState = exports.bfsPlan = void 0;
var bfs_1 = require("./bfs");
Object.defineProperty(exports, "bfsPlan", { enumerable: true, get: function () { return bfs_1.bfsPlan; } });
Object.defineProperty(exports, "hashState", { enumerable: true, get: function () { return bfs_1.hashState; } });
var astar_1 = require("./astar");
Object.defineProperty(exports, "aStarPlan", { enumerable: true, get: function () { return astar_1.aStarPlan; } });
var ground_1 = require("./ground");
Object.defineProperty(exports, "applyAction", { enumerable: true, get: function () { return ground_1.applyAction; } });
Object.defineProperty(exports, "goalSatisfied", { enumerable: true, get: function () { return ground_1.goalSatisfied; } });
Object.defineProperty(exports, "ground", { enumerable: true, get: function () { return ground_1.ground; } });
Object.defineProperty(exports, "groundAll", { enumerable: true, get: function () { return ground_1.groundAll; } });
Object.defineProperty(exports, "preconditionsSatisfied", { enumerable: true, get: function () { return ground_1.preconditionsSatisfied; } });
Object.defineProperty(exports, "substituteVars", { enumerable: true, get: function () { return ground_1.substituteVars; } });
var heuristic_1 = require("./heuristic");
Object.defineProperty(exports, "fastForwardHeuristic", { enumerable: true, get: function () { return heuristic_1.fastForwardHeuristic; } });
Object.defineProperty(exports, "goalCountHeuristic", { enumerable: true, get: function () { return heuristic_1.goalCountHeuristic; } });
Object.defineProperty(exports, "makeFFHeuristic", { enumerable: true, get: function () { return heuristic_1.makeFFHeuristic; } });
//# sourceMappingURL=index.js.map