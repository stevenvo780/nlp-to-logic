"use strict";
// ============================================================
// CSP Hoare — Semántica operacional (LTS) + alfabetos
// ============================================================
// Implementa un sistema de transición etiquetado (LTS) sobre `Process`:
//
//   • `nextEvents(P)` — eventos visibles ofrecidos inmediatamente (sin
//     resolver elección interna). Para `P ⊓ Q` devolvemos la unión: ambos
//     son alcanzables vía un paso interno (τ).
//   • `step(P, a)` — derivada tras un evento visible. Si `a` no está en
//     `initials(P)`, devuelve `null`. Para los operadores no-deterministas
//     elegimos cualquier rama que ofrezca `a`.
//
// Para las semánticas más finas (failures) exponemos `internalResolutions`,
// que enumera todos los estados estables (sin τ pendientes) alcanzables
// mediante choices internos. Esto evita explorar la rama "muerta" de un
// `P ⊓ Q` cuando solo nos interesa qué puede ofrecer una resolución dada.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.SKIP = exports.STOP = void 0;
exports.prefix = prefix;
exports.choice = choice;
exports.internal = internal;
exports.parallel = parallel;
exports.interleave = interleave;
exports.sequence = sequence;
exports.hide = hide;
exports.rename = rename;
exports.recursion = recursion;
exports.processVar = processVar;
exports.alphabet = alphabet;
exports.nextEvents = nextEvents;
exports.step = step;
exports.internalResolutions = internalResolutions;
const types_1 = require("./types");
// ── Constructores cómodos ───────────────────────────────────
/** The deadlocked process: offers no events and never terminates. */
exports.STOP = { kind: 'stop' };
/** The successfully terminated process: offers only the tick event `✓`. */
exports.SKIP = { kind: 'skip' };
/** Creates a prefixed process `event → cont`. */
function prefix(event, cont) {
    return { kind: 'prefix', event, cont };
}
/** Creates an external (deterministic) choice `left □ right`. */
function choice(left, right) {
    return { kind: 'choice', left, right };
}
/** Creates an internal (non-deterministic) choice `left ⊓ right`. */
function internal(left, right) {
    return { kind: 'internal', left, right };
}
/** Creates a parallel composition synchronized on the given `alphabet`. */
function parallel(left, right, alphabet) {
    return { kind: 'parallel', left, right, alphabet };
}
/** Creates an interleaving composition (synchronized only on `✓`). */
function interleave(left, right) {
    return { kind: 'interleave', left, right };
}
/** Creates a sequential composition: `right` starts after `left` terminates. */
function sequence(left, right) {
    return { kind: 'sequence', left, right };
}
/** Creates a hiding operator that conceals `events` from the environment. */
function hide(process, events) {
    return { kind: 'hide', process, events };
}
/** Creates a renaming operator that maps events according to `mapping`. */
function rename(process, mapping) {
    return { kind: 'rename', process, mapping };
}
/** Creates a recursive process `μname.body`. */
function recursion(name, body) {
    return { kind: 'recursion', name, body };
}
/** Creates a process variable reference (for use inside `recursion` bodies). */
function processVar(name) {
    return { kind: 'var', name };
}
// ── Alfabeto sintáctico ─────────────────────────────────────
/**
 * Conjunto de eventos visibles mencionados sintácticamente en `p`.
 * Los eventos renombrados aportan tanto la fuente como el destino
 * (la fuente puede aparecer en una rama no recorrida, y el destino
 * es lo que el entorno observa).
 */
function alphabet(p) {
    const out = new Set();
    collectAlphabet(p, out);
    return out;
}
function collectAlphabet(p, out) {
    switch (p.kind) {
        case 'stop':
        case 'skip':
        case 'var':
            return;
        case 'prefix':
            out.add(p.event);
            collectAlphabet(p.cont, out);
            return;
        case 'choice':
        case 'internal':
        case 'interleave':
        case 'sequence':
            collectAlphabet(p.left, out);
            collectAlphabet(p.right, out);
            return;
        case 'parallel':
            collectAlphabet(p.left, out);
            collectAlphabet(p.right, out);
            for (const e of p.alphabet)
                out.add(e);
            return;
        case 'hide':
            collectAlphabet(p.process, out);
            for (const e of p.events)
                out.delete(e);
            return;
        case 'rename': {
            const inner = new Set();
            collectAlphabet(p.process, inner);
            for (const e of inner)
                out.add(p.mapping.get(e) ?? e);
            return;
        }
        case 'recursion':
            collectAlphabet(p.body, out);
            return;
    }
}
// ── Desplegado de recursión ─────────────────────────────────
/**
 * Sustituye la variable de proceso `name` por `replacement` en `p`.
 * Es una sustitución por valor (no captura porque las variables son
 * nombres globales del nivel de declaración).
 */
