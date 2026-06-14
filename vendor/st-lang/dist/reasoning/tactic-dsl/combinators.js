"use strict";
// ============================================================
// Tactic DSL — combinators
// ============================================================
//
// seq / orElse / repeat_ / tryAlt: combinadores estándar al estilo
// Coq/Ltac. Operan sobre Tactic = (state) => state, lanzando
// TacticError para señalizar falla.
//
// Nota sobre el nombre `seq`: la API conceptual de Lean/Coq usa el
// nombre `then` o `;`. NO podemos exportar un símbolo top-level
// llamado `then` desde un módulo ESM porque el bundler de vitest
// trata al namespace del módulo como un thenable y cuelga el import.
// Por compatibilidad con la documentación del DSL, el index re-expone
// `seq` también bajo el alias `then` vía objeto namespace (ver
// `tactics` exportado desde index.ts).
Object.defineProperty(exports, "__esModule", { value: true });
exports.seq = seq;
exports.orElse = orElse;
exports.repeat_ = repeat_;
exports.tryAlt = tryAlt;
const types_1 = require("./types");
// ---------- seq ----------
// Aplica los tactics en secuencia. Si alguno falla, propaga el error
// (estado intermedio descartado). Equivalente a `then` en Coq.
function seq(...tactics) {
    return (state) => {
        let cur = state;
        for (const t of tactics) {
            cur = t(cur);
        }
        return cur;
    };
}
// ---------- orElse ----------
// Devuelve el resultado del primer tactic que no lanza. Si todos
// fallan, lanza TacticError con el último mensaje.
function orElse(...tactics) {
    return (state) => {
        let lastErr = null;
        for (const t of tactics) {
            try {
                return t(state);
            }
            catch (e) {
                if (e instanceof Error) {
                    lastErr = e;
                    continue;
                }
                throw e;
            }
        }
        throw new types_1.TacticError('orElse', `todas las alternativas fallaron${lastErr ? `: ${lastErr.message}` : ''}`);
    };
}
// ---------- repeat_ ----------
// Aplica `t` mientras pueda. Detiene cuando lanza o cuando alcanza
// `max` iteraciones (default 100). Nunca falla: si t no aplica ni
// una vez, devuelve el estado original.
function repeat_(t, max = 100) {
    return (state) => {
        let cur = state;
        let i = 0;
        while (i < max) {
            let next;
            try {
                next = t(cur);
            }
            catch {
                return cur;
            }
            // Guard contra punto fijo: si el estado no cambia (mismas goals + history),
            // paramos para evitar bucles tipo `repeat_(trivial())` cuando el goal ya
            // está cerrado.
            if (next === cur)
                return cur;
            if (next.done)
                return next;
            cur = next;
            i++;
        }
        return cur;
    };
}
// ---------- tryAlt ----------
// Aplica `t` ignorando la falla. Util para "intenta esto, sigue
// adelante si no aplica". Nombre `tryAlt` por colisión con keyword.
function tryAlt(t) {
    return (state) => {
        try {
            return t(state);
        }
        catch {
            return state;
        }
    };
}
//# sourceMappingURL=combinators.js.map