"use strict";
// ============================================================
// Mechanism design — barrel público
// ============================================================
//
// Implementación de los mecanismos canónicos de la teoría:
//
//   - VCG (Vickrey-Clarke-Groves): allocation que maximiza welfare,
//     pagos por externalidad. DSIC.
//   - First-price sealed-bid: ganador paga su bid.
//   - Second-price sealed-bid (Vickrey): ganador paga el segundo
//     precio. DSIC. Coincide con VCG para 1 item.
//   - English ascending: reloj sube, sale el último parado.
//   - Dutch descending: reloj baja, gana el primero en aceptar.
//   - Myerson optimal auction: maximiza expected revenue via virtual
//     valuations + reserve price.
//
// Helpers:
//   - socialWelfare, isStrategyProof (empírico)
//   - virtualValuation, expectedRevenue (Monte Carlo)
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniformDistribution = exports.sampleFromDistribution = exports.expectedRevenue = exports.findReserve = exports.virtualValuation = exports.myersonOptimal = exports.dutchAuction = exports.englishAuction = exports.secondPriceSealed = exports.firstPriceSealed = exports.isStrategyProof = exports.socialWelfare = exports.vcgMechanism = void 0;
var vcg_1 = require("./vcg");
Object.defineProperty(exports, "vcgMechanism", { enumerable: true, get: function () { return vcg_1.vcgMechanism; } });
Object.defineProperty(exports, "socialWelfare", { enumerable: true, get: function () { return vcg_1.socialWelfare; } });
Object.defineProperty(exports, "isStrategyProof", { enumerable: true, get: function () { return vcg_1.isStrategyProof; } });
var auctions_1 = require("./auctions");
Object.defineProperty(exports, "firstPriceSealed", { enumerable: true, get: function () { return auctions_1.firstPriceSealed; } });
Object.defineProperty(exports, "secondPriceSealed", { enumerable: true, get: function () { return auctions_1.secondPriceSealed; } });
Object.defineProperty(exports, "englishAuction", { enumerable: true, get: function () { return auctions_1.englishAuction; } });
Object.defineProperty(exports, "dutchAuction", { enumerable: true, get: function () { return auctions_1.dutchAuction; } });
var myerson_1 = require("./myerson");
Object.defineProperty(exports, "myersonOptimal", { enumerable: true, get: function () { return myerson_1.myersonOptimal; } });
Object.defineProperty(exports, "virtualValuation", { enumerable: true, get: function () { return myerson_1.virtualValuation; } });
Object.defineProperty(exports, "findReserve", { enumerable: true, get: function () { return myerson_1.findReserve; } });
Object.defineProperty(exports, "expectedRevenue", { enumerable: true, get: function () { return myerson_1.expectedRevenue; } });
Object.defineProperty(exports, "sampleFromDistribution", { enumerable: true, get: function () { return myerson_1.sampleFromDistribution; } });
Object.defineProperty(exports, "uniformDistribution", { enumerable: true, get: function () { return myerson_1.uniformDistribution; } });
//# sourceMappingURL=index.js.map