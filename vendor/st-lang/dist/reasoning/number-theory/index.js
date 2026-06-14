"use strict";
// ============================================================
// ST Number Theory — barrel público.
// ============================================================
// Primitivas:
//   gcd / lcm / extendedGcd            — Euclides + Bézout.
//   modPow / modInverse / modSolve     — aritmética modular.
//   crt                                — Chinese Remainder generalizado.
//   isPrime / millerRabin              — primalidad determinístico-ish.
//   nextPrime / previousPrime / primesBelow
//   factorize / divisors / eulerPhi / mobius
//   linearDiophantine                  — Bézout sobre ax+by=c.
//   continuedFractionExpansion / fromContinuedFraction
//   legendreSymbol / jacobiSymbol      — residuos cuadráticos.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.jacobiSymbol = exports.legendreSymbol = exports.fromContinuedFraction = exports.continuedFractionExpansion = exports.linearDiophantine = exports.mobius = exports.eulerPhi = exports.divisors = exports.factorize = exports.primesBelow = exports.previousPrime = exports.nextPrime = exports.millerRabin = exports.isPrime = exports.crt = exports.modSolve = exports.modInverse = exports.modPow = exports.extendedGcd = exports.lcm = exports.gcd = void 0;
var gcd_1 = require("./gcd");
Object.defineProperty(exports, "gcd", { enumerable: true, get: function () { return gcd_1.gcd; } });
Object.defineProperty(exports, "lcm", { enumerable: true, get: function () { return gcd_1.lcm; } });
Object.defineProperty(exports, "extendedGcd", { enumerable: true, get: function () { return gcd_1.extendedGcd; } });
var modular_1 = require("./modular");
Object.defineProperty(exports, "modPow", { enumerable: true, get: function () { return modular_1.modPow; } });
Object.defineProperty(exports, "modInverse", { enumerable: true, get: function () { return modular_1.modInverse; } });
Object.defineProperty(exports, "modSolve", { enumerable: true, get: function () { return modular_1.modSolve; } });
var crt_1 = require("./crt");
Object.defineProperty(exports, "crt", { enumerable: true, get: function () { return crt_1.crt; } });
var primality_1 = require("./primality");
Object.defineProperty(exports, "isPrime", { enumerable: true, get: function () { return primality_1.isPrime; } });
Object.defineProperty(exports, "millerRabin", { enumerable: true, get: function () { return primality_1.millerRabin; } });
Object.defineProperty(exports, "nextPrime", { enumerable: true, get: function () { return primality_1.nextPrime; } });
Object.defineProperty(exports, "previousPrime", { enumerable: true, get: function () { return primality_1.previousPrime; } });
Object.defineProperty(exports, "primesBelow", { enumerable: true, get: function () { return primality_1.primesBelow; } });
var factorization_1 = require("./factorization");
Object.defineProperty(exports, "factorize", { enumerable: true, get: function () { return factorization_1.factorize; } });
Object.defineProperty(exports, "divisors", { enumerable: true, get: function () { return factorization_1.divisors; } });
Object.defineProperty(exports, "eulerPhi", { enumerable: true, get: function () { return factorization_1.eulerPhi; } });
Object.defineProperty(exports, "mobius", { enumerable: true, get: function () { return factorization_1.mobius; } });
var diophantine_1 = require("./diophantine");
Object.defineProperty(exports, "linearDiophantine", { enumerable: true, get: function () { return diophantine_1.linearDiophantine; } });
Object.defineProperty(exports, "continuedFractionExpansion", { enumerable: true, get: function () { return diophantine_1.continuedFractionExpansion; } });
Object.defineProperty(exports, "fromContinuedFraction", { enumerable: true, get: function () { return diophantine_1.fromContinuedFraction; } });
var symbols_1 = require("./symbols");
Object.defineProperty(exports, "legendreSymbol", { enumerable: true, get: function () { return symbols_1.legendreSymbol; } });
Object.defineProperty(exports, "jacobiSymbol", { enumerable: true, get: function () { return symbols_1.jacobiSymbol; } });
//# sourceMappingURL=index.js.map