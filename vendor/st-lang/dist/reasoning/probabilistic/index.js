"use strict";
// ============================================================
// ST Probabilistic Programming — Barrel
// ============================================================
//
// PPL minimal: define un `PProgram<T>` como `(sampler) => T`, donde
// `sampler` ofrece `sample(dist)`, `observe(condition)` y
// `factor(logWeight)`. Cuatro motores de inferencia:
//
//   - `enumerate`           Exacto, soporta solo discreto finito.
//   - `rejectionSample`     Muestreo del prior + rechazo por observe.
//   - `importanceSample`    Muestreo del prior + log-weights.
//   - `metropolisHastings`  Single-site MCMC (proposal = prior).
//
// Más distribuciones (`sampleFrom`, `logPdf`, `enumerateSupport`) y
// programas de ejemplo (`coinExample`, `bayesianLinearRegression`,
// `gaussianMeanModel`).
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniform = exports.poisson = exports.normal = exports.discrete = exports.categorical = exports.bernoulli = exports.twoCoinsExample = exports.gaussianMeanModel = exports.coinExample = exports.biasedCoinExample = exports.bayesianLinearRegression = exports.sampleFrom = exports.logPdf = exports.enumerateSupport = exports.rejectionSample = exports.metropolisHastings = exports.importanceSample = exports.enumerate = void 0;
var inference_1 = require("./inference");
Object.defineProperty(exports, "enumerate", { enumerable: true, get: function () { return inference_1.enumerate; } });
Object.defineProperty(exports, "importanceSample", { enumerable: true, get: function () { return inference_1.importanceSample; } });
Object.defineProperty(exports, "metropolisHastings", { enumerable: true, get: function () { return inference_1.metropolisHastings; } });
Object.defineProperty(exports, "rejectionSample", { enumerable: true, get: function () { return inference_1.rejectionSample; } });
var distributions_1 = require("./distributions");
Object.defineProperty(exports, "enumerateSupport", { enumerable: true, get: function () { return distributions_1.enumerateSupport; } });
Object.defineProperty(exports, "logPdf", { enumerable: true, get: function () { return distributions_1.logPdf; } });
Object.defineProperty(exports, "sampleFrom", { enumerable: true, get: function () { return distributions_1.sampleFrom; } });
var examples_1 = require("./examples");
Object.defineProperty(exports, "bayesianLinearRegression", { enumerable: true, get: function () { return examples_1.bayesianLinearRegression; } });
Object.defineProperty(exports, "biasedCoinExample", { enumerable: true, get: function () { return examples_1.biasedCoinExample; } });
Object.defineProperty(exports, "coinExample", { enumerable: true, get: function () { return examples_1.coinExample; } });
Object.defineProperty(exports, "gaussianMeanModel", { enumerable: true, get: function () { return examples_1.gaussianMeanModel; } });
Object.defineProperty(exports, "twoCoinsExample", { enumerable: true, get: function () { return examples_1.twoCoinsExample; } });
var types_1 = require("./types");
Object.defineProperty(exports, "bernoulli", { enumerable: true, get: function () { return types_1.bernoulli; } });
Object.defineProperty(exports, "categorical", { enumerable: true, get: function () { return types_1.categorical; } });
Object.defineProperty(exports, "discrete", { enumerable: true, get: function () { return types_1.discrete; } });
Object.defineProperty(exports, "normal", { enumerable: true, get: function () { return types_1.normal; } });
Object.defineProperty(exports, "poisson", { enumerable: true, get: function () { return types_1.poisson; } });
Object.defineProperty(exports, "uniform", { enumerable: true, get: function () { return types_1.uniform; } });
//# sourceMappingURL=index.js.map