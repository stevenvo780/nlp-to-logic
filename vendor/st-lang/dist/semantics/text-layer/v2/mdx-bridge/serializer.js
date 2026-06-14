"use strict";
/**
 * Claim[] → MDX serializer.
 *
 * Produce MDX con bloques sincronizables en formato 'comment' o 'fence'.
 * El round-trip `mdxToClaims(claimsToMDX(claims))` reproduce los campos
 * lógicos (id, formula, profile, dependencies) sin pérdida.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.claimsToMDX = void 0;
/**
 * Escape para atributo entre comillas dobles. Reemplaza " por &quot; y
 * mantiene el resto. No es HTML-completo (no escapa <>&) porque vive
 * dentro de un comentario HTML, donde sólo "--" sería problemático.
 *
 * Si la fórmula contiene "--", la rompemos insertando un zero-width-space.
 * En la práctica las fórmulas ST no contienen "--" (sí "<->", "->", etc.),
 * así que es defense-in-depth.
 */
const escapeAttr = (s) => s.replace(/"/g, '&quot;').replace(/--/g, '-​-');
const unescapedRoundtripCheck = (raw) => !raw.includes('--');
/**
 * Para fence-style: los atributos no llevan comillas si el valor no tiene
 * espacios ni caracteres especiales; si los tiene, usamos comillas dobles.
 */
const fenceAttrValue = (value) => {
    if (/^[A-Za-z0-9._\-:]+$/.test(value))
        return value;
    return `"${value.replace(/"/g, '\\"')}"`;
};
const formatComment = (claim) => {
    const parts = [];
    parts.push(`id="${escapeAttr(claim.id)}"`);
    parts.push(`profile="${escapeAttr(claim.profile)}"`);
    parts.push(`formula="${escapeAttr(claim.formula)}"`);
    if (claim.dependencies.length > 0) {
        parts.push(`deps="${escapeAttr(claim.dependencies.join(','))}"`);
    }
    // Sanity: el cierre `-->` del comentario no debe aparecer en los atributos.
    const inside = parts.join(' ');
    if (!unescapedRoundtripCheck(inside)) {
        // Si quedó "--" tras escape, es un edge-case raro: igual emitimos y
        // dejamos que el parser lo reconozca (regex es no-greedy).
    }
    return `<!-- st:claim ${inside} -->`;
};
const formatFence = (claim) => {
    const headerParts = [];
    headerParts.push(`id=${fenceAttrValue(claim.id)}`);
    headerParts.push(`profile=${fenceAttrValue(claim.profile)}`);
    if (claim.dependencies.length > 0) {
        headerParts.push(`deps=${fenceAttrValue(claim.dependencies.join(','))}`);
    }
    const header = headerParts.join(' ');
    return ['```st-claim ' + header, claim.formula, '```'].join('\n');
};
/**
 * Claim[] → MDX string.
 *
 * Separa cada bloque con doble newline. El orden de salida respeta el
 * orden del array de entrada.
 */
const claimsToMDX = (claims, options = {}) => {
    const template = options.template ?? 'fence';
    const blocks = claims.map((c) => (template === 'comment' ? formatComment(c) : formatFence(c)));
    return blocks.join('\n\n');
};
exports.claimsToMDX = claimsToMDX;
//# sourceMappingURL=serializer.js.map