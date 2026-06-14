"use strict";
// ============================================================
// Game theory — Punto de entrada público
// ============================================================
//
// Computación de equilibria de Nash (puros y mixtos) para juegos
// 2-player en forma normal NxM y juegos n-player simétricos chicos.
//
//   - findPureNash         enumera Nash puros exhaustivamente.
//   - enumerateAllNash     enumera TODOS los Nash (puros y mixtos)
//                          via support enumeration (2-player).
//   - lemkeHowson          encuentra UN Nash via pivot LCP.
//   - eliminateDominated   iterated elimination of dominated strats.
//   - bestResponse         best responses puras dado un perfil mixto.
//
// Constructores ergonómicos: createTwoPlayerGame, prisonersDilemma,
// rockPaperScissors, battleOfSexes, matchingPennies, stagHunt.
Object.defineProperty(exports, "__esModule", { value: true });
exports.stagHunt = exports.matchingPennies = exports.battleOfSexes = exports.rockPaperScissors = exports.prisonersDilemma = exports.bestResponse = exports.eliminateDominated = exports.isDominated = exports.lemkeHowson = exports.enumerateAllNash = exports.findPureNash = exports.vectorsApproxEqual = exports.approxEqual = exports.expectedPayoff = exports.pureDistribution = exports.payoffOf = exports.totalProfiles = exports.indexToProfile = exports.profileToIndex = exports.createTwoPlayerGame = exports.createGame = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "createGame", { enumerable: true, get: function () { return types_1.createGame; } });
Object.defineProperty(exports, "createTwoPlayerGame", { enumerable: true, get: function () { return types_1.createTwoPlayerGame; } });
Object.defineProperty(exports, "profileToIndex", { enumerable: true, get: function () { return types_1.profileToIndex; } });
Object.defineProperty(exports, "indexToProfile", { enumerable: true, get: function () { return types_1.indexToProfile; } });
Object.defineProperty(exports, "totalProfiles", { enumerable: true, get: function () { return types_1.totalProfiles; } });
Object.defineProperty(exports, "payoffOf", { enumerable: true, get: function () { return types_1.payoffOf; } });
Object.defineProperty(exports, "pureDistribution", { enumerable: true, get: function () { return types_1.pureDistribution; } });
Object.defineProperty(exports, "expectedPayoff", { enumerable: true, get: function () { return types_1.expectedPayoff; } });
Object.defineProperty(exports, "approxEqual", { enumerable: true, get: function () { return types_1.approxEqual; } });
Object.defineProperty(exports, "vectorsApproxEqual", { enumerable: true, get: function () { return types_1.vectorsApproxEqual; } });
var pure_nash_1 = require("./pure-nash");
Object.defineProperty(exports, "findPureNash", { enumerable: true, get: function () { return pure_nash_1.findPureNash; } });
var support_enumeration_1 = require("./support-enumeration");
Object.defineProperty(exports, "enumerateAllNash", { enumerable: true, get: function () { return support_enumeration_1.enumerateAllNash; } });
var lemke_howson_1 = require("./lemke-howson");
Object.defineProperty(exports, "lemkeHowson", { enumerable: true, get: function () { return lemke_howson_1.lemkeHowson; } });
var dominance_1 = require("./dominance");
Object.defineProperty(exports, "isDominated", { enumerable: true, get: function () { return dominance_1.isDominated; } });
Object.defineProperty(exports, "eliminateDominated", { enumerable: true, get: function () { return dominance_1.eliminateDominated; } });
Object.defineProperty(exports, "bestResponse", { enumerable: true, get: function () { return dominance_1.bestResponse; } });
var common_games_1 = require("./common-games");
Object.defineProperty(exports, "prisonersDilemma", { enumerable: true, get: function () { return common_games_1.prisonersDilemma; } });
Object.defineProperty(exports, "rockPaperScissors", { enumerable: true, get: function () { return common_games_1.rockPaperScissors; } });
Object.defineProperty(exports, "battleOfSexes", { enumerable: true, get: function () { return common_games_1.battleOfSexes; } });
Object.defineProperty(exports, "matchingPennies", { enumerable: true, get: function () { return common_games_1.matchingPennies; } });
Object.defineProperty(exports, "stagHunt", { enumerable: true, get: function () { return common_games_1.stagHunt; } });
//# sourceMappingURL=index.js.map