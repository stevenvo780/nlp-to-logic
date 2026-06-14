"use strict";
// Phase saving — Pipatsrisawat & Darwiche (2007).
// Guarda la última polaridad asignada a cada variable. Al decidir, el solver
// la reutiliza, lo que explota localidad: el espacio "cerca" de soluciones
// parciales válidas suele tener phases similares.
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhaseSaver = void 0;
class PhaseSaver {
    /** 1 = positivo, 0 = negativo. -1 codificado como 0 en la práctica. */
    phase;
    numVars;
    initialPhase;
    constructor(numVars, initialPhase = 0) {
        if (numVars < 0 || !Number.isInteger(numVars)) {
            throw new RangeError(`PhaseSaver: numVars inválido ${numVars}`);
        }
        this.numVars = numVars;
        this.initialPhase = initialPhase;
        this.phase = new Int8Array(numVars + 1);
        if (initialPhase === 1) {
            for (let i = 1; i <= numVars; i++)
                this.phase[i] = 1;
        }
    }
    /** Guarda la polaridad efectivamente asignada al literal `lit`. */
    save(lit) {
        const v = Math.abs(lit);
        if (v <= 0 || v > this.numVars)
            return;
        this.phase[v] = lit > 0 ? 1 : 0;
    }
    /** Polaridad guardada (0 o 1) para la variable. */
    getPhase(v) {
        if (v <= 0 || v > this.numVars)
            return this.initialPhase;
        return this.phase[v] === 1 ? 1 : 0;
    }
    /** Literal a probar en branching: var positiva si phase=1, negativa si phase=0. */
    pickLit(v) {
        return this.getPhase(v) === 1 ? v : -v;
    }
}
exports.PhaseSaver = PhaseSaver;
//# sourceMappingURL=phase-saving.js.map