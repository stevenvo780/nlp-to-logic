"use strict";
// ============================================================
// ST Proof Guidance — ML-guided proof search
//
// Sistema de ranking de tácticas/lemas con feature extraction
// simple + logistic regression + beam search guiada.
//
// Sin dependencias externas, sin embeddings — todo deterministic
// y barato. Pensado para integrarse al agente IA del Agora como
// heurística previa a aplicar tácticas reales sobre ST.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.guidedSearch = exports.updateModel = exports.trainModel = exports.tacticSuccessProbability = exports.rankTactics = exports.createEmptyModel = exports.featureNames = exports.extractFeatures = void 0;
var features_1 = require("./features");
Object.defineProperty(exports, "extractFeatures", { enumerable: true, get: function () { return features_1.extractFeatures; } });
Object.defineProperty(exports, "featureNames", { enumerable: true, get: function () { return features_1.featureNames; } });
var model_1 = require("./model");
Object.defineProperty(exports, "createEmptyModel", { enumerable: true, get: function () { return model_1.createEmptyModel; } });
Object.defineProperty(exports, "rankTactics", { enumerable: true, get: function () { return model_1.rankTactics; } });
Object.defineProperty(exports, "tacticSuccessProbability", { enumerable: true, get: function () { return model_1.tacticSuccessProbability; } });
Object.defineProperty(exports, "trainModel", { enumerable: true, get: function () { return model_1.trainModel; } });
Object.defineProperty(exports, "updateModel", { enumerable: true, get: function () { return model_1.updateModel; } });
var search_1 = require("./search");
Object.defineProperty(exports, "guidedSearch", { enumerable: true, get: function () { return search_1.guidedSearch; } });
//# sourceMappingURL=index.js.map