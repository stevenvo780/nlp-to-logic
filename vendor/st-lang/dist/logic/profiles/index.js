"use strict";
// ============================================================
// ST Profiles — Barrel de registro automático
// ============================================================
// Este archivo importa y registra todos los perfiles built-in.
// Para añadir un nuevo perfil, simplemente impórtalo aquí y
// llama a registry.register(new MiPerfil()).
//
// Los perfiles externos pueden usar registerProfile() de la API
// pública sin modificar este archivo.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileRegistry = exports.registry = exports.ArithmeticProfile = exports.ProbabilisticBasic = exports.TemporalLTL = exports.IntuitionisticPropositional = exports.AristotelianSyllogistic = exports.EpistemicS5 = exports.DeonticStandard = exports.ParaconsistentBelnap = exports.ModalK = exports.ClassicalFirstOrder = exports.ClassicalPropositional = void 0;
const interface_1 = require("./interface");
// ── Built-in profiles ─────────────────────────────────────────
const propositional_1 = require("./classical/propositional");
Object.defineProperty(exports, "ClassicalPropositional", { enumerable: true, get: function () { return propositional_1.ClassicalPropositional; } });
const first_order_1 = require("./classical/first-order");
Object.defineProperty(exports, "ClassicalFirstOrder", { enumerable: true, get: function () { return first_order_1.ClassicalFirstOrder; } });
const k_1 = require("./modal/k");
Object.defineProperty(exports, "ModalK", { enumerable: true, get: function () { return k_1.ModalK; } });
const belnap_1 = require("./paraconsistent/belnap");
Object.defineProperty(exports, "ParaconsistentBelnap", { enumerable: true, get: function () { return belnap_1.ParaconsistentBelnap; } });
const standard_1 = require("./deontic/standard");
Object.defineProperty(exports, "DeonticStandard", { enumerable: true, get: function () { return standard_1.DeonticStandard; } });
const s5_1 = require("./epistemic/s5");
Object.defineProperty(exports, "EpistemicS5", { enumerable: true, get: function () { return s5_1.EpistemicS5; } });
const syllogistic_1 = require("./aristotelian/syllogistic");
Object.defineProperty(exports, "AristotelianSyllogistic", { enumerable: true, get: function () { return syllogistic_1.AristotelianSyllogistic; } });
const propositional_2 = require("./intuitionistic/propositional");
Object.defineProperty(exports, "IntuitionisticPropositional", { enumerable: true, get: function () { return propositional_2.IntuitionisticPropositional; } });
const ltl_1 = require("./temporal/ltl");
Object.defineProperty(exports, "TemporalLTL", { enumerable: true, get: function () { return ltl_1.TemporalLTL; } });
const basic_1 = require("./probabilistic/basic");
Object.defineProperty(exports, "ProbabilisticBasic", { enumerable: true, get: function () { return basic_1.ProbabilisticBasic; } });
const arithmetic_1 = require("./arithmetic");
Object.defineProperty(exports, "ArithmeticProfile", { enumerable: true, get: function () { return arithmetic_1.ArithmeticProfile; } });
// Registro idempotente
const builtins = [
    propositional_1.ClassicalPropositional,
    first_order_1.ClassicalFirstOrder,
    k_1.ModalK,
    belnap_1.ParaconsistentBelnap,
    standard_1.DeonticStandard,
    s5_1.EpistemicS5,
    syllogistic_1.AristotelianSyllogistic,
    propositional_2.IntuitionisticPropositional,
    ltl_1.TemporalLTL,
    basic_1.ProbabilisticBasic,
    arithmetic_1.ArithmeticProfile,
];
for (const Profile of builtins) {
    const instance = new Profile();
    if (!interface_1.registry.has(instance.name)) {
        interface_1.registry.register(instance);
    }
}
var interface_2 = require("./interface");
Object.defineProperty(exports, "registry", { enumerable: true, get: function () { return interface_2.registry; } });
Object.defineProperty(exports, "ProfileRegistry", { enumerable: true, get: function () { return interface_2.ProfileRegistry; } });
//# sourceMappingURL=index.js.map