function substituteVar(p, name, replacement) {
    switch (p.kind) {
        case 'stop':
        case 'skip':
            return p;
        case 'var':
            return p.name === name ? replacement : p;
        case 'prefix':
            return { kind: 'prefix', event: p.event, cont: substituteVar(p.cont, name, replacement) };
        case 'choice':
            return {
                kind: 'choice',
                left: substituteVar(p.left, name, replacement),
                right: substituteVar(p.right, name, replacement),
            };
        case 'internal':
            return {
                kind: 'internal',
                left: substituteVar(p.left, name, replacement),
                right: substituteVar(p.right, name, replacement),
            };
        case 'parallel':
            return {
                kind: 'parallel',
                left: substituteVar(p.left, name, replacement),
                right: substituteVar(p.right, name, replacement),
                alphabet: p.alphabet,
            };
        case 'interleave':
            return {
                kind: 'interleave',
                left: substituteVar(p.left, name, replacement),
                right: substituteVar(p.right, name, replacement),
            };
        case 'sequence':
            return {
                kind: 'sequence',
                left: substituteVar(p.left, name, replacement),
                right: substituteVar(p.right, name, replacement),
            };
        case 'hide':
            return {
                kind: 'hide',
                process: substituteVar(p.process, name, replacement),
                events: p.events,
            };
        case 'rename':
            return {
                kind: 'rename',
                process: substituteVar(p.process, name, replacement),
                mapping: p.mapping,
            };
        case 'recursion':
            // shadowing: si la recursión re-define la misma variable, no entrar.
            if (p.name === name)
                return p;
            return { kind: 'recursion', name: p.name, body: substituteVar(p.body, name, replacement) };
    }
}
/** μX.P → P[X := μX.P], un solo paso de desplegado. */
function unfoldOnce(p) {
    return substituteVar(p.body, p.name, p);
}
// ── Eventos iniciales ───────────────────────────────────────
/**
 * Eventos visibles que `p` puede ofrecer inmediatamente como su primer
 * evento (tomando todas las resoluciones internas). No incluye τ (los
 * eventos ocultos son silenciosos por construcción).
 *
 * Para `SKIP` reportamos el tick `✓` — termina exitosamente.
 */
