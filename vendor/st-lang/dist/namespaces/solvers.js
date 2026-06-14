"use strict";
/**
 * Namespace: Solvers
 *
 * Solvers de decisión combinatoria: SAT (CDCL v1/v2 + incremental),
 * SMT bridge, CSP (AC-3 + backtracking + builtins), MUS (minimal
 * unsat subsets), pool de evaluación paralela.
 *
 * Importa así:
 *   import { Solvers } from '@stevenvo780/st-lang';
 *   const r = Solvers.cdclV2.solveCDCLv2(cnf);
 *   const mus = Solvers.mus.extractMUS(clauses);
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
exports.IncrementalCDCL = exports.solveCDCLv2 = exports.parallel = exports.smt = exports.mus = exports.csp = exports.cdclV2Incremental = exports.cdclV2 = void 0;
const cdclV2 = __importStar(require("../solver/cdcl-v2"));
exports.cdclV2 = cdclV2;
const cdclV2Incremental = __importStar(require("../solver/cdcl-v2-incremental"));
exports.cdclV2Incremental = cdclV2Incremental;
const csp = __importStar(require("../solver/csp"));
exports.csp = csp;
const mus = __importStar(require("../solver/mus"));
exports.mus = mus;
const smt = __importStar(require("../solver/smt"));
exports.smt = smt;
const parallel = __importStar(require("../runtime/parallel"));
exports.parallel = parallel;
// Conveniencia: símbolos populares re-expuestos en raíz del namespace.
var cdcl_v2_1 = require("../solver/cdcl-v2");
Object.defineProperty(exports, "solveCDCLv2", { enumerable: true, get: function () { return cdcl_v2_1.solveCDCLv2; } });
var cdcl_v2_incremental_1 = require("../solver/cdcl-v2-incremental");
Object.defineProperty(exports, "IncrementalCDCL", { enumerable: true, get: function () { return cdcl_v2_incremental_1.IncrementalCDCL; } });
//# sourceMappingURL=solvers.js.map