"use strict";
// ============================================================
// Markov Logic — Inferencia
// ============================================================
//
// Funciones:
//   - `weight(theory, world)` → log-prob no normalizada del mundo
//   - `probability(theory, world, Z)` → P(world) dada la partición
//   - `gibbsSample(theory, evidence, iters)` → cadena de mundos
//   - `mapInference(theory, evidence)` → mundo más probable
//     (aproximado vía MaxWalkSAT).
//
// Convenciones:
//   - El log-score de un mundo es `Σ_i w_i · satisfied_i(W)`. Los
//     hard constraints (`w_i = ±Infinity`) se tratan aparte: si están
//     violados, el log-score es `-Infinity` (probabilidad 0).
//   - Atoms ausentes del mundo se interpretan como `false`.
//   - Las funciones que dependen de RNG aceptan `rng?: () => number`
//     opcional para tests deterministas.
Object.defineProperty(exports, "__esModule", { value: true });
exports.weight = weight;
exports.probability = probability;
exports.exactPartition = exactPartition;
exports.exactMarginals = exactMarginals;
exports.gibbsSample = gibbsSample;
exports.gibbsMarginals = gibbsMarginals;
exports.mapInference = mapInference;
const grounding_1 = require("./grounding");
/**
 * Log-score (no normalizado) de un mundo:
 *   logZW = Σ_i w_i · satisfied_i(world)
 *
 * Si la teoría tiene un hard constraint violado, devuelve
 * `-Infinity` (lo cual hace P(world)=0).
 */
function weight(theory, world) {
    const grounded = (0, grounding_1.ground)(theory);
    return weightFromGrounded(grounded, world);
}
function weightFromGrounded(grounded, world) {
    let score = 0;
    for (const g of grounded) {
        const sat = g.satisfied(world);
        if (!Number.isFinite(g.weight)) {
            // hard constraint
            if (g.weight > 0 && !sat)
                return Number.NEGATIVE_INFINITY;
            if (g.weight < 0 && sat)
                return Number.NEGATIVE_INFINITY;
            // hard constraint satisfecho → no aporta al score
            continue;
        }
        if (sat)
            score += g.weight;
    }
    return score;
}
/**
 * Probabilidad de un mundo dada una aproximación de la partición Z.
 *
 * P(world) = exp(weight(world)) / partitionApprox
 *
 * `partitionApprox` debe estar en el mismo "espacio" (no log).
 * Si `weight(world) === -Infinity` devuelve 0.
 */
function probability(theory, world, partitionApprox) {
    if (partitionApprox <= 0 || !Number.isFinite(partitionApprox)) {
        throw new Error('partitionApprox debe ser un número positivo finito');
    }
    const w = weight(theory, world);
    if (!Number.isFinite(w))
        return 0;
    return Math.exp(w) / partitionApprox;
}
/**
 * Calcula la partición Z exactamente sumando sobre todos los mundos
 * posibles. SOLO viable para teorías pequeñas (≤ ~20 ground atoms).
 * Útil para tests.
 */
function exactPartition(theory) {
    const atoms = (0, grounding_1.allGroundAtoms)(theory);
    if (atoms.length > 24) {
        throw new Error(`exactPartition no es viable con ${atoms.length} atoms (> 24). Usá muestreo.`);
    }
    const grounded = (0, grounding_1.ground)(theory);
    const n = atoms.length;
    const total = 1 << n;
    let Z = 0;
    const world = { groundAtoms: {} };
    for (let mask = 0; mask < total; mask++) {
        for (let i = 0; i < n; i++) {
            world.groundAtoms[atoms[i]] = (mask & (1 << i)) !== 0;
        }
        const w = weightFromGrounded(grounded, world);
        if (Number.isFinite(w))
            Z += Math.exp(w);
    }
    return Z;
}
/**
 * Marginales exactas P(atom = true) sobre todos los mundos.
 * Mismo costo exponencial que `exactPartition`. Sólo para tests.
 */