function nextEvents(p) {
    const out = new Set();
    collectInitials(p, out, 0);
    return out;
}
const MAX_UNFOLD_DEPTH = 64;
function collectInitials(p, out, depth) {
    if (depth > MAX_UNFOLD_DEPTH)
        return; // protección contra recursión sin guarda
    switch (p.kind) {
        case 'stop':
            return;
        case 'skip':
            out.add(types_1.TICK);
            return;
        case 'prefix':
            out.add(p.event);
            return;
        case 'choice':
        case 'internal':
            collectInitials(p.left, out, depth);
            collectInitials(p.right, out, depth);
            return;
        case 'parallel': {
            const sync = new Set(p.alphabet);
            const li = new Set();
            const ri = new Set();
            collectInitials(p.left, li, depth);
            collectInitials(p.right, ri, depth);
            for (const e of li) {
                if (sync.has(e)) {
                    if (ri.has(e))
                        out.add(e);
                }
                else {
                    out.add(e);
                }
            }
            for (const e of ri) {
                if (sync.has(e)) {
                    if (li.has(e))
                        out.add(e);
                }
                else {
                    out.add(e);
                }
            }
            return;
        }
        case 'interleave': {
            const li = new Set();
            const ri = new Set();
            collectInitials(p.left, li, depth);
            collectInitials(p.right, ri, depth);
            // El tick solo se ofrece cuando ambos terminan; en interleave puro
            // sigue la regla "ambos a la vez".
            for (const e of li)
                if (e !== types_1.TICK)
                    out.add(e);
            for (const e of ri)
                if (e !== types_1.TICK)
                    out.add(e);
            if (li.has(types_1.TICK) && ri.has(types_1.TICK))
                out.add(types_1.TICK);
            return;
        }
        case 'sequence': {
            const li = new Set();
            collectInitials(p.left, li, depth);
            for (const e of li) {
                if (e !== types_1.TICK)
                    out.add(e);
            }
            if (li.has(types_1.TICK)) {
                collectInitials(p.right, out, depth);
            }
            return;
        }
        case 'hide': {
            const hidden = new Set(p.events);
            const inner = new Set();
            collectInitials(p.process, inner, depth);
            // Si algún evento oculto está disponible, hay un τ: avanzamos
            // silenciosamente y recolectamos lo que se ofrece desde ahí.
            let progressed = false;
            for (const e of inner) {
                if (hidden.has(e)) {
                    const next = step(p.process, e);
                    if (next) {
                        collectInitials({ kind: 'hide', process: next, events: p.events }, out, depth + 1);
                        progressed = true;
                    }
                }
            }
            // Los eventos no ocultos siguen siendo ofrecidos por la versión actual.
            for (const e of inner) {
                if (!hidden.has(e))
                    out.add(e);
            }
            // Si solo había τ disponibles pero ninguno avanzó (caso raro), no
            // ofrecemos nada visible — equivale a deadlock visible.
            void progressed;
            return;
        }
        case 'rename': {
            const inner = new Set();
            collectInitials(p.process, inner, depth);
            for (const e of inner) {
                if (e === types_1.TICK)
                    out.add(types_1.TICK);
                else
                    out.add(p.mapping.get(e) ?? e);
            }
            return;
        }
        case 'recursion':
            collectInitials(unfoldOnce(p), out, depth + 1);
            return;
        case 'var':
            // Variable libre: no hay nada que ofrecer.
            return;
    }
}
// ── Paso operacional ────────────────────────────────────────
/**
 * `step(P, a)` aplica una transición visible etiquetada con `a` y devuelve
 * el continuante, o `null` si `a` no está habilitado. Para procesos no-
 * deterministas elegimos arbitrariamente cualquier rama que habilite `a`
 * (eso es válido para análisis de trazas; para failures inspeccionamos
 * todas las resoluciones aparte).
 */
