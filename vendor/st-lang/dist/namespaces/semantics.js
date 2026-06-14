"use strict";
/**
 * Namespace: Semantics
 *
 * Capas semánticas y puentes de interpretación: text-layer (claims/passages
 * con grafo de dependencias), MDX bridge, game semantics dialógico (IPC
 * Lorenzen-Felscher), profile-bridge (traducciones entre lógicas), y
 * coinducción (streams, bisimulación).
 *
 * Importa así:
 *   import { Semantics } from '@stevenvo780/st-lang';
 *   const state = Semantics.textLayer.createTextLayerState();
 *   const win = Semantics.gameSemantics.winningStrategy(formula);
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
exports.textLayer = exports.coinduction = exports.profileBridge = exports.gameSemantics = exports.textLayerV2 = exports.textLayerCompiler = void 0;
// Text layer v1 — compilador legacy
const textLayerCompiler = __importStar(require("../semantics/text-layer/compiler"));
exports.textLayerCompiler = textLayerCompiler;
// Text layer v2 — grafo de claims con dependencias
const textLayerV2 = __importStar(require("../semantics/text-layer/v2"));
exports.textLayerV2 = textLayerV2;
const gameSemantics = __importStar(require("../semantics/game-semantics"));
exports.gameSemantics = gameSemantics;
const profileBridge = __importStar(require("../logic/profile-bridge"));
exports.profileBridge = profileBridge;
const coinduction = __importStar(require("../semantics/coinduction"));
exports.coinduction = coinduction;
// Aliases convenientes — text-layer flat para coincidir con flat exports.
exports.textLayer = textLayerCompiler;
//# sourceMappingURL=semantics.js.map