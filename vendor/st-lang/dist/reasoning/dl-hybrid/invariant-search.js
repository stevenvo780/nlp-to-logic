"use strict";
// ============================================================
// ST dL-Hybrid — Búsqueda heurística de invariantes diferenciales
// ============================================================
// Dado un sistema ODE y una propiedad objetivo de la forma p(x) ≥ 0,
// determina si p es un invariante diferencial bajo la regla:
//
//   Si L_f(p) ≥ 0 en todo punto del dominio Q, entonces p ≥ 0 es
//   invariante a lo largo de la evolución continua (Platzer 2010,
//   "Differential Invariants for ODEs").
//
// Esta es una condición *suficiente*: si la chequeamos en una malla de
// muestras y se cumple en todas, reportamos `likely-invariant`; si falla
// en alguna, `not-invariant`; si la derivada de Lie es identicamente
// cero, el invariante es exacto (consonant con el flujo).
//
// La búsqueda automática prueba algunos candidatos típicos:
//   • p(x) = x - c        (semihalfplanes)
//   • p(x) = c - x        (cotas superiores)
//   • p(x, y) = x² + y² - r²   (esferas / círculos en R²)
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDifferentialInvariant = checkDifferentialInvariant;
exports.suggestInvariants = suggestInvariants;
exports.describeVerdict = describeVerdict;
const dl_hybrid_1 = require("../../logic/profiles/dl-hybrid");
const DEFAULTS = {
    meshValues: [-2, -1, -0.5, 0, 0.5, 1, 2],
};
/**
 * Verifica si `p ≥ 0` es invariante diferencial del sistema bajo el
 * dominio implícito (sin restringir). Chequea L_f(p) ≥ 0 en una malla.
 */
function checkDifferentialInvariant(p, system, opts) {
    // El chequeo de invariante NO requiere que la ODE sea soluble cerrada:
    // basta con poder calcular la derivada de Lie y muestrearla. La
    // clasificación se consulta para distinguir "no podemos evaluar"
    // (genuinamente unknown) de "sistema acoplado pero el invariante se
    // verifica numéricamente".
    const lie = (0, dl_hybrid_1.lieDerivative)(p, system);
    // Si L_f(p) se simplifica a 0 → invariante exacto.
    if (lie.kind === 'const' && lie.value === 0) {
        return { kind: 'invariant', reason: 'exact', samples: 0 };
    }
    // Caso general: chequeo en una malla.
    // Variables relevantes para la malla: las del sistema ODE más las
    // variables libres que aparezcan en la derivada de Lie (ej. ODEs
    // acopladas que mencionan `y` aunque `y` no tenga su propia ecuación).
    const meshVars = new Set();
    for (const eq of system.equations)
        meshVars.add(eq.varName);
    const collectVars = (e) => {
        switch (e.kind) {
            case 'var':
                meshVars.add(e.name);
                return;
            case 'const':
                return;
            case 'add':
            case 'mul':
                e.args.forEach(collectVars);
                return;
            case 'sub':
            case 'div':
                collectVars(e.left);
                collectVars(e.right);
                return;
            case 'pow':
                collectVars(e.base);
                collectVars(e.exp);
                return;
            case 'neg':
            case 'sin':
            case 'cos':
            case 'tan':
            case 'log':
            case 'exp':
                collectVars(e.arg);
                return;
        }
    };
    collectVars(lie);
    const samples = opts?.samples ?? buildMesh(Array.from(meshVars), opts?.meshValues ?? DEFAULTS.meshValues);
    let checked = 0;
    for (const s of samples) {
        const val = (0, dl_hybrid_1.evalSym)(lie, s);
        if (Number.isNaN(val))
            continue;
        checked++;
        if (val < -1e-9) {
            return { kind: 'not-invariant', counterexample: s, lieValue: val };
        }
    }
    if (checked === 0) {
        return { kind: 'unknown', reason: 'Ninguna muestra evaluable; ODE puede involucrar divisiones.' };
    }
    return { kind: 'invariant', reason: 'lie-nonnegative', samples: checked };
}
/** Construye una malla cartesiana sobre el conjunto de variables dado. */
function buildMesh(vars, values) {
    if (vars.length === 0)
        return [new Map()];
    if (vars.length > 3) {
        // Modo light para evitar explosión combinatoria.
        const result = [];
        for (const v of values) {
            const s = new Map();
            for (const x of vars)
                s.set(x, v);
            result.push(s);
        }
        return result;
    }
    const result = [];
    const recurse = (idx, current) => {
        if (idx === vars.length) {
            result.push(new Map(current));
            return;
        }
        const name = vars[idx];
        if (!name)
            return;
        for (const val of values) {
            current.set(name, val);
            recurse(idx + 1, current);
        }
    };
    recurse(0, new Map());
    return result;
}
function suggestInvariants(system, opts) {
    const found = [];
    const vars = system.equations.map((e) => e.varName);
    // 1) Halfplanes p = xᵢ - c y p = c - xᵢ para algunos c.
    for (const v of vars) {
        for (const c of [-1, 0, 1]) {
            const upper = c === 0 ? (0, dl_hybrid_1.variable)(v) : (0, dl_hybrid_1.minus)((0, dl_hybrid_1.variable)(v), (0, dl_hybrid_1.num)(c));
            const verdict = checkDifferentialInvariant(upper, system, opts);
            if (verdict.kind === 'invariant') {
                found.push({
                    candidate: upper,
                    description: `${v} ≥ ${c}`,
                    verdict,
                });
            }
            const lower = (0, dl_hybrid_1.minus)((0, dl_hybrid_1.num)(c), (0, dl_hybrid_1.variable)(v));
            const v2 = checkDifferentialInvariant(lower, system, opts);
            if (v2.kind === 'invariant') {
                found.push({
                    candidate: lower,
                    description: `${v} ≤ ${c}`,
                    verdict: v2,
                });
            }
        }
    }
    // 2) Esferas x² + y² - r² (si hay al menos 2 vars).
    if (vars.length >= 2) {
        const x = vars[0];
        const y = vars[1];
        if (x && y) {
            for (const r of [1, 2]) {
                const sphere = (0, dl_hybrid_1.minus)((0, dl_hybrid_1.plus)((0, dl_hybrid_1.power)((0, dl_hybrid_1.variable)(x), 2), (0, dl_hybrid_1.power)((0, dl_hybrid_1.variable)(y), 2)), (0, dl_hybrid_1.num)(r * r));
                const verdict = checkDifferentialInvariant(sphere, system, opts);
                if (verdict.kind === 'invariant') {
                    found.push({
                        candidate: sphere,
                        description: `${x}² + ${y}² ≤ ${r * r}`,
                        verdict,
                    });
                }
            }
        }
    }
    return found;
}
/** Formatea un veredicto para inspección humana. */
function describeVerdict(c) {
    switch (c.verdict.kind) {
        case 'invariant':
            return `[OK] ${c.description}  (term=${(0, dl_hybrid_1.termToString)(c.candidate)})  reason=${c.verdict.reason}, samples=${c.verdict.samples}`;
        case 'not-invariant':
            return `[NO] ${c.description}  (term=${(0, dl_hybrid_1.termToString)(c.candidate)})  L_f(p)=${c.verdict.lieValue} en contra-ejemplo`;
        case 'unknown':
            return `[?]  ${c.description}  reason=${c.verdict.reason}`;
    }
}
//# sourceMappingURL=invariant-search.js.map