function step(p, event) {
    return stepRec(p, event, 0);
}
function stepRec(p, event, depth) {
    if (depth > MAX_UNFOLD_DEPTH)
        return null;
    switch (p.kind) {
        case 'stop':
            return null;
        case 'skip':
            return event === types_1.TICK ? exports.STOP : null;
        case 'prefix':
            return event === p.event ? p.cont : null;
        case 'choice':
        case 'internal': {
            const l = stepRec(p.left, event, depth);
            if (l !== null)
                return l;
            return stepRec(p.right, event, depth);
        }
        case 'parallel': {
            const sync = new Set(p.alphabet);
            if (sync.has(event)) {
                const l = stepRec(p.left, event, depth);
                const r = stepRec(p.right, event, depth);
                if (l === null || r === null)
                    return null;
                return { kind: 'parallel', left: l, right: r, alphabet: p.alphabet };
            }
            const l = stepRec(p.left, event, depth);
            if (l !== null) {
                return { kind: 'parallel', left: l, right: p.right, alphabet: p.alphabet };
            }
            const r = stepRec(p.right, event, depth);
            if (r !== null) {
                return { kind: 'parallel', left: p.left, right: r, alphabet: p.alphabet };
            }
            return null;
        }
        case 'interleave': {
            if (event === types_1.TICK) {
                // Ambos lados deben aceptar ✓ simultáneamente.
                const l = stepRec(p.left, types_1.TICK, depth);
                const r = stepRec(p.right, types_1.TICK, depth);
                if (l === null || r === null)
                    return null;
                return exports.STOP;
            }
            const l = stepRec(p.left, event, depth);
            if (l !== null)
                return { kind: 'interleave', left: l, right: p.right };
            const r = stepRec(p.right, event, depth);
            if (r !== null)
                return { kind: 'interleave', left: p.left, right: r };
            return null;
        }
        case 'sequence': {
            // Si el lado izquierdo puede terminar (ofrece ✓) y aceptamos un
            // evento que sólo está disponible en `right`, transicionamos a `right`.
            const initialsLeft = nextEvents(p.left);
            if (event !== types_1.TICK && initialsLeft.has(event)) {
                const l = stepRec(p.left, event, depth);
                if (l !== null)
                    return { kind: 'sequence', left: l, right: p.right };
            }
            if (initialsLeft.has(types_1.TICK)) {
                // P termina silenciosamente y pasamos a Q.
                return stepRec(p.right, event, depth + 1);
            }
            // Reintento por si el evento existía solo en `left` (sin tick).
            if (event !== types_1.TICK) {
                const l = stepRec(p.left, event, depth);
                if (l !== null)
                    return { kind: 'sequence', left: l, right: p.right };
            }
            return null;
        }
        case 'hide': {
            const hidden = new Set(p.events);
            if (hidden.has(event))
                return null; // los ocultos no son observables
            // Caso 1: el evento es directamente ofrecido por el cuerpo.
            const direct = stepRec(p.process, event, depth);
            if (direct !== null) {
                return { kind: 'hide', process: direct, events: p.events };
            }
            // Caso 2: hay τ pendientes (eventos ocultos disponibles). Los
            // disparamos silenciosamente y reintentamos.
            const inner = nextEvents(p.process);
            for (const eHidden of hidden) {
                if (inner.has(eHidden)) {
                    const after = stepRec(p.process, eHidden, depth);
                    if (after !== null) {
                        const wrapped = { kind: 'hide', process: after, events: p.events };
                        const r = stepRec(wrapped, event, depth + 1);
                        if (r !== null)
                            return r;
                    }
                }
            }
            return null;
        }
        case 'rename': {
            // Encontrar todos los eventos del cuerpo que se renombran a `event`.
            // (Mapping puede ser muchos-a-uno.)
            const sources = [];
            for (const [src, dst] of p.mapping) {
                if (dst === event)
                    sources.push(src);
            }
            // Eventos no listados quedan idénticos: si event ∉ values(mapping)
            // y event ∉ keys(mapping), `event` también es candidato literal.
            const isMappedTarget = sources.length > 0;
            const isMappedSource = p.mapping.has(event);
            if (!isMappedSource)
                sources.push(event);
            for (const src of sources) {
                const r = stepRec(p.process, src, depth);
                if (r !== null) {
                    return { kind: 'rename', process: r, mapping: p.mapping };
                }
            }
            // Cuando `event` es key del mapping pero no value y no calzó nada,
            // efectivamente está bloqueado.
            void isMappedTarget;
            return null;
        }
        case 'recursion':
            return stepRec(unfoldOnce(p), event, depth + 1);
        case 'var':
            return null;
    }
}
/**
 * Enumera todos los estados "estables" alcanzables desde `p` resolviendo
 * elecciones internas (`⊓`) y desplegando recursiones inmediatas, sin
 * consumir eventos visibles. Útil para la semántica de failures, donde
 * el conjunto de refusal depende de QUÉ rama interna se eligió.
 *
 * Devuelve procesos sin un `internal` en la raíz (después de empujarlo
 * hacia adentro de operadores asociativos cuando aplica). El número de
 * resoluciones es 2^(# de internals encadenados), así que limitamos a un
 * número razonable para no explotar.
 */
function internalResolutions(p, limit = 64) {
    const out = [];
    resolveInternal(p, out, limit, 0);
    return out;
}
function resolveInternal(p, out, limit, depth) {
    if (out.length >= limit || depth > MAX_UNFOLD_DEPTH)
        return;
    switch (p.kind) {
        case 'internal':
            resolveInternal(p.left, out, limit, depth);
            resolveInternal(p.right, out, limit, depth);
            return;
        case 'recursion':
            resolveInternal(unfoldOnce(p), out, limit, depth + 1);
            return;
        default:
            out.push(p);
            return;
    }
}
//# sourceMappingURL=semantics.js.map