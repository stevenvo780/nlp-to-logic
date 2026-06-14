"use strict";
// ============================================================
// generateDocs — glue.
//
// extractDocs → render(markdown|json|html-minimal) → escribe a
// outputDir, devolviendo lista de archivos y warnings detectados
// durante el proceso (símbolos sin descripción, etc.).
// ============================================================
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDocs = generateDocs;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const extract_1 = require("./extract");
const render_1 = require("./render");
/**
 * Genera documentación a disco según `opts.template`. Crea
 * `outputDir` y subdirectorios necesarios.
 *
 * El default cuando `template` no se especifica es `'markdown'`.
 */
async function generateDocs(opts) {
    const includeInternal = opts.includeInternal === true;
    const modules = (0, extract_1.extractDocs)(opts.rootDir, { includeInternal });
    const template = opts.template ?? 'markdown';
    const warnings = collectWarnings(modules);
    const filesWritten = [];
    await fs.mkdir(opts.outputDir, { recursive: true });
    if (template === 'markdown') {
        const files = (0, render_1.renderMarkdown)(modules);
        for (const [relPath, content] of files) {
            const abs = path.join(opts.outputDir, relPath);
            await fs.mkdir(path.dirname(abs), { recursive: true });
            await fs.writeFile(abs, content, 'utf8');
            filesWritten.push(abs);
        }
    }
    else if (template === 'json') {
        const abs = path.join(opts.outputDir, 'api.json');
        await fs.writeFile(abs, (0, render_1.renderJSON)(modules), 'utf8');
        filesWritten.push(abs);
    }
    else if (template === 'html-minimal') {
        const indexHtml = renderHtmlMinimal(modules);
        const abs = path.join(opts.outputDir, 'index.html');
        await fs.writeFile(abs, indexHtml, 'utf8');
        filesWritten.push(abs);
    }
    return { filesWritten, warnings };
}
function collectWarnings(modules) {
    const out = [];
    for (const mod of modules) {
        for (const sym of mod.exports) {
            if (!sym.description) {
                out.push(`${mod.path}:${sym.lineNumber}: ${sym.kind} \`${sym.name}\` sin descripción`);
            }
        }
    }
    return out;
}
function renderHtmlMinimal(modules) {
    const md = (0, render_1.renderIndex)(modules);
    // Minimal HTML que embebe el index como <pre>. Útil para preview
    // rápida sin pipeline de Markdown.
    const escaped = md.replace(/[&<>]/g, (c) => {
        if (c === '&')
            return '&amp;';
        if (c === '<')
            return '&lt;';
        return '&gt;';
    });
    return [
        '<!doctype html>',
        '<html lang="en">',
        '<head><meta charset="utf-8"><title>API Reference</title></head>',
        '<body><pre style="font:14px/1.4 monospace">',
        escaped,
        '</pre></body>',
        '</html>',
        '',
    ].join('\n');
}
//# sourceMappingURL=generate.js.map