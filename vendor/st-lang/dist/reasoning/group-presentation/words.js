"use strict";
// ============================================================
// Aritmética del grupo libre F(S) sobre palabras.
// ============================================================
//
// Convención de inversos: letras a-z son generadores positivos;
// A-Z son sus inversos. `inverse('a') === 'A'` y viceversa. Para
// símbolos fuera de a-zA-Z (uso interno opcional), se asume que
// el caller pasa pares (g, g⁻¹) ya emparejados — pero las APIs
// públicas estándar (cyclic/dihedral/free/symmetric) viven en
// el alfabeto a-z/A-Z.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.inverse = inverse;
exports.reduceWord = reduceWord;
exports.multiplyWords = multiplyWords;
exports.invertWord = invertWord;
exports.wordEquals = wordEquals;
exports.isReduced = isReduced;
exports.parseWord = parseWord;
exports.wordToString = wordToString;
// inverse: invierte una letra (cambia caja). Lanza si no es una
// letra alfabética ASCII de un caracter, porque eso indica error
// del caller (las APIs expuestas siempre usan letras simples).
function inverse(g) {
    if (g.length !== 1) {
        throw new Error(`inverse: se esperaba letra de 1 caracter, recibí "${g}"`);
    }
    const code = g.charCodeAt(0);
    // a..z
    if (code >= 97 && code <= 122)
        return String.fromCharCode(code - 32);
    // A..Z
    if (code >= 65 && code <= 90)
        return String.fromCharCode(code + 32);
    throw new Error(`inverse: letra no alfabética ASCII: "${g}"`);
}
// reduceWord: reducción libre. Cancela pares adyacentes `x x⁻¹`.
// Implementación O(n) con pila: lee secuencialmente y colapsa
// con el tope si se anulan. Idempotente.
function reduceWord(w) {
    const stack = [];
    for (const letter of w) {
        const top = stack[stack.length - 1];
        if (top !== undefined && top === inverse(letter)) {
            stack.pop();
        }
        else {
            stack.push(letter);
        }
    }
    return stack;
}
// multiplyWords: concatena y reduce. La multiplicación en F(S)
// es la concatenación módulo cancelación libre.
function multiplyWords(a, b) {
    return reduceWord([...a, ...b]);
}
// invertWord: w = x1 x2 ... xn ⇒ w⁻¹ = xn⁻¹ ... x1⁻¹.
function invertWord(w) {
    const out = [];
    for (let i = w.length - 1; i >= 0; i--) {
        out.push(inverse(w[i]));
    }
    return out;
}
// wordEquals: igualdad sintáctica (no semántica módulo relaciones).
// Para igualdad módulo relaciones hay que pasar por Todd-Coxeter.
function wordEquals(a, b) {
    if (a.length !== b.length)
        return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
}
// isReduced: true si no hay cancelaciones libres pendientes.
function isReduced(w) {
    for (let i = 0; i < w.length - 1; i++) {
        const a = w[i];
        const b = w[i + 1];
        if (a.length === 1 && b.length === 1) {
            try {
                if (inverse(a) === b)
                    return false;
            }
            catch {
                // Si la letra no es alfabética simple, no podemos
                // verificar cancelación con inverse; asumimos reducido.
            }
        }
    }
    return true;
}
// parseWord: convierte un string como "abAb" en ['a','b','A','b'].
// Útil para tests legibles. Acepta solo caracteres ASCII letra.
function parseWord(s) {
    const out = [];
    for (const ch of s) {
        out.push(ch);
    }
    return out;
}
// wordToString: inversa de parseWord. La palabra vacía → "1".
function wordToString(w) {
    return w.length === 0 ? '1' : w.join('');
}
//# sourceMappingURL=words.js.map