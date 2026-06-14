"use strict";
/**
 * Namespace: Reasoning
 *
 * Razonamiento no-monótono, probabilístico, abductivo y herramientas
 * de manipulación simbólica. Argumentación Dung, revisión de creencias AGM,
 * abducción, lógica de Markov, redes Bayesianas, citation reasoning,
 * análisis hyperreal, cache de teoremas, anti-unificación, term-rewriting.
 *
 * Importa así:
 *   import { Reasoning } from '@stevenvo780/st-lang';
 *   const ext = Reasoning.argumentation.computeExtensions(af, 'grounded');
 *   const cited = Reasoning.citationReasoning.deriveWithCitations(claims, ev);
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryReuseProof = exports.TheoremCache = exports.termRewriting = exports.antiUnification = exports.hyperreal = exports.citationReasoning = exports.differentialPrivacy = exports.probabilistic = exports.bayesian = exports.markovLogic = exports.abduction = exports.beliefRevision = exports.argumentation = void 0;
const argumentation = __importStar(require("../reasoning/argumentation"));
exports.argumentation = argumentation;
const beliefRevision = __importStar(require("../reasoning/belief-revision"));
exports.beliefRevision = beliefRevision;
const abduction = __importStar(require("../reasoning/abduction"));
exports.abduction = abduction;
const markovLogic = __importStar(require("../reasoning/markov-logic"));
exports.markovLogic = markovLogic;
const bayesian = __importStar(require("../reasoning/bayesian"));
exports.bayesian = bayesian;
const probabilistic = __importStar(require("../reasoning/probabilistic"));
exports.probabilistic = probabilistic;
const differentialPrivacy = __importStar(require("../reasoning/differential-privacy"));
exports.differentialPrivacy = differentialPrivacy;
const citationReasoning = __importStar(require("../reasoning/citation-reasoning"));
exports.citationReasoning = citationReasoning;
const hyperreal = __importStar(require("../reasoning/hyperreal"));
exports.hyperreal = hyperreal;
const antiUnification = __importStar(require("../runtime/anti-unification"));
exports.antiUnification = antiUnification;
const termRewriting = __importStar(require("../runtime/term-rewriting"));
exports.termRewriting = termRewriting;
// Theorem cache (proof reuse persistente) — re-export plano por uso frecuente.
var theorem_cache_1 = require("../runtime/theorem-cache");
Object.defineProperty(exports, "TheoremCache", { enumerable: true, get: function () { return theorem_cache_1.TheoremCache; } });
Object.defineProperty(exports, "tryReuseProof", { enumerable: true, get: function () { return theorem_cache_1.tryReuseProof; } });
//# sourceMappingURL=reasoning.js.map