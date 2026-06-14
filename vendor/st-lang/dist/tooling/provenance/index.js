"use strict";
// ============================================================
// ST Provenance — Public API
//
// DAG auditado de teoremas/lemas/axiomas: cada nodo declara sus
// dependencias y metadata (autor, herramienta, timestamp, perfil).
// El ledger ofrece queries del cierre transitivo, detección de
// ciclos, estadísticas y serialización determinística.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.provenanceToCertificate = exports.auditTheorem = exports.ProvenanceLedger = void 0;
var ledger_1 = require("./ledger");
Object.defineProperty(exports, "ProvenanceLedger", { enumerable: true, get: function () { return ledger_1.ProvenanceLedger; } });
Object.defineProperty(exports, "auditTheorem", { enumerable: true, get: function () { return ledger_1.auditTheorem; } });
Object.defineProperty(exports, "provenanceToCertificate", { enumerable: true, get: function () { return ledger_1.provenanceToCertificate; } });
//# sourceMappingURL=index.js.map