"use strict";
// ============================================================
// ST Automata — Lenguajes estándar de fábrica
// ============================================================
//
// DFAs / regex de ejemplo, útiles para tests y demos:
//   · dfaEvenZeros()   — palabras sobre {0,1} con número par de '0'.
//   · dfaContainsAB()  — palabras sobre {a,b,c} que contienen "ab".
//   · regexEmail()     — regex simplificada de email.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.dfaEvenZeros = dfaEvenZeros;
exports.dfaContainsAB = dfaContainsAB;
exports.regexEmail = regexEmail;
const regex_1 = require("./regex");
/** Palabras sobre {0,1} con un número par de ceros. */
function dfaEvenZeros() {
    const states = new Set(['even', 'odd']);
    const alphabet = new Set(['0', '1']);
    const transitions = new Map();
    transitions.set('even', new Map([
        ['0', 'odd'],
        ['1', 'even'],
    ]));
    transitions.set('odd', new Map([
        ['0', 'even'],
        ['1', 'odd'],
    ]));
    return {
        states,
        alphabet,
        transitions,
        initial: 'even',
        accept: new Set(['even']),
    };
}
/** Palabras sobre {a,b,c} que contienen "ab" como subcadena. */
function dfaContainsAB() {
    const states = new Set(['q0', 'q1', 'q2']);
    const alphabet = new Set(['a', 'b', 'c']);
    const transitions = new Map();
    transitions.set('q0', new Map([
        ['a', 'q1'],
        ['b', 'q0'],
        ['c', 'q0'],
    ]));
    transitions.set('q1', new Map([
        ['a', 'q1'],
        ['b', 'q2'],
        ['c', 'q0'],
    ]));
    transitions.set('q2', new Map([
        ['a', 'q2'],
        ['b', 'q2'],
        ['c', 'q2'],
    ]));
    return {
        states,
        alphabet,
        transitions,
        initial: 'q0',
        accept: new Set(['q2']),
    };
}
/** Regex simplificada de email: letras+ '@' letras+ '.' letras+
 *  (ASCII inferior, sin números / símbolos). Es deliberadamente
 *  pedagógica; no aspira a RFC 5322. */
function regexEmail() {
    // (a|b|...|z)+ @ (a|...|z)+ . (a|...|z)+
    const letters = [];
    for (let c = 'a'.charCodeAt(0); c <= 'z'.charCodeAt(0); c++) {
        letters.push(String.fromCharCode(c));
    }
    const alt = letters.join('|');
    const src = `(${alt})+@(${alt})+\\.(${alt})+`;
    return (0, regex_1.parseRegex)(src);
}
//# sourceMappingURL=languages.js.map