"use strict";
// ============================================================
// ST Belief Revision — Operadores AGM
// ============================================================
//
// Implementa los tres operadores básicos AGM sobre belief sets:
//   - expand     (K + φ): unión sintáctica.
//   - contract   (K - φ): partial-meet contraction guiada por entrenchment.
//   - revise     (K * φ): identidad de Levi → (K - ¬φ) + φ.
//
// Verificación de postulados básicos:
//   - K1 (cierre lógico): aquí trabajamos sobre belief BASES (no cierres
//     deductivos completos). `verifyClosure` chequea que toda fórmula que
//     `entails(K, φ)` produzca el mismo veredicto que K (idempotencia
//     semántica). Es una versión finitizada del postulado original.
//   - K2 (éxito): φ ∈ Cn(K * φ).
//   - K3 (inclusión): K * φ ⊆ K + φ.
//
// Las fórmulas se almacenan como CADENAS para preservar la representación
// sintáctica que el usuario provee; las operaciones lógicas (entailment,
// consistencia) parsean a AST cuando hace falta.
Object.defineProperty(exports, "__esModule", { value: true });
exports.newBeliefSet = newBeliefSet;
exports.isConsistent = isConsistent;
exports.entails = entails;
exports.expand = expand;
exports.contract = contract;
exports.revise = revise;
exports.verifyClosure = verifyClosure;
exports.verifySuccess = verifySuccess;
exports.verifyInclusion = verifyInclusion;
exports.beliefSetToArray = beliefSetToArray;
exports.canonicalize = canonicalize;
const parser_1 = require("./parser");
const sat_1 = require("./sat");
// ---------------------------------------------------------------------------
// Helpers internos
// ---------------------------------------------------------------------------
/** Cache de parsing para evitar reparsear fórmulas repetidas. */
const parseCache = new Map();
function parseCached(formula) {
    let cached = parseCache.get(formula);
    if (cached === undefined) {
        cached = (0, parser_1.parsePropFormula)(formula);
        parseCache.set(formula, cached);
    }
    return cached;
}
function toFormulaList(K) {
    const out = [];
    for (const s of K.formulas) {
        out.push(parseCached(s));
    }
    return out;
}
function entrenchment(formula, ordering) {
    if (ordering === undefined)
        return 0;
    return ordering.get(formula) ?? 0;
}
// ---------------------------------------------------------------------------
// Constructores y predicados básicos
// ---------------------------------------------------------------------------
/**
 * Construye un belief set a partir de un arreglo de fórmulas iniciales.
 * Duplicados sintácticos se colapsan automáticamente.
 */
function newBeliefSet(initial) {
    const formulas = new Set();
    for (const f of initial) {
        // Validar que parsea para fallar temprano si hay sintaxis inválida.
        parseCached(f);
        formulas.add(f);
    }
    return { formulas };
}
/**
 * ¿Es K consistente? (la conjunción de todas sus fórmulas es satisfactible)
 */
function isConsistent(K) {
    return (0, sat_1.isSatisfiable)(toFormulaList(K));
}
/**
 * ¿K implica lógicamente φ?
 * φ se pasa como cadena (se parsea con la misma sintaxis que las creencias).
 */
function entails(K, phi) {
    const phiAst = parseCached(phi);
    return (0, sat_1.entailsFormula)(toFormulaList(K), phiAst);
}
// ---------------------------------------------------------------------------
// Operadores AGM
// ---------------------------------------------------------------------------
/**
 * Expansion: K + φ.
 * Definición AGM: K + φ = Cn(K ∪ {φ}).
 * Sobre belief bases: añadimos φ al conjunto sintáctico (sin clausurar).
 * NO garantiza consistencia (el caller suele preferir `revise` en su lugar).
 */
function expand(K, phi) {
    // Validar sintaxis.
    parseCached(phi);
    const formulas = new Set(K.formulas);
    formulas.add(phi);
    return { formulas };
}
/**
 * Selecciona los candidatos a remover: subconjunto mínimo de K cuya
 * eliminación rompe la implicación de φ, preferentemente los menos
 * arraigados según `ordering`.
 *
 * Estrategia (greedy partial-meet):
 * 1. Ordenar las fórmulas de K ASCENDENTEMENTE por entrenchment
 *    (menos arraigada primero, candidata principal a remover).
 * 2. Eliminar fórmulas en ese orden hasta que K \ removed deje de
 *    implicar φ. Detener al primer subconjunto que rompe φ.
 * 3. Si K no implica φ, no se remueve nada.
 */
