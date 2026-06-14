"use strict";
// ============================================================
// ST SMT-Z3 — Backend real basado en z3-solver (WASM in-process)
// ============================================================
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
exports.Z3WasmBackend = void 0;
exports.isZ3Available = isZ3Available;
exports.detectAvailableSMT = detectAvailableSMT;
let cachedZ3Module;
let cachedInitError;
/** Carga perezosa de z3-solver. Cachea el módulo entre instancias. */
async function loadZ3() {
    if (cachedZ3Module)
        return cachedZ3Module;
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    if (cachedInitError !== undefined)
        throw cachedInitError;
    try {
        // Import dinámico + cast a `any`: la API real de z3-solver expone
        // genéricos por Context<Name> que harían el wrapper invasivo. El
        // contrato externo del backend está fijado por AsyncSMTBackend, así
        // que el cast queda contenido aquí.
        const mod = (await Promise.resolve().then(() => __importStar(require('z3-solver'))));
        cachedZ3Module = (await mod.init());
        return cachedZ3Module;
    }
    catch (err) {
        cachedInitError = err;
        throw err;
    }
}
/**
 * `isZ3Available()` intenta inicializar z3-solver y devuelve true si
 * obtiene un Context utilizable. No lanza. Útil para skip de tests y
 * detección de runtime.
 */
