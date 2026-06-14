"use strict";
// ============================================================
// ST Formal Concept Analysis — barrel público.
// ============================================================
// Marco matemático (Wille 1982, Ganter & Wille 1999) para extraer un
// retículo de conceptos a partir de una relación binaria objeto-atributo.
//
// API mínima:
//   createContext(G, M, I)        → FormalContext
//   derivativeObjects(K, B)       → B'   (objetos)
//   derivativeAttributes(K, A)    → A'   (atributos)
//   isConcept(K, A, B)            → (A, B) ∈ B(K)?
//   closeIntent(K, B)             → B''  (clausura Galois sobre atributos)
//   allConcepts(K)                → todos los conceptos (Next Closure)
//   lattice(concepts)             → diagrama de Hasse (aristas cobertura)
//   impliesAll(K, P, C)           → ¿P → C válida en K?
//
// Uso típico:
//   const K = createContext(objs, attrs, pairs);
//   const concepts = allConcepts(K);
//   const hasse = lattice(concepts);
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.impliesAll = exports.lattice = exports.allConcepts = exports.hasIncidence = exports.closeExtent = exports.closeIntent = exports.isConcept = exports.derivativeAttributes = exports.derivativeObjects = exports.createContext = void 0;
var context_1 = require("./context");
Object.defineProperty(exports, "createContext", { enumerable: true, get: function () { return context_1.createContext; } });
Object.defineProperty(exports, "derivativeObjects", { enumerable: true, get: function () { return context_1.derivativeObjects; } });
Object.defineProperty(exports, "derivativeAttributes", { enumerable: true, get: function () { return context_1.derivativeAttributes; } });
Object.defineProperty(exports, "isConcept", { enumerable: true, get: function () { return context_1.isConcept; } });
Object.defineProperty(exports, "closeIntent", { enumerable: true, get: function () { return context_1.closeIntent; } });
Object.defineProperty(exports, "closeExtent", { enumerable: true, get: function () { return context_1.closeExtent; } });
Object.defineProperty(exports, "hasIncidence", { enumerable: true, get: function () { return context_1.hasIncidence; } });
var next_closure_1 = require("./next-closure");
Object.defineProperty(exports, "allConcepts", { enumerable: true, get: function () { return next_closure_1.allConcepts; } });
var lattice_1 = require("./lattice");
Object.defineProperty(exports, "lattice", { enumerable: true, get: function () { return lattice_1.lattice; } });
var implications_1 = require("./implications");
Object.defineProperty(exports, "impliesAll", { enumerable: true, get: function () { return implications_1.impliesAll; } });
//# sourceMappingURL=index.js.map