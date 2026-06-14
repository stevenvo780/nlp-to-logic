"use strict";
/**
 * MDX → Claim[] parser.
 *
 * Reconoce dos formatos en cualquier orden y en cualquier posición del
 * documento (dentro de prosa, dentro de listas, etc):
 *
 *   - HTML comment style:
 *       <!-- st:claim id="c1" profile="p" formula="A->B" deps="c0,c2" -->
 *
 *   - Fenced code block style:
 *       ```st-claim id=c1 profile=p deps=c0
 *       A->B
 *       ```
 *
 * Bloques malformados (sin id, sin profile, sin formula, etc.) se ignoran
 * acumulando un warning. NUNCA lanza.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripMDXMetadata = exports.mdxToClaims = exports.mdxToClaimsDetailed = void 0;
const COMMENT_RE = /<!--\s*st:claim\s+([^]*?)-->/g;
// Fence: ```st-claim [opts]\n...body...\n```
// Tolerante con espacios y con el cierre exacto de 3 backticks.
const FENCE_RE = /```st-claim([^\n]*)\n([\s\S]*?)\n```/g;
const truncate = (s, max = 80) => s.length > max ? s.slice(0, max - 3) + '...' : s;
/**
 * Parsea una lista de atributos clave=valor. Soporta:
 *   - id="c1" o id='c1' (con comillas)
 *   - id=c1 (sin comillas, hasta whitespace)
 *   - claves repetidas: la última gana
 *
 * Devuelve un mapa case-sensitive.
 */
const parseAttrs = (raw) => {
    const attrs = {};
    // Pattern por iteración: key=value-con-o-sin-quotes
    const re = /([a-zA-Z_][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'`<>]+))/g;
    let m;
    while ((m = re.exec(raw)) !== null) {
        const key = m[1];
        if (key === undefined)
            continue;
        const value = m[2] ?? m[3] ?? m[4] ?? '';
        attrs[key] = value;
    }
    return attrs;
};
const parseDeps = (raw) => {
    if (!raw)
        return [];
    return raw
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
};
const buildClaim = (attrs, formula, rawBlock, offset) => {
    const id = attrs.id?.trim();
    const profile = attrs.profile?.trim();
    const trimmedFormula = formula.trim();
    if (!id) {
        return {
            ok: false,
            warning: {
                offset,
                message: 'st:claim sin id',
                snippet: truncate(rawBlock),
            },
        };
    }
    if (!profile) {
        return {
            ok: false,
            warning: {
                offset,
                message: `st:claim '${id}' sin profile`,
                snippet: truncate(rawBlock),
            },
        };
    }
    if (!trimmedFormula) {
        return {
            ok: false,
            warning: {
                offset,
                message: `st:claim '${id}' sin formula`,
                snippet: truncate(rawBlock),
            },
        };
    }
    const dependencies = parseDeps(attrs.deps ?? attrs.dependencies);
    const claim = {
        id,
        formula: trimmedFormula,
        profile,
        dependencies,
        rawBlock,
    };
    // Source location (offset en el MDX original). docId queda vacío — el
    // caller puede inyectarlo si necesita persistir.
    claim.source = { docId: '', offset };
    return { ok: true, claim };
};
/**
 * Versión "rica" — devuelve también warnings. La API pública delega aquí.
 */
const mdxToClaimsDetailed = (mdx) => {
    const claims = [];
    const warnings = [];
    const seenIds = new Set();
    // Reset stateful regex flags per call (defensa porque /g mantiene lastIndex).
    COMMENT_RE.lastIndex = 0;
    FENCE_RE.lastIndex = 0;
    // 1) Comentarios HTML
    let cm;
    while ((cm = COMMENT_RE.exec(mdx)) !== null) {
        const rawBlock = cm[0];
        const attrRaw = cm[1] ?? '';
        const offset = cm.index;
        const attrs = parseAttrs(attrRaw);
        // En comment-style, la fórmula viene en el atributo `formula`.
        const formula = attrs.formula ?? '';
        const built = buildClaim(attrs, formula, rawBlock, offset);
        if (!built.ok) {
            warnings.push(built.warning);
            continue;
        }
        if (seenIds.has(built.claim.id)) {
            warnings.push({
                offset,
                message: `st:claim id duplicado: '${built.claim.id}'`,
                snippet: truncate(rawBlock),
            });
            continue;
        }
        seenIds.add(built.claim.id);
        claims.push(built.claim);
    }
    // 2) Code fences ```st-claim
    let fm;
    while ((fm = FENCE_RE.exec(mdx)) !== null) {
        const rawBlock = fm[0];
        const attrRaw = fm[1] ?? '';
        const body = fm[2] ?? '';
        const offset = fm.index;
        const attrs = parseAttrs(attrRaw);
        const built = buildClaim(attrs, body, rawBlock, offset);
        if (!built.ok) {
            warnings.push(built.warning);
            continue;
        }
        if (seenIds.has(built.claim.id)) {
            warnings.push({
                offset,
                message: `st:claim id duplicado: '${built.claim.id}'`,
                snippet: truncate(rawBlock),
            });
            continue;
        }
        seenIds.add(built.claim.id);
        claims.push(built.claim);
    }
    // Orden estable por offset (mezcla comments + fences en orden de aparición).
    claims.sort((a, b) => {
        const ao = a.source?.offset ?? 0;
        const bo = b.source?.offset ?? 0;
        return ao - bo;
    });
    return { claims, warnings };
};
exports.mdxToClaimsDetailed = mdxToClaimsDetailed;
/**
 * MDX → Claim[]. Tolera bloques malformados ignorándolos.
 */
const mdxToClaims = (mdx) => {
    return (0, exports.mdxToClaimsDetailed)(mdx).claims;
};
exports.mdxToClaims = mdxToClaims;
/**
 * Helper interno: convierte MDXClaim a Claim "pelado" (sin rawBlock/source).
 * Útil para diff que sólo compara campos lógicos.
 */
const stripMDXMetadata = (claim) => {
    const { id, formula, profile, dependencies } = claim;
    return {
        id,
        formula,
        profile,
        dependencies: [...dependencies],
    };
};
exports.stripMDXMetadata = stripMDXMetadata;
//# sourceMappingURL=parser.js.map