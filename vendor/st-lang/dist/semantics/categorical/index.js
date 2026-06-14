"use strict";
// ============================================================
// ST Categorical — Punto de entrada público
// ============================================================
// Re-exporta primitivas de teoría de categorías: Category,
// Functor, NaturalTransformation, límites/colímites concretos
// en FinSet, y estructura monoidal estricta sobre FinSet.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinSetMonoidal = exports.coequalizer = exports.equalizer = exports.coproduct = exports.product = exports.isLimit = exports.isCone = exports.identityNT = exports.mkNaturalTransformation = exports.composeFunctors = exports.identityFunctor = exports.mkFunctor = exports.Free = exports.Poset = exports.mkFinSetMor = exports.FinSet = void 0;
var fin_set_1 = require("./fin-set");
Object.defineProperty(exports, "FinSet", { enumerable: true, get: function () { return fin_set_1.FinSet; } });
Object.defineProperty(exports, "mkFinSetMor", { enumerable: true, get: function () { return fin_set_1.mkFinSetMor; } });
var poset_1 = require("./poset");
Object.defineProperty(exports, "Poset", { enumerable: true, get: function () { return poset_1.Poset; } });
var free_1 = require("./free");
Object.defineProperty(exports, "Free", { enumerable: true, get: function () { return free_1.Free; } });
var functor_1 = require("./functor");
Object.defineProperty(exports, "mkFunctor", { enumerable: true, get: function () { return functor_1.mkFunctor; } });
Object.defineProperty(exports, "identityFunctor", { enumerable: true, get: function () { return functor_1.identityFunctor; } });
Object.defineProperty(exports, "composeFunctors", { enumerable: true, get: function () { return functor_1.composeFunctors; } });
Object.defineProperty(exports, "mkNaturalTransformation", { enumerable: true, get: function () { return functor_1.mkNaturalTransformation; } });
Object.defineProperty(exports, "identityNT", { enumerable: true, get: function () { return functor_1.identityNT; } });
var limits_1 = require("./limits");
Object.defineProperty(exports, "isCone", { enumerable: true, get: function () { return limits_1.isCone; } });
Object.defineProperty(exports, "isLimit", { enumerable: true, get: function () { return limits_1.isLimit; } });
Object.defineProperty(exports, "product", { enumerable: true, get: function () { return limits_1.product; } });
Object.defineProperty(exports, "coproduct", { enumerable: true, get: function () { return limits_1.coproduct; } });
Object.defineProperty(exports, "equalizer", { enumerable: true, get: function () { return limits_1.equalizer; } });
Object.defineProperty(exports, "coequalizer", { enumerable: true, get: function () { return limits_1.coequalizer; } });
var monoidal_1 = require("./monoidal");
Object.defineProperty(exports, "FinSetMonoidal", { enumerable: true, get: function () { return monoidal_1.FinSetMonoidal; } });
//# sourceMappingURL=index.js.map