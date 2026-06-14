"use strict";
/**
 * ST — Exports públicos
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
exports.TypeChecker = exports.typeCheck = exports.REPL = exports.ProtocolHandler = exports.Interpreter = exports.CycleError = exports.ClaimGraph = exports.registerInterpretation = exports.registerSource = exports.registerDefinition = exports.compileClaimsToTheory = exports.registerContext = exports.registerConfidence = exports.registerSupport = exports.registerClaim = exports.registerFormalization = exports.registerPassage = exports.parseAnchorPath = exports.createTextLayerState = exports.detectFallacies = exports.formulaToLaTeX = exports.formulaToUnicode = exports.PARALLEL_THRESHOLD = exports.workersAvailable = exports.dpllAsync = exports.dpll = exports.cdclAsync = exports.cdcl = exports.ParaconsistentBelnap = exports.ModalK = exports.ClassicalFirstOrder = exports.formulaToString = exports.ClassicalPropositional = exports.registry = exports.ProfileRegistry = exports.Parser = exports.KEYWORDS = exports.TokenType = exports.Lexer = exports.render = exports.completion = exports.gotoDefinition = exports.symbols = exports.hover = exports.listProfiles = exports.createInterpreter = exports.quickEval = exports.check = exports.parse = exports.evaluate = void 0;
exports.explainProof = exports.deriveWithCitations = exports.detectAvailableSMT = exports.SubprocessSMTBackend = exports.MockSMTBackend = exports.toSMTLIB = exports.generateLessonPath = exports.checkAnswer = exports.generateExercise = exports.SnapshotStore = exports.captureSnapshot = exports.generateKeyPair = exports.verifyProof = exports.signProof = exports.hashProof = exports.canonicalize = exports.TptpTokenizerError = exports.TptpParserError = exports.tptpFormulaToFol = exports.tptpToFolProverFormat = exports.emitTptpFormula = exports.emitTptp = exports.parseTptpFormula = exports.parseTptp = exports.toCNF = exports.skolemize = exports.unify = exports.proveFOL = exports.dotExport = exports.defends = exports.isConflictFree = exports.isAdmissible = exports.computeExtensions = exports.exportProofToCoq = exports.exportToCoq = exports.removeUnusedSubproofs = exports.compactModusPonensChain = exports.minifyProof = exports.minimizeCountermodel = exports.streamEval = exports.tryReuseProof = exports.TheoremCache = exports.hashFormula = exports.DerivationCache = exports.shutdownPool = exports.evalParallel = exports.solveCDCLv2 = exports.BaseASTVisitor = exports.visitProgram = exports.visit = void 0;
exports.lcBetaStep = exports.lcMakeFreshSupply = exports.lcAlphaRename = exports.lcSubstitute = exports.lcFreeVars = exports.lcTermToString = exports.lcAlphaEq = exports.lcApN = exports.lcAp = exports.lcLam = exports.lcVar = exports.mlttTermToString = exports.mlttOccursFree = exports.mlttFreeVars = exports.mlttSubstitute = exports.mlttAlphaBetaEq = exports.mlttAlphaEq = exports.mlttIsNormal = exports.mlttReduceStep = exports.mlttNormalize = exports.mlttIsInferError = exports.mlttCheckType = exports.mlttInferType = exports.mArrow = exports.mSucc = exports.mZero = exports.mNat = exports.mRefl = exports.mId = exports.mSnd = exports.mFst = exports.mPair = exports.mSigma = exports.mApp = exports.mLam = exports.mPi = exports.mUniverse = exports.mVar = exports.chEqType = exports.chTermToString = exports.chTypeToString = exports.ProofConversionError = exports.proofIsConsistent = exports.proofToTerm = exports.termToProof = exports.isNormal = exports.normalize = exports.reduceBeta = exports.isInferError = exports.inferType = void 0;
exports.isBisimilar = exports.fibonacci = exports.naturals = exports.streamZipWith = exports.streamMap = exports.streamIterate = exports.streamRepeat = exports.streamTake = exports.lsFreeVars = exports.lsTermToString = exports.listsSignature = exports.booleansSignature = exports.naturalNumbersSignature = exports.verifyConjectures = exports.pruneConsequences = exports.synthesizeEqualities = exports.lsEnumerateTerms = exports.ipcBottom = exports.ipcNot = exports.ipcImplies = exports.ipcOr = exports.ipcAnd = exports.ipcAtom = exports.play = exports.winningStrategy = exports.createPropositionalProver = exports.TableauProver = exports.TRANSLATIONS = exports.translateFormula = exports.findTranslationPath = exports.ctlToLTL = exports.ltlToCTL = exports.godelTranslation = exports.glivenkoTranslation = exports.lcChurchMul = exports.lcChurchAdd = exports.lcChurchSucc = exports.lcEvalChurch = exports.lcDecodeChurch = exports.lcChurchNumeral = exports.lcOmegaSmall = exports.lcOmega = exports.lcY = exports.lcS = exports.lcK = exports.lcI = exports.lcIsWHNF = exports.lcIsNormalForm = exports.lcNormalize = exports.lcEtaStep = void 0;
exports.TacticDSL = exports.LemmaRAG = exports.DLHybridReasoning = exports.DLHybrid = exports.STNotebook = exports.ProofMining = exports.Semantics = exports.Reasoning = exports.Solvers = exports.TypeTheory = exports.ProofSystems = exports.Logic = exports.CSPHoare = exports.hmSchemeToString = exports.hmTypeToString = exports.HMTypeEnv = exports.hmInstantiate = exports.hmGeneralize = exports.hmResetFreshSupply = exports.hmFreshTypeVar = exports.hmComposeSubsts = exports.hmApplySubst = exports.hmIsUnifyError = exports.hmUnify = exports.hmNormalizeScheme = exports.hmInitialEnv = exports.hmIsInferError = exports.hmInferScheme = exports.hmInfer = exports.hmAlgorithmW = exports.applyHOSubst = exports.hoUnifyPattern = exports.isHigherOrderPattern = exports.hoIsPattern = void 0;
// API programática (uso recomendado para integración)
var api_1 = require("./api");
Object.defineProperty(exports, "evaluate", { enumerable: true, get: function () { return api_1.evaluate; } });
Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return api_1.parse; } });
Object.defineProperty(exports, "check", { enumerable: true, get: function () { return api_1.check; } });
Object.defineProperty(exports, "quickEval", { enumerable: true, get: function () { return api_1.quickEval; } });
Object.defineProperty(exports, "createInterpreter", { enumerable: true, get: function () { return api_1.createInterpreter; } });
Object.defineProperty(exports, "listProfiles", { enumerable: true, get: function () { return api_1.listProfiles; } });
Object.defineProperty(exports, "hover", { enumerable: true, get: function () { return api_1.hover; } });
Object.defineProperty(exports, "symbols", { enumerable: true, get: function () { return api_1.symbols; } });
Object.defineProperty(exports, "gotoDefinition", { enumerable: true, get: function () { return api_1.gotoDefinition; } });
Object.defineProperty(exports, "completion", { enumerable: true, get: function () { return api_1.completion; } });
Object.defineProperty(exports, "render", { enumerable: true, get: function () { return api_1.render; } });
// Tipos
__exportStar(require("./types"), exports);
// Lexer
var lexer_1 = require("./lexer/lexer");
Object.defineProperty(exports, "Lexer", { enumerable: true, get: function () { return lexer_1.Lexer; } });
var tokens_1 = require("./lexer/tokens");
Object.defineProperty(exports, "TokenType", { enumerable: true, get: function () { return tokens_1.TokenType; } });
Object.defineProperty(exports, "KEYWORDS", { enumerable: true, get: function () { return tokens_1.KEYWORDS; } });
// AST
__exportStar(require("./ast/nodes"), exports);
// Parser
var parser_1 = require("./parser/parser");
Object.defineProperty(exports, "Parser", { enumerable: true, get: function () { return parser_1.Parser; } });
// Perfiles
var interface_1 = require("./logic/profiles/interface");
Object.defineProperty(exports, "ProfileRegistry", { enumerable: true, get: function () { return interface_1.ProfileRegistry; } });
Object.defineProperty(exports, "registry", { enumerable: true, get: function () { return interface_1.registry; } });
var propositional_1 = require("./logic/profiles/classical/propositional");
Object.defineProperty(exports, "ClassicalPropositional", { enumerable: true, get: function () { return propositional_1.ClassicalPropositional; } });
Object.defineProperty(exports, "formulaToString", { enumerable: true, get: function () { return propositional_1.formulaToString; } });
var first_order_1 = require("./logic/profiles/classical/first-order");
Object.defineProperty(exports, "ClassicalFirstOrder", { enumerable: true, get: function () { return first_order_1.ClassicalFirstOrder; } });
var k_1 = require("./logic/profiles/modal/k");
Object.defineProperty(exports, "ModalK", { enumerable: true, get: function () { return k_1.ModalK; } });
var belnap_1 = require("./logic/profiles/paraconsistent/belnap");
Object.defineProperty(exports, "ParaconsistentBelnap", { enumerable: true, get: function () { return belnap_1.ParaconsistentBelnap; } });
// SAT Solving (parallelism support)
var cdcl_1 = require("./logic/profiles/classical/cdcl");
Object.defineProperty(exports, "cdcl", { enumerable: true, get: function () { return cdcl_1.cdcl; } });
Object.defineProperty(exports, "cdclAsync", { enumerable: true, get: function () { return cdcl_1.cdclAsync; } });
var dpll_1 = require("./logic/profiles/classical/dpll");
Object.defineProperty(exports, "dpll", { enumerable: true, get: function () { return dpll_1.dpll; } });
Object.defineProperty(exports, "dpllAsync", { enumerable: true, get: function () { return dpll_1.dpllAsync; } });
var parallel_sat_1 = require("./logic/profiles/classical/parallel-sat");
Object.defineProperty(exports, "workersAvailable", { enumerable: true, get: function () { return parallel_sat_1.workersAvailable; } });
Object.defineProperty(exports, "PARALLEL_THRESHOLD", { enumerable: true, get: function () { return parallel_sat_1.PARALLEL_THRESHOLD; } });
// Formato / Unicode / LaTeX
var format_1 = require("./runtime/format");
Object.defineProperty(exports, "formulaToUnicode", { enumerable: true, get: function () { return format_1.formulaToUnicode; } });
Object.defineProperty(exports, "formulaToLaTeX", { enumerable: true, get: function () { return format_1.formulaToLaTeX; } });
// Detector de falacias
var fallacies_1 = require("./runtime/fallacies");
Object.defineProperty(exports, "detectFallacies", { enumerable: true, get: function () { return fallacies_1.detectFallacies; } });
// Text Layer
var compiler_1 = require("./semantics/text-layer/compiler");
Object.defineProperty(exports, "createTextLayerState", { enumerable: true, get: function () { return compiler_1.createTextLayerState; } });
Object.defineProperty(exports, "parseAnchorPath", { enumerable: true, get: function () { return compiler_1.parseAnchorPath; } });
Object.defineProperty(exports, "registerPassage", { enumerable: true, get: function () { return compiler_1.registerPassage; } });
Object.defineProperty(exports, "registerFormalization", { enumerable: true, get: function () { return compiler_1.registerFormalization; } });
Object.defineProperty(exports, "registerClaim", { enumerable: true, get: function () { return compiler_1.registerClaim; } });
Object.defineProperty(exports, "registerSupport", { enumerable: true, get: function () { return compiler_1.registerSupport; } });
Object.defineProperty(exports, "registerConfidence", { enumerable: true, get: function () { return compiler_1.registerConfidence; } });
Object.defineProperty(exports, "registerContext", { enumerable: true, get: function () { return compiler_1.registerContext; } });
Object.defineProperty(exports, "compileClaimsToTheory", { enumerable: true, get: function () { return compiler_1.compileClaimsToTheory; } });
Object.defineProperty(exports, "registerDefinition", { enumerable: true, get: function () { return compiler_1.registerDefinition; } });
Object.defineProperty(exports, "registerSource", { enumerable: true, get: function () { return compiler_1.registerSource; } });
Object.defineProperty(exports, "registerInterpretation", { enumerable: true, get: function () { return compiler_1.registerInterpretation; } });
// Text Layer 2.0 — grafo de claims con dependencias e invalidación propagada
var v2_1 = require("./semantics/text-layer/v2");
Object.defineProperty(exports, "ClaimGraph", { enumerable: true, get: function () { return v2_1.ClaimGraph; } });
Object.defineProperty(exports, "CycleError", { enumerable: true, get: function () { return v2_1.CycleError; } });
// Runtime
var interpreter_1 = require("./runtime/interpreter");
Object.defineProperty(exports, "Interpreter", { enumerable: true, get: function () { return interpreter_1.Interpreter; } });
// Protocol
var handler_1 = require("./protocol/handler");
Object.defineProperty(exports, "ProtocolHandler", { enumerable: true, get: function () { return handler_1.ProtocolHandler; } });
// REPL
var repl_1 = require("./repl/repl");
Object.defineProperty(exports, "REPL", { enumerable: true, get: function () { return repl_1.REPL; } });
// TypeChecker (validación estática con sugerencias humanas)
var typecheck_1 = require("./runtime/typecheck");
Object.defineProperty(exports, "typeCheck", { enumerable: true, get: function () { return typecheck_1.typeCheck; } });
Object.defineProperty(exports, "TypeChecker", { enumerable: true, get: function () { return typecheck_1.TypeChecker; } });
// AST visitor (nuevo en v4)
var visitor_1 = require("./ast/visitor");
Object.defineProperty(exports, "visit", { enumerable: true, get: function () { return visitor_1.visit; } });
Object.defineProperty(exports, "visitProgram", { enumerable: true, get: function () { return visitor_1.visitProgram; } });
Object.defineProperty(exports, "BaseASTVisitor", { enumerable: true, get: function () { return visitor_1.BaseASTVisitor; } });
// CDCL v2
var cdcl_v2_1 = require("./solver/cdcl-v2");
Object.defineProperty(exports, "solveCDCLv2", { enumerable: true, get: function () { return cdcl_v2_1.solveCDCLv2; } });
// Parallel pool
var parallel_1 = require("./runtime/parallel");
Object.defineProperty(exports, "evalParallel", { enumerable: true, get: function () { return parallel_1.evalParallel; } });
Object.defineProperty(exports, "shutdownPool", { enumerable: true, get: function () { return parallel_1.shutdownPool; } });
// Memoization
var memo_1 = require("./runtime/memo");
Object.defineProperty(exports, "DerivationCache", { enumerable: true, get: function () { return memo_1.DerivationCache; } });
Object.defineProperty(exports, "hashFormula", { enumerable: true, get: function () { return memo_1.hashFormula; } });
// Theorem cache (proof reuse persistente)
var theorem_cache_1 = require("./runtime/theorem-cache");
Object.defineProperty(exports, "TheoremCache", { enumerable: true, get: function () { return theorem_cache_1.TheoremCache; } });
Object.defineProperty(exports, "tryReuseProof", { enumerable: true, get: function () { return theorem_cache_1.tryReuseProof; } });
// Streaming
var streaming_1 = require("./runtime/streaming");
Object.defineProperty(exports, "streamEval", { enumerable: true, get: function () { return streaming_1.streamEval; } });
// Countermodel minimization
var countermodel_min_1 = require("./runtime/countermodel-min");
Object.defineProperty(exports, "minimizeCountermodel", { enumerable: true, get: function () { return countermodel_min_1.minimizeCountermodel; } });
// Proof minification
var proof_minify_1 = require("./proof-systems/proof-minify");
Object.defineProperty(exports, "minifyProof", { enumerable: true, get: function () { return proof_minify_1.minifyProof; } });
Object.defineProperty(exports, "compactModusPonensChain", { enumerable: true, get: function () { return proof_minify_1.compactModusPonensChain; } });
Object.defineProperty(exports, "removeUnusedSubproofs", { enumerable: true, get: function () { return proof_minify_1.removeUnusedSubproofs; } });
// Coq exporter
var coq_1 = require("./tooling/exporters/coq");
Object.defineProperty(exports, "exportToCoq", { enumerable: true, get: function () { return coq_1.exportToCoq; } });
Object.defineProperty(exports, "exportProofToCoq", { enumerable: true, get: function () { return coq_1.exportProofToCoq; } });
// Argumentation (Dung framework)
var argumentation_1 = require("./reasoning/argumentation");
Object.defineProperty(exports, "computeExtensions", { enumerable: true, get: function () { return argumentation_1.computeExtensions; } });
Object.defineProperty(exports, "isAdmissible", { enumerable: true, get: function () { return argumentation_1.isAdmissible; } });
Object.defineProperty(exports, "isConflictFree", { enumerable: true, get: function () { return argumentation_1.isConflictFree; } });
Object.defineProperty(exports, "defends", { enumerable: true, get: function () { return argumentation_1.defends; } });
Object.defineProperty(exports, "dotExport", { enumerable: true, get: function () { return argumentation_1.dotExport; } });
// FOL prover
var fol_prover_1 = require("./proof-systems/fol-prover");
Object.defineProperty(exports, "proveFOL", { enumerable: true, get: function () { return fol_prover_1.proveFOL; } });
Object.defineProperty(exports, "unify", { enumerable: true, get: function () { return fol_prover_1.unify; } });
Object.defineProperty(exports, "skolemize", { enumerable: true, get: function () { return fol_prover_1.skolemize; } });
Object.defineProperty(exports, "toCNF", { enumerable: true, get: function () { return fol_prover_1.toCNF; } });
// TPTP parser/emitter + bridge a fol-prover
var tptp_1 = require("./tooling/tptp");
Object.defineProperty(exports, "parseTptp", { enumerable: true, get: function () { return tptp_1.parseTptp; } });
Object.defineProperty(exports, "parseTptpFormula", { enumerable: true, get: function () { return tptp_1.parseFormula; } });
Object.defineProperty(exports, "emitTptp", { enumerable: true, get: function () { return tptp_1.emitTptp; } });
Object.defineProperty(exports, "emitTptpFormula", { enumerable: true, get: function () { return tptp_1.emitFormula; } });
Object.defineProperty(exports, "tptpToFolProverFormat", { enumerable: true, get: function () { return tptp_1.toFolProverFormat; } });
Object.defineProperty(exports, "tptpFormulaToFol", { enumerable: true, get: function () { return tptp_1.tptpFormulaToFol; } });
Object.defineProperty(exports, "TptpParserError", { enumerable: true, get: function () { return tptp_1.TptpParserError; } });
Object.defineProperty(exports, "TptpTokenizerError", { enumerable: true, get: function () { return tptp_1.TptpTokenizerError; } });
// Proof exchange
var proof_exchange_1 = require("./proof-systems/proof-exchange");
Object.defineProperty(exports, "canonicalize", { enumerable: true, get: function () { return proof_exchange_1.canonicalize; } });
Object.defineProperty(exports, "hashProof", { enumerable: true, get: function () { return proof_exchange_1.hashProof; } });
Object.defineProperty(exports, "signProof", { enumerable: true, get: function () { return proof_exchange_1.signProof; } });
Object.defineProperty(exports, "verifyProof", { enumerable: true, get: function () { return proof_exchange_1.verifyProof; } });
Object.defineProperty(exports, "generateKeyPair", { enumerable: true, get: function () { return proof_exchange_1.generateKeyPair; } });
// Time-travel
var time_travel_1 = require("./tooling/time-travel");
Object.defineProperty(exports, "captureSnapshot", { enumerable: true, get: function () { return time_travel_1.captureSnapshot; } });
Object.defineProperty(exports, "SnapshotStore", { enumerable: true, get: function () { return time_travel_1.SnapshotStore; } });
// Educational
var educational_1 = require("./tooling/educational");
Object.defineProperty(exports, "generateExercise", { enumerable: true, get: function () { return educational_1.generateExercise; } });
Object.defineProperty(exports, "checkAnswer", { enumerable: true, get: function () { return educational_1.checkAnswer; } });
Object.defineProperty(exports, "generateLessonPath", { enumerable: true, get: function () { return educational_1.generateLessonPath; } });
// SMT bridge
var smt_1 = require("./solver/smt");
Object.defineProperty(exports, "toSMTLIB", { enumerable: true, get: function () { return smt_1.toSMTLIB; } });
Object.defineProperty(exports, "MockSMTBackend", { enumerable: true, get: function () { return smt_1.MockSMTBackend; } });
Object.defineProperty(exports, "SubprocessSMTBackend", { enumerable: true, get: function () { return smt_1.SubprocessSMTBackend; } });
Object.defineProperty(exports, "detectAvailableSMT", { enumerable: true, get: function () { return smt_1.detectAvailableSMT; } });
// Citation Reasoning (δ3)
var citation_reasoning_1 = require("./reasoning/citation-reasoning");
Object.defineProperty(exports, "deriveWithCitations", { enumerable: true, get: function () { return citation_reasoning_1.deriveWithCitations; } });
Object.defineProperty(exports, "explainProof", { enumerable: true, get: function () { return citation_reasoning_1.explainProof; } });
// Curry-Howard — correspondencia term ↔ proof
var curry_howard_1 = require("./type-theory/curry-howard");
Object.defineProperty(exports, "inferType", { enumerable: true, get: function () { return curry_howard_1.inferType; } });
Object.defineProperty(exports, "isInferError", { enumerable: true, get: function () { return curry_howard_1.isInferError; } });
Object.defineProperty(exports, "reduceBeta", { enumerable: true, get: function () { return curry_howard_1.reduceBeta; } });
Object.defineProperty(exports, "normalize", { enumerable: true, get: function () { return curry_howard_1.normalize; } });
Object.defineProperty(exports, "isNormal", { enumerable: true, get: function () { return curry_howard_1.isNormal; } });
Object.defineProperty(exports, "termToProof", { enumerable: true, get: function () { return curry_howard_1.termToProof; } });
Object.defineProperty(exports, "proofToTerm", { enumerable: true, get: function () { return curry_howard_1.proofToTerm; } });
Object.defineProperty(exports, "proofIsConsistent", { enumerable: true, get: function () { return curry_howard_1.proofIsConsistent; } });
Object.defineProperty(exports, "ProofConversionError", { enumerable: true, get: function () { return curry_howard_1.ProofConversionError; } });
Object.defineProperty(exports, "chTypeToString", { enumerable: true, get: function () { return curry_howard_1.typeToString; } });
Object.defineProperty(exports, "chTermToString", { enumerable: true, get: function () { return curry_howard_1.termToString; } });
Object.defineProperty(exports, "chEqType", { enumerable: true, get: function () { return curry_howard_1.eqType; } });
// MLTT — Martin-Löf Type Theory (Π/Σ/Id/Nat + universos)
var mltt_1 = require("./type-theory/mltt");
Object.defineProperty(exports, "mVar", { enumerable: true, get: function () { return mltt_1.mVar; } });
Object.defineProperty(exports, "mUniverse", { enumerable: true, get: function () { return mltt_1.mUniverse; } });
Object.defineProperty(exports, "mPi", { enumerable: true, get: function () { return mltt_1.mPi; } });
Object.defineProperty(exports, "mLam", { enumerable: true, get: function () { return mltt_1.mLam; } });
Object.defineProperty(exports, "mApp", { enumerable: true, get: function () { return mltt_1.mApp; } });
Object.defineProperty(exports, "mSigma", { enumerable: true, get: function () { return mltt_1.mSigma; } });
Object.defineProperty(exports, "mPair", { enumerable: true, get: function () { return mltt_1.mPair; } });
Object.defineProperty(exports, "mFst", { enumerable: true, get: function () { return mltt_1.mFst; } });
Object.defineProperty(exports, "mSnd", { enumerable: true, get: function () { return mltt_1.mSnd; } });
Object.defineProperty(exports, "mId", { enumerable: true, get: function () { return mltt_1.mId; } });
Object.defineProperty(exports, "mRefl", { enumerable: true, get: function () { return mltt_1.mRefl; } });
Object.defineProperty(exports, "mNat", { enumerable: true, get: function () { return mltt_1.mNat; } });
Object.defineProperty(exports, "mZero", { enumerable: true, get: function () { return mltt_1.mZero; } });
Object.defineProperty(exports, "mSucc", { enumerable: true, get: function () { return mltt_1.mSucc; } });
Object.defineProperty(exports, "mArrow", { enumerable: true, get: function () { return mltt_1.mArrow; } });
Object.defineProperty(exports, "mlttInferType", { enumerable: true, get: function () { return mltt_1.inferType; } });
Object.defineProperty(exports, "mlttCheckType", { enumerable: true, get: function () { return mltt_1.checkType; } });
Object.defineProperty(exports, "mlttIsInferError", { enumerable: true, get: function () { return mltt_1.isInferError; } });
Object.defineProperty(exports, "mlttNormalize", { enumerable: true, get: function () { return mltt_1.normalize; } });
Object.defineProperty(exports, "mlttReduceStep", { enumerable: true, get: function () { return mltt_1.reduceStep; } });
Object.defineProperty(exports, "mlttIsNormal", { enumerable: true, get: function () { return mltt_1.isNormal; } });
Object.defineProperty(exports, "mlttAlphaEq", { enumerable: true, get: function () { return mltt_1.alphaEq; } });
Object.defineProperty(exports, "mlttAlphaBetaEq", { enumerable: true, get: function () { return mltt_1.alphaBetaEq; } });
Object.defineProperty(exports, "mlttSubstitute", { enumerable: true, get: function () { return mltt_1.substitute; } });
Object.defineProperty(exports, "mlttFreeVars", { enumerable: true, get: function () { return mltt_1.freeVars; } });
Object.defineProperty(exports, "mlttOccursFree", { enumerable: true, get: function () { return mltt_1.occursFree; } });
Object.defineProperty(exports, "mlttTermToString", { enumerable: true, get: function () { return mltt_1.termToString; } });
// λ-cálculo untyped puro — β/η, estrategias, combinadores, Church numerals
var lambda_calc_1 = require("./type-theory/lambda-calc");
Object.defineProperty(exports, "lcVar", { enumerable: true, get: function () { return lambda_calc_1.v; } });
Object.defineProperty(exports, "lcLam", { enumerable: true, get: function () { return lambda_calc_1.lam; } });
Object.defineProperty(exports, "lcAp", { enumerable: true, get: function () { return lambda_calc_1.ap; } });
Object.defineProperty(exports, "lcApN", { enumerable: true, get: function () { return lambda_calc_1.apN; } });
Object.defineProperty(exports, "lcAlphaEq", { enumerable: true, get: function () { return lambda_calc_1.alphaEq; } });
Object.defineProperty(exports, "lcTermToString", { enumerable: true, get: function () { return lambda_calc_1.termToString; } });
Object.defineProperty(exports, "lcFreeVars", { enumerable: true, get: function () { return lambda_calc_1.freeVars; } });
Object.defineProperty(exports, "lcSubstitute", { enumerable: true, get: function () { return lambda_calc_1.substitute; } });
Object.defineProperty(exports, "lcAlphaRename", { enumerable: true, get: function () { return lambda_calc_1.alphaRename; } });
Object.defineProperty(exports, "lcMakeFreshSupply", { enumerable: true, get: function () { return lambda_calc_1.makeFreshSupply; } });
Object.defineProperty(exports, "lcBetaStep", { enumerable: true, get: function () { return lambda_calc_1.betaStep; } });
Object.defineProperty(exports, "lcEtaStep", { enumerable: true, get: function () { return lambda_calc_1.etaStep; } });
Object.defineProperty(exports, "lcNormalize", { enumerable: true, get: function () { return lambda_calc_1.normalize; } });
Object.defineProperty(exports, "lcIsNormalForm", { enumerable: true, get: function () { return lambda_calc_1.isNormalForm; } });
Object.defineProperty(exports, "lcIsWHNF", { enumerable: true, get: function () { return lambda_calc_1.isWeakHeadNormalForm; } });
Object.defineProperty(exports, "lcI", { enumerable: true, get: function () { return lambda_calc_1.I; } });
Object.defineProperty(exports, "lcK", { enumerable: true, get: function () { return lambda_calc_1.K; } });
Object.defineProperty(exports, "lcS", { enumerable: true, get: function () { return lambda_calc_1.S; } });
Object.defineProperty(exports, "lcY", { enumerable: true, get: function () { return lambda_calc_1.Y; } });
Object.defineProperty(exports, "lcOmega", { enumerable: true, get: function () { return lambda_calc_1.omega; } });
Object.defineProperty(exports, "lcOmegaSmall", { enumerable: true, get: function () { return lambda_calc_1.omegaSmall; } });
Object.defineProperty(exports, "lcChurchNumeral", { enumerable: true, get: function () { return lambda_calc_1.churchNumeral; } });
Object.defineProperty(exports, "lcDecodeChurch", { enumerable: true, get: function () { return lambda_calc_1.decodeChurch; } });
Object.defineProperty(exports, "lcEvalChurch", { enumerable: true, get: function () { return lambda_calc_1.evalChurch; } });
Object.defineProperty(exports, "lcChurchSucc", { enumerable: true, get: function () { return lambda_calc_1.churchSucc; } });
Object.defineProperty(exports, "lcChurchAdd", { enumerable: true, get: function () { return lambda_calc_1.churchAdd; } });
Object.defineProperty(exports, "lcChurchMul", { enumerable: true, get: function () { return lambda_calc_1.churchMul; } });
// profile-bridge — traducciones entre perfiles lógicos
var profile_bridge_1 = require("./logic/profile-bridge");
Object.defineProperty(exports, "glivenkoTranslation", { enumerable: true, get: function () { return profile_bridge_1.glivenkoTranslation; } });
Object.defineProperty(exports, "godelTranslation", { enumerable: true, get: function () { return profile_bridge_1.godelTranslation; } });
Object.defineProperty(exports, "ltlToCTL", { enumerable: true, get: function () { return profile_bridge_1.ltlToCTL; } });
Object.defineProperty(exports, "ctlToLTL", { enumerable: true, get: function () { return profile_bridge_1.ctlToLTL; } });
Object.defineProperty(exports, "findTranslationPath", { enumerable: true, get: function () { return profile_bridge_1.findTranslationPath; } });
Object.defineProperty(exports, "translateFormula", { enumerable: true, get: function () { return profile_bridge_1.translateFormula; } });
Object.defineProperty(exports, "TRANSLATIONS", { enumerable: true, get: function () { return profile_bridge_1.TRANSLATIONS; } });
// tableau-framework — probador semántico por tableau
var tableau_framework_1 = require("./proof-systems/tableau-framework");
Object.defineProperty(exports, "TableauProver", { enumerable: true, get: function () { return tableau_framework_1.TableauProver; } });
Object.defineProperty(exports, "createPropositionalProver", { enumerable: true, get: function () { return tableau_framework_1.createPropositionalProver; } });
// game-semantics — juegos dialógicos IPC (Lorenzen-Felscher)
var game_semantics_1 = require("./semantics/game-semantics");
Object.defineProperty(exports, "winningStrategy", { enumerable: true, get: function () { return game_semantics_1.winningStrategy; } });
Object.defineProperty(exports, "play", { enumerable: true, get: function () { return game_semantics_1.play; } });
Object.defineProperty(exports, "ipcAtom", { enumerable: true, get: function () { return game_semantics_1.ipcAtom; } });
Object.defineProperty(exports, "ipcAnd", { enumerable: true, get: function () { return game_semantics_1.ipcAnd; } });
Object.defineProperty(exports, "ipcOr", { enumerable: true, get: function () { return game_semantics_1.ipcOr; } });
Object.defineProperty(exports, "ipcImplies", { enumerable: true, get: function () { return game_semantics_1.ipcImplies; } });
Object.defineProperty(exports, "ipcNot", { enumerable: true, get: function () { return game_semantics_1.ipcNot; } });
Object.defineProperty(exports, "ipcBottom", { enumerable: true, get: function () { return game_semantics_1.ipcBottom; } });
// lemma synthesis — exploración de teoría QuickSpec-style
var lemma_synthesis_1 = require("./reasoning/lemma-synthesis");
Object.defineProperty(exports, "lsEnumerateTerms", { enumerable: true, get: function () { return lemma_synthesis_1.enumerateTerms; } });
Object.defineProperty(exports, "synthesizeEqualities", { enumerable: true, get: function () { return lemma_synthesis_1.synthesizeEqualities; } });
Object.defineProperty(exports, "pruneConsequences", { enumerable: true, get: function () { return lemma_synthesis_1.pruneConsequences; } });
Object.defineProperty(exports, "verifyConjectures", { enumerable: true, get: function () { return lemma_synthesis_1.verifyConjectures; } });
Object.defineProperty(exports, "naturalNumbersSignature", { enumerable: true, get: function () { return lemma_synthesis_1.naturalNumbersSignature; } });
Object.defineProperty(exports, "booleansSignature", { enumerable: true, get: function () { return lemma_synthesis_1.booleansSignature; } });
Object.defineProperty(exports, "listsSignature", { enumerable: true, get: function () { return lemma_synthesis_1.listsSignature; } });
Object.defineProperty(exports, "lsTermToString", { enumerable: true, get: function () { return lemma_synthesis_1.termToString; } });
Object.defineProperty(exports, "lsFreeVars", { enumerable: true, get: function () { return lemma_synthesis_1.freeVars; } });
// coinduction — streams coinductivos y bisimulación
var coinduction_1 = require("./semantics/coinduction");
Object.defineProperty(exports, "streamTake", { enumerable: true, get: function () { return coinduction_1.take; } });
Object.defineProperty(exports, "streamRepeat", { enumerable: true, get: function () { return coinduction_1.repeat; } });
Object.defineProperty(exports, "streamIterate", { enumerable: true, get: function () { return coinduction_1.iterate; } });
Object.defineProperty(exports, "streamMap", { enumerable: true, get: function () { return coinduction_1.map; } });
Object.defineProperty(exports, "streamZipWith", { enumerable: true, get: function () { return coinduction_1.zipWith; } });
Object.defineProperty(exports, "naturals", { enumerable: true, get: function () { return coinduction_1.naturals; } });
Object.defineProperty(exports, "fibonacci", { enumerable: true, get: function () { return coinduction_1.fibonacci; } });
Object.defineProperty(exports, "isBisimilar", { enumerable: true, get: function () { return coinduction_1.isBisimilar; } });
// higher-order-unify — unificación de orden superior
var higher_order_unify_1 = require("./proof-systems/higher-order-unify");
Object.defineProperty(exports, "hoIsPattern", { enumerable: true, get: function () { return higher_order_unify_1.isPattern; } });
Object.defineProperty(exports, "isHigherOrderPattern", { enumerable: true, get: function () { return higher_order_unify_1.isHigherOrderPattern; } });
Object.defineProperty(exports, "hoUnifyPattern", { enumerable: true, get: function () { return higher_order_unify_1.unifyPattern; } });
Object.defineProperty(exports, "applyHOSubst", { enumerable: true, get: function () { return higher_order_unify_1.applyHOSubst; } });
// hindley-milner — Algorithm W (Damas-Milner) con let-polimorfismo
var hindley_milner_1 = require("./type-theory/hindley-milner");
Object.defineProperty(exports, "hmAlgorithmW", { enumerable: true, get: function () { return hindley_milner_1.algorithmW; } });
Object.defineProperty(exports, "hmInfer", { enumerable: true, get: function () { return hindley_milner_1.infer; } });
Object.defineProperty(exports, "hmInferScheme", { enumerable: true, get: function () { return hindley_milner_1.inferScheme; } });
Object.defineProperty(exports, "hmIsInferError", { enumerable: true, get: function () { return hindley_milner_1.isInferError; } });
Object.defineProperty(exports, "hmInitialEnv", { enumerable: true, get: function () { return hindley_milner_1.initialEnv; } });
Object.defineProperty(exports, "hmNormalizeScheme", { enumerable: true, get: function () { return hindley_milner_1.normalizeScheme; } });
Object.defineProperty(exports, "hmUnify", { enumerable: true, get: function () { return hindley_milner_1.unify; } });
Object.defineProperty(exports, "hmIsUnifyError", { enumerable: true, get: function () { return hindley_milner_1.isUnifyError; } });
Object.defineProperty(exports, "hmApplySubst", { enumerable: true, get: function () { return hindley_milner_1.applySubst; } });
Object.defineProperty(exports, "hmComposeSubsts", { enumerable: true, get: function () { return hindley_milner_1.composeSubsts; } });
Object.defineProperty(exports, "hmFreshTypeVar", { enumerable: true, get: function () { return hindley_milner_1.freshTypeVar; } });
Object.defineProperty(exports, "hmResetFreshSupply", { enumerable: true, get: function () { return hindley_milner_1.resetFreshSupply; } });
Object.defineProperty(exports, "hmGeneralize", { enumerable: true, get: function () { return hindley_milner_1.generalize; } });
Object.defineProperty(exports, "hmInstantiate", { enumerable: true, get: function () { return hindley_milner_1.instantiate; } });
Object.defineProperty(exports, "HMTypeEnv", { enumerable: true, get: function () { return hindley_milner_1.TypeEnv; } });
Object.defineProperty(exports, "hmTypeToString", { enumerable: true, get: function () { return hindley_milner_1.typeToString; } });
Object.defineProperty(exports, "hmSchemeToString", { enumerable: true, get: function () { return hindley_milner_1.schemeToString; } });
// csp-hoare — Communicating Sequential Processes (Hoare 1978/1985).
// Expuesto como namespace porque sus constructores cortos (`prefix`, `choice`,
// `parallel`, `hide`...) colisionarían con otros módulos en el flat export.
exports.CSPHoare = __importStar(require("./runtime/csp-hoare"));
// ── Namespaces semánticos (aditivo, no breaking) ─────────────────────────────
// Re-organiza los símbolos públicos por dominio sin remover los flat exports.
// Uso: `import { Logic, TypeTheory } from '@stevenvo780/st-lang'`.
//
// Nota: el namespace `Semantics` (valor) convive con `type Semantics` ya
// exportado por argumentation usando `export * as` (re-export wildcard), que
// crea un namespace de valor compatible con la fusión de declaraciones de TS.
exports.Logic = __importStar(require("./namespaces/logic"));
exports.ProofSystems = __importStar(require("./namespaces/proof-systems"));
exports.TypeTheory = __importStar(require("./namespaces/type-theory"));
exports.Solvers = __importStar(require("./namespaces/solvers"));
exports.Reasoning = __importStar(require("./namespaces/reasoning"));
exports.Semantics = __importStar(require("./namespaces/semantics"));
// === Ciclo 3 V4.15 features ===
exports.ProofMining = __importStar(require("./reasoning/proof-mining"));
exports.STNotebook = __importStar(require("./format/stnb"));
exports.DLHybrid = __importStar(require("./logic/profiles/dl-hybrid"));
exports.DLHybridReasoning = __importStar(require("./reasoning/dl-hybrid"));
exports.LemmaRAG = __importStar(require("./reasoning/lemma-rag"));
exports.TacticDSL = __importStar(require("./reasoning/tactic-dsl"));
//# sourceMappingURL=index.js.map