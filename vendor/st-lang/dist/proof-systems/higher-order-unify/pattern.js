"use strict";
// ============================================================
// Higher-order unification — Verificación de patrón Miller
// ============================================================
//
// Condición de patrón (Miller 1991):
//   Un término es un "pattern" si toda meta-variable M aparece aplicada
//   exclusivamente a variables ligadas *distintas* en el scope actual.
//
// Formalmente: M y₁ … yₙ es patrón si:
//   1. Cada yᵢ es una variable (kind 'var').
//   2. Todas las yᵢ son distintas entre sí.
//   3. Todas las yᵢ son *ligadas* (aparecen en el scope de un λ
//      que las introduce).
//
// isHigherOrderPattern es un alias semántico que hace explícito que
// el término es una HO pattern en el sentido de Miller.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPattern = isPattern;
exports.isHigherOrderPattern = isHigherOrderPattern;
// Comprueba si `term` es un pattern Miller.
// `scope` es el conjunto de variables ligadas en el contexto actual.
function isPattern(term, scope = new Set()) {
    switch (term.kind) {
        case 'var':
            return true;
        case 'meta':
            return true;
        case 'abs': {
            const newScope = new Set(scope);
            newScope.add(term.param);
            return isPattern(term.body, newScope);
        }
        case 'app': {
            const { fn, args } = term;
            if (fn.kind === 'meta') {
                // Verificar que cada arg es una variable ligada distinta
                if (!allDistinctBoundVars(args, scope))
                    return false;
                return true;
            }
            // Para aplicaciones no-meta: el fn y cada arg deben ser pattern
            if (!isPattern(fn, scope))
                return false;
            for (const a of args) {
                if (!isPattern(a, scope))
                    return false;
            }
            return true;
        }
    }
}
function allDistinctBoundVars(args, scope) {
    const seen = new Set();
    for (const a of args) {
        if (a.kind !== 'var')
            return false;
        if (!scope.has(a.name))
            return false; // debe ser ligada
        if (seen.has(a.name))
            return false; // no repetidas
        seen.add(a.name);
    }
    return true;
}
// Alias semántico: ¿es el término un higher-order pattern en sentido Miller?
function isHigherOrderPattern(t) {
    return isPattern(t, new Set());
}
//# sourceMappingURL=pattern.js.map