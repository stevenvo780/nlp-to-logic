"use strict";
// ============================================================
// BAN Logic — Barrel export
// ============================================================
//
// Burrows-Abadi-Needham logic para verificación de protocolos
// criptográficos de autenticación.
//
// API pública:
//   - Constructores de términos y fórmulas (`principal`, `key`, ...)
//   - Reglas de inferencia (R1-R10 y variantes)
//   - `saturate(initial)` para cerrar un estado bajo las reglas
//   - `analyzeProtocol(p)` para evaluar goals de un Protocol
//   - Protocolos pre-armados: Needham-Schroeder symmetric / PK / Kerberos
Object.defineProperty(exports, "__esModule", { value: true });
exports.needhamSchroederSymmetric = exports.needhamSchroederPublicKey = exports.kerberos = exports.saturate = exports.idealize = exports.analyzeProtocol = exports.RULES_REGISTRY = exports.applySeesCompound = exports.applySeeingEncrypted = exports.applySaidConjunction = exports.applyNonceVerification = exports.applyMessageMeaningShared = exports.applyMessageMeaningSecret = exports.applyMessageMeaningPublic = exports.applyJurisdiction = exports.applyFreshnessPropagation = exports.applyBeliefConjunctionRight = exports.applyBeliefConjunction = exports.termToString = exports.termEquals = exports.hasFormula = exports.formulaToString = exports.formulaEquals = exports.sharedSecret = exports.sharedKey = exports.sees = exports.saidMessage = exports.said = exports.publicKey = exports.jurisdiction = exports.fresh = exports.formulaAnd = exports.controls = exports.believes = exports.principal = exports.nonce = exports.message = exports.key = exports.hashed = exports.encrypted = exports.compound = exports.atom = void 0;
var terms_1 = require("./terms");
// Constructores de términos
Object.defineProperty(exports, "atom", { enumerable: true, get: function () { return terms_1.atom; } });
Object.defineProperty(exports, "compound", { enumerable: true, get: function () { return terms_1.compound; } });
Object.defineProperty(exports, "encrypted", { enumerable: true, get: function () { return terms_1.encrypted; } });
Object.defineProperty(exports, "hashed", { enumerable: true, get: function () { return terms_1.hashed; } });
Object.defineProperty(exports, "key", { enumerable: true, get: function () { return terms_1.key; } });
Object.defineProperty(exports, "message", { enumerable: true, get: function () { return terms_1.message; } });
Object.defineProperty(exports, "nonce", { enumerable: true, get: function () { return terms_1.nonce; } });
Object.defineProperty(exports, "principal", { enumerable: true, get: function () { return terms_1.principal; } });
// Constructores de fórmulas
Object.defineProperty(exports, "believes", { enumerable: true, get: function () { return terms_1.believes; } });
Object.defineProperty(exports, "controls", { enumerable: true, get: function () { return terms_1.controls; } });
Object.defineProperty(exports, "formulaAnd", { enumerable: true, get: function () { return terms_1.formulaAnd; } });
Object.defineProperty(exports, "fresh", { enumerable: true, get: function () { return terms_1.fresh; } });
Object.defineProperty(exports, "jurisdiction", { enumerable: true, get: function () { return terms_1.jurisdiction; } });
Object.defineProperty(exports, "publicKey", { enumerable: true, get: function () { return terms_1.publicKey; } });
Object.defineProperty(exports, "said", { enumerable: true, get: function () { return terms_1.said; } });
Object.defineProperty(exports, "saidMessage", { enumerable: true, get: function () { return terms_1.saidMessage; } });
Object.defineProperty(exports, "sees", { enumerable: true, get: function () { return terms_1.sees; } });
Object.defineProperty(exports, "sharedKey", { enumerable: true, get: function () { return terms_1.sharedKey; } });
Object.defineProperty(exports, "sharedSecret", { enumerable: true, get: function () { return terms_1.sharedSecret; } });
// Equality + printing
Object.defineProperty(exports, "formulaEquals", { enumerable: true, get: function () { return terms_1.formulaEquals; } });
Object.defineProperty(exports, "formulaToString", { enumerable: true, get: function () { return terms_1.formulaToString; } });
Object.defineProperty(exports, "hasFormula", { enumerable: true, get: function () { return terms_1.hasFormula; } });
Object.defineProperty(exports, "termEquals", { enumerable: true, get: function () { return terms_1.termEquals; } });
Object.defineProperty(exports, "termToString", { enumerable: true, get: function () { return terms_1.termToString; } });
var rules_1 = require("./rules");
Object.defineProperty(exports, "applyBeliefConjunction", { enumerable: true, get: function () { return rules_1.applyBeliefConjunction; } });
Object.defineProperty(exports, "applyBeliefConjunctionRight", { enumerable: true, get: function () { return rules_1.applyBeliefConjunctionRight; } });
Object.defineProperty(exports, "applyFreshnessPropagation", { enumerable: true, get: function () { return rules_1.applyFreshnessPropagation; } });
Object.defineProperty(exports, "applyJurisdiction", { enumerable: true, get: function () { return rules_1.applyJurisdiction; } });
Object.defineProperty(exports, "applyMessageMeaningPublic", { enumerable: true, get: function () { return rules_1.applyMessageMeaningPublic; } });
Object.defineProperty(exports, "applyMessageMeaningSecret", { enumerable: true, get: function () { return rules_1.applyMessageMeaningSecret; } });
Object.defineProperty(exports, "applyMessageMeaningShared", { enumerable: true, get: function () { return rules_1.applyMessageMeaningShared; } });
Object.defineProperty(exports, "applyNonceVerification", { enumerable: true, get: function () { return rules_1.applyNonceVerification; } });
Object.defineProperty(exports, "applySaidConjunction", { enumerable: true, get: function () { return rules_1.applySaidConjunction; } });
Object.defineProperty(exports, "applySeeingEncrypted", { enumerable: true, get: function () { return rules_1.applySeeingEncrypted; } });
Object.defineProperty(exports, "applySeesCompound", { enumerable: true, get: function () { return rules_1.applySeesCompound; } });
Object.defineProperty(exports, "RULES_REGISTRY", { enumerable: true, get: function () { return rules_1.RULES_REGISTRY; } });
var analyze_1 = require("./analyze");
Object.defineProperty(exports, "analyzeProtocol", { enumerable: true, get: function () { return analyze_1.analyzeProtocol; } });
Object.defineProperty(exports, "idealize", { enumerable: true, get: function () { return analyze_1.idealize; } });
Object.defineProperty(exports, "saturate", { enumerable: true, get: function () { return analyze_1.saturate; } });
var protocols_1 = require("./protocols");
Object.defineProperty(exports, "kerberos", { enumerable: true, get: function () { return protocols_1.kerberos; } });
Object.defineProperty(exports, "needhamSchroederPublicKey", { enumerable: true, get: function () { return protocols_1.needhamSchroederPublicKey; } });
Object.defineProperty(exports, "needhamSchroederSymmetric", { enumerable: true, get: function () { return protocols_1.needhamSchroederSymmetric; } });
//# sourceMappingURL=index.js.map