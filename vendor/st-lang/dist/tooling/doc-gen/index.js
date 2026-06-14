"use strict";
// ============================================================
// ST doc-gen — generador de documentación de API.
//
// Toma JSDoc/TSDoc de fuentes TypeScript usando el TS Compiler
// API y produce Markdown (o JSON, o HTML minimal) por módulo.
//
// Uso típico:
//
// ```ts
// import { generateDocs } from '@stevenvo780/st-lang/tooling/doc-gen';
// await generateDocs({
//   rootDir: 'src',
//   outputDir: 'docs/api',
//   template: 'markdown',
// });
// ```
//
// La librería NO empaqueta a `dist/` un binario CLI; la idea es
// invocarla desde scripts (`scripts/build-docs.mjs`) o desde un
// task externo.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDocs = exports.toMarkdownPath = exports.renderIndex = exports.renderJSON = exports.renderMarkdown = exports.extractDocs = exports.stripCommentMarkers = exports.parseReturnsTag = exports.parseParamTag = exports.parseJSDoc = void 0;
var jsdoc_1 = require("./jsdoc");
Object.defineProperty(exports, "parseJSDoc", { enumerable: true, get: function () { return jsdoc_1.parseJSDoc; } });
Object.defineProperty(exports, "parseParamTag", { enumerable: true, get: function () { return jsdoc_1.parseParamTag; } });
Object.defineProperty(exports, "parseReturnsTag", { enumerable: true, get: function () { return jsdoc_1.parseReturnsTag; } });
Object.defineProperty(exports, "stripCommentMarkers", { enumerable: true, get: function () { return jsdoc_1.stripCommentMarkers; } });
var extract_1 = require("./extract");
Object.defineProperty(exports, "extractDocs", { enumerable: true, get: function () { return extract_1.extractDocs; } });
var render_1 = require("./render");
Object.defineProperty(exports, "renderMarkdown", { enumerable: true, get: function () { return render_1.renderMarkdown; } });
Object.defineProperty(exports, "renderJSON", { enumerable: true, get: function () { return render_1.renderJSON; } });
Object.defineProperty(exports, "renderIndex", { enumerable: true, get: function () { return render_1.renderIndex; } });
Object.defineProperty(exports, "toMarkdownPath", { enumerable: true, get: function () { return render_1.toMarkdownPath; } });
var generate_1 = require("./generate");
Object.defineProperty(exports, "generateDocs", { enumerable: true, get: function () { return generate_1.generateDocs; } });
//# sourceMappingURL=index.js.map