function selectContractionVictims(K, phi, ordering) {
    const formulasList = Array.from(K.formulas);
    // Si K ya no implica φ, no hay nada que remover.
    if (!(0, sat_1.entailsFormula)(formulasList.map(parseCached), phi)) {
        return new Set();
    }
    // Ordenar ascendentemente por entrenchment; desempate lexicográfico.
    const sorted = [...formulasList].sort((a, b) => {
        const ea = entrenchment(a, ordering);
        const eb = entrenchment(b, ordering);
        if (ea !== eb)
            return ea - eb;
        return a < b ? -1 : a > b ? 1 : 0;
    });
    const removed = new Set();
    for (const candidate of sorted) {
        removed.add(candidate);
        const remaining = formulasList.filter((f) => !removed.has(f));
        if (!(0, sat_1.entailsFormula)(remaining.map(parseCached), phi)) {
            return removed;
        }
    }
    // Fallback: si removiendo todo aún implica φ (ej. φ es tautología),
    // devolvemos el set completo (el caller tratará el caso).
    return removed;
}
/**
 * Contraction: K - φ.
 * Definición AGM: K - φ es el mayor subconjunto de K que NO implica φ.
 *
 * Casos especiales:
 * - Si φ es tautología (vacuidad K-5): K - φ = K (no se puede remover).
 * - Si K no implica φ: K - φ = K.
 * - En cualquier otro caso: se aplica partial-meet con `ordering`.
 *
 * El parámetro opcional `ordering` define el "epistemic entrenchment":
 * fórmulas con mayor número son más arraigadas y se preservan primero.
 */
function contract(K, phi, ordering) {
    const phiAst = parseCached(phi);
    // Vacuidad: si φ es tautología, no se puede contraer.
    // (¬φ es insatisfactible ⇔ φ es tautología.)
    const negPhi = { kind: 'not', arg: phiAst };
    if (!(0, sat_1.isSatisfiable)([negPhi])) {
        return { formulas: new Set(K.formulas) };
    }
    const victims = selectContractionVictims(K, phiAst, ordering);
    const formulas = new Set();
    for (const f of K.formulas) {
        if (!victims.has(f))
            formulas.add(f);
    }
    return { formulas };
}
/**
 * Revision: K * φ.
 * Identidad de Levi: K * φ = (K - ¬φ) + φ.
 *
 * Garantiza:
 * - K2 (éxito): φ ∈ K * φ.
 * - K5 (consistencia): si φ es consistente, K * φ es consistente.
 *
 * El parámetro `ordering` se usa para la contracción interna por ¬φ.
 */
function revise(K, phi, ordering) {
    // Validar sintaxis.
    const phiAst = parseCached(phi);
    // Construir ¬φ y normalizarlo a una cadena que el parser pueda releer.
    const negPhiStr = `!(${phi})`;
    // Pre-cachear su AST.
    parseCache.set(negPhiStr, { kind: 'not', arg: phiAst });
    const contracted = contract(K, negPhiStr, ordering);
    return expand(contracted, phi);
}
// ---------------------------------------------------------------------------
// Verificación de postulados AGM
// ---------------------------------------------------------------------------
/**
 * Verifica una versión finitizada del postulado K1 (cierre lógico):
 * para cada φ ∈ K, K entails φ (autocontención lógica).
 * En belief bases puras esto es trivial; aquí adicionalmente exigimos
 * que K sea consistente o que cada fórmula sea bien-formada.
 */
function verifyClosure(K) {
    const list = toFormulaList(K);
    for (const f of list) {
        if (!(0, sat_1.entailsFormula)(list, f))
            return false;
    }
    return true;
}
/**
 * K2 (éxito): φ ∈ Cn(K * φ).
 * Tras revisar por φ, el belief set debe implicar φ.
 */
function verifySuccess(K_revised, phi) {
    return entails(K_revised, phi);
}
/**
 * K3 (inclusión): K * φ ⊆ K + φ.
 * Toda fórmula derivable de K * φ debe ser derivable de K + φ.
 * Para belief bases finitas, basta verificar que cada formula sintáctica
 * de K_revised sea derivable desde K ∪ {φ}.
 */
function verifyInclusion(K_revised, K, phi) {
    const expanded = expand(K, phi);
    const expandedList = toFormulaList(expanded);
    for (const f of K_revised.formulas) {
        const ast = parseCached(f);
        if (!(0, sat_1.entailsFormula)(expandedList, ast))
            return false;
    }
    return true;
}
/**
 * Helper utilitario: devuelve K como arreglo ordenado de fórmulas
 * (útil para tests, debugging, hashing estable).
 */
function beliefSetToArray(K) {
    return Array.from(K.formulas).sort();
}
/**
 * Serialización canónica de un belief set: ordena alfabéticamente y
 * normaliza cada fórmula vía `formulaToString` sobre su AST parseado.
 */
function canonicalize(K) {
    const normalized = Array.from(K.formulas).map((f) => (0, parser_1.formulaToString)(parseCached(f)));
    normalized.sort();
    return `{${normalized.join(', ')}}`;
}
//# sourceMappingURL=agm.js.map