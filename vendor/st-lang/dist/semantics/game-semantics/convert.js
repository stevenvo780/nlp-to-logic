"use strict";
// ============================================================
// Conversión IPCFormula ↔ IntuitFormula
// ============================================================
//
// Reutilizamos el prover NJ existente (`profiles/intuitionistic-nj`)
// como oráculo de validez para certificar "existe estrategia
// ganadora". Por el teorema de Lorenzen-Felscher: P tiene
// estrategia ganadora en el juego dialógico sobre φ sii φ es
// demostrable en NJ (equivalentemente, válida en IPC).
Object.defineProperty(exports, "__esModule", { value: true });
exports.toIntuit = toIntuit;
const intuitionistic_nj_1 = require("../../logic/profiles/intuitionistic-nj");
function toIntuit(f) {
    switch (f.kind) {
        case 'atom':
            return (0, intuitionistic_nj_1.atom)(f.name);
        case 'bottom':
            return (0, intuitionistic_nj_1.bottom)();
        case 'and':
            return (0, intuitionistic_nj_1.and)(toIntuit(f.left), toIntuit(f.right));
        case 'or':
            return (0, intuitionistic_nj_1.or)(toIntuit(f.left), toIntuit(f.right));
        case 'implies':
            return (0, intuitionistic_nj_1.implies)(toIntuit(f.left), toIntuit(f.right));
    }
}
//# sourceMappingURL=convert.js.map