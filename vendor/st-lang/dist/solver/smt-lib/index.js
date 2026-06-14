"use strict";
// ============================================================
// SMT-LIB v2 — Barrel
// ============================================================
//
// Parser + emitter de scripts SMT-LIB v2 con soporte para los comandos
// estándar (set-logic, declare-fun, assert, check-sat, push/pop, etc.) y
// los constructores de término privilegiados (let, forall, exists, match,
// annotated). Complementa al serializador específico de ST en
// `src/runtime/smt/serializer.ts` permitiendo leer archivos `.smt2` y
// reemitirlos canónicamente.
Object.defineProperty(exports, "__esModule", { value: true });
exports.quoteSymbol = exports.emitTerm = exports.emitSort = exports.emitSmtLib = exports.emitCommand = exports.parseTerm = exports.parseSort = exports.parseSmtLib = exports.SmtParserError = exports.tokenize = exports.SmtTokenizerError = exports.KNOWN_LOGICS = exports.COMMAND_NAMES = void 0;
var ast_1 = require("./ast");
Object.defineProperty(exports, "COMMAND_NAMES", { enumerable: true, get: function () { return ast_1.COMMAND_NAMES; } });
Object.defineProperty(exports, "KNOWN_LOGICS", { enumerable: true, get: function () { return ast_1.KNOWN_LOGICS; } });
var tokenizer_1 = require("./tokenizer");
Object.defineProperty(exports, "SmtTokenizerError", { enumerable: true, get: function () { return tokenizer_1.SmtTokenizerError; } });
Object.defineProperty(exports, "tokenize", { enumerable: true, get: function () { return tokenizer_1.tokenize; } });
var parser_1 = require("./parser");
Object.defineProperty(exports, "SmtParserError", { enumerable: true, get: function () { return parser_1.SmtParserError; } });
Object.defineProperty(exports, "parseSmtLib", { enumerable: true, get: function () { return parser_1.parseSmtLib; } });
Object.defineProperty(exports, "parseSort", { enumerable: true, get: function () { return parser_1.parseSort; } });
Object.defineProperty(exports, "parseTerm", { enumerable: true, get: function () { return parser_1.parseTerm; } });
var emitter_1 = require("./emitter");
Object.defineProperty(exports, "emitCommand", { enumerable: true, get: function () { return emitter_1.emitCommand; } });
Object.defineProperty(exports, "emitSmtLib", { enumerable: true, get: function () { return emitter_1.emitSmtLib; } });
Object.defineProperty(exports, "emitSort", { enumerable: true, get: function () { return emitter_1.emitSort; } });
Object.defineProperty(exports, "emitTerm", { enumerable: true, get: function () { return emitter_1.emitTerm; } });
Object.defineProperty(exports, "quoteSymbol", { enumerable: true, get: function () { return emitter_1.quoteSymbol; } });
//# sourceMappingURL=index.js.map