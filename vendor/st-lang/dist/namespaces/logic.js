"use strict";
/**
 * Namespace: Logic
 *
 * Agrupa los perfiles lógicos disponibles en ST. Cada sub-namespace expone
 * los símbolos del módulo correspondiente sin colisiones de nombres entre
 * lógicas (CTL.Formula vs LTL.Formula, etc).
 *
 * Importa así:
 *   import { Logic } from '@stevenvo780/st-lang';
 *   Logic.modal.s5.isValid(formula);
 *   Logic.ctl.modelCheckCTL(kripke, formula);
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
exports.PARALLEL_THRESHOLD = exports.workersAvailable = exports.dpllAsync = exports.dpll = exports.cdclAsync = exports.cdcl = exports.arithmetic = exports.substructural = exports.manyValued = exports.defaultLogic = exports.intuitNJ = exports.sequentLK = exports.sequentG3 = exports.modalAxioms = exports.descriptionLogic = exports.hybrid = exports.muCalculus = exports.ltl = exports.ctl = exports.ProbabilisticBasic = exports.AristotelianSyllogistic = exports.DeonticStandard = exports.EpistemicS5 = exports.TemporalLTL = exports.IntuitionisticPropositional = exports.ParaconsistentBelnap = exports.ModalK = exports.ClassicalFirstOrder = exports.formulaToString = exports.ClassicalPropositional = exports.registry = exports.ProfileRegistry = void 0;
// Perfil registry + interfaces compartidas
var interface_1 = require("../logic/profiles/interface");
Object.defineProperty(exports, "ProfileRegistry", { enumerable: true, get: function () { return interface_1.ProfileRegistry; } });
Object.defineProperty(exports, "registry", { enumerable: true, get: function () { return interface_1.registry; } });
// Perfiles "clase suelta" (un solo símbolo)
var propositional_1 = require("../logic/profiles/classical/propositional");
Object.defineProperty(exports, "ClassicalPropositional", { enumerable: true, get: function () { return propositional_1.ClassicalPropositional; } });
Object.defineProperty(exports, "formulaToString", { enumerable: true, get: function () { return propositional_1.formulaToString; } });
var first_order_1 = require("../logic/profiles/classical/first-order");
Object.defineProperty(exports, "ClassicalFirstOrder", { enumerable: true, get: function () { return first_order_1.ClassicalFirstOrder; } });
var k_1 = require("../logic/profiles/modal/k");
Object.defineProperty(exports, "ModalK", { enumerable: true, get: function () { return k_1.ModalK; } });
var belnap_1 = require("../logic/profiles/paraconsistent/belnap");
Object.defineProperty(exports, "ParaconsistentBelnap", { enumerable: true, get: function () { return belnap_1.ParaconsistentBelnap; } });
var propositional_2 = require("../logic/profiles/intuitionistic/propositional");
Object.defineProperty(exports, "IntuitionisticPropositional", { enumerable: true, get: function () { return propositional_2.IntuitionisticPropositional; } });
var ltl_1 = require("../logic/profiles/temporal/ltl");
Object.defineProperty(exports, "TemporalLTL", { enumerable: true, get: function () { return ltl_1.TemporalLTL; } });
var s5_1 = require("../logic/profiles/epistemic/s5");
Object.defineProperty(exports, "EpistemicS5", { enumerable: true, get: function () { return s5_1.EpistemicS5; } });
var standard_1 = require("../logic/profiles/deontic/standard");
Object.defineProperty(exports, "DeonticStandard", { enumerable: true, get: function () { return standard_1.DeonticStandard; } });
var syllogistic_1 = require("../logic/profiles/aristotelian/syllogistic");
Object.defineProperty(exports, "AristotelianSyllogistic", { enumerable: true, get: function () { return syllogistic_1.AristotelianSyllogistic; } });
var basic_1 = require("../logic/profiles/probabilistic/basic");
Object.defineProperty(exports, "ProbabilisticBasic", { enumerable: true, get: function () { return basic_1.ProbabilisticBasic; } });
// Sub-namespaces (cada perfil con barrel propio)
const ctl = __importStar(require("../logic/profiles/ctl"));
exports.ctl = ctl;
const ltl = __importStar(require("../logic/profiles/ltl-sat"));
exports.ltl = ltl;
const muCalculus = __importStar(require("../logic/profiles/mu-calculus"));
exports.muCalculus = muCalculus;
const hybrid = __importStar(require("../logic/profiles/hybrid-logic"));
exports.hybrid = hybrid;
const descriptionLogic = __importStar(require("../logic/profiles/description-logic"));
exports.descriptionLogic = descriptionLogic;
const modalAxioms = __importStar(require("../logic/profiles/modal-frame-axioms"));
exports.modalAxioms = modalAxioms;
const sequentG3 = __importStar(require("../logic/profiles/sequent-g3"));
exports.sequentG3 = sequentG3;
const sequentLK = __importStar(require("../logic/profiles/sequent-lk"));
exports.sequentLK = sequentLK;
const intuitNJ = __importStar(require("../logic/profiles/intuitionistic-nj"));
exports.intuitNJ = intuitNJ;
const defaultLogic = __importStar(require("../logic/profiles/default-logic"));
exports.defaultLogic = defaultLogic;
const manyValued = __importStar(require("../logic/profiles/many-valued"));
exports.manyValued = manyValued;
const substructural = __importStar(require("../logic/profiles/substructural"));
exports.substructural = substructural;
const arithmetic = __importStar(require("../logic/profiles/arithmetic"));
exports.arithmetic = arithmetic;
// SAT solving (algoritmos clásicos para evaluación de fórmulas)
var cdcl_1 = require("../logic/profiles/classical/cdcl");
Object.defineProperty(exports, "cdcl", { enumerable: true, get: function () { return cdcl_1.cdcl; } });
Object.defineProperty(exports, "cdclAsync", { enumerable: true, get: function () { return cdcl_1.cdclAsync; } });
var dpll_1 = require("../logic/profiles/classical/dpll");
Object.defineProperty(exports, "dpll", { enumerable: true, get: function () { return dpll_1.dpll; } });
Object.defineProperty(exports, "dpllAsync", { enumerable: true, get: function () { return dpll_1.dpllAsync; } });
var parallel_sat_1 = require("../logic/profiles/classical/parallel-sat");
Object.defineProperty(exports, "workersAvailable", { enumerable: true, get: function () { return parallel_sat_1.workersAvailable; } });
Object.defineProperty(exports, "PARALLEL_THRESHOLD", { enumerable: true, get: function () { return parallel_sat_1.PARALLEL_THRESHOLD; } });
//# sourceMappingURL=logic.js.map