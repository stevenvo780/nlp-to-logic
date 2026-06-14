"use strict";
// ============================================================
// Sistemas modales nombrados — composición de axiomas
// ============================================================
//
// Mapa de etiquetas estándar a sus axiomas. Los sistemas se
// caracterizan por la relación de accesibilidad del frame:
//
//   K     ∅                  — sin restricción
//   T     reflexiva          — {T}
//   D     serial             — {D}
//   KB    simétrica          — {B}
//   K4    transitiva         — {4}
//   K5    euclidiana         — {5}
//   B     refl + sim         — {T, B}    (a veces "KTB")
//   S4    refl + trans       — {T, 4}
//   S5    equivalencia       — {T, 4, 5} (≡ {T, B, 4})
//   KD45  ser + trans + eucl — {D, 4, 5} (lógica doxástica)
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemAxioms = systemAxioms;
exports.isSatisfiable = isSatisfiable;
exports.isValid = isValid;
exports.axiomFormula = axiomFormula;
const formula_1 = require("./formula");
const tableau_1 = require("./tableau");
/**
 * Devuelve los axiomas que caracterizan al sistema nombrado.
 *
 * Para sistemas no listados (e.g. "K45", "KTB5") usar directamente
 * {@link tableauWithAxioms} con la combinación deseada.
 */
function systemAxioms(system) {
    switch (system) {
        case 'K':
            return [];
        case 'T':
            return ['T'];
        case 'D':
            return ['D'];
        case 'KB':
            return ['B'];
        case 'K4':
            return ['4'];
        case 'K5':
            return ['5'];
        case 'B':
            return ['T', 'B'];
        case 'S4':
            return ['T', '4'];
        case 'S5':
            return ['T', '4', '5'];
        case 'KD45':
            return ['D', '4', '5'];
    }
}
/**
 * ¿`phi` es satisfacible en el sistema `system`?
 *
 * Equivale a: ¿existe un modelo Kripke cuyo frame cumple los
 * axiomas y cuya raíz fuerza `phi`?
 */
function isSatisfiable(phi, system) {
    return (0, tableau_1.tableauWithAxioms)(phi, systemAxioms(system)).sat;
}
/**
 * ¿`phi` es válida en el sistema `system`?
 *
 * Equivale a: ¬(¬phi satisfacible) — si el tableau de ¬φ cierra
 * en todas las ramas, φ es teorema del sistema.
 */
function isValid(phi, system) {
    return !isSatisfiable((0, formula_1.not)(phi), system);
}
// ------------------------------------------------------------
// Helpers: axiomas como fórmulas (útil para tests)
// ------------------------------------------------------------
/**
 * Esquema del axioma como fórmula concreta sobre un átomo dado.
 * Útil para verificar que cada axioma es válido en su sistema
 * mínimo.
 */
function axiomFormula(axiom, p) {
    switch (axiom) {
        case 'T':
            return (0, formula_1.implies)((0, formula_1.box)(p), p);
        case 'B':
            return (0, formula_1.implies)(p, (0, formula_1.box)((0, formula_1.diamond)(p)));
        case '4':
            return (0, formula_1.implies)((0, formula_1.box)(p), (0, formula_1.box)((0, formula_1.box)(p)));
        case '5':
            return (0, formula_1.implies)((0, formula_1.diamond)(p), (0, formula_1.box)((0, formula_1.diamond)(p)));
        case 'D':
            return (0, formula_1.implies)((0, formula_1.box)(p), (0, formula_1.diamond)(p));
    }
}
//# sourceMappingURL=systems.js.map