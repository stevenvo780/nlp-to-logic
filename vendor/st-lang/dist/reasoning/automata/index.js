"use strict";
// ============================================================
// ST Automata — Barrel
// ============================================================
//
// Teoría clásica de autómatas:
//
//   DFA (Deterministic Finite Automaton)
//     · dfaAccepts          simulación
//     · dfaMinimize         Hopcroft partition refinement
//     · dfaUnion/dfaIntersection/dfaComplement
//
//   NFA (con ε-transiciones)
//     · nfaAccepts          BFS sobre el frontier
//     · nfaToDfa            subset construction
//     · epsilonClosure
//
//   Regex
//     · parseRegex          gramática '|', concat, *, +, ?, (), \\esc
//     · regexToNfa          Thompson construction
//     · regexMatches        match exacto
//
//   PDA (push-down)
//     · pdaAccepts          BFS no determinista con memo
//     · pdaPalindromes      palíndromes sobre {a,b}
//     · pdaBalancedParens   paréntesis balanceados
//
//   Lenguajes estándar:
//     · dfaEvenZeros        {0,1}* con # de '0' par
//     · dfaContainsAB       {a,b,c}* que contienen "ab"
//     · regexEmail          regex simplificada de email
//
// Constantes:
//   · EPSILON = 'ε'
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.regexEmail = exports.dfaContainsAB = exports.dfaEvenZeros = exports.pdaBalancedParens = exports.pdaPalindromes = exports.pdaAccepts = exports.regexMatches = exports.regexToNfa = exports.parseRegex = exports.epsilonClosure = exports.nfaToDfa = exports.nfaAccepts = exports.dfaTotalize = exports.dfaIntersection = exports.dfaUnion = exports.dfaProduct = exports.dfaComplement = exports.dfaMinimize = exports.dfaAccepts = exports.EPSILON = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "EPSILON", { enumerable: true, get: function () { return types_1.EPSILON; } });
var dfa_1 = require("./dfa");
Object.defineProperty(exports, "dfaAccepts", { enumerable: true, get: function () { return dfa_1.dfaAccepts; } });
Object.defineProperty(exports, "dfaMinimize", { enumerable: true, get: function () { return dfa_1.dfaMinimize; } });
Object.defineProperty(exports, "dfaComplement", { enumerable: true, get: function () { return dfa_1.dfaComplement; } });
Object.defineProperty(exports, "dfaProduct", { enumerable: true, get: function () { return dfa_1.dfaProduct; } });
Object.defineProperty(exports, "dfaUnion", { enumerable: true, get: function () { return dfa_1.dfaUnion; } });
Object.defineProperty(exports, "dfaIntersection", { enumerable: true, get: function () { return dfa_1.dfaIntersection; } });
Object.defineProperty(exports, "dfaTotalize", { enumerable: true, get: function () { return dfa_1.dfaTotalize; } });
var nfa_1 = require("./nfa");
Object.defineProperty(exports, "nfaAccepts", { enumerable: true, get: function () { return nfa_1.nfaAccepts; } });
Object.defineProperty(exports, "nfaToDfa", { enumerable: true, get: function () { return nfa_1.nfaToDfa; } });
Object.defineProperty(exports, "epsilonClosure", { enumerable: true, get: function () { return nfa_1.epsilonClosure; } });
var regex_1 = require("./regex");
Object.defineProperty(exports, "parseRegex", { enumerable: true, get: function () { return regex_1.parseRegex; } });
Object.defineProperty(exports, "regexToNfa", { enumerable: true, get: function () { return regex_1.regexToNfa; } });
Object.defineProperty(exports, "regexMatches", { enumerable: true, get: function () { return regex_1.regexMatches; } });
var pda_1 = require("./pda");
Object.defineProperty(exports, "pdaAccepts", { enumerable: true, get: function () { return pda_1.pdaAccepts; } });
Object.defineProperty(exports, "pdaPalindromes", { enumerable: true, get: function () { return pda_1.pdaPalindromes; } });
Object.defineProperty(exports, "pdaBalancedParens", { enumerable: true, get: function () { return pda_1.pdaBalancedParens; } });
var languages_1 = require("./languages");
Object.defineProperty(exports, "dfaEvenZeros", { enumerable: true, get: function () { return languages_1.dfaEvenZeros; } });
Object.defineProperty(exports, "dfaContainsAB", { enumerable: true, get: function () { return languages_1.dfaContainsAB; } });
Object.defineProperty(exports, "regexEmail", { enumerable: true, get: function () { return languages_1.regexEmail; } });
//# sourceMappingURL=index.js.map