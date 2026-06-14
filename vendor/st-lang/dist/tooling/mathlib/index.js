"use strict";
// ============================================================
// ST Mathlib — Subset curado de definiciones algebraicas.
// Inspirado en Lean mathlib. Soporta order theory, group theory,
// ring theory + instancias estándar (Z, Q, Z/nZ, S_3) + lemas.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.STANDARD_LEMMAS = exports.perm3Eq = exports.sym3Elements = exports.sym3 = exports.zModNDiv = exports.zModNElements = exports.zModN = exports.rationalDiv = exports.rationalEq = exports.rational = exports.rationalsField = exports.intRing = exports.intAdditiveGroup = exports.isField = exports.verifyRing = exports.verifyAbelianGroup = exports.verifyGroup = exports.hasInverses = exports.hasIdentity = exports.isCommutative = exports.isAssociative = exports.verifyPartialOrder = exports.isLattice = exports.isTransitive = exports.isAntisymmetric = exports.isReflexive = void 0;
var order_1 = require("./order");
Object.defineProperty(exports, "isReflexive", { enumerable: true, get: function () { return order_1.isReflexive; } });
Object.defineProperty(exports, "isAntisymmetric", { enumerable: true, get: function () { return order_1.isAntisymmetric; } });
Object.defineProperty(exports, "isTransitive", { enumerable: true, get: function () { return order_1.isTransitive; } });
Object.defineProperty(exports, "isLattice", { enumerable: true, get: function () { return order_1.isLattice; } });
Object.defineProperty(exports, "verifyPartialOrder", { enumerable: true, get: function () { return order_1.verifyPartialOrder; } });
var group_1 = require("./group");
Object.defineProperty(exports, "isAssociative", { enumerable: true, get: function () { return group_1.isAssociative; } });
Object.defineProperty(exports, "isCommutative", { enumerable: true, get: function () { return group_1.isCommutative; } });
Object.defineProperty(exports, "hasIdentity", { enumerable: true, get: function () { return group_1.hasIdentity; } });
Object.defineProperty(exports, "hasInverses", { enumerable: true, get: function () { return group_1.hasInverses; } });
Object.defineProperty(exports, "verifyGroup", { enumerable: true, get: function () { return group_1.verifyGroup; } });
Object.defineProperty(exports, "verifyAbelianGroup", { enumerable: true, get: function () { return group_1.verifyAbelianGroup; } });
var ring_1 = require("./ring");
Object.defineProperty(exports, "verifyRing", { enumerable: true, get: function () { return ring_1.verifyRing; } });
Object.defineProperty(exports, "isField", { enumerable: true, get: function () { return ring_1.isField; } });
var instances_1 = require("./instances");
Object.defineProperty(exports, "intAdditiveGroup", { enumerable: true, get: function () { return instances_1.intAdditiveGroup; } });
Object.defineProperty(exports, "intRing", { enumerable: true, get: function () { return instances_1.intRing; } });
Object.defineProperty(exports, "rationalsField", { enumerable: true, get: function () { return instances_1.rationalsField; } });
Object.defineProperty(exports, "rational", { enumerable: true, get: function () { return instances_1.rational; } });
Object.defineProperty(exports, "rationalEq", { enumerable: true, get: function () { return instances_1.rationalEq; } });
Object.defineProperty(exports, "rationalDiv", { enumerable: true, get: function () { return instances_1.rationalDiv; } });
Object.defineProperty(exports, "zModN", { enumerable: true, get: function () { return instances_1.zModN; } });
Object.defineProperty(exports, "zModNElements", { enumerable: true, get: function () { return instances_1.zModNElements; } });
Object.defineProperty(exports, "zModNDiv", { enumerable: true, get: function () { return instances_1.zModNDiv; } });
Object.defineProperty(exports, "sym3", { enumerable: true, get: function () { return instances_1.sym3; } });
Object.defineProperty(exports, "sym3Elements", { enumerable: true, get: function () { return instances_1.sym3Elements; } });
Object.defineProperty(exports, "perm3Eq", { enumerable: true, get: function () { return instances_1.perm3Eq; } });
var lemmas_1 = require("./lemmas");
Object.defineProperty(exports, "STANDARD_LEMMAS", { enumerable: true, get: function () { return lemmas_1.STANDARD_LEMMAS; } });
//# sourceMappingURL=index.js.map