"use strict";
// CDCL incremental — solver vivo que mantiene aprendizaje entre llamadas.
//
// A diferencia de solveCDCLv2 (one-shot, todas las estructuras se crean en cada
// invocación), aquí el solver es un objeto persistente que soporta:
//
//   - addClause(literals) — añade cláusula permanente, integra en watches.
//   - newVar() — declara una variable nueva creciendo todas las estructuras.
//   - push() / pop() — checkpoint y rollback (descarta cláusulas + aprendidas
//     añadidas tras el push; conserva phase saving y VSIDS como caching útil).
//   - solve(assumptions?) — resuelve bajo el conjunto de assumptions
//     (literales asumidos true sólo para esta query). Devuelve modelo o
//     failedAssumptions/unsatCore.
//
// Bases internas reutilizadas conceptualmente del solver one-shot:
//   - 2-watched literals para BCP.
//   - 1UIP conflict analysis (analyzeConflict1UIP de cdcl-v2).
//   - VSIDS, phase saving, Luby restarts.
//   - LBD scoring + reducción periódica de aprendidas.
//
// La maquinaria incremental clave es el manejo de assumptions: tras backtrack
// al nivel 0, cada assumption se introduce como decisión en su propio nivel.
// Si BCP detecta conflicto al asumir, derivamos el unsatCore vía análisis del
// conflicto + intersección con el conjunto de assumptions enqueued.
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncrementalCDCL = void 0;
const cdcl_v2_1 = require("../cdcl-v2");
const DEFAULTS = {
    timeoutMs: 30_000,
    vsidsDecay: 0.95,
    lubyBase: 100,
    clauseDecay: 0.999,
    lbdReduceThreshold: 2,
    initialPhase: 0,
};
class IncrementalCDCL {
    numVars;
    opts;
    // Pool de cláusulas. Las originales y las aprendidas conviven en `clauses`;
    // `learnedFlag[ci] = 1` marca a las aprendidas para distinguir orígenes en
    // pop/reset. learnedMeta indexa por ci.
    clauses = [];
    learnedFlag = [];
    learnedMeta = new Map();
    clauseInc = 1.0;
    // Estado de variables (1-indexado, dimensionado a numVars+1).
    varVal;
    varLevel;
    varAnte;
    // Trail.
    trail = [];
    trailLim = [];
    qHead = 0;
    // Watch lists indexadas por litToIdx. Se reconstruyen tras grow / pop.
    watches = [];
    // Heurísticas. Se recrean tras newVar() (grow) y reset(); persisten entre solves.
    vsids;
    phases;
    // Stack de checkpoints push/pop.
    checkpoints = [];
    // Para asociar variable → último assumption que la fijó. Usado para derivar
    // failedAssumptions en O(|trail| + |conflictClause|).
    // varToAssumption[v] = lit (signed) si v fue assumption; 0 si no.
    varToAssumption;
    // Acumuladores de stats globales.
    totalDecisions = 0;
    totalConflicts = 0;
    totalLearned = 0;
    constructor(numVars = 0, options) {
        if (numVars < 0 || !Number.isInteger(numVars)) {
            throw new RangeError(`IncrementalCDCL: numVars inválido ${numVars}`);
        }
        this.numVars = numVars;
        this.opts = {
            timeoutMs: options?.timeoutMs ?? DEFAULTS.timeoutMs,
            vsidsDecay: options?.vsidsDecay ?? DEFAULTS.vsidsDecay,
            lubyBase: options?.lubyBase ?? DEFAULTS.lubyBase,
            initialPhase: options?.initialPhase ?? DEFAULTS.initialPhase,
            clauseDecay: DEFAULTS.clauseDecay,
            lbdReduceThreshold: DEFAULTS.lbdReduceThreshold,
        };
        this.varVal = new Int8Array(numVars + 1);
        this.varLevel = new Int32Array(numVars + 1).fill(-1);
        this.varAnte = new Int32Array(numVars + 1).fill(cdcl_v2_1.NO_ANTECEDENT);
        this.varToAssumption = new Int32Array(numVars + 1);
        this.vsids = new cdcl_v2_1.VSIDS(numVars, this.opts.vsidsDecay);
        this.phases = new cdcl_v2_1.PhaseSaver(numVars, this.opts.initialPhase);
        this.rebuildWatches();
    }
    // -------------------------------------------------------------------------
    // API pública.
    // -------------------------------------------------------------------------
    /** Declara y devuelve una variable nueva (1-indexada). */
    newVar() {
        this.numVars++;
        this.growVarArrays();
        // VSIDS y PhaseSaver no soportan grow in-place; los reconstruimos
        // preservando su activity/phase actual.
        this.regrowHeuristics();
        return this.numVars;
    }
    /** Agrega una cláusula permanente. Validación: literales !== 0 y |lit| <= numVars. */
    addClause(literals) {
        for (const l of literals) {
            if (l === 0)
                throw new RangeError('IncrementalCDCL.addClause: literal 0 inválido');
            const v = Math.abs(l);
            if (v > this.numVars) {
                throw new RangeError(`IncrementalCDCL.addClause: variable ${v} fuera de rango (numVars=${this.numVars})`);
            }
        }
        const clause = new Int32Array(literals);
        const ci = this.clauses.length;
        this.clauses.push(clause);
        this.learnedFlag.push(0);
        if (clause.length >= 2) {
            const w0 = this.watches[(0, cdcl_v2_1.litToIdx)(clause[0], this.numVars)];
            const w1 = this.watches[(0, cdcl_v2_1.litToIdx)(clause[1], this.numVars)];
            if (w0)
                w0.push(ci);
            if (w1)
                w1.push(ci);
        }
        this.vsids.initFromClauses([clause]);
    }
    /** Crea un checkpoint para rollback con `pop()`. */
    push() {
        this.checkpoints.push({
            numClauses: this.clauses.length,
            numLearned: this.countLearned(),
            numVars: this.numVars,
        });
    }
    /** Revierte hasta `levels` checkpoints atrás. Default: 1. */
    pop(levels = 1) {
        if (levels <= 0)
            return;
        for (let k = 0; k < levels && this.checkpoints.length > 0; k++) {
            const frame = this.checkpoints.pop();
            if (!frame)
                break;
            this.rollbackTo(frame);
        }
    }
    /**
     * Resuelve bajo el conjunto opcional de assumptions.
     *
     * Cada assumption es un literal con signo: positivo = var asumida true,
     * negativo = var asumida false. Si el problema es UNSAT bajo esas
     * assumptions, `failedAssumptions` contiene el subconjunto que produjo
     * el conflicto.
     */
    solve(assumptions = []) {
        // Validar assumptions.
        for (const a of assumptions) {
            if (a === 0)
                throw new RangeError('IncrementalCDCL.solve: assumption 0 inválida');
            if (Math.abs(a) > this.numVars) {
                throw new RangeError(`IncrementalCDCL.solve: assumption refiere variable ${Math.abs(a)} > numVars=${this.numVars}`);
            }
        }
        return this.runSolve(assumptions);
    }
    /** Devuelve la polaridad de una variable en el último modelo SAT (o undefined). */
    modelValue(varId) {
        if (varId <= 0 || varId > this.numVars)
            return undefined;
        const v = this.varVal[varId];
        if (v === 1)
            return true;
        if (v === -1)
            return false;
        return undefined;
    }
    /** Limpia todo el estado, dejando 0 vars / 0 cláusulas. */
    reset() {
        this.clauses = [];
        this.learnedFlag = [];
        this.learnedMeta.clear();
        this.clauseInc = 1.0;
        this.numVars = 0;
        this.varVal = new Int8Array(1);
        this.varLevel = new Int32Array(1).fill(-1);
        this.varAnte = new Int32Array(1).fill(cdcl_v2_1.NO_ANTECEDENT);
        this.varToAssumption = new Int32Array(1);
        this.trail = [];
        this.trailLim = [];
        this.qHead = 0;
        this.checkpoints = [];
        this.totalDecisions = 0;
        this.totalConflicts = 0;
        this.totalLearned = 0;
        this.vsids = new cdcl_v2_1.VSIDS(0, this.opts.vsidsDecay);
        this.phases = new cdcl_v2_1.PhaseSaver(0, this.opts.initialPhase);
        this.rebuildWatches();
    }
    /** Resumen del estado actual del solver. */
    stats() {
        return {
            decisions: this.totalDecisions,
            conflicts: this.totalConflicts,
            learned: this.countLearned(),
            vars: this.numVars,
            clauses: this.clauses.length,
        };
    }
    // -------------------------------------------------------------------------
    // Internals — control de estructura.
    // -------------------------------------------------------------------------
    growVarArrays() {
        const n = this.numVars;
        // Crecimiento simple: copiamos a un Typed Array más grande.
        const newVal = new Int8Array(n + 1);
        newVal.set(this.varVal);
        this.varVal = newVal;
        const newLevel = new Int32Array(n + 1).fill(-1);
        newLevel.set(this.varLevel);
        this.varLevel = newLevel;
        const newAnte = new Int32Array(n + 1).fill(cdcl_v2_1.NO_ANTECEDENT);
        newAnte.set(this.varAnte);
        this.varAnte = newAnte;
        const newAssump = new Int32Array(n + 1);
        newAssump.set(this.varToAssumption);
        this.varToAssumption = newAssump;
        // Crecer la watch list (literal positivo y negativo de la nueva var).
        this.rebuildWatches();
    }
    regrowHeuristics() {
        const newVsids = new cdcl_v2_1.VSIDS(this.numVars, this.opts.vsidsDecay);
        // Preservar activities anteriores.
        const oldAct = this.vsids.activity;
        for (let v = 1; v < oldAct.length && v <= this.numVars; v++) {
            newVsids.activity[v] = oldAct[v];
        }
        this.vsids = newVsids;
        const newPhases = new cdcl_v2_1.PhaseSaver(this.numVars, this.opts.initialPhase);
        for (let v = 1; v <= this.numVars; v++) {
            // Si había phase previa, preservarla.
            if (v < oldAct.length) {
                const prevPhase = this.phases.getPhase(v);
                newPhases.save(prevPhase === 1 ? v : -v);
            }
        }
        this.phases = newPhases;
    }
    rebuildWatches() {
        const size = 2 * this.numVars;
        this.watches = new Array(size);
        for (let i = 0; i < size; i++)
            this.watches[i] = [];
        for (let ci = 0; ci < this.clauses.length; ci++) {
            const c = this.clauses[ci];
            if (c.length >= 2) {
                const w0 = this.watches[(0, cdcl_v2_1.litToIdx)(c[0], this.numVars)];
                const w1 = this.watches[(0, cdcl_v2_1.litToIdx)(c[1], this.numVars)];
                if (w0)
                    w0.push(ci);
                if (w1)
                    w1.push(ci);
            }
        }
    }
    countLearned() {
        let n = 0;
        for (const f of this.learnedFlag)
            if (f === 1)
                n++;
        return n;
    }
    rollbackTo(frame) {
        // Limpiar todo el trail antes de tocar cláusulas (los antecedentes
        // pueden apuntar a cláusulas que vamos a borrar; las asignaciones de
        // nivel 0 también deben desfilarse para no contaminar el próximo solve).
        this.resetAllAssignments();
        // Truncar cláusulas: descarta TODO lo añadido tras el push (originales +
        // learned). Estrategia v1: descartar learned posteriores. v2 podría
        // intentar conservar las que no dependen de los assumptions removidos.
        const target = Math.min(frame.numClauses, this.clauses.length);
        this.clauses.length = target;
        this.learnedFlag.length = target;
        // Limpiar learnedMeta y antecedentes que apuntan a cláusulas eliminadas.
        for (const ci of Array.from(this.learnedMeta.keys())) {
            if (ci >= target)
                this.learnedMeta.delete(ci);
        }
        for (let v = 1; v <= this.numVars; v++) {
            if (this.varAnte[v] !== cdcl_v2_1.NO_ANTECEDENT && this.varAnte[v] >= target) {
                this.varAnte[v] = cdcl_v2_1.NO_ANTECEDENT;
            }
        }
        // Si nuevas vars fueron declaradas tras el push, las "retiramos".
        if (this.numVars > frame.numVars) {
            this.numVars = frame.numVars;
            const np1 = this.numVars + 1;
            // Truncar typed arrays (recortar copiando).
            this.varVal = this.varVal.slice(0, np1);
            this.varLevel = this.varLevel.slice(0, np1);
            this.varAnte = this.varAnte.slice(0, np1);
            this.varToAssumption = this.varToAssumption.slice(0, np1);
            this.regrowHeuristics();
        }
        // Reconstruir watches sobre el conjunto resultante.
        this.rebuildWatches();
    }
    // -------------------------------------------------------------------------
    // Internals — núcleo CDCL.
    // -------------------------------------------------------------------------
    currentLevel() {
        return this.trailLim.length;
    }
    litIsTrue(lit) {
        return lit > 0 ? this.varVal[lit] === 1 : this.varVal[-lit] === -1;
    }
    litIsFalse(lit) {
        return lit > 0 ? this.varVal[lit] === -1 : this.varVal[-lit] === 1;
    }
    enqueue(lit, lev, reason, stats) {
        const v = Math.abs(lit);
        if (this.varVal[v] !== 0)
            return this.litIsTrue(lit);
        this.varVal[v] = lit > 0 ? 1 : -1;
        this.varLevel[v] = lev;
        this.varAnte[v] = reason;
        this.trail.push(lit);
        this.phases.save(lit);
        if (stats)
            stats.propagations++;
        return true;
    }
    /** Propagación booleana con watched literals. Devuelve índice de cláusula en conflicto o NO_CONFLICT. */
    propagate(stats) {
        while (this.qHead < this.trail.length) {
            const p = this.trail[this.qHead++];
            const falseLit = -p;
            const wIdx = (0, cdcl_v2_1.litToIdx)(falseLit, this.numVars);
            const wl = this.watches[wIdx];
            if (!wl)
                continue;
            let j = 0;
            for (let i = 0; i < wl.length; i++) {
                const ci = wl[i];
                const c = this.clauses[ci];
                if (!c || c.length < 2) {
                    wl[j++] = ci;
                    continue;
                }
                // Mover falseLit a c[1] para que c[0] sea el "otro watch".
                if (c[0] === falseLit) {
                    const tmp = c[0];
                    c[0] = c[1];
                    c[1] = tmp;
                }
                if (this.litIsTrue(c[0])) {
                    wl[j++] = ci;
                    continue;
                }
                // Buscar reemplazo para watch en c[1].
                let found = false;
                for (let k = 2; k < c.length; k++) {
                    if (!this.litIsFalse(c[k])) {
                        const tmp = c[1];
                        c[1] = c[k];
                        c[k] = tmp;
                        const newWatch = this.watches[(0, cdcl_v2_1.litToIdx)(c[1], this.numVars)];
                        if (newWatch)
                            newWatch.push(ci);
                        found = true;
                        break;
                    }
                }
                if (found)
                    continue;
                wl[j++] = ci;
                if (this.litIsFalse(c[0])) {
                    // Conflicto.
                    for (let r = i + 1; r < wl.length; r++)
                        wl[j++] = wl[r];
                    wl.length = j;
                    this.qHead = this.trail.length;
                    return ci;
                }
                if (!this.enqueue(c[0], this.currentLevel(), ci, stats)) {
                    for (let r = i + 1; r < wl.length; r++)
                        wl[j++] = wl[r];
                    wl.length = j;
                    this.qHead = this.trail.length;
                    return ci;
                }
            }
            wl.length = j;
        }
        return cdcl_v2_1.NO_CONFLICT;
    }
    backtrackToLevel(target) {
        if (this.currentLevel() <= target)
            return;
        const btPoint = target < this.trailLim.length ? this.trailLim[target] : this.trail.length;
        for (let i = this.trail.length - 1; i >= btPoint; i--) {
            const v = Math.abs(this.trail[i]);
            this.varVal[v] = 0;
            this.varLevel[v] = -1;
            this.varAnte[v] = cdcl_v2_1.NO_ANTECEDENT;
            this.varToAssumption[v] = 0;
        }
        this.trail.length = btPoint;
        this.trailLim.length = target;
        this.qHead = btPoint;
    }
    /** Reset completo del trail incluyendo asignaciones de nivel 0. Usado entre
     * llamadas a solve() para garantizar idempotencia. */
    resetAllAssignments() {
        for (let i = 0; i < this.trail.length; i++) {
            const v = Math.abs(this.trail[i]);
            this.varVal[v] = 0;
            this.varLevel[v] = -1;
            this.varAnte[v] = cdcl_v2_1.NO_ANTECEDENT;
            this.varToAssumption[v] = 0;
        }
        this.trail.length = 0;
        this.trailLim.length = 0;
        this.qHead = 0;
    }
    addLearnedClauseAt(learned, lbd, stats) {
        const ci = this.clauses.length;
        this.clauses.push(learned);
        this.learnedFlag.push(1);
        stats.learned++;
        this.totalLearned++;
        if (learned.length >= 2) {
            const w0 = this.watches[(0, cdcl_v2_1.litToIdx)(learned[0], this.numVars)];
            const w1 = this.watches[(0, cdcl_v2_1.litToIdx)(learned[1], this.numVars)];
            if (w0)
                w0.push(ci);
            if (w1)
                w1.push(ci);
        }
        this.learnedMeta.set(ci, {
            index: ci,
            lbd,
            activity: this.clauseInc,
            locked: false,
            length: learned.length,
        });
        return ci;
    }
    // -------------------------------------------------------------------------
    // Solve loop con assumptions.
    // -------------------------------------------------------------------------
    runSolve(assumptions) {
        const stats = {
            decisions: 0,
            conflicts: 0,
            learned: 0,
            propagations: 0,
            restarts: 0,
        };
        const startTime = Date.now();
        // UNSAT trivial: cláusula vacía.
        for (const c of this.clauses) {
            if (c.length === 0) {
                return { sat: false, unsatCore: [], failedAssumptions: [], stats };
            }
        }
        // Cada call empieza limpio: vaciamos TODO el trail (incluso asignaciones
        // de nivel 0 forzadas por solves anteriores) y re-propagamos las unitarias
        // originales desde cero. Esto garantiza idempotencia: dos solve() con la
        // misma entrada producen el mismo modelo. Las cláusulas aprendidas
        // siguen vivas y siguen activas como restricciones.
        this.resetAllAssignments();
        // Reset varToAssumption antes de re-enqueue assumptions.
        for (let v = 0; v <= this.numVars; v++)
            this.varToAssumption[v] = 0;
        const restarter = new cdcl_v2_1.LubyRestartPolicy(this.opts.lubyBase);
        // Propagar primero las unitarias originales a nivel 0 (idempotente).
        for (let ci = 0; ci < this.clauses.length; ci++) {
            const c = this.clauses[ci];
            if (c.length === 1) {
                const lit = c[0];
                const v = Math.abs(lit);
                if (this.varVal[v] !== 0) {
                    if (!this.litIsTrue(lit)) {
                        return { sat: false, unsatCore: [], failedAssumptions: [], stats };
                    }
                    continue;
                }
                if (!this.enqueue(lit, 0, ci, stats)) {
                    return { sat: false, unsatCore: [], failedAssumptions: [], stats };
                }
            }
        }
        let conflict = this.propagate(stats);
        if (conflict !== cdcl_v2_1.NO_CONFLICT) {
            return { sat: false, unsatCore: [], failedAssumptions: [], stats };
        }
        // Aplicar assumptions una a una como decisiones en niveles sucesivos.
        // Si alguna ya está implicada falsa por unidades de nivel 0, derivar
        // unsatCore como las assumptions previas + ésta.
        const enqueuedAssumptions = [];
        for (const lit of assumptions) {
            // Si ya está fijada a nivel 0 con polaridad opuesta ⇒ UNSAT bajo este lit.
            if (this.litIsFalse(lit)) {
                const core = this.deriveCoreFromBlockedAssumption(lit, enqueuedAssumptions);
                return {
                    sat: false,
                    unsatCore: core,
                    failedAssumptions: core,
                    stats,
                };
            }
            if (this.litIsTrue(lit))
                continue; // ya implicada, no decidir.
            this.trailLim.push(this.trail.length);
            const lev = this.currentLevel();
            const v = Math.abs(lit);
            this.varToAssumption[v] = lit;
            enqueuedAssumptions.push(lit);
            stats.decisions++;
            this.totalDecisions++;
            this.enqueue(lit, lev, cdcl_v2_1.NO_ANTECEDENT, stats);
            const c2 = this.propagate(stats);
            if (c2 !== cdcl_v2_1.NO_CONFLICT) {
                // Conflicto al asumir. Derivamos failed assumptions cruzando el
                // cone-of-conflict con las assumptions enqueued.
                const failed = this.deriveFailedAssumptions(c2, enqueuedAssumptions);
                return {
                    sat: false,
                    unsatCore: failed,
                    failedAssumptions: failed,
                    stats,
                };
            }
        }
        // CDCL principal — branching VSIDS sobre variables libres.
        let conflictsUntilRestart = restarter.next();
        let conflictsSinceRestart = 0;
        const baseLevel = this.currentLevel(); // = #assumptions enqueued
        const seenBuf = new Uint8Array(this.numVars + 2);
        while (true) {
            if (Date.now() - startTime > this.opts.timeoutMs) {
                return { sat: false, unsatCore: [], failedAssumptions: [], stats };
            }
            const v = this.vsids.pick(this.varVal);
            if (v === 0) {
                // SAT. Construimos el modelo.
                const model = new Map();
                for (let i = 1; i <= this.numVars; i++) {
                    model.set(i, this.varVal[i] === 1 || this.varVal[i] === 0);
                }
                return { sat: true, model, stats };
            }
            this.trailLim.push(this.trail.length);
            stats.decisions++;
            this.totalDecisions++;
            this.enqueue(this.phases.pickLit(v), this.currentLevel(), cdcl_v2_1.NO_ANTECEDENT, stats);
            conflict = this.propagate(stats);
            while (conflict !== cdcl_v2_1.NO_CONFLICT) {
                stats.conflicts++;
                this.totalConflicts++;
                conflictsSinceRestart++;
                if (this.currentLevel() <= baseLevel) {
                    // Conflicto en nivel ≤ baseLevel ⇒ UNSAT bajo assumptions.
                    const failed = this.deriveFailedAssumptions(conflict, enqueuedAssumptions);
                    return {
                        sat: false,
                        unsatCore: failed,
                        failedAssumptions: failed,
                        stats,
                    };
                }
                const result = (0, cdcl_v2_1.analyzeConflict1UIP)(conflict, {
                    clauses: this.clauses,
                    trail: this.trail,
                    currentLevel: this.currentLevel(),
                    varLevel: this.varLevel,
                    varAnte: this.varAnte,
                });
                for (const bv of result.bumped)
                    this.vsids.bump(bv);
                this.vsids.decayStep();
                this.clauseInc /= this.opts.clauseDecay;
                if (result.learned.length === 0 || result.btLevel < 0) {
                    // UNSAT raíz; bajo assumptions ⇒ derivar core con las assumptions vivas.
                    const failed = this.deriveFailedAssumptions(conflict, enqueuedAssumptions);
                    return {
                        sat: false,
                        unsatCore: failed,
                        failedAssumptions: failed,
                        stats,
                    };
                }
                // No retroceder por debajo de baseLevel (las assumptions deben quedar
                // intactas; si fueran las culpables, el conflicto las habría atrapado
                // al asumir o estaríamos en currentLevel <= baseLevel arriba).
                const bt = Math.max(result.btLevel, baseLevel);
                this.backtrackToLevel(bt);
                if (result.learned.length === 1) {
                    // Si la unit clause aprendida apunta a nivel 0 pero hay assumptions
                    // por encima, la propagamos al nivel actual (= baseLevel) como
                    // forced (no se "fija" al 0 mientras haya assumptions vivas, pero
                    // su semántica vale: bajo estas assumptions, ese literal es true).
                    if (!this.enqueue(result.learned[0], bt, cdcl_v2_1.NO_ANTECEDENT, stats)) {
                        const failed = this.deriveFailedAssumptions(conflict, enqueuedAssumptions);
                        return {
                            sat: false,
                            unsatCore: failed,
                            failedAssumptions: failed,
                            stats,
                        };
                    }
                }
                else {
                    const lbd = (0, cdcl_v2_1.computeLBD)(result.learned, this.varLevel, seenBuf);
                    const newCi = this.addLearnedClauseAt(result.learned, lbd, stats);
                    if (!this.enqueue(result.learned[0], bt, newCi, stats)) {
                        const failed = this.deriveFailedAssumptions(conflict, enqueuedAssumptions);
                        return {
                            sat: false,
                            unsatCore: failed,
                            failedAssumptions: failed,
                            stats,
                        };
                    }
                }
                conflict = this.propagate(stats);
            }
            if (conflictsSinceRestart >= conflictsUntilRestart) {
                stats.restarts++;
                // Restart respeta assumptions: vuelve al baseLevel, no a 0.
                this.backtrackToLevel(baseLevel);
                conflictsSinceRestart = 0;
                conflictsUntilRestart = restarter.next();
            }
            this.maybeReduceLearned();
        }
    }
    /**
     * Un assumption `lit` está bloqueado: `var(lit)` ya quedó fijada con
     * polaridad opuesta antes de poder decidirlo. Esa fijación puede venir
     * de unidades originales (nivel 0) o de assumptions previas que la
     * forzaron vía propagación. El unsat core no es `[lit]` solo: hay que
     * incluir el cono de antecedentes que volvió `lit` insatisfacible.
     *
     * Recorremos hacia atrás el grafo de implicación desde `var(lit)`,
     * marcando cada variable involucrada, y recolectamos:
     *   - `lit` mismo (la assumption que se intentaba decidir), y
     *   - toda assumption previa cuya variable cayó en el cono.
     *
     * Si el cono no contiene ninguna assumption previa (la base sola ya
     * implica `¬lit`), el core es `[lit]` — correcto: ese único assumption
     * es incompatible con las cláusulas permanentes.
     */
    deriveCoreFromBlockedAssumption(lit, assumptionList) {
        const seen = new Uint8Array(this.numVars + 1);
        const stack = [];
        const blockedVar = Math.abs(lit);
        seen[blockedVar] = 1;
        stack.push(blockedVar);
        while (stack.length > 0) {
            const v = stack.pop();
            if (v === undefined)
                break;
            const ante = this.varAnte[v];
            if (ante === undefined || ante === cdcl_v2_1.NO_ANTECEDENT)
                continue;
            const c = this.clauses[ante];
            if (!c)
                continue;
            for (let i = 0; i < c.length; i++) {
                const u = Math.abs(c[i]);
                if (u === 0 || seen[u])
                    continue;
                seen[u] = 1;
                stack.push(u);
            }
        }
        const core = [lit];
        for (const a of assumptionList) {
            if (seen[Math.abs(a)])
                core.push(a);
        }
        return core;
    }
    /**
     * Dado un índice de cláusula en conflicto y la lista actual de assumptions
     * enqueued, regresa el subconjunto de assumptions cuya negación está
     * presente (recursivamente, vía antecedentes) en el cone de conflicto.
     *
     * Implementación O(|trail|): marca seen cada variable involucrada en el
     * conflicto, recorre antecedentes hasta agotar; cualquier var marcada cuyo
     * assumption literal sea distinto de 0 entra al core.
     */
    deriveFailedAssumptions(conflictCi, assumptionList) {
        if (assumptionList.length === 0)
            return [];
        const seen = new Uint8Array(this.numVars + 1);
        const stack = [];
        const pushFromClause = (ci) => {
            const c = this.clauses[ci];
            if (!c)
                return;
            for (let i = 0; i < c.length; i++) {
                const v = Math.abs(c[i]);
                if (v === 0 || seen[v])
                    continue;
                seen[v] = 1;
                stack.push(v);
            }
        };
        pushFromClause(conflictCi);
        while (stack.length > 0) {
            const v = stack.pop();
            if (v === undefined)
                break;
            const ante = this.varAnte[v];
            if (ante !== undefined && ante !== cdcl_v2_1.NO_ANTECEDENT) {
                pushFromClause(ante);
            }
        }
        // Recolectar assumptions cuyas vars quedaron marcadas, en el orden
        // en que fueron enqueued (estable, útil para clientes).
        const failed = [];
        for (const a of assumptionList) {
            const v = Math.abs(a);
            if (seen[v])
                failed.push(a);
        }
        // Si por alguna razón el cone no atrapó ninguna assumption (caso
        // degenerado: conflicto puro entre unitarias originales bajo ese contexto),
        // devolvemos todas las assumptions como fallback seguro.
        if (failed.length === 0)
            return assumptionList.slice();
        return failed;
    }
    maybeReduceLearned() {
        const learnedCount = this.learnedMeta.size;
        if (learnedCount < 200)
            return;
        // Marcar locked (las que actualmente sirven de antecedente).
        for (const m of this.learnedMeta.values())
            m.locked = false;
        for (let v = 1; v <= this.numVars; v++) {
            const ante = this.varAnte[v];
            if (ante !== cdcl_v2_1.NO_ANTECEDENT && this.learnedMeta.has(ante)) {
                const m = this.learnedMeta.get(ante);
                if (m)
                    m.locked = true;
            }
        }
        const toRemove = new Set((0, cdcl_v2_1.selectClausesToRemove)(Array.from(this.learnedMeta.values()), this.opts.lbdReduceThreshold));
        if (toRemove.size === 0)
            return;
        // Backtrack a baseLevel sería costoso aquí; v1 hacemos un GC simple
        // marcando huecos. Estrategia: en lugar de reindexar (caro), saltamos
        // las cláusulas marcadas vaciando su contenido lógico. Esto preserva
        // los índices (antecedentes y watches siguen siendo válidos pero las
        // cláusulas reducidas son inertes). Para mantener watches consistentes,
        // simplemente las dejamos como están: ningún literal "false" forzará
        // unit propagation desde una cláusula sin watches actualizados... pero
        // como están vivas en watches, las skipeamos al detectar la marca.
        // Para v1, simplemente no reducimos en caliente; se hace solo al pop.
        // (Mantener este path como no-op evita un bug sutil con watches.)
        void toRemove;
    }
}
exports.IncrementalCDCL = IncrementalCDCL;
//# sourceMappingURL=solver.js.map