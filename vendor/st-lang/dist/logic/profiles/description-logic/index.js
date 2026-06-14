"use strict";
// ============================================================
// ST Description Logic — Public API (ALC profile)
// ============================================================
// Perfil ALC: el fragmento base de OWL/DL. Provee un decisor
// completo y terminante para satisfacibilidad de conceptos,
// subsumption, instance checking y clasificación.
//
// Procedimiento: tableau con subset blocking. Termina sobre KBs
// cíclicas. NO se inscribe en el ProfileRegistry (esto es un módulo
// de razonamiento independiente, no un perfil sentencial textual).
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.classify = exports.isInstance = exports.isSubsumed = exports.isSatisfiable = exports.conceptToString = exports.conceptEqual = exports.conceptHash = exports.toNNF = exports.emptyKB = exports.roleInstance = exports.instance = exports.equivalent = exports.subsumes = exports.forall = exports.exists = exports.or = exports.and = exports.not = exports.atomic = exports.BOTTOM = exports.TOP = void 0;
var types_1 = require("./types");
Object.defineProperty(exports, "TOP", { enumerable: true, get: function () { return types_1.TOP; } });
Object.defineProperty(exports, "BOTTOM", { enumerable: true, get: function () { return types_1.BOTTOM; } });
Object.defineProperty(exports, "atomic", { enumerable: true, get: function () { return types_1.atomic; } });
Object.defineProperty(exports, "not", { enumerable: true, get: function () { return types_1.not; } });
Object.defineProperty(exports, "and", { enumerable: true, get: function () { return types_1.and; } });
Object.defineProperty(exports, "or", { enumerable: true, get: function () { return types_1.or; } });
Object.defineProperty(exports, "exists", { enumerable: true, get: function () { return types_1.exists; } });
Object.defineProperty(exports, "forall", { enumerable: true, get: function () { return types_1.forall; } });
Object.defineProperty(exports, "subsumes", { enumerable: true, get: function () { return types_1.subsumes; } });
Object.defineProperty(exports, "equivalent", { enumerable: true, get: function () { return types_1.equivalent; } });
Object.defineProperty(exports, "instance", { enumerable: true, get: function () { return types_1.instance; } });
Object.defineProperty(exports, "roleInstance", { enumerable: true, get: function () { return types_1.roleInstance; } });
Object.defineProperty(exports, "emptyKB", { enumerable: true, get: function () { return types_1.emptyKB; } });
var nnf_1 = require("./nnf");
Object.defineProperty(exports, "toNNF", { enumerable: true, get: function () { return nnf_1.toNNF; } });
Object.defineProperty(exports, "conceptHash", { enumerable: true, get: function () { return nnf_1.conceptHash; } });
Object.defineProperty(exports, "conceptEqual", { enumerable: true, get: function () { return nnf_1.conceptEqual; } });
Object.defineProperty(exports, "conceptToString", { enumerable: true, get: function () { return nnf_1.conceptToString; } });
var tableau_1 = require("./tableau");
Object.defineProperty(exports, "isSatisfiable", { enumerable: true, get: function () { return tableau_1.isSatisfiable; } });
Object.defineProperty(exports, "isSubsumed", { enumerable: true, get: function () { return tableau_1.isSubsumed; } });
Object.defineProperty(exports, "isInstance", { enumerable: true, get: function () { return tableau_1.isInstance; } });
Object.defineProperty(exports, "classify", { enumerable: true, get: function () { return tableau_1.classify; } });
//# sourceMappingURL=index.js.map