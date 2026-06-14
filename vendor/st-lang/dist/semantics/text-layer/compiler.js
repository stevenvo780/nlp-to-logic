"use strict";
/**
 * ST Text Layer — Compilador texto -> formula/claim
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTextLayerState = createTextLayerState;
exports.parseAnchorPath = parseAnchorPath;
exports.registerPassage = registerPassage;
exports.registerFormalization = registerFormalization;
exports.registerClaim = registerClaim;
exports.registerSupport = registerSupport;
exports.registerConfidence = registerConfidence;
exports.registerContext = registerContext;
exports.compileClaimsToTheory = compileClaimsToTheory;
exports.registerDefinition = registerDefinition;
exports.registerSource = registerSource;
exports.registerInterpretation = registerInterpretation;
/** Crea un `TextLayerState` vacío listo para recibir passages, claims y definiciones. */
function createTextLayerState() {
    return {
        passages: new Map(),
        formalizations: new Map(),
        claims: new Map(),
        supports: [],
        confidences: [],
        contexts: [],
        definitions: new Map(),
        sources: new Map(),
        interpretations: new Map(),
    };
}
const HEADING_ANCHOR_RE = /^h[1-6](?:[-_.:][A-Za-z0-9._-]+)?$/;
const PARAGRAPH_ANCHOR_RE = /^p\d+(?:[-_.:][A-Za-z0-9._-]+)?$/;
const RANGE_ANCHOR_RE = /^r\d+(?:-\d+)?$/;
const BLOCK_ANCHOR_RE = /^[A-Za-z0-9][A-Za-z0-9._/-]*$/;
/**
 * Parsea una ruta de anchor con formato `"archivo.md#fragmento"` en un `Anchor`.
 * Infiere el tipo (`heading`, `paragraph`, `range`, `block`) a partir del fragmento.
 * @throws Si la cadena es inválida, vacía, tiene múltiples `#`, o el fragmento no se reconoce.
 */
function parseAnchorPath(raw) {
    if (typeof raw !== 'string') {
        throw new Error('Anchor invalido: se esperaba una cadena');
    }
    const trimmed = raw.trim();
    if (!trimmed) {
        throw new Error('Anchor invalido: la ruta no puede estar vacia');
    }
    const firstHash = trimmed.indexOf('#');
    const lastHash = trimmed.lastIndexOf('#');
    if (firstHash !== lastHash) {
        throw new Error(`Anchor invalido: '${raw}' contiene multiples fragmentos '#'`);
    }
    const path = (firstHash >= 0 ? trimmed.slice(0, firstHash) : trimmed).trim();
    const fragment = (firstHash >= 0 ? trimmed.slice(firstHash + 1) : '').trim() || undefined;
    if (!path) {
        throw new Error(`Anchor invalido: '${raw}' debe incluir una ruta antes de '#'`);
    }
    let type = 'block';
    if (fragment) {
        if (HEADING_ANCHOR_RE.test(fragment))
            type = 'heading';
        else if (PARAGRAPH_ANCHOR_RE.test(fragment))
            type = 'paragraph';
        else if (RANGE_ANCHOR_RE.test(fragment))
            type = 'range';
        else if (BLOCK_ANCHOR_RE.test(fragment))
            type = 'block';
        else
            throw new Error(`Anchor invalido: fragmento '${fragment}' no reconocido`);
    }
    return { path, fragment, type };
}
/**
 * Registra un passage en el estado, parseando `anchorPath` con `parseAnchorPath`.
 * @returns Diagnósticos de error si el anchor es inválido; vacío en caso de éxito.
 */
function registerPassage(state, name, anchorPath) {
    let anchor;
    try {
        anchor = parseAnchorPath(anchorPath);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Anchor invalido';
        return [{ severity: 'error', message }];
    }
    state.passages.set(name, { name, anchor });
    return [];
}
/**
 * Registra una formalización (passage + fórmula) en el estado.
 * Emite un warning si el passage referenciado no existe aún.
 */
function registerFormalization(state, name, passageName, formula) {
    const diags = [];
    if (!state.passages.has(passageName)) {
        diags.push({
            severity: 'warning',
            message: `Passage '${passageName}' no encontrado al formalizar '${name}'`,
        });
    }
    state.formalizations.set(name, { name, passage: passageName, formula });
    return diags;
}
/**
 * Registra un claim con fórmula directa o referencia a una formalización.
 * Emite un warning si `formalizationRef` no apunta a ningún pasaje o formalización conocida.
 */
