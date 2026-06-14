"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateId = generateId;
exports.generatePredicateId = generatePredicateId;
exports.generateVariableId = generateVariableId;
/** Letras disponibles para estilo 'letters' */
const LETTERS = 'PQRSTUVWXYZABCDEFGHIJKLMNO'.split('');
/**
 * Genera un identificador ST válido a partir de palabras clave.
 */
function generateId(keywords, style = 'keywords', index = 0) {
    switch (style) {
        case 'keywords':
            return keywordsToId(keywords);
        case 'letters':
            return lettersId(index);
        case 'numbered':
            return numberedId(index);
    }
}
/**
 * Genera ID a partir de palabras clave.
 * Limpia caracteres especiales y une con underscore.
 */
function keywordsToId(keywords) {
    if (keywords.length === 0)
        return 'ATOM';
    const id = keywords
        .map(k => sanitize(k))
        .filter(k => k.length > 0)
        .join('_')
        .toUpperCase();
    return id || 'ATOM';
}
/**
 * Genera ID tipo letra (P, Q, R, ..., P1, Q1, ...).
 */
function lettersId(index) {
    if (index < LETTERS.length)
        return LETTERS[index];
    const cycle = Math.floor(index / LETTERS.length);
    const pos = index % LETTERS.length;
    return `${LETTERS[pos]}${cycle}`;
}
/**
 * Genera ID tipo numerado (A1, A2, A3, ...).
 */
function numberedId(index) {
    return `A${index + 1}`;
}
/**
 * Sanitiza una palabra para ser un identificador ST válido.
 * Solo permite letras ASCII, dígitos y underscore.
 */
function sanitize(word) {
    return word
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // eliminar diacríticos
        .replace(/[^a-zA-Z0-9_]/g, '')
        .replace(/^[0-9]/, '_$&'); // no empezar con dígito
}
/**
 * Genera un identificador para predicados (primer orden).
 * Formato: NombrePredicado (CamelCase)
 */
function generatePredicateId(words) {
    if (words.length === 0)
        return 'Pred';
    return words
        .map(w => {
        const s = sanitize(w);
        return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    })
        .join('');
}
/**
 * Genera un identificador de variable (minúscula).
 */
function generateVariableId(name) {
    const s = sanitize(name).toLowerCase();
    return s || 'x';
}
//# sourceMappingURL=identifier-gen.js.map