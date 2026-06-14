"use strict";
/**
 * Parser del formato .stnb — JSON → Notebook
 * Validación estructural sin dependencia de zod (no está en deps).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseError = void 0;
exports.parseNotebook = parseNotebook;
class ParseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ParseError';
    }
}
exports.ParseError = ParseError;
function isObject(v) {
    return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function assertString(v, field) {
    if (typeof v !== 'string') {
        throw new ParseError(`Field "${field}" must be a string, got ${typeof v}`);
    }
    return v;
}
function validateOutput(raw, cellId, idx) {
    if (!isObject(raw)) {
        throw new ParseError(`Output ${idx} in cell "${cellId}" must be an object`);
    }
    const type = raw['type'];
    if (type !== 'result' && type !== 'error' && type !== 'stream') {
        throw new ParseError(`Output ${idx} in cell "${cellId}" has invalid type "${String(type)}"`);
    }
    if (!isObject(raw['data'])) {
        throw new ParseError(`Output ${idx} in cell "${cellId}" must have "data" object`);
    }
    const output = {
        type,
        data: raw['data'],
    };
    if (raw['metadata'] !== undefined) {
        if (!isObject(raw['metadata'])) {
            throw new ParseError(`Output ${idx} metadata in cell "${cellId}" must be an object`);
        }
        output.metadata = raw['metadata'];
    }
    return output;
}
function validateCell(raw, idx) {
    if (!isObject(raw)) {
        throw new ParseError(`Cell ${idx} must be an object`);
    }
    const id = assertString(raw['id'], `cells[${idx}].id`);
    const type = raw['type'];
    const source = assertString(raw['source'], `cells[${idx}].source`);
    if (type === 'markdown') {
        return { id, type: 'markdown', source };
    }
    if (type === 'code') {
        const rawOutputs = raw['outputs'];
        let outputs = [];
        if (rawOutputs !== undefined) {
            if (!Array.isArray(rawOutputs)) {
                throw new ParseError(`Cell "${id}" outputs must be an array`);
            }
            outputs = rawOutputs.map((o, i) => validateOutput(o, id, i));
        }
        const cell = { id, type: 'code', source, outputs };
        if (raw['profile'] !== undefined) {
            cell.profile = assertString(raw['profile'], `cells[${idx}].profile`);
        }
        return cell;
    }
    throw new ParseError(`Cell ${idx} has invalid type "${String(type)}". Must be "code" or "markdown".`);
}
function validateMetadata(raw) {
    if (!isObject(raw)) {
        throw new ParseError('"metadata" must be an object');
    }
    const title = assertString(raw['title'], 'metadata.title');
    const profile = assertString(raw['profile'], 'metadata.profile');
    const createdAt = assertString(raw['createdAt'], 'metadata.createdAt');
    const updatedAt = assertString(raw['updatedAt'], 'metadata.updatedAt');
    const meta = { title, profile, createdAt, updatedAt };
    if (typeof raw['author'] === 'string') {
        meta.author = raw['author'];
    }
    // copy extra keys
    for (const [k, v] of Object.entries(raw)) {
        if (!(k in meta)) {
            meta[k] = v;
        }
    }
    return meta;
}
/**
 * Parsea un string JSON → Notebook validado.
 * Lanza ParseError si el formato es inválido.
 */
function parseNotebook(source) {
    let raw;
    try {
        raw = JSON.parse(source);
    }
    catch (e) {
        throw new ParseError(`Invalid JSON: ${e.message}`);
    }
    if (!isObject(raw)) {
        throw new ParseError('Notebook must be a JSON object');
    }
    const version = assertString(raw['version'], 'version');
    if (!version.startsWith('1.')) {
        throw new ParseError(`Unsupported notebook version "${version}". Only "1.x" is supported.`);
    }
    const kernel = assertString(raw['kernel'], 'kernel');
    const kernelVersion = assertString(raw['kernelVersion'], 'kernelVersion');
    const metadata = validateMetadata(raw['metadata']);
    if (!Array.isArray(raw['cells'])) {
        throw new ParseError('"cells" must be an array');
    }
    const cells = raw['cells'].map((c, i) => validateCell(c, i));
    return { version, kernel, kernelVersion, metadata, cells };
}
//# sourceMappingURL=parser.js.map