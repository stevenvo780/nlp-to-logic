"use strict";
// ============================================================
// ST Proof Mining — Barrel + orquestador
// ============================================================
//
// API pública del módulo. La pipeline es:
//
//   mineLemmas(corpus, options)
//     → extractor.extractAuxiliaryLemmas
//     → para cada grupo: generalizer.generalizeLemma
//     → ranker.rankLemmas
//     → (opcional) persistence.persistLemmas
//
// `ProofMiner` es una fachada stateful que mantiene un cache
// interno entre llamadas (útil si se procesa el corpus en batches).
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProofMiner = exports.statsToString = exports.computeStats = exports.MINED_LEMMA_PROVER = exports.recoverLemmaFromCache = exports.recoverLemmas = exports.persistLemmas = exports.topK = exports.scoreLemma = exports.rankLemmas = exports.generalizeTerms = exports.generalizeFormulas = exports.generalizeLemma = exports.extractAuxiliaryLemmas = exports.subtreeKey = exports.groupSubtrees = exports.extractSubtrees = void 0;
exports.mineLemmas = mineLemmas;
const crypto_1 = require("crypto");
const theorem_cache_1 = require("../../runtime/theorem-cache");
const extractor_1 = require("./extractor");
const generalizer_1 = require("./generalizer");
const persistence_1 = require("./persistence");
const ranker_1 = require("./ranker");
const statistics_1 = require("./statistics");
var extractor_2 = require("./extractor");
Object.defineProperty(exports, "extractSubtrees", { enumerable: true, get: function () { return extractor_2.extractSubtrees; } });
Object.defineProperty(exports, "groupSubtrees", { enumerable: true, get: function () { return extractor_2.groupSubtrees; } });
Object.defineProperty(exports, "subtreeKey", { enumerable: true, get: function () { return extractor_2.subtreeKey; } });
Object.defineProperty(exports, "extractAuxiliaryLemmas", { enumerable: true, get: function () { return extractor_2.extractAuxiliaryLemmas; } });
var generalizer_2 = require("./generalizer");
Object.defineProperty(exports, "generalizeLemma", { enumerable: true, get: function () { return generalizer_2.generalizeLemma; } });
Object.defineProperty(exports, "generalizeFormulas", { enumerable: true, get: function () { return generalizer_2.generalizeFormulas; } });
Object.defineProperty(exports, "generalizeTerms", { enumerable: true, get: function () { return generalizer_2.generalizeTerms; } });
var ranker_2 = require("./ranker");
Object.defineProperty(exports, "rankLemmas", { enumerable: true, get: function () { return ranker_2.rankLemmas; } });
Object.defineProperty(exports, "scoreLemma", { enumerable: true, get: function () { return ranker_2.scoreLemma; } });
Object.defineProperty(exports, "topK", { enumerable: true, get: function () { return ranker_2.topK; } });
var persistence_2 = require("./persistence");
Object.defineProperty(exports, "persistLemmas", { enumerable: true, get: function () { return persistence_2.persistLemmas; } });
Object.defineProperty(exports, "recoverLemmas", { enumerable: true, get: function () { return persistence_2.recoverLemmas; } });
Object.defineProperty(exports, "recoverLemmaFromCache", { enumerable: true, get: function () { return persistence_2.recoverLemmaFromCache; } });
Object.defineProperty(exports, "MINED_LEMMA_PROVER", { enumerable: true, get: function () { return persistence_2.MINED_LEMMA_PROVER; } });
var statistics_2 = require("./statistics");
Object.defineProperty(exports, "computeStats", { enumerable: true, get: function () { return statistics_2.computeStats; } });
Object.defineProperty(exports, "statsToString", { enumerable: true, get: function () { return statistics_2.statsToString; } });
// ── Orquestador funcional ───────────────────────────────────
function hashStatement(profile, statement) {
    return (0, crypto_1.createHash)('sha1').update(`${profile}::${statement}`).digest('hex');
}
/**
 * Construye un MinedLemma a partir de un grupo. La conclusión
 * generalizada se obtiene del generalizer; el proof representativo
 * es el del primer member (estructura idéntica al resto módulo
 * renombre).
 */
