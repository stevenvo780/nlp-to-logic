"use strict";
// ============================================================
// ST Deontic Standard — KD sobre BaseTableauProfile
// ============================================================
// O(φ) = [](φ)  — obligación
// P(φ) = <>(φ)  — permisión
// F(φ) = [](!φ) — prohibición
// Axioma D: O(φ) → P(φ) — serialidad
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeonticStandard = void 0;
const propositional_1 = require("../classical/propositional");
const base_profile_1 = require("../shared/base-profile");
const tableau_engine_1 = require("../shared/tableau-engine");
class DeonticStandard extends base_profile_1.BaseTableauProfile {
    name = 'deontic.standard';
    description = 'Lógica deóntica estándar (KD) — obligación (O/[]), permisión (P/<>), prohibición (F/[]!)';
    frameRules = tableau_engine_1.FRAME_KD;
    formatFormula(f) {
        return deonticToString(f);
    }
    explainSystem() {
        return [
            'Operadores deónticos:',
            '  O(φ) = [](φ)  — "Es obligatorio que φ"',
            '  P(φ) = <>(φ)  — "Está permitido que φ"',
            '  F(φ) = [](!φ) — "Está prohibido que φ"',
            '',
            'Sistema: KD (K + axioma D)',
            '  Axioma K: O(φ→ψ) → (O(φ)→O(ψ))',
            '  Axioma D: O(φ) → P(φ) — "lo obligatorio es permisible"',
            '',
            '  Relación de accesibilidad: serial',
            '  Propiedades del frame: {serialidad}',
            '  Significado: todo estado deóntico tiene al menos una alternativa permisible',
            '',
            '  No vale:',
            '    ✗ Reflexividad  (O(φ) → φ — lo obligatorio no es necesariamente el caso)',
            '    ✗ Transitividad, Simetría, Euclidianidad',
            '',
            '  ⚠ Paradojas conocidas en SDL:',
            '    • Ross:       O(P) → O(P∨Q) — si es obligatorio enviar la carta, ¿es obligatorio enviarla o quemarla?',
            '    • Chisholm:   O(P), O(P→Q), ¬P→O(¬Q), ¬P — inconsistente (contrary-to-duty)',
            '    • Samaritano: O(¬P) → O(¬P∧Q) — obligaciones derivadas de eventos impermisibles',
        ].join('\n');
    }
}
exports.DeonticStandard = DeonticStandard;
function deonticToString(f) {
    switch (f.kind) {
        case 'modal_necessity': {
            const inner = (f.args || [])[0];
            if (!inner)
                return 'O(?)';
            if (inner.kind === 'not' && inner.args?.[0]) {
                return `F(${deonticToString(inner.args[0])})`;
            }
            return `O(${deonticToString(inner)})`;
        }
        case 'modal_possibility': {
            const inner = (f.args || [])[0];
            return inner ? `P(${deonticToString(inner)})` : 'P(?)';
        }
        case 'atom':
            return f.name || '?';
        case 'not': {
            const inner = (f.args || [])[0];
            if (!inner)
                return '¬?';
            if (inner.kind === 'atom')
                return `¬${deonticToString(inner)}`;
            return `¬(${deonticToString(inner)})`;
        }
        case 'and':
            return `(${deonticToString((f.args || [])[0])} ∧ ${deonticToString((f.args || [])[1])})`;
        case 'or':
            return `(${deonticToString((f.args || [])[0])} ∨ ${deonticToString((f.args || [])[1])})`;
        case 'implies':
            return `(${deonticToString((f.args || [])[0])} → ${deonticToString((f.args || [])[1])})`;
        case 'biconditional':
            return `(${deonticToString((f.args || [])[0])} ↔ ${deonticToString((f.args || [])[1])})`;
        default:
            return (0, propositional_1.formulaToString)(f);
    }
}
//# sourceMappingURL=standard.js.map