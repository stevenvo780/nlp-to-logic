"use strict";
// ============================================================
// ST Proof Certificate — Standard rule checkers
// ============================================================
//
// Cada checker recibe (args, conclusion, premises) y retorna true
// si el paso aplica la regla correctamente. NO hacen búsqueda — sólo
// chequean estructura sintáctica de strings canonicalizados.
//
// Las fórmulas viajan como strings. Reconocemos los operadores
// estándar de proposicional/clásico con variantes ASCII y Unicode:
//
//   negación:     ~ A   |   ¬A   |   !A   |   not A
//   conjunción:   A & B |  A ∧ B |  A and B
//   disyunción:   A | B |  A ∨ B |  A or B
//   implicación:  A -> B |  A → B
//   bicondicional: A <-> B |  A ↔ B
//
// Para minimizar dependencia con el AST interno, comparamos por
// igualdad de la forma normalizada (`normalizeFormula`). Cuando
// necesitamos descomponer un operador binario, escaneamos a top-level
// respetando paréntesis.
Object.defineProperty(exports, "__esModule", { value: true });
exports.STANDARD_RULES = void 0;
const canonical_1 = require("./canonical");
function strip(formula) {
    let s = (0, canonical_1.normalizeFormula)(formula);
    while (s.startsWith('(') && s.endsWith(')') && balancedOuter(s)) {
        s = s.slice(1, -1).trim();
    }
    return s;
}
function balancedOuter(s) {
    if (!s.startsWith('(') || !s.endsWith(')'))
        return false;
    let depth = 0;
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (c === '(')
            depth++;
        else if (c === ')') {
            depth--;
            if (depth === 0 && i < s.length - 1)
                return false;
        }
    }
    return depth === 0;
}
// Operadores binarios ordenados por precedencia (menor precedencia
// primero — escaneamos de menor a mayor). Cada entrada es una lista
// de spellings equivalentes.
const BINARY_OPS = [
    { name: 'iff', spellings: ['<->', '↔'] },
    { name: 'implies', spellings: ['->', '→'] },
    { name: 'or', spellings: ['|', '∨', ' or '] },
    { name: 'and', spellings: ['&', '∧', ' and '] },
];
function findTopLevel(s, needle) {
    let depth = 0;
    for (let i = 0; i <= s.length - needle.length; i++) {
        const c = s[i];
        if (c === '(') {
            depth++;
            continue;
        }
        if (c === ')') {
            depth--;
            continue;
        }
        if (depth === 0 && s.startsWith(needle, i))
            return i;
    }
    return -1;
}
function splitBinary(formula, opName) {
    const s = strip(formula);
    for (const op of BINARY_OPS) {
        if (op.name !== opName)
            continue;
        for (const sp of op.spellings) {
            const idx = findTopLevel(s, sp);
            if (idx >= 0) {
                const left = strip(s.slice(0, idx));
                const right = strip(s.slice(idx + sp.length));
                return { operator: opName, left, right };
            }
        }
    }
    return null;
}
function stripNot(formula) {
    const s = strip(formula);
    if (s.startsWith('~'))
        return strip(s.slice(1));
    if (s.startsWith('¬'))
        return strip(s.slice(1));
    if (s.startsWith('!'))
        return strip(s.slice(1));
    if (s.toLowerCase().startsWith('not '))
        return strip(s.slice(4));
    return null;
}
function eq(a, b) {
    return strip(a) === strip(b);
}
// ---- Checkers ----
const axiomChecker = (args, conclusion, premises) => {
    // axiom: la conclusión es uno de los args (el nombre del axioma es
    // la propia fórmula) y no hay premisas.
    if (premises.length !== 0)
        return false;
    if (args.length === 0)
        return false;
    return args.some((a) => eq(a, conclusion));
};
const assumptionChecker = (_args, _conclusion, premises) => {
    // assumption: no premisas (es una hipótesis local). El verificador
    // global se encarga de comprobar que se descargue eventualmente.
    return premises.length === 0;
};
const reiterationChecker = (_args, conclusion, premises) => {
    // reit: una sola premisa idéntica a la conclusión.
    if (premises.length !== 1)
        return false;
    return eq(premises[0], conclusion);
};
const modusPonensChecker = (_args, conclusion, premises) => {
    // MP: premisas = [A -> B, A], conclusión = B
    if (premises.length !== 2)
        return false;
    const [impl, ant] = premises;
    const split = splitBinary(impl, 'implies');
    if (!split)
        return false;
    return eq(split.left, ant) && eq(split.right, conclusion);
};
const modusTollensChecker = (_args, conclusion, premises) => {
    // MT: premisas = [A -> B, ~B], conclusión = ~A
    if (premises.length !== 2)
        return false;
    const [impl, notB] = premises;
    const split = splitBinary(impl, 'implies');
    if (!split)
        return false;
    const inside = stripNot(notB);
    const concInside = stripNot(conclusion);
    if (inside === null || concInside === null)
        return false;
    return eq(inside, split.right) && eq(concInside, split.left);
};
const andIntroChecker = (_args, conclusion, premises) => {
    // ∧I: premisas = [A, B], conclusión = A & B
    if (premises.length !== 2)
        return false;
    const split = splitBinary(conclusion, 'and');
    if (!split)
        return false;
    return eq(split.left, premises[0]) && eq(split.right, premises[1]);
};
const andElimLeftChecker = (_args, conclusion, premises) => {
    if (premises.length !== 1)
        return false;
    const split = splitBinary(premises[0], 'and');
    if (!split)
        return false;
    return eq(split.left, conclusion);
};
const andElimRightChecker = (_args, conclusion, premises) => {
    if (premises.length !== 1)
        return false;
    const split = splitBinary(premises[0], 'and');
    if (!split)
        return false;
    return eq(split.right, conclusion);
};
const orIntroLeftChecker = (_args, conclusion, premises) => {
    // ∨IL: premisa = A, conclusión = A | B (B arbitrario pero declarado en args[0])
    if (premises.length !== 1)
        return false;
    const split = splitBinary(conclusion, 'or');
    if (!split)
        return false;
    return eq(split.left, premises[0]);
};
const orIntroRightChecker = (_args, conclusion, premises) => {
    if (premises.length !== 1)
        return false;
    const split = splitBinary(conclusion, 'or');
    if (!split)
        return false;
    return eq(split.right, premises[0]);
};
const orElimChecker = (_args, conclusion, premises) => {
    // ∨E: premisas = [A | B, A -> C, B -> C], conclusión = C
    if (premises.length !== 3)
        return false;
    const disj = splitBinary(premises[0], 'or');
    const impL = splitBinary(premises[1], 'implies');
    const impR = splitBinary(premises[2], 'implies');
    if (!disj || !impL || !impR)
        return false;
    return (eq(disj.left, impL.left) &&
        eq(disj.right, impR.left) &&
        eq(impL.right, conclusion) &&
        eq(impR.right, conclusion));
};
const impliesIntroChecker = (args, conclusion, premises) => {
    // →I: descarga la hipótesis declarada en args[0] de la sub-derivación
    // que produjo `premises[0]`. Conclusión = args[0] -> premises[0].
    // El checker se limita a la forma sintáctica.
    if (premises.length !== 1)
        return false;
    if (args.length < 1)
        return false;
    const split = splitBinary(conclusion, 'implies');
    if (!split)
        return false;
    return eq(split.left, args[0]) && eq(split.right, premises[0]);
};
const impliesElimChecker = modusPonensChecker;
const notIntroChecker = (args, conclusion, premises) => {
    // ¬I: de una sub-derivación de ⊥ asumiendo args[0], deriva ¬args[0].
    // premises[0] debe ser ⊥ (false/bottom/⊥/_|_).
    if (premises.length !== 1)
        return false;
    if (args.length < 1)
        return false;
    const inside = stripNot(conclusion);
    if (inside === null)
        return false;
    const bottom = strip(premises[0]);
    if (!['⊥', 'false', '_|_', 'bottom'].includes(bottom.toLowerCase())) {
        return false;
    }
    return eq(inside, args[0]);
};
const notElimChecker = (_args, conclusion, premises) => {
    // ¬E: premisas = [A, ~A], conclusión = ⊥
    if (premises.length !== 2)
        return false;
    const a = premises[0];
    const notA = stripNot(premises[1]);
    if (notA === null)
        return false;
    if (!eq(a, notA))
        return false;
    const c = strip(conclusion).toLowerCase();
    return ['⊥', 'false', '_|_', 'bottom'].includes(c);
};
const efqChecker = (_args, _conclusion, premises) => {
    // ex falso: de ⊥ deriva cualquier cosa.
    if (premises.length !== 1)
        return false;
    const b = strip(premises[0]).toLowerCase();
    return ['⊥', 'false', '_|_', 'bottom'].includes(b);
};
const doubleNegElimChecker = (_args, conclusion, premises) => {
    // ¬¬E: premisa = ~~A, conclusión = A. (clásico)
    if (premises.length !== 1)
        return false;
    const inner1 = stripNot(premises[0]);
    if (inner1 === null)
        return false;
    const inner2 = stripNot(inner1);
    if (inner2 === null)
        return false;
    return eq(inner2, conclusion);
};
const doubleNegIntroChecker = (_args, conclusion, premises) => {
    // ¬¬I: premisa = A, conclusión = ~~A.
    if (premises.length !== 1)
        return false;
    const inner1 = stripNot(conclusion);
    if (inner1 === null)
        return false;
    const inner2 = stripNot(inner1);
    if (inner2 === null)
        return false;
    return eq(inner2, premises[0]);
};
const iffIntroChecker = (_args, conclusion, premises) => {
    // ↔I: premisas = [A -> B, B -> A], conclusión = A <-> B
    if (premises.length !== 2)
        return false;
    const fwd = splitBinary(premises[0], 'implies');
    const bwd = splitBinary(premises[1], 'implies');
    if (!fwd || !bwd)
        return false;
    if (!(eq(fwd.left, bwd.right) && eq(fwd.right, bwd.left)))
        return false;
    const iff = splitBinary(conclusion, 'iff');
    if (!iff)
        return false;
    return eq(iff.left, fwd.left) && eq(iff.right, fwd.right);
};
const iffElimLeftChecker = (_args, conclusion, premises) => {
    // ↔EL: premisa = A <-> B, conclusión = A -> B
    if (premises.length !== 1)
        return false;
    const iff = splitBinary(premises[0], 'iff');
    if (!iff)
        return false;
    const impl = splitBinary(conclusion, 'implies');
    if (!impl)
        return false;
    return eq(iff.left, impl.left) && eq(iff.right, impl.right);
};
const iffElimRightChecker = (_args, conclusion, premises) => {
    if (premises.length !== 1)
        return false;
    const iff = splitBinary(premises[0], 'iff');
    if (!iff)
        return false;
    const impl = splitBinary(conclusion, 'implies');
    if (!impl)
        return false;
    return eq(iff.left, impl.right) && eq(iff.right, impl.left);
};
/**
 * Tabla de reglas estándar. El verificador busca primero en esta tabla
 * (o en una tabla custom pasada como parámetro). Si la regla no
 * existe, registra un error pero no aborta para listar todos.
 */