function buildLemmaFromGroup(group, options) {
    if (group.members.length === 0)
        return undefined;
    const conclusions = group.members.map((m) => m.conclusion);
    const gen = (0, generalizer_1.generalizeLemma)(conclusions, {
        maxAbstractionLevel: options.maxAbstractionLevel,
        preserveSemantic: options.preserveSemantic,
    });
    // Stat representativo: usamos el statement generalizado si
    // nonTrivial, si no el canonical de la primera conclusión.
    const statement = gen.statement || group.canonicalConclusion;
    const distinctProofs = new Set(group.members.map((m) => m.proofId));
    const usageCount = distinctProofs.size;
    const repMember = group.members[0];
    if (repMember === undefined)
        return undefined;
    const subproofCost = repMember.cost;
    // Saving total: cost del sub-proof × (usageCount - 1) — la 1ª
    // ocurrencia no se ahorra, solo las subsecuentes.
    const savings = subproofCost * Math.max(0, usageCount - 1);
    // Re-armamos un ProofTrace independiente para el lemma. Los
    // pasos se normalizan al subtree del primer member; las hojas
    // (deepest steps que no tienen children) se interpretan como
    // premises del lemma.
    const steps = repMember.steps.map((s) => ({ ...s }));
    // Premises: outputs de pasos cuya depth es la máxima dentro del
    // sub-tree (hojas en el árbol).
    let maxDepth = -1;
    for (const s of steps)
        if (s.depth > maxDepth)
            maxDepth = s.depth;
    const premises = [];
    for (const s of steps) {
        if (s.depth === maxDepth) {
            // Los inputs del nivel más profundo se consideran hojas.
            for (const inp of s.inputs) {
                if (!premises.includes(inp))
                    premises.push(inp);
            }
        }
    }
    const proof = {
        conclusion: repMember.conclusion,
        premises,
        profile: repMember.profile,
        steps,
        cost: subproofCost,
    };
    const id = hashStatement(repMember.profile, statement);
    return {
        id,
        statement,
        proof,
        abstractionLevel: gen.abstractionLevel,
        usageCount,
        savings,
        sourceProofs: Array.from(distinctProofs).sort(),
    };
}
function resolveOptions(o) {
    return {
        minReuseThreshold: o?.minReuseThreshold ?? 2,
        minSubtreeSize: o?.minSubtreeSize ?? 2,
        maxAbstractionLevel: o?.maxAbstractionLevel ?? 3,
        preserveSemantic: o?.preserveSemantic ?? true,
    };
}
/**
 * Mina lemmas del corpus de proofs. Devuelve los lemmas ordenados
 * por score descendente + stats agregadas.
 *
 * Esta es la entrada principal del módulo. No persiste por defecto;
 * para meter al cache, pasar `cache` o usar `ProofMiner`.
 */
function mineLemmas(corpus, options) {
    const opts = resolveOptions(options);
    const groups = (0, extractor_1.extractAuxiliaryLemmas)(corpus, {
        minReuseThreshold: opts.minReuseThreshold,
        minSubtreeSize: opts.minSubtreeSize,
    });
    // Candidates count: cuántos sub-trees pasaron el primer filtro,
    // antes del ranking final.
    let candidatesFound = 0;
    for (const g of groups)
        candidatesFound += g.members.length;
    const lemmas = [];
    for (const g of groups) {
        const l = buildLemmaFromGroup(g, opts);
        if (l !== undefined)
            lemmas.push(l);
    }
    const ranked = (0, ranker_1.rankLemmas)(lemmas, options?.weights);
    const stats = (0, statistics_1.computeStats)(corpus.length, candidatesFound, ranked);
    if (options?.cache !== undefined) {
        (0, persistence_1.persistLemmas)(ranked, options.cache);
    }
    return { lemmas: ranked, stats };
}
// ── Fachada stateful ────────────────────────────────────────
/**
 * `ProofMiner` es una clase fachada con estado interno: acumula
 * lemmas a través de múltiples corpus, los persiste en un cache
 * común, y expone consultas.
 */
class ProofMiner {
    cache;
    options;
    weights;
    seen = new Map();
    totalProofsAnalyzed = 0;
    totalCandidatesFound = 0;
    constructor(opts) {
        this.options = resolveOptions(opts);
        this.weights = opts?.weights;
        this.cache = opts?.cache ?? new theorem_cache_1.TheoremCache();
    }
    /**
     * Procesa un corpus de proofs y acumula los lemmas en estado.
     * Lemmas con el mismo `id` se mergean: usageCount += new, savings
     * += new, sourceProofs se unifican.
     */
    mine(corpus) {
        const single = mineLemmas(corpus, {
            ...this.options,
            weights: this.weights,
        });
        this.totalProofsAnalyzed += corpus.length;
        this.totalCandidatesFound += single.stats.candidatesFound;
        for (const l of single.lemmas) {
            const existing = this.seen.get(l.id);
            if (existing === undefined) {
                this.seen.set(l.id, l);
                continue;
            }
            // Merge: unión de sourceProofs y suma de usage/savings.
            const merged = {
                ...existing,
                usageCount: existing.usageCount + l.usageCount,
                savings: existing.savings + l.savings,
                sourceProofs: Array.from(new Set([...existing.sourceProofs, ...l.sourceProofs])).sort(),
            };
            this.seen.set(l.id, merged);
        }
        // Persistir lo nuevo en el cache.
        (0, persistence_1.persistLemmas)(Array.from(this.seen.values()), this.cache);
        const all = (0, ranker_1.rankLemmas)(Array.from(this.seen.values()), this.weights);
        const stats = (0, statistics_1.computeStats)(this.totalProofsAnalyzed, this.totalCandidatesFound, all);
        return { lemmas: all, stats };
    }
    /**
     * Devuelve los lemmas acumulados, rankeados.
     */
    all() {
        return (0, ranker_1.rankLemmas)(Array.from(this.seen.values()), this.weights);
    }
    /**
     * Top-k del catálogo acumulado.
     */
    top(k) {
        return (0, ranker_1.topK)(Array.from(this.seen.values()), k, this.weights);
    }
    /**
     * Stats agregadas.
     */
    stats() {
        return (0, statistics_1.computeStats)(this.totalProofsAnalyzed, this.totalCandidatesFound, Array.from(this.seen.values()));
    }
    /** Cache subyacente (lectura). */
    getCache() {
        return this.cache;
    }
    clear() {
        this.seen.clear();
        this.totalProofsAnalyzed = 0;
        this.totalCandidatesFound = 0;
    }
}
exports.ProofMiner = ProofMiner;
//# sourceMappingURL=index.js.map