"use strict";
// ============================================================
// TPTP — Barrel
// ============================================================
//
// Parser + emitter para el formato TPTP (Thousands of Problems for
// Theorem Provers), soporte FOF / CNF / TFF light. Incluye un puente
// (`toFolProverFormat`) que convierte un `TptpProblem` al tipo `Formula`
// que entiende `src/fol-prover`.
Object.defineProperty(exports, "__esModule", { value: true });
exports.annotatedToFol = exports.tptpFormulaToFol = exports.toFolProverFormat = exports.emitTerm = exports.emitFormula = exports.emitTptp = exports.parseTerm = exports.parseFormula = exports.parseTptp = exports.TptpParserError = exports.tokenize = exports.TptpTokenizerError = exports.TPTP_ROLES = exports.TPTP_LANGUAGES = void 0;
var ast_1 = require("./ast");
Object.defineProperty(exports, "TPTP_LANGUAGES", { enumerable: true, get: function () { return ast_1.TPTP_LANGUAGES; } });
Object.defineProperty(exports, "TPTP_ROLES", { enumerable: true, get: function () { return ast_1.TPTP_ROLES; } });
var tokenizer_1 = require("./tokenizer");
Object.defineProperty(exports, "TptpTokenizerError", { enumerable: true, get: function () { return tokenizer_1.TptpTokenizerError; } });
Object.defineProperty(exports, "tokenize", { enumerable: true, get: function () { return tokenizer_1.tokenize; } });
var parser_1 = require("./parser");
Object.defineProperty(exports, "TptpParserError", { enumerable: true, get: function () { return parser_1.TptpParserError; } });
Object.defineProperty(exports, "parseTptp", { enumerable: true, get: function () { return parser_1.parseTptp; } });
Object.defineProperty(exports, "parseFormula", { enumerable: true, get: function () { return parser_1.parseFormula; } });
Object.defineProperty(exports, "parseTerm", { enumerable: true, get: function () { return parser_1.parseTerm; } });
var emitter_1 = require("./emitter");
Object.defineProperty(exports, "emitTptp", { enumerable: true, get: function () { return emitter_1.emitTptp; } });
Object.defineProperty(exports, "emitFormula", { enumerable: true, get: function () { return emitter_1.emitFormula; } });
Object.defineProperty(exports, "emitTerm", { enumerable: true, get: function () { return emitter_1.emitTerm; } });
var bridge_1 = require("./bridge");
Object.defineProperty(exports, "toFolProverFormat", { enumerable: true, get: function () { return bridge_1.toFolProverFormat; } });
Object.defineProperty(exports, "tptpFormulaToFol", { enumerable: true, get: function () { return bridge_1.tptpFormulaToFol; } });
Object.defineProperty(exports, "annotatedToFol", { enumerable: true, get: function () { return bridge_1.annotatedToFol; } });
//# sourceMappingURL=index.js.map