exports.STANDARD_RULES = new Map([
    ['axiom', axiomChecker],
    ['assumption', assumptionChecker],
    ['hypothesis', assumptionChecker],
    ['premise', axiomChecker],
    ['reiteration', reiterationChecker],
    ['reit', reiterationChecker],
    ['modus-ponens', modusPonensChecker],
    ['mp', modusPonensChecker],
    ['implies-elim', impliesElimChecker],
    ['->E', impliesElimChecker],
    ['modus-tollens', modusTollensChecker],
    ['mt', modusTollensChecker],
    ['implies-intro', impliesIntroChecker],
    ['->I', impliesIntroChecker],
    ['and-intro', andIntroChecker],
    ['&I', andIntroChecker],
    ['conj-intro', andIntroChecker],
    ['and-elim-left', andElimLeftChecker],
    ['&EL', andElimLeftChecker],
    ['and-elim-right', andElimRightChecker],
    ['&ER', andElimRightChecker],
    ['or-intro-left', orIntroLeftChecker],
    ['|IL', orIntroLeftChecker],
    ['or-intro-right', orIntroRightChecker],
    ['|IR', orIntroRightChecker],
    ['or-elim', orElimChecker],
    ['|E', orElimChecker],
    ['not-intro', notIntroChecker],
    ['~I', notIntroChecker],
    ['not-elim', notElimChecker],
    ['~E', notElimChecker],
    ['ex-falso', efqChecker],
    ['efq', efqChecker],
    ['double-neg-elim', doubleNegElimChecker],
    ['~~E', doubleNegElimChecker],
    ['double-neg-intro', doubleNegIntroChecker],
    ['~~I', doubleNegIntroChecker],
    ['iff-intro', iffIntroChecker],
    ['<->I', iffIntroChecker],
    ['iff-elim-left', iffElimLeftChecker],
    ['<->EL', iffElimLeftChecker],
    ['iff-elim-right', iffElimRightChecker],
    ['<->ER', iffElimRightChecker],
]);
//# sourceMappingURL=rules.js.map