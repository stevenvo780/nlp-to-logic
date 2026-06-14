"use strict";
// ============================================================
// ST dL-Hybrid — Punto de entrada público del perfil
// ============================================================
// Differential Dynamic Logic (Platzer 2008/2010), subset decidible para
// verificación de sistemas híbridos: programas con estado continuo
// (ODEs polinomiales lineales) y discreto (asignaciones, choice, tests).
//
// API:
//   parseFormula(src) / parseProgram(src) / parseTerm(src)
//     Lexer + parser de la sintaxis textual dL.
//   checkValid(f, opts?)       Decisión de validez (semántica acotada).
//   checkSatisfiable(f, opts?) Decisión de satisfacibilidad.
//   evalInState(f, s, opts?)   Evaluación concreta en un estado.
//   classifyOde, flow, lieDerivative
//     Análisis y evolución analítica de sistemas ODE.
//   DLHybridProfile  Clase para registro en el `ProfileRegistry`.
//
// Limitaciones (subset):
//   • Sólo ODEs desacopladas (cada x' = f(x) sólo menciona x).
//   • x' = c (constantes) y x' = a*x + b (lineal con a, b constantes).
//   • Validez decidida por enumeración acotada sobre una malla finita:
//     no equivalente al cálculo completo de KeYmaera, pero suficiente para
//     los ejemplos canónicos.
//   • Loops α* expandidos a horizonte N (loopUnfold, default 3).
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalInState = exports.checkSatisfiable = exports.checkValid = exports.parseTerm = exports.parseProgram = exports.parseFormula = exports.evalSym = exports.lieDerivative = exports.flow = exports.classifyOde = exports.termIsLinearIn = exports.termIsConstant = exports.termToExpr = exports.substFormula = exports.substTerm = exports.evalQuantifierFree = exports.evalComp = exports.evalTerm = exports.formulaToString = exports.programToString = exports.termToString = exports.programVars = exports.formulaVars = exports.termVars = exports.cloneState = exports.ode = exports.loop = exports.choice = exports.seq = exports.test = exports.nondet = exports.assign = exports.diamond = exports.box = exports.iff = exports.implies = exports.orF = exports.andF = exports.notF = exports.falseF = exports.trueF = exports.comp = exports.power = exports.negTerm = exports.divide = exports.times = exports.minus = exports.plus = exports.variable = exports.num = void 0;
exports.runSatisfiability = exports.runValidity = exports.DLHybridProfile = exports.relevantVariables = void 0;
var ast_1 = require("./ast");
Object.defineProperty(exports, "num", { enumerable: true, get: function () { return ast_1.num; } });
Object.defineProperty(exports, "variable", { enumerable: true, get: function () { return ast_1.variable; } });
Object.defineProperty(exports, "plus", { enumerable: true, get: function () { return ast_1.plus; } });
Object.defineProperty(exports, "minus", { enumerable: true, get: function () { return ast_1.minus; } });
Object.defineProperty(exports, "times", { enumerable: true, get: function () { return ast_1.times; } });
Object.defineProperty(exports, "divide", { enumerable: true, get: function () { return ast_1.divide; } });
Object.defineProperty(exports, "negTerm", { enumerable: true, get: function () { return ast_1.negTerm; } });
Object.defineProperty(exports, "power", { enumerable: true, get: function () { return ast_1.power; } });
Object.defineProperty(exports, "comp", { enumerable: true, get: function () { return ast_1.comp; } });
Object.defineProperty(exports, "trueF", { enumerable: true, get: function () { return ast_1.trueF; } });
Object.defineProperty(exports, "falseF", { enumerable: true, get: function () { return ast_1.falseF; } });
Object.defineProperty(exports, "notF", { enumerable: true, get: function () { return ast_1.notF; } });
Object.defineProperty(exports, "andF", { enumerable: true, get: function () { return ast_1.andF; } });
Object.defineProperty(exports, "orF", { enumerable: true, get: function () { return ast_1.orF; } });
Object.defineProperty(exports, "implies", { enumerable: true, get: function () { return ast_1.implies; } });
Object.defineProperty(exports, "iff", { enumerable: true, get: function () { return ast_1.iff; } });
Object.defineProperty(exports, "box", { enumerable: true, get: function () { return ast_1.box; } });
Object.defineProperty(exports, "diamond", { enumerable: true, get: function () { return ast_1.diamond; } });
Object.defineProperty(exports, "assign", { enumerable: true, get: function () { return ast_1.assign; } });
Object.defineProperty(exports, "nondet", { enumerable: true, get: function () { return ast_1.nondet; } });
Object.defineProperty(exports, "test", { enumerable: true, get: function () { return ast_1.test; } });
Object.defineProperty(exports, "seq", { enumerable: true, get: function () { return ast_1.seq; } });
Object.defineProperty(exports, "choice", { enumerable: true, get: function () { return ast_1.choice; } });
Object.defineProperty(exports, "loop", { enumerable: true, get: function () { return ast_1.loop; } });
Object.defineProperty(exports, "ode", { enumerable: true, get: function () { return ast_1.ode; } });
Object.defineProperty(exports, "cloneState", { enumerable: true, get: function () { return ast_1.cloneState; } });
Object.defineProperty(exports, "termVars", { enumerable: true, get: function () { return ast_1.termVars; } });
Object.defineProperty(exports, "formulaVars", { enumerable: true, get: function () { return ast_1.formulaVars; } });
Object.defineProperty(exports, "programVars", { enumerable: true, get: function () { return ast_1.programVars; } });
Object.defineProperty(exports, "termToString", { enumerable: true, get: function () { return ast_1.termToString; } });
Object.defineProperty(exports, "programToString", { enumerable: true, get: function () { return ast_1.programToString; } });
Object.defineProperty(exports, "formulaToString", { enumerable: true, get: function () { return ast_1.formulaToString; } });
var semantics_1 = require("./semantics");
Object.defineProperty(exports, "evalTerm", { enumerable: true, get: function () { return semantics_1.evalTerm; } });
Object.defineProperty(exports, "evalComp", { enumerable: true, get: function () { return semantics_1.evalComp; } });
Object.defineProperty(exports, "evalQuantifierFree", { enumerable: true, get: function () { return semantics_1.evalQuantifierFree; } });
Object.defineProperty(exports, "substTerm", { enumerable: true, get: function () { return semantics_1.substTerm; } });
Object.defineProperty(exports, "substFormula", { enumerable: true, get: function () { return semantics_1.substFormula; } });
var differential_1 = require("./differential");
Object.defineProperty(exports, "termToExpr", { enumerable: true, get: function () { return differential_1.termToExpr; } });
Object.defineProperty(exports, "termIsConstant", { enumerable: true, get: function () { return differential_1.termIsConstant; } });
Object.defineProperty(exports, "termIsLinearIn", { enumerable: true, get: function () { return differential_1.termIsLinearIn; } });
Object.defineProperty(exports, "classifyOde", { enumerable: true, get: function () { return differential_1.classifyOde; } });
Object.defineProperty(exports, "flow", { enumerable: true, get: function () { return differential_1.flow; } });
Object.defineProperty(exports, "lieDerivative", { enumerable: true, get: function () { return differential_1.lieDerivative; } });
Object.defineProperty(exports, "evalSym", { enumerable: true, get: function () { return differential_1.evalSym; } });
var parser_1 = require("./parser");
Object.defineProperty(exports, "parseFormula", { enumerable: true, get: function () { return parser_1.parseFormula; } });
Object.defineProperty(exports, "parseProgram", { enumerable: true, get: function () { return parser_1.parseProgram; } });
Object.defineProperty(exports, "parseTerm", { enumerable: true, get: function () { return parser_1.parseTerm; } });
var tableau_1 = require("./tableau");
Object.defineProperty(exports, "checkValid", { enumerable: true, get: function () { return tableau_1.checkValid; } });
Object.defineProperty(exports, "checkSatisfiable", { enumerable: true, get: function () { return tableau_1.checkSatisfiable; } });
Object.defineProperty(exports, "evalInState", { enumerable: true, get: function () { return tableau_1.evalInState; } });
Object.defineProperty(exports, "relevantVariables", { enumerable: true, get: function () { return tableau_1.relevantVariables; } });
var profile_1 = require("./profile");
Object.defineProperty(exports, "DLHybridProfile", { enumerable: true, get: function () { return profile_1.DLHybridProfile; } });
Object.defineProperty(exports, "runValidity", { enumerable: true, get: function () { return profile_1.runValidity; } });
Object.defineProperty(exports, "runSatisfiability", { enumerable: true, get: function () { return profile_1.runSatisfiability; } });
//# sourceMappingURL=index.js.map