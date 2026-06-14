"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureSnapshot = captureSnapshot;
const crypto_1 = require("crypto");
function captureSnapshot(state, opts) {
    return {
        id: (0, crypto_1.randomUUID)(),
        version: '1.0',
        createdAt: new Date().toISOString(),
        parentId: opts?.parentId,
        state: {
            declarations: state.declarations.map((d) => ({ ...d })),
            activeProfile: state.activeProfile,
            evaluatedFormulas: state.evaluatedFormulas.map((e) => ({ ...e })),
            countermodels: state.countermodels?.map((c) => ({
                formula: c.formula,
                assignments: { ...c.assignments },
            })),
        },
        tags: opts?.tags,
        message: opts?.message,
    };
}
//# sourceMappingURL=snapshot.js.map