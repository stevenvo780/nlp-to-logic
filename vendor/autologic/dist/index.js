"use strict";
/**
 * Autologic — Formalizador automático de texto natural a lógica formal ST
 *
 * @packageDocumentation
 * @module @stevenvo780/autologic
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateST = exports.emitST = exports.buildFormulas = exports.extractAtoms = exports.analyzeDiscourse = exports.segment = exports.llmResultToST = exports.parseTextWithLLM = exports.Autologic = exports.DEFAULT_RULES = exports.lintNaturalLanguage = exports.formalizeWithLLM = exports.formalize = void 0;
// ── API pública principal ─────────────────────
var formalize_1 = require("./formalize");
Object.defineProperty(exports, "formalize", { enumerable: true, get: function () { return formalize_1.formalize; } });
Object.defineProperty(exports, "formalizeWithLLM", { enumerable: true, get: function () { return formalize_1.formalizeWithLLM; } });
var nl_linter_1 = require("./nl-linter");
Object.defineProperty(exports, "lintNaturalLanguage", { enumerable: true, get: function () { return nl_linter_1.lintNaturalLanguage; } });
Object.defineProperty(exports, "DEFAULT_RULES", { enumerable: true, get: function () { return nl_linter_1.DEFAULT_RULES; } });
var autologic_1 = require("./autologic");
Object.defineProperty(exports, "Autologic", { enumerable: true, get: function () { return autologic_1.Autologic; } });
var llm_parser_1 = require("./llm-parser");
Object.defineProperty(exports, "parseTextWithLLM", { enumerable: true, get: function () { return llm_parser_1.parseTextWithLLM; } });
Object.defineProperty(exports, "llmResultToST", { enumerable: true, get: function () { return llm_parser_1.llmResultToST; } });
// ── Utilidades expuestas ──────────────────────
var segmenter_1 = require("./segmenter");
Object.defineProperty(exports, "segment", { enumerable: true, get: function () { return segmenter_1.segment; } });
var discourse_1 = require("./discourse");
Object.defineProperty(exports, "analyzeDiscourse", { enumerable: true, get: function () { return discourse_1.analyzeDiscourse; } });
var atoms_1 = require("./atoms");
Object.defineProperty(exports, "extractAtoms", { enumerable: true, get: function () { return atoms_1.extractAtoms; } });
var formula_1 = require("./formula");
Object.defineProperty(exports, "buildFormulas", { enumerable: true, get: function () { return formula_1.buildFormulas; } });
var st_emitter_1 = require("./generator/st-emitter");
Object.defineProperty(exports, "emitST", { enumerable: true, get: function () { return st_emitter_1.emitST; } });
var validator_1 = require("./generator/validator");
Object.defineProperty(exports, "validateST", { enumerable: true, get: function () { return validator_1.validateST; } });
//# sourceMappingURL=index.js.map