function exactMarginals(theory) {
    const atoms = (0, grounding_1.allGroundAtoms)(theory);
    if (atoms.length > 24) {
        throw new Error(`exactMarginals no viable con ${atoms.length} atoms (> 24).`);
    }
    const grounded = (0, grounding_1.ground)(theory);
    const n = atoms.length;
    const total = 1 << n;
    let Z = 0;
    const trueMass = {};
    for (const a of atoms)
        trueMass[a] = 0;
    const world = { groundAtoms: {} };
    for (let mask = 0; mask < total; mask++) {
        for (let i = 0; i < n; i++) {
            world.groundAtoms[atoms[i]] = (mask & (1 << i)) !== 0;
        }
        const w = weightFromGrounded(grounded, world);
        if (!Number.isFinite(w))
            continue;
        const p = Math.exp(w);
        Z += p;
        for (let i = 0; i < n; i++) {
            if ((mask & (1 << i)) !== 0) {
                trueMass[atoms[i]] += p;
            }
        }
    }
    if (Z === 0) {
        // toda probabilidad concentrada en mundos violadores → distribución indefinida
        const out = {};
        for (const a of atoms)
            out[a] = 0;
        return out;
    }
    const out = {};
    for (const a of atoms)
        out[a] = (trueMass[a] ?? 0) / Z;
    return out;
}
/**
 * Gibbs sampling sobre los ground atoms NO evidenciados.
 *
 * En cada paso elige un atom no fijo y resamplea su valor según
 * P(atom=true | resto). Para MLN, esa condicional es la sigmoide del
 * "delta" de log-score al flippear:
 *
 *   P(atom=true | ·) = σ( logScore(true) − logScore(false) )
 *
 * Devuelve una secuencia de `iterations` mundos coleccionados tras
 * `burnIn` pasos de calentamiento, con thinning opcional.
 */
function gibbsSample(theory, evidence = {}, iterations, options = {}) {
    if (iterations <= 0)
        return [];
    const rng = options.rng ?? Math.random;
    const burnIn = Math.max(0, options.burnIn ?? 0);
    const thin = Math.max(1, options.thin ?? 1);
    const grounded = (0, grounding_1.ground)(theory);
    const allAtoms = (0, grounding_1.allGroundAtoms)(theory);
    const evidenceAtoms = evidence.groundAtoms ?? {};
    const fixed = new Set(Object.keys(evidenceAtoms));
    // Inicial: respetá evidence; atoms libres → coin flip.
    const current = options.initial ? cloneWorld(options.initial) : { groundAtoms: {} };
    for (const a of allAtoms) {
        if (fixed.has(a)) {
            current.groundAtoms[a] = evidenceAtoms[a] === true;
        }
        else if (current.groundAtoms[a] === undefined) {
            current.groundAtoms[a] = rng() < 0.5;
        }
    }
    // Index: qué ground formulas tocan qué atom (Markov blanket de cada atom).
    const touchedBy = new Map();
    for (let i = 0; i < grounded.length; i++) {
        for (const a of grounded[i].atoms) {
            let arr = touchedBy.get(a);
            if (!arr) {
                arr = [];
                touchedBy.set(a, arr);
            }
            arr.push(i);
        }
    }
    const samples = [];
    const freeAtoms = allAtoms.filter((a) => !fixed.has(a));
    if (freeAtoms.length === 0) {
        // todos los átomos son evidencia → la única muestra posible es la evidencia.
        for (let k = 0; k < iterations; k++)
            samples.push(cloneWorld(current));
        return samples;
    }
    const totalSteps = burnIn + iterations * thin;
    let collected = 0;
    let stepsAfterBurnIn = 0;
    for (let step = 0; step < totalSteps; step++) {
        const idx = Math.floor(rng() * freeAtoms.length);
        const atom = freeAtoms[idx];
        const local = touchedBy.get(atom) ?? [];
        // logScore parcial con valor actual: sólo necesitamos las fórmulas que tocan `atom`.
        const prev = current.groundAtoms[atom] === true;
        current.groundAtoms[atom] = true;
        const sTrue = partialLogScore(grounded, local, current);
        current.groundAtoms[atom] = false;
        const sFalse = partialLogScore(grounded, local, current);
        let pTrue;
        if (!Number.isFinite(sTrue) && !Number.isFinite(sFalse)) {
            // ambos imposibles (hard constraint contradictorio) → quedate como estabas.
            current.groundAtoms[atom] = prev;
        }
        else if (!Number.isFinite(sTrue)) {
            pTrue = 0;
            current.groundAtoms[atom] = rng() < pTrue;
        }
        else if (!Number.isFinite(sFalse)) {
            pTrue = 1;
            current.groundAtoms[atom] = rng() < pTrue;
        }
        else {
            pTrue = sigmoid(sTrue - sFalse);
            current.groundAtoms[atom] = rng() < pTrue;
        }
        if (step >= burnIn) {
            stepsAfterBurnIn++;
            if (stepsAfterBurnIn % thin === 0 && collected < iterations) {
                samples.push(cloneWorld(current));
                collected++;
            }
        }
    }
    return samples;
}
function partialLogScore(grounded, indices, world) {
    let s = 0;
    for (const i of indices) {
        const g = grounded[i];
        const sat = g.satisfied(world);
        if (!Number.isFinite(g.weight)) {
            if (g.weight > 0 && !sat)
                return Number.NEGATIVE_INFINITY;
            if (g.weight < 0 && sat)
                return Number.NEGATIVE_INFINITY;
            continue;
        }
        if (sat)
            s += g.weight;
    }
    return s;
}
function sigmoid(x) {
    if (x >= 0) {
        const e = Math.exp(-x);
        return 1 / (1 + e);
    }
    const e = Math.exp(x);
    return e / (1 + e);
}
function cloneWorld(w) {
    return { groundAtoms: { ...w.groundAtoms } };
}
/**
 * Marginales aproximadas: corre Gibbs y promedia indicadores.
 */