function registerClaim(state, name, formula, formalizationRef) {
    const diags = [];
    if (formalizationRef &&
        !state.formalizations.has(formalizationRef) &&
        !state.passages.has(formalizationRef)) {
        diags.push({
            severity: 'warning',
            message: `Referencia '${formalizationRef}' no encontrada para claim '${name}'`,
        });
    }
    state.claims.set(name, { name, formula, formalization: formalizationRef });
    return diags;
}
/**
 * Asocia una fuente bibliográfica (`sourceName`) como soporte de un claim.
 * Emite un warning si el claim no existe en el estado.
 */
function registerSupport(state, claimName, sourceName) {
    const diags = [];
    if (!state.claims.has(claimName)) {
        diags.push({
            severity: 'warning',
            message: `Claim '${claimName}' no encontrado para registrar soporte`,
        });
    }
    state.supports.push({ claimName, sourceName });
    // Actualizar claim si existe
    const claim = state.claims.get(claimName);
    if (claim) {
        claim.support = sourceName;
    }
    return diags;
}
/**
 * Registra el nivel de confianza `value ∈ [0,1]` para un claim.
 * @returns Error si `value` está fuera de rango; warning si el claim no existe.
 */
function registerConfidence(state, claimName, value) {
    const diags = [];
    if (value < 0 || value > 1) {
        diags.push({
            severity: 'error',
            message: `Confidence debe estar entre 0 y 1, recibido: ${value}`,
        });
    }
    if (!state.claims.has(claimName)) {
        diags.push({
            severity: 'warning',
            message: `Claim '${claimName}' no encontrado para registrar confianza`,
        });
    }
    state.confidences.push({ claimName, value });
    const claim = state.claims.get(claimName);
    if (claim) {
        claim.confidence = value;
    }
    return diags;
}
/**
 * Registra texto de contexto libre asociado a un claim.
 * Emite un warning si el claim no existe en el estado.
 */
function registerContext(state, claimName, text) {
    const diags = [];
    if (!state.claims.has(claimName)) {
        diags.push({
            severity: 'warning',
            message: `Claim '${claimName}' no encontrado para registrar contexto`,
        });
    }
    state.contexts.push({ claimName, text });
    const claim = state.claims.get(claimName);
    if (claim) {
        claim.context = text;
    }
    return diags;
}
/**
 * Copia todos los claims con fórmula (directa o vía formalización) a `theory.claims`.
 * @returns Diagnósticos de error para claims con referencia a formalización inexistente.
 */
function compileClaimsToTheory(state, theory) {
    const diags = [];
    for (const [name, claim] of state.claims) {
        if (claim.formula) {
            theory.claims.set(name, claim);
        }
        else if (claim.formalization) {
            const fz = state.formalizations.get(claim.formalization);
            if (fz) {
                claim.formula = fz.formula;
                theory.claims.set(name, claim);
            }
            else {
                diags.push({
                    severity: 'error',
                    message: `Claim '${name}' refiere a formalizacion '${claim.formalization}' que no existe`,
                });
            }
        }
    }
    return diags;
}
/**
 * Registra una entrada de definición formal en el estado (v3).
 * Emite un warning si el nombre ya fue definido anteriormente.
 */
function registerDefinition(state, entry) {
    const diags = [];
    if (state.definitions.has(entry.name)) {
        diags.push({
            severity: 'warning',
            message: `Definición '${entry.name}' redefinida`,
        });
    }
    state.definitions.set(entry.name, entry);
    return diags;
}
/**
 * Registra una fuente bibliográfica en el estado (v3).
 * Emite un warning si el `source.id` ya fue registrado.
 */
function registerSource(state, source) {
    const diags = [];
    if (state.sources.has(source.id)) {
        diags.push({
            severity: 'warning',
            message: `Fuente '${source.id}' redefinida`,
        });
    }
    state.sources.set(source.id, source);
    return diags;
}
/**
 * Registra una entrada de interpretación semántica bajo la clave `key` (v3).
 * Sobreescribe silenciosamente si la clave ya existe.
 */
function registerInterpretation(state, key, entry) {
    state.interpretations.set(key, entry);
    return [];
}
//# sourceMappingURL=compiler.js.map