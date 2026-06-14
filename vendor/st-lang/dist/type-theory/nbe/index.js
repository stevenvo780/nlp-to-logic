"use strict";
// Punto de entrada público del módulo NbE.
Object.defineProperty(exports, "__esModule", { value: true });
exports.reify = exports.normalize = exports.makeFreshSupply = exports.evaluate = exports.apply = exports.vNeutralVar = exports.vNeutral = exports.vClosure = exports.v = exports.typeToString = exports.typeEq = exports.termToString = exports.tBase = exports.tArr = exports.lam = exports.apN = exports.ap = exports.alphaEq = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "alphaEq", { enumerable: true, get: function () { return types_1.alphaEq; } });
Object.defineProperty(exports, "ap", { enumerable: true, get: function () { return types_1.ap; } });
Object.defineProperty(exports, "apN", { enumerable: true, get: function () { return types_1.apN; } });
Object.defineProperty(exports, "lam", { enumerable: true, get: function () { return types_1.lam; } });
Object.defineProperty(exports, "tArr", { enumerable: true, get: function () { return types_1.tArr; } });
Object.defineProperty(exports, "tBase", { enumerable: true, get: function () { return types_1.tBase; } });
Object.defineProperty(exports, "termToString", { enumerable: true, get: function () { return types_1.termToString; } });
Object.defineProperty(exports, "typeEq", { enumerable: true, get: function () { return types_1.typeEq; } });
Object.defineProperty(exports, "typeToString", { enumerable: true, get: function () { return types_1.typeToString; } });
Object.defineProperty(exports, "v", { enumerable: true, get: function () { return types_1.v; } });
Object.defineProperty(exports, "vClosure", { enumerable: true, get: function () { return types_1.vClosure; } });
Object.defineProperty(exports, "vNeutral", { enumerable: true, get: function () { return types_1.vNeutral; } });
Object.defineProperty(exports, "vNeutralVar", { enumerable: true, get: function () { return types_1.vNeutralVar; } });
var nbe_1 = require("./nbe");
Object.defineProperty(exports, "apply", { enumerable: true, get: function () { return nbe_1.apply; } });
Object.defineProperty(exports, "evaluate", { enumerable: true, get: function () { return nbe_1.evaluate; } });
Object.defineProperty(exports, "makeFreshSupply", { enumerable: true, get: function () { return nbe_1.makeFreshSupply; } });
Object.defineProperty(exports, "normalize", { enumerable: true, get: function () { return nbe_1.normalize; } });
Object.defineProperty(exports, "reify", { enumerable: true, get: function () { return nbe_1.reify; } });
//# sourceMappingURL=index.js.map