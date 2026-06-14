"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formalize = formalize;
exports.formalizeWithLLM = formalizeWithLLM;
const segmenter_1 = require("./segmenter");
const discourse_1 = require("./discourse");
const atoms_1 = require("./atoms");
const formula_1 = require("./formula");
const st_emitter_1 = require("./generator/st-emitter");
const compiler_frontend_1 = require("./compiler-frontend");
const validator_1 = require("./generator/validator");
/** Opciones por defecto */
const DEFAULTS = {
    profile: 'classical.propositional',
    language: 'es',
    atomStyle: 'keywords',
    includeComments: true,
    validateOutput: true,
    maxClauseDepth: 3,
};
/**
 * Formaliza texto natural a código ST.
 *
 * @param text Texto en lenguaje natural a formalizar
 * @param options Opciones de formalización
 * @returns Resultado con código ST, análisis y diagnósticos
 *
 * @example
 * ```ts
 * const result = formalize(
 *   "Si llueve, entonces la calle se moja. Está lloviendo. Por lo tanto, la calle está mojada.",
 *   { profile: 'classical.propositional', language: 'es' }
 * );
 * console.log(result.stCode);
 * ```
 */
function formalize(text, options = {}) {
    const opts = { ...DEFAULTS, ...options };
    const diagnostics = [];
    // ── Validación de entrada ───────────────────
    if (!text || !text.trim()) {
        return emptyResult('El texto de entrada está vacío.', diagnostics);
    }
    try {
        // ── 0. Compilador AST Directo (Fase 1-4) ─────
        const advancedLogic = (0, compiler_frontend_1.compileComplexLogic)(text, opts.profile);
        if (advancedLogic) {
            const { code: stCode, diagnostics: emitDiags } = (0, st_emitter_1.emitST)({
                profile: opts.profile,
                language: opts.language,
                includeComments: opts.includeComments,
                atoms: new Map(),
                formulas: advancedLogic.map((al, idx) => ({
                    formula: al.formula,
                    stType: al.type,
                    label: `a${idx + 1}`,
                    sourceText: text,
                    sourceSentence: 0,
                })),
                detectedPatterns: ['ast_compiled']
            });
            diagnostics.push(...emitDiags);
            return {
                ok: true,
                stCode,
                analysis: { sentences: [], argumentStructure: { premises: [], conclusions: [], conditions: [], relations: [] }, detectedPatterns: [] },
                atoms: new Map(),
                formulas: [],
                diagnostics,
                stValidation: { ok: true, errors: [] },
                stExecution: undefined
            };
        }
        // ── 1. Segmentación ─────────────────────────
        const sentences = (0, segmenter_1.segment)(text, opts.language);
        if (sentences.length === 0) {
            return emptyResult('No se detectaron oraciones en el texto.', diagnostics);
        }
        // ── 1.5. Resolución Anafórica (Fase 2.1) ────────
        let lastSubject = '';
        for (const sentence of sentences) {
            for (const clause of sentence.clauses) {
                // Heuristica basica para buscar el sujeto dominante 
                // o palabras clave de la clausula
                const words = clause.text.split(' ');
                for (let i = 0; i < words.length; i++) {
                    const w = words[i].toLowerCase();
                    if (['el', 'la', 'los', 'las', 'un', 'una'].includes(w) && i + 1 < words.length && words[i + 1].length > 3) {
                        lastSubject = words[i + 1];
                    }
                }
                // Reemplazar anáforas
                if (lastSubject) {
                    clause.text = clause.text.replace(/\b(este|ese|aquel|éste|ése|aquél)\b/gi, lastSubject);
                    clause.text = clause.text.replace(/\b(lo anterior)\b/gi, lastSubject);
                }
            }
        }
        // ── 2. Análisis discursivo ──────────────────
        const analysis = (0, discourse_1.analyzeDiscourse)(sentences, opts.language);
        // ── 3. Extracción de átomos ─────────────────
        const { atoms, entries: atomEntries } = (0, atoms_1.extractAtoms)(analysis.sentences, {
            language: opts.language,
            atomStyle: opts.atomStyle,
            profile: opts.profile,
        });
        // ── 4. Construcción de fórmulas ─────────────
        const formulas = (0, formula_1.buildFormulas)(analysis.sentences, atomEntries, opts.profile, analysis.detectedPatterns);
        // ── 5. Generación de código ST ──────────────
        const { code, diagnostics: emitDiags } = (0, st_emitter_1.emitST)({
            profile: opts.profile,
            language: opts.language,
            includeComments: opts.includeComments,
            atoms,
            formulas,
            detectedPatterns: analysis.detectedPatterns,
        });
        diagnostics.push(...emitDiags);
        // ── 6. Validación (opcional) ────────────────
        let stValidation;
        let stExecution;
        if (opts.validateOutput) {
            stValidation = (0, validator_1.validateST)(code);
            diagnostics.push(...(0, validator_1.validationToDiagnostics)(stValidation));
            if (stValidation.ok) {
                stExecution = (0, validator_1.executeST)(code);
                diagnostics.push(...(0, validator_1.executionToDiagnostics)(stExecution));
                // BUG-C7: si la ejecución corrió sin errores de runtime pero la
                // derivación es refutable/no demostrable, la validación NO es ok.
                // Antes esto se perdía en silencio (formalizeOk:true con derive
                // refutable). No marcamos error para timeouts (resultado incompleto,
                // no incorrecto).
                if (!stExecution.timedOut && !stExecution.semanticOk) {
                    stValidation = {
                        ok: false,
                        errors: [
                            ...stValidation.errors,
                            `Derivación refutable o no demostrable (${stExecution.failingStatuses.join(', ') || 'sin conclusión'})`,
                        ],
                    };
                }
            }
        }
        // `ok` refleja: sin diagnósticos de error Y validez semántica de la
        // ejecución (cuando hubo ejecución no abortada por timeout).
        const semanticOk = !stExecution || stExecution.timedOut || stExecution.semanticOk;
        return {
            ok: diagnostics.every(d => d.severity !== 'error') && semanticOk,
            stCode: code,
            analysis,
            atoms,
            formulas,
            diagnostics,
            stValidation,
            stExecution,
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        diagnostics.push({
            severity: 'error',
            message: `Error en pipeline de formalización: ${message}`,
            code: 'PIPELINE_ERROR',
        });
        return {
            ok: false,
            stCode: '',
            analysis: {
                sentences: [],
                argumentStructure: { premises: [], conclusions: [], conditions: [], relations: [] },
                detectedPatterns: [],
            },
            atoms: new Map(),
            formulas: [],
            diagnostics,
        };
    }
}
/**
 * Resultado vacío con error.
 */
function emptyResult(message, diagnostics) {
    diagnostics.push({ severity: 'warning', message, code: 'EMPTY_INPUT' });
    return {
        ok: false,
        stCode: '',
        analysis: {
            sentences: [],
            argumentStructure: { premises: [], conclusions: [], conditions: [], relations: [] },
            detectedPatterns: [],
        },
        atoms: new Map(),
        formulas: [],
        diagnostics,
    };
}
const llm_parser_1 = require("./llm-parser");
const nl_linter_1 = require("./nl-linter");
/**
 * Nueva entrada arquitectonica de Doble Capa.
 * 1. Pasa por en NL Linter
 * 2. Manda a Inferencia (Local o Red)
 */
async function formalizeWithLLM(text, options) {
    const opts = { ...DEFAULTS, abortOnLinterErrors: true, ...options };
    const baseResult = {
        ok: false, stCode: '', analysis: { sentences: [], argumentStructure: { premises: [], conclusions: [], conditions: [], relations: [] }, detectedPatterns: [] },
        atoms: new Map(), formulas: [], diagnostics: [], stValidation: { ok: true, errors: [] }, stExecution: undefined,
        linterDiagnostics: []
    };
    // 1. Capa Linter
    const linterDiagnostics = (0, nl_linter_1.lintNaturalLanguage)(text, nl_linter_1.DEFAULT_RULES);
    baseResult.linterDiagnostics = linterDiagnostics;
    const hasErrors = linterDiagnostics.some(d => d.severity === 'error');
    if (hasErrors && opts.abortOnLinterErrors) {
        baseResult.diagnostics.push({
            severity: 'error',
            code: 'NL_LINTER_ABORT',
            message: 'El texto no es apto para formalización. Revisa los errores del NL Linter.'
        });
        return baseResult;
    }
    try {
        // 2. Capa LLM / SLM (Inferencia semántica)
        const parsedAst = await (0, llm_parser_1.parseTextWithLLM)(text, opts.profile, opts.llmConfig);
        baseResult.llmRawAst = parsedAst;
        // 3. Traducimos el Árbol JSON a código ST
        const stLines = (0, llm_parser_1.llmResultToST)(parsedAst);
        let axiomIdx = 0;
        let deriveIdx = 0;
        const generatorInput = stLines.map((line) => ({
            formula: line.formula,
            stType: line.type === 'derive' ? 'derive' : line.type,
            label: line.type === 'axiom' ? `a${++axiomIdx}` : line.type === 'derive' ? `d${++deriveIdx}` : `c${++deriveIdx}`,
            sourceText: '', sourceSentence: 0
        }));
        const { code: stCode, diagnostics: emitDiags } = (0, st_emitter_1.emitST)({
            profile: opts.profile,
            language: opts.language,
            includeComments: opts.includeComments,
            atoms: new Map(),
            formulas: generatorInput,
            detectedPatterns: ['llm_extracted']
        });
        baseResult.stCode = stCode;
        baseResult.diagnostics.push(...emitDiags);
        if (opts.validateOutput) {
            let stValidation = (0, validator_1.validateST)(stCode);
            baseResult.diagnostics.push(...(0, validator_1.validationToDiagnostics)(stValidation));
            if (stValidation.ok) {
                const stExecution = (0, validator_1.executeST)(stCode);
                baseResult.stExecution = stExecution;
                baseResult.diagnostics.push(...(0, validator_1.executionToDiagnostics)(stExecution));
                // BUG-C7: validez semántica también en la ruta LLM.
                if (!stExecution.timedOut && !stExecution.semanticOk) {
                    stValidation = {
                        ok: false,
                        errors: [
                            ...stValidation.errors,
                            `Derivación refutable o no demostrable (${stExecution.failingStatuses.join(', ') || 'sin conclusión'})`,
                        ],
                    };
                }
            }
            baseResult.stValidation = stValidation;
        }
        const semanticOk = !baseResult.stExecution || baseResult.stExecution.timedOut || baseResult.stExecution.semanticOk;
        const allValid = baseResult.diagnostics.every(d => d.severity !== 'error') && semanticOk;
        baseResult.ok = allValid;
        return baseResult;
    }
    catch (err) {
        baseResult.diagnostics.push({
            severity: 'error',
            code: 'LLM_PIPELINE_ERROR',
            message: `Ocurrió un error en la capa inferencial: ${err.message}`
        });
        return baseResult;
    }
}
//# sourceMappingURL=formalize.js.map