function gibbsMarginals(theory, evidence, iterations, options = {}) {
    const samples = gibbsSample(theory, evidence, iterations, options);
    if (samples.length === 0)
        return {};
    const atoms = (0, grounding_1.allGroundAtoms)(theory);
    const counts = {};
    for (const a of atoms)
        counts[a] = 0;
    for (const s of samples) {
        for (const a of atoms) {
            if (s.groundAtoms[a] === true)
                counts[a] += 1;
        }
    }
    const out = {};
    for (const a of atoms)
        out[a] = (counts[a] ?? 0) / samples.length;
    return out;
}
/**
 * MAP inference: encuentra el mundo de mayor `weight`. Aproximado
 * mediante MaxWalkSAT con múltiples restarts: en cada paso, elige
 * una ground formula INSATISFECHA y flippea uno de sus atoms; con
 * probabilidad `noise` lo elige al azar (random walk), con `1-noise`
 * elige el flip que más mejora el score (greedy).
 *
 * Respeta `evidence`: nunca flippea atoms fijos.
 */
function mapInference(theory, evidence = {}, options = {}) {
    const rng = options.rng ?? Math.random;
    const maxFlips = Math.max(1, options.maxFlips ?? 5000);
    const restarts = Math.max(1, options.restarts ?? 5);
    const noise = clamp(options.noise ?? 0.3, 0, 1);
    const grounded = (0, grounding_1.ground)(theory);
    const allAtoms = (0, grounding_1.allGroundAtoms)(theory);
    const evidenceAtoms = evidence.groundAtoms ?? {};
    const fixed = new Set(Object.keys(evidenceAtoms));
    const freeAtoms = allAtoms.filter((a) => !fixed.has(a));
    // Index: cada atom → qué ground formulas lo tocan.
    const touchedBy = new Map();
    for (let i = 0; i < grounded.length; i++) {
        for (const a of grounded[i].atoms) {
            let arr = touchedBy.get(a);
            if (!arr) {
                arr = [];
                touchedBy.set(a, arr);
            }
            arr.push(i);
        }
    }
    let bestWorld = null;
    let bestScore = Number.NEGATIVE_INFINITY;
    for (let restart = 0; restart < restarts; restart++) {
        const world = { groundAtoms: {} };
        for (const a of allAtoms) {
            world.groundAtoms[a] = fixed.has(a) ? evidenceAtoms[a] === true : rng() < 0.5;
        }
        let currentScore = weightFromGrounded(grounded, world);
        if (currentScore > bestScore) {
            bestScore = currentScore;
            bestWorld = cloneWorld(world);
        }
        for (let flip = 0; flip < maxFlips; flip++) {
            // recolectar ground formulas no satisfechas
            const unsat = [];
            for (let i = 0; i < grounded.length; i++) {
                if (!grounded[i].satisfied(world))
                    unsat.push(i);
            }
            if (unsat.length === 0)
                break; // todas las fórmulas satisfechas (caso raro)
            const pick = unsat[Math.floor(rng() * unsat.length)];
            const candidates = grounded[pick].atoms.filter((a) => !fixed.has(a));
            if (candidates.length === 0)
                continue;
            let chosen;
            if (rng() < noise) {
                // random walk
                chosen = candidates[Math.floor(rng() * candidates.length)] ?? candidates[0] ?? '';
            }
            else {
                // greedy: elige el flip que maximiza el score
                let bestFlipScore = Number.NEGATIVE_INFINITY;
                let bestFlipAtom = candidates[0];
                for (const c of candidates) {
                    world.groundAtoms[c] = !world.groundAtoms[c];
                    const s = weightFromGrounded(grounded, world);
                    if (s > bestFlipScore) {
                        bestFlipScore = s;
                        bestFlipAtom = c;
                    }
                    world.groundAtoms[c] = !world.groundAtoms[c]; // revert
                }
                chosen = bestFlipAtom;
            }
            world.groundAtoms[chosen] = !world.groundAtoms[chosen];
            currentScore = weightFromGrounded(grounded, world);
            if (currentScore > bestScore) {
                bestScore = currentScore;
                bestWorld = cloneWorld(world);
            }
        }
        // Si no hay free atoms el primer restart ya nos da la única solución posible.
        if (freeAtoms.length === 0)
            break;
    }
    return bestWorld ?? { groundAtoms: { ...evidenceAtoms } };
}
function clamp(x, lo, hi) {
    if (x < lo)
        return lo;
    if (x > hi)
        return hi;
    return x;
}
//# sourceMappingURL=inference.js.map