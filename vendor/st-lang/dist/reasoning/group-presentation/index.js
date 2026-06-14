"use strict";
// ============================================================
// ST Group Presentation — barrel público.
// ============================================================
// Presentaciones finitas de grupos ⟨S | R⟩, palabras en el grupo
// libre F(S), reducción libre, multiplicación, Todd-Coxeter para
// enumeración de cosets, orden de grupo finito, pertenencia a
// subgrupo y grafo de Cayley.
//
// Convención del alfabeto: letras a-z son generadores positivos,
// A-Z son sus inversos (case-flip). Las palabras son `Generator[]`,
// la palabra vacía representa el neutro 1.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.cayleyGraph = exports.symmetricGroupSn = exports.freeGroupFn = exports.dihedralGroupDn = exports.cyclicGroupZn = exports.isInSubgroup = exports.groupOrder = exports.toddCoxeter = exports.wordToString = exports.parseWord = exports.isReduced = exports.wordEquals = exports.invertWord = exports.multiplyWords = exports.reduceWord = exports.inverse = void 0;
var words_1 = require("./words");
Object.defineProperty(exports, "inverse", { enumerable: true, get: function () { return words_1.inverse; } });
Object.defineProperty(exports, "reduceWord", { enumerable: true, get: function () { return words_1.reduceWord; } });
Object.defineProperty(exports, "multiplyWords", { enumerable: true, get: function () { return words_1.multiplyWords; } });
Object.defineProperty(exports, "invertWord", { enumerable: true, get: function () { return words_1.invertWord; } });
Object.defineProperty(exports, "wordEquals", { enumerable: true, get: function () { return words_1.wordEquals; } });
Object.defineProperty(exports, "isReduced", { enumerable: true, get: function () { return words_1.isReduced; } });
Object.defineProperty(exports, "parseWord", { enumerable: true, get: function () { return words_1.parseWord; } });
Object.defineProperty(exports, "wordToString", { enumerable: true, get: function () { return words_1.wordToString; } });
var todd_coxeter_1 = require("./todd-coxeter");
Object.defineProperty(exports, "toddCoxeter", { enumerable: true, get: function () { return todd_coxeter_1.toddCoxeter; } });
Object.defineProperty(exports, "groupOrder", { enumerable: true, get: function () { return todd_coxeter_1.groupOrder; } });
Object.defineProperty(exports, "isInSubgroup", { enumerable: true, get: function () { return todd_coxeter_1.isInSubgroup; } });
var standard_groups_1 = require("./standard-groups");
Object.defineProperty(exports, "cyclicGroupZn", { enumerable: true, get: function () { return standard_groups_1.cyclicGroupZn; } });
Object.defineProperty(exports, "dihedralGroupDn", { enumerable: true, get: function () { return standard_groups_1.dihedralGroupDn; } });
Object.defineProperty(exports, "freeGroupFn", { enumerable: true, get: function () { return standard_groups_1.freeGroupFn; } });
Object.defineProperty(exports, "symmetricGroupSn", { enumerable: true, get: function () { return standard_groups_1.symmetricGroupSn; } });
var cayley_1 = require("./cayley");
Object.defineProperty(exports, "cayleyGraph", { enumerable: true, get: function () { return cayley_1.cayleyGraph; } });
//# sourceMappingURL=index.js.map