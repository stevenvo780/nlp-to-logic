"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashFormula = hashFormula;
/**
 * Renombra alfa-canónicamente las variables ligadas de una fórmula.
 * ∀x.P(x) y ∀y.P(y) producen la misma forma canónica.
 */
function alphaRename(f, env, counter) {
    switch (f.kind) {
        case 'forall':
        case 'exists': {
            const origVar = f.variable ?? '';
            const canonical = `x${counter.n++}`;
            const newEnv = new Map(env);
            newEnv.set(origVar, canonical);
            const renamedArgs = f.args ? f.args.map((a) => alphaRename(a, newEnv, counter)) : undefined;
            return {
                kind: f.kind,
                variable: canonical,
                args: renamedArgs,
            };
        }
        case 'atom': {
            const resolved = env.get(f.name ?? '') ?? f.name;
            return { kind: 'atom', name: resolved };
        }
        case 'predicate': {
            const resolvedTerms = (f.terms ?? f.params ?? []).map((t) => env.get(t) ?? t);
            return {
                kind: 'predicate',
                name: f.name,
                terms: resolvedTerms,
                params: resolvedTerms,
            };
        }
        default: {
            if (!f.args || f.args.length === 0) {
                return {
                    kind: f.kind,
                    name: f.name,
                    value: f.value,
                    variable: f.variable !== undefined ? (env.get(f.variable) ?? f.variable) : undefined,
                };
            }
            return {
                kind: f.kind,
                name: f.name,
                value: f.value,
                variable: f.variable !== undefined ? (env.get(f.variable) ?? f.variable) : undefined,
                args: f.args.map((a) => alphaRename(a, newEnvFor(f, env), counter)),
            };
        }
    }
}
function newEnvFor(_f, env) {
    return env;
}
/** Serializa una fórmula ya alfa-renombrada a string canónico. */
function serialize(f) {
    const parts = [f.kind];
    if (f.name !== undefined)
        parts.push(`n:${f.name}`);
    if (f.variable !== undefined)
        parts.push(`v:${f.variable}`);
    if (f.value !== undefined)
        parts.push(`val:${f.value}`);
    const terms = f.terms ?? f.params;
    if (terms && terms.length > 0) {
        parts.push(`t:[${terms.join(',')}]`);
    }
    if (f.args && f.args.length > 0) {
        parts.push(`a[${f.args.map(serialize).join('|')}]`);
    }
    return parts.join(':');
}
/**
 * Genera un hash canónico y estable para una fórmula.
 * - Ignora whitespace/metadatos de source.
 * - Aplica alpha-renaming antes de serializar: fórmulas alfa-equivalentes
 *   producen el mismo hash.
 */
function hashFormula(f) {
    const counter = { n: 0 };
    const renamed = alphaRename(f, new Map(), counter);
    return serialize(renamed);
}
//# sourceMappingURL=hash.js.map