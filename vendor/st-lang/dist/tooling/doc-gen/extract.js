"use strict";
// ============================================================
// Extractor — recorre los `.ts` de un rootDir con el TS Compiler
// API y construye un DocModule[] con todos los símbolos exportados
// (top-level) más su JSDoc/TSDoc asociado.
//
// Skip:
//  - archivos de tests (`*.test.ts`, `src/tests/**`)
//  - `index.ts` SIN re-export con doc propio (igual lo escaneamos,
//    pero los re-exports sin doc no entran como ApiDoc — typescript
//    los exporta sin nodo de declaración local).
//  - símbolos no exportados, salvo `includeInternal: true`.
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractDocs = extractDocs;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const typescript_1 = __importDefault(require("typescript"));
const jsdoc_1 = require("./jsdoc");
/**
 * Entrada principal. Recorre `rootDir` recursivamente, parsea cada
 * archivo `.ts` y devuelve un `DocModule` por archivo con contenido.
 *
 * Archivos sin exports documentados se omiten (no aparecen en el
 * resultado) para mantener el output compacto.
 */
function extractDocs(rootDir, opts = {}) {
    const includeInternal = opts.includeInternal === true;
    const absRoot = path.resolve(rootDir);
    const files = collectTsFiles(absRoot);
    const modules = [];
    for (const file of files) {
        const source = fs.readFileSync(file, 'utf8');
        const sf = typescript_1.default.createSourceFile(file, source, typescript_1.default.ScriptTarget.ES2022, true, typescript_1.default.ScriptKind.TS);
        const moduleRelPath = path.relative(absRoot, file).replace(/\\/g, '/');
        const description = extractFileLevelDescription(sf, source);
        const exports = extractFromSourceFile(sf, source, moduleRelPath, file, includeInternal);
        if (exports.length === 0 && !description)
            continue;
        modules.push({
            path: moduleRelPath,
            description,
            exports,
        });
    }
    modules.sort((a, b) => a.path.localeCompare(b.path));
    return modules;
}
function collectTsFiles(root) {
    const out = [];
    const stack = [root];
    while (stack.length) {
        const dir = stack.pop();
        if (!dir)
            continue;
        let entries;
        try {
            entries = fs.readdirSync(dir, { withFileTypes: true });
        }
        catch {
            continue;
        }
        for (const ent of entries) {
            const full = path.join(dir, ent.name);
            if (ent.isDirectory()) {
                if (ent.name === 'node_modules' || ent.name === 'dist' || ent.name.startsWith('.')) {
                    continue;
                }
                if (ent.name === 'tests' || ent.name === '__tests__')
                    continue;
                stack.push(full);
            }
            else if (ent.isFile()) {
                if (!ent.name.endsWith('.ts'))
                    continue;
                if (ent.name.endsWith('.d.ts'))
                    continue;
                if (ent.name.endsWith('.test.ts') || ent.name.endsWith('.spec.ts'))
                    continue;
                out.push(full);
            }
        }
    }
    out.sort();
    return out;
}
function extractFileLevelDescription(sf, source) {
    // Busca un bloque `/** ... */` que aparezca antes de la primera declaración.
    const firstStatement = sf.statements[0];
    const upTo = firstStatement ? firstStatement.getStart(sf) : source.length;
    const head = source.slice(0, upTo);
    const m = /\/\*\*([\s\S]*?)\*\//.exec(head);
    if (!m) {
        // También aceptamos comentarios `//` consecutivos al inicio.
        const lines = head.split('\n');
        const desc = [];
        for (const line of lines) {
            const t = line.trim();
            if (t.startsWith('//')) {
                const body = t.replace(/^\/+\s?/, '');
                if (body)
                    desc.push(body);
            }
            else if (t === '') {
                if (desc.length > 0)
                    continue;
            }
            else {
                break;
            }
        }
        if (desc.length === 0)
            return undefined;
        return desc.join(' ').trim() || undefined;
    }
    const cleaned = (0, jsdoc_1.stripCommentMarkers)(m[0]);
    const parsed = (0, jsdoc_1.parseJSDoc)(cleaned);
    // Si hay tag @fileoverview úsalo, si no, la description del bloque.
    const fov = parsed.tags.find((t) => t.tag === 'fileoverview' || t.tag === 'file');
    const desc = fov ? fov.content : parsed.description;
    return desc.trim() || undefined;
}
function extractFromSourceFile(sf, source, modulePath, filePath, includeInternal) {
    const ctx = {
        source,
        sf,
        modulePath,
        filePath,
        includeInternal,
        out: [],
    };
    for (const stmt of sf.statements) {
        visitTopLevel(stmt, ctx);
    }
    return ctx.out;
}
function visitTopLevel(node, ctx) {
    const exported = hasExportModifier(node);
    if (!exported && !ctx.includeInternal)
        return;
    if (typescript_1.default.isFunctionDeclaration(node) && node.name) {
        pushDoc(ctx, node, node.name.text, 'function');
        return;
    }
    if (typescript_1.default.isClassDeclaration(node) && node.name) {
        pushDoc(ctx, node, node.name.text, 'class');
        return;
    }
    if (typescript_1.default.isInterfaceDeclaration(node)) {
        pushDoc(ctx, node, node.name.text, 'interface');
        return;
    }
    if (typescript_1.default.isTypeAliasDeclaration(node)) {
        pushDoc(ctx, node, node.name.text, 'type');
        return;
    }
    if (typescript_1.default.isEnumDeclaration(node)) {
        pushDoc(ctx, node, node.name.text, 'enum');
        return;
    }
    if (typescript_1.default.isModuleDeclaration(node) && node.name) {
        const name = typescript_1.default.isIdentifier(node.name) ? node.name.text : node.name.text;
        pushDoc(ctx, node, name, 'namespace');
        return;
    }
    if (typescript_1.default.isVariableStatement(node)) {
        for (const decl of node.declarationList.declarations) {
            if (decl.name && typescript_1.default.isIdentifier(decl.name)) {
                pushDoc(ctx, node, decl.name.text, 'const', decl);
            }
        }
        return;
    }
}
function hasExportModifier(node) {
    const mods = node.modifiers;
    if (!mods)
        return false;
    return mods.some((m) => m.kind === typescript_1.default.SyntaxKind.ExportKeyword);
}
function pushDoc(ctx, node, name, kind, detailNode) {
    const exported = hasExportModifier(node);
    const jsdoc = getJSDocFor(node, ctx.source);
    const parsed = jsdoc ? (0, jsdoc_1.parseJSDoc)(jsdoc) : { description: '', tags: [] };
    // @internal filter (cuando no se solicitó includeInternal)
    if (!ctx.includeInternal && parsed.tags.some((t) => t.tag === 'internal'))
        return;
    const target = detailNode ?? node;
    const signature = buildSignature(target, ctx.source);
    const { line } = ctx.sf.getLineAndCharacterOfPosition(node.getStart(ctx.sf));
    const doc = {
        name,
        kind,
        description: parsed.description,
        signature,
        module: ctx.modulePath,
        filePath: ctx.filePath,
        lineNumber: line + 1,
        exported,
    };
    const params = collectParameters(node, parsed);
    if (params && params.length > 0)
        doc.parameters = params;
    const returns = collectReturns(node, parsed);
    if (returns)
        doc.returns = returns;
    const examples = parsed.tags.filter((t) => t.tag === 'example').map((t) => t.content);
    if (examples.length > 0)
        doc.examples = examples;
    const remarks = parsed.tags.find((t) => t.tag === 'remarks');
    if (remarks)
        doc.remarks = remarks.content;
    const see = parsed.tags.filter((t) => t.tag === 'see').map((t) => t.content);
    if (see.length > 0)
        doc.see = see;
    const deprecated = parsed.tags.find((t) => t.tag === 'deprecated');
    if (deprecated)
        doc.deprecated = true;
    ctx.out.push(doc);
}
function getJSDocFor(node, source) {
    // ts ofrece getJSDocCommentRanges sólo en internal API, usamos
    // getLeadingCommentRanges + filtramos los que sean `/** ... */`.
    const fullStart = node.getFullStart();
    const ranges = typescript_1.default.getLeadingCommentRanges(source, fullStart);
    if (!ranges || ranges.length === 0)
        return undefined;
    // El último range pegado al nodo es el "su" JSDoc.
    const last = ranges[ranges.length - 1];
    if (!last)
        return undefined;
    const raw = source.slice(last.pos, last.end);
    if (!raw.startsWith('/**'))
        return undefined;
    return raw;
}
function buildSignature(node, source) {
    // Para functions: hasta el final del header (signo `{` o `;`).
    if (typescript_1.default.isFunctionDeclaration(node) || typescript_1.default.isMethodDeclaration(node)) {
        return signatureFromFunctionLike(node, source);
    }
    if (typescript_1.default.isClassDeclaration(node)) {
        // Solo el header `export class X<T> extends Y implements Z`.
        const start = node.getStart();
        const body = node.members.length > 0 ? node.members[0]?.getFullStart() : node.getEnd();
        const headEnd = source.indexOf('{', start);
        const end = headEnd > 0 ? headEnd : (body ?? node.getEnd());
        return collapseWhitespace(source.slice(start, end));
    }
    if (typescript_1.default.isInterfaceDeclaration(node)) {
        const start = node.getStart();
        const headEnd = source.indexOf('{', start);
        const end = headEnd > 0 ? headEnd : node.getEnd();
        return collapseWhitespace(source.slice(start, end));
    }
    if (typescript_1.default.isTypeAliasDeclaration(node)) {
        return collapseWhitespace(source.slice(node.getStart(), node.getEnd()));
    }
    if (typescript_1.default.isEnumDeclaration(node)) {
        const start = node.getStart();
        const headEnd = source.indexOf('{', start);
        const end = headEnd > 0 ? headEnd : node.getEnd();
        return collapseWhitespace(source.slice(start, end));
    }
    if (typescript_1.default.isVariableDeclaration(node)) {
        // Reconstruye `const name: Type = ...` recortando inicializadores largos.
        const name = node.name.getText();
        const typeText = node.type ? `: ${node.type.getText()}` : '';
        return `const ${name}${typeText}`;
    }
    if (typescript_1.default.isModuleDeclaration(node)) {
        const start = node.getStart();
        const headEnd = source.indexOf('{', start);
        const end = headEnd > 0 ? headEnd : node.getEnd();
        return collapseWhitespace(source.slice(start, end));
    }
    return collapseWhitespace(source.slice(node.getStart(), node.getEnd()));
}
function signatureFromFunctionLike(node, source) {
    const start = node.getStart();
    const bodyStart = node.body ? node.body.getFullStart() : node.getEnd();
    let end = bodyStart;
    // Recorta el `{` que abre el body.
    const semi = source.lastIndexOf(';', end);
    const brace = source.lastIndexOf('{', end);
    if (brace > start)
        end = brace;
    else if (semi > start)
        end = semi + 1;
    return collapseWhitespace(source.slice(start, end));
}
function collapseWhitespace(s) {
    return s.replace(/\s+/g, ' ').trim();
}
function collectParameters(node, parsed) {
    let parameters;
    if (typescript_1.default.isFunctionDeclaration(node) || typescript_1.default.isMethodDeclaration(node)) {
        parameters = node.parameters;
    }
    else {
        return undefined;
    }
    const paramTags = new Map();
    for (const t of parsed.tags) {
        if (t.tag !== 'param')
            continue;
        const parsedParam = (0, jsdoc_1.parseParamTag)(t.content);
        if (parsedParam) {
            paramTags.set(parsedParam.name, {
                description: parsedParam.description,
                optional: parsedParam.optional,
            });
        }
    }
    const out = [];
    for (const p of parameters) {
        const name = p.name.getText();
        const type = p.type ? p.type.getText() : 'any';
        const tag = paramTags.get(name);
        out.push({
            name,
            type,
            description: tag?.description ?? '',
            optional: Boolean(p.questionToken) || tag?.optional === true || p.initializer != null,
        });
    }
    return out;
}
function collectReturns(node, parsed) {
    let typeText;
    if ((typescript_1.default.isFunctionDeclaration(node) || typescript_1.default.isMethodDeclaration(node)) &&
        node.type) {
        typeText = node.type.getText();
    }
    const tag = parsed.tags.find((t) => t.tag === 'returns' || t.tag === 'return');
    if (!typeText && !tag)
        return undefined;
    return {
        type: typeText ?? 'unknown',
        description: tag ? (0, jsdoc_1.parseReturnsTag)(tag.content) : '',
    };
}
//# sourceMappingURL=extract.js.map