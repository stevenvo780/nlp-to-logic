"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patternMatches = exports.matchPattern = exports.normalizeWhitespace = exports.applySubstitution = exports.computeSubstitution = exports.canonicalString = exports.canonicalize = exports.tryReuseProof = exports.TheoremCache = void 0;
var cache_1 = require("./cache");
Object.defineProperty(exports, "TheoremCache", { enumerable: true, get: function () { return cache_1.TheoremCache; } });
Object.defineProperty(exports, "tryReuseProof", { enumerable: true, get: function () { return cache_1.tryReuseProof; } });
var canonical_1 = require("./canonical");
Object.defineProperty(exports, "canonicalize", { enumerable: true, get: function () { return canonical_1.canonicalize; } });
Object.defineProperty(exports, "canonicalString", { enumerable: true, get: function () { return canonical_1.canonicalString; } });
Object.defineProperty(exports, "computeSubstitution", { enumerable: true, get: function () { return canonical_1.computeSubstitution; } });
Object.defineProperty(exports, "applySubstitution", { enumerable: true, get: function () { return canonical_1.applySubstitution; } });
Object.defineProperty(exports, "normalizeWhitespace", { enumerable: true, get: function () { return canonical_1.normalizeWhitespace; } });
var pattern_1 = require("./pattern");
Object.defineProperty(exports, "matchPattern", { enumerable: true, get: function () { return pattern_1.matchPattern; } });
Object.defineProperty(exports, "patternMatches", { enumerable: true, get: function () { return pattern_1.patternMatches; } });
//# sourceMappingURL=index.js.map