async function isZ3Available() {
    try {
        const z3 = await loadZ3();
        // Smoke: crear y liberar un Solver. Si falla el WASM, salimos por catch.
        const ctx = z3.Context('detect-' + Date.now().toString(36));
        const s = new ctx.Solver();
        s.release();
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Detector unificado de runtime SMT con preferencia por el WASM in-process.
 * - z3-wasm si la WASM bind carga.
 * - z3-subprocess o cvc5-subprocess si hay binario en PATH.
 * - 'none' si no hay nada.
 */
async function detectAvailableSMT() {
    if (await isZ3Available())
        return 'z3-wasm';
    // Fallback: importar el detector subprocess sin acoplar build target.
    try {
        const { detectAvailableSMTDetailed } = await Promise.resolve().then(() => __importStar(require('../smt/subprocess-backend')));
        const detected = detectAvailableSMTDetailed();
        if (detected.solver === 'z3')
            return 'z3-subprocess';
        if (detected.solver === 'cvc5')
            return 'cvc5-subprocess';
    }
    catch {
        // ignore — subprocess backend opcional
    }
    return 'none';
}
let contextCounter = 0;
/**
 * Z3WasmBackend — wrapper sobre z3-solver con interfaz AsyncSMTBackend.
 *
 * Modelo de estado:
 *  - Mantiene un único `Solver` Z3 cuyo stack push/pop se sincroniza con
 *    `scopes[]` del host (espejo). Esto permite re-hidratar el solver con
 *    `solver.reset()` + replay de scopes si fuera necesario (no se hace
 *    en el flujo normal, sólo en `reset()`).
 *  - `assertFormula(body)` mete `(assert body)` en el solver actual,
 *    pero también lo registra en `scopes[top].assertions` por trazabilidad.
 *  - `getUnsatCore()` requiere haber usado `assertNamed(name, body)`:
 *    estos asserts se envuelven en `(=> <track> <body>)` y se pasan como
 *    assumption literals al check(). El core devuelto es la lista de
 *    nombres `track`.
 */
class Z3WasmBackend {
    name = 'z3-wasm';
    ctx;
    solver;
    logic;
    produceUnsatCore;
    produceModels;
    timeoutMs;
    scopes = [{ decls: [], assertions: [] }];
    /** Tracks declarados como Bool y usados como assumption literals. */
    trackNames = new Set();
    lastModel;
    lastUnsatCore = [];
    lastStatistics = {};
    constructor(_z3, ctx, options = {}) {
        this.ctx = ctx;
        this.logic = options.logic;
        this.produceUnsatCore = options.produceUnsatCore ?? true;
        this.produceModels = options.produceModels ?? true;
        this.timeoutMs = options.timeoutMs;
        this.solver = this.buildSolver();
    }
    /** Crea un backend nuevo. Falla si z3-solver no puede inicializarse. */
    static async create(logicOrOptions) {
        const options = typeof logicOrOptions === 'string' ? { logic: logicOrOptions } : (logicOrOptions ?? {});
        const z3 = await loadZ3();
        // Cada backend usa su propio Context Z3 para evitar cross-talk entre tests.
        contextCounter += 1;
        const ctx = z3.Context(`st-z3-wasm-${contextCounter}`);
        return new Z3WasmBackend(z3, ctx, options);
    }
    /** Resetea el solver (drop all asserts y scopes). */
    reset() {
        try {
            this.solver.release();
        }
        catch {
            // ignore — release es best-effort
        }
        this.solver = this.buildSolver();
        this.scopes = [{ decls: [], assertions: [] }];
        this.trackNames = new Set();
        this.lastModel = undefined;
        this.lastUnsatCore = [];
        this.lastStatistics = {};
    }
    push() {
        this.solver.push();
        this.scopes.push({ decls: [], assertions: [] });
    }
    pop(levels = 1) {
        const target = Math.min(levels, this.scopes.length - 1);
        if (target <= 0)
            return;
        this.solver.pop(target);
        for (let i = 0; i < target; i += 1) {
            this.scopes.pop();
        }
    }
    declareConst(name, sort, bvWidth) {
        const decl = { name, sort };
        if (sort === 'BitVec')
            decl.bvWidth = bvWidth ?? 32;
        this.currentScope().decls.push(decl);
        this.solver.fromString(this.formatDecl(decl));
    }
    /**
     * Inserta una aserción directa (sin tracking). El cuerpo es SMT-LIB v2
     * SIN envolver en `(assert ...)`.
     */
    assertFormula(smtlib) {
        const body = smtlib.trim();
        if (!body)
            return;
        this.currentScope().assertions.push({ body });
        this.solver.fromString(`(assert ${body})`);
    }
    /**
     * Aserción nombrada para participar de unsat core. El `trackName` se
     * declara como Bool fresco y la aserción real se mete como
     * `(=> trackName body)`. En checkSat() esos tracks se pasan como
     * assumption literals.
     */
    assertNamed(trackName, smtlib) {
        if (!this.produceUnsatCore) {
            // Si el solver no produce core, degradamos a assert simple.
            this.assertFormula(smtlib);
            return;
        }
        const body = smtlib.trim();
        if (!body)
            return;
        if (this.trackNames.has(trackName)) {
            throw new Error(`[z3-wasm] trackName "${trackName}" ya fue usado en este backend`);
        }
        this.trackNames.add(trackName);
        this.currentScope().assertions.push({ body, trackName });
        this.solver.fromString(`(declare-const ${trackName} Bool)`);
        this.solver.fromString(`(assert (=> ${trackName} ${body}))`);
    }
    async checkSat() {
        const assumptions = [];
        if (this.produceUnsatCore) {
            for (const name of this.trackNames) {
                assumptions.push(this.ctx.Bool.const(name));
            }
        }
        let result;
        try {
            result =
                assumptions.length > 0
                    ? await this.solver.check(...assumptions)
                    : await this.solver.check();
        }
        catch (err) {
            // WASM throw — devolver unknown en lugar de propagar, alineado con el
            // resto de backends que nunca tiran en checkSat.
            this.lastModel = undefined;
            this.lastUnsatCore = [];
            // Bug-friendly: pegar mensaje a las statistics para diagnóstico.
            this.lastStatistics = { error: 1 };
            void err;
            return 'unknown';
        }
        if (result === 'sat') {
            this.lastModel = this.extractModel();
            this.lastUnsatCore = [];
        }
        else if (result === 'unsat') {
            this.lastModel = undefined;
            this.lastUnsatCore = this.extractUnsatCore();
        }
        else {
            this.lastModel = undefined;
            this.lastUnsatCore = [];
        }
        this.lastStatistics = this.extractStatistics();
        return result;
    }
    getModel() {
        return this.lastModel ? { ...this.lastModel } : undefined;
    }
    getUnsatCore() {
        return [...this.lastUnsatCore];
    }
    /**
     * `setOption` envuelve `solver.set(key, value)`. Acepta los nombres
     * estándar Z3 (ej. `timeout`, `random_seed`).
     */
    setOption(key, value) {
        this.solver.set(key, value);
    }
    /** Devuelve la última snapshot de stats Z3 capturada en checkSat(). */
    getStatistics() {
        return { ...this.lastStatistics };
    }
    /**
     * Cierra el solver liberando memoria WASM. Después de close() el
     * backend no debe usarse.
     */
    close() {
        try {
            this.solver.release();
        }
        catch {
            // ignore — release es best-effort
        }
    }
    // --------------------------------------------------------------
    // Internals
    // --------------------------------------------------------------
    buildSolver() {
        const solver = this.logic ? new this.ctx.Solver(this.logic) : new this.ctx.Solver();
        if (this.produceUnsatCore) {
            solver.set('unsat_core', true);
        }
        if (this.produceModels) {
            solver.set('model', true);
        }
        if (this.timeoutMs !== undefined) {
            solver.set('timeout', this.timeoutMs);
        }
        return solver;
    }
    currentScope() {
        const top = this.scopes[this.scopes.length - 1];
        if (!top) {
            const fresh = { decls: [], assertions: [] };
            this.scopes.push(fresh);
            return fresh;
        }
        return top;
    }
    formatDecl(decl) {
        if (decl.sort === 'BitVec') {
            return `(declare-const ${decl.name} (_ BitVec ${decl.bvWidth ?? 32}))`;
        }
        return `(declare-const ${decl.name} ${decl.sort})`;
    }
    extractModel() {
        let model;
        try {
            model = this.solver.model();
        }
        catch {
            return undefined;
        }
        const out = {};
        const decls = model.decls();
        for (const d of decls) {
            const nameAst = d.name();
            const name = nameAst.toString();
            // Saltamos los track names usados internamente para unsat-core.
            if (this.trackNames.has(name))
                continue;
            let raw;
            try {
                raw = model.get(d).toString().trim();
            }
            catch {
                continue;
            }
            out[name] = parseZ3Value(raw);
        }
        return Object.keys(out).length > 0 ? out : undefined;
    }
    extractUnsatCore() {
        let core;
        try {
            core = this.solver.unsatCore();
        }
        catch {
            return [];
        }
        const names = [];
        const len = core.length();
        for (let i = 0; i < len; i += 1) {
            try {
                const lit = core.get(i);
                names.push(lit.toString());
            }
            catch {
                // ignore literal corrupto
            }
        }
        return names;
    }
    extractStatistics() {
        let stats;
        try {
            stats = this.solver.statistics();
        }
        catch {
            return {};
        }
        const out = {};
        try {
            const iter = stats[Symbol.iterator]();
            while (true) {
                const step = iter.next();
                if (step.done)
                    break;
                const entry = step.value;
                if (typeof entry.value === 'number' && Number.isFinite(entry.value)) {
                    out[entry.key] = entry.value;
                }
            }
        }
        catch {
            // Si la iteración de stats falla, mantenemos el snapshot vacío.
        }
        return out;
    }
}
exports.Z3WasmBackend = Z3WasmBackend;
/**
 * Decodifica el `toString()` de un valor Z3 a una representación JS:
 *  - "true"/"false" → boolean
 *  - "#xFF" / "#b101" → number (con guard a Number.MAX_SAFE_INTEGER)
 *  - decimales y enteros → number (cuando entran en safe range)
 *  - resto → string crudo
 */
function parseZ3Value(raw) {
    if (raw === 'true')
        return true;
    if (raw === 'false')
        return false;
    if (raw.startsWith('#x')) {
        const n = Number.parseInt(raw.slice(2), 16);
        return Number.isSafeInteger(n) ? n : raw;
    }
    if (raw.startsWith('#b')) {
        const n = Number.parseInt(raw.slice(2), 2);
        return Number.isSafeInteger(n) ? n : raw;
    }
    // (- 5) → -5
    const negMatch = /^\(-\s+(\d+(?:\.\d+)?)\)$/.exec(raw);
    if (negMatch && negMatch[1] !== undefined) {
        const n = Number(`-${negMatch[1]}`);
        return Number.isFinite(n) ? n : raw;
    }
    // Racional (/ a b) → a/b
    const ratMatch = /^\(\/\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\)$/.exec(raw);
    if (ratMatch && ratMatch[1] !== undefined && ratMatch[2] !== undefined) {
        const a = Number(ratMatch[1]);
        const b = Number(ratMatch[2]);
        if (Number.isFinite(a) && Number.isFinite(b) && b !== 0)
            return a / b;
    }
    const numeric = Number(raw);
    if (!Number.isNaN(numeric) && Number.isFinite(numeric))
        return numeric;
    return raw;
}
//# sourceMappingURL=z3-wasm-backend.js.map