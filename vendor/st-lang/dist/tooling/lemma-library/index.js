"use strict";
// ============================================================
// ST Lemma Library — entrypoint público.
//
// Biblioteca curada de lemas pre-probados (proposicional, primer
// orden, modal, aritmética, conjuntos) + búsqueda TF-IDF + intento
// de aplicación automática contra un goal.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.standardLibrary = exports.FIRSTORDER_LEMMAS = exports.MODAL_LEMMAS = exports.SET_THEORY_LEMMAS = exports.ARITHMETIC_LEMMAS = exports.PROPOSITIONAL_LEMMAS = exports.tokenize = exports.tryApplyLemma = exports.semanticSearch = exports.buildIndex = exports.LemmaLibrary = void 0;
var library_1 = require("./library");
Object.defineProperty(exports, "LemmaLibrary", { enumerable: true, get: function () { return library_1.LemmaLibrary; } });
var tfidf_1 = require("./tfidf");
Object.defineProperty(exports, "buildIndex", { enumerable: true, get: function () { return tfidf_1.buildIndex; } });
Object.defineProperty(exports, "semanticSearch", { enumerable: true, get: function () { return tfidf_1.semanticSearch; } });
var apply_1 = require("./apply");
Object.defineProperty(exports, "tryApplyLemma", { enumerable: true, get: function () { return apply_1.tryApplyLemma; } });
var tokenize_1 = require("./tokenize");
Object.defineProperty(exports, "tokenize", { enumerable: true, get: function () { return tokenize_1.tokenize; } });
var propositional_1 = require("./propositional");
Object.defineProperty(exports, "PROPOSITIONAL_LEMMAS", { enumerable: true, get: function () { return propositional_1.PROPOSITIONAL_LEMMAS; } });
var arithmetic_1 = require("./arithmetic");
Object.defineProperty(exports, "ARITHMETIC_LEMMAS", { enumerable: true, get: function () { return arithmetic_1.ARITHMETIC_LEMMAS; } });
var set_theory_1 = require("./set-theory");
Object.defineProperty(exports, "SET_THEORY_LEMMAS", { enumerable: true, get: function () { return set_theory_1.SET_THEORY_LEMMAS; } });
var modal_1 = require("./modal");
Object.defineProperty(exports, "MODAL_LEMMAS", { enumerable: true, get: function () { return modal_1.MODAL_LEMMAS; } });
var firstorder_1 = require("./firstorder");
Object.defineProperty(exports, "FIRSTORDER_LEMMAS", { enumerable: true, get: function () { return firstorder_1.FIRSTORDER_LEMMAS; } });
var standard_1 = require("./standard");
Object.defineProperty(exports, "standardLibrary", { enumerable: true, get: function () { return standard_1.standardLibrary; } });
//# sourceMappingURL=index.js.map