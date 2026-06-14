"use strict";
/**
 * ST Notebook Format (.stnb)
 * Análogo a Jupyter .ipynb pero para proofs ST.
 *
 * API pública:
 *   parseNotebook(source)     — JSON string → Notebook
 *   serializeNotebook(nb)     — Notebook → JSON string (pretty, 2 spaces)
 *   executeNotebook(nb, opts) — ejecuta cells code, captura outputs
 *   renderHTML(nb)            — Notebook → HTML standalone (KaTeX)
 *   renderMarkdown(nb)        — Notebook → Markdown export
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderMarkdown = exports.renderHTML = exports.executeCell = exports.executeNotebook = exports.serializeNotebookCompact = exports.serializeNotebook = exports.ParseError = exports.parseNotebook = void 0;
var parser_1 = require("./parser");
Object.defineProperty(exports, "parseNotebook", { enumerable: true, get: function () { return parser_1.parseNotebook; } });
Object.defineProperty(exports, "ParseError", { enumerable: true, get: function () { return parser_1.ParseError; } });
var serializer_1 = require("./serializer");
Object.defineProperty(exports, "serializeNotebook", { enumerable: true, get: function () { return serializer_1.serializeNotebook; } });
Object.defineProperty(exports, "serializeNotebookCompact", { enumerable: true, get: function () { return serializer_1.serializeNotebookCompact; } });
var executor_1 = require("./executor");
Object.defineProperty(exports, "executeNotebook", { enumerable: true, get: function () { return executor_1.executeNotebook; } });
Object.defineProperty(exports, "executeCell", { enumerable: true, get: function () { return executor_1.executeCell; } });
var renderer_html_1 = require("./renderer-html");
Object.defineProperty(exports, "renderHTML", { enumerable: true, get: function () { return renderer_html_1.renderHTML; } });
var renderer_markdown_1 = require("./renderer-markdown");
Object.defineProperty(exports, "renderMarkdown", { enumerable: true, get: function () { return renderer_markdown_1.renderMarkdown; } });
//# sourceMappingURL=index.js.map