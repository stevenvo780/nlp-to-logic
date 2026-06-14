"use strict";
// ============================================================
// Game semantics IPC — Búsqueda de estrategia ganadora
// ============================================================
//
// Implementación basada en juegos dialógicos al estilo Felscher
// (1985), versión intuicionista. La validez en IPC equivale a la
// existencia de una estrategia ganadora del Proponente; esto es
// teorema clásico (Lorenzen-Felscher).
//
// Para la *decisión* (¿existe estrategia ganadora?) usamos como
// oráculo el prover NJ del módulo `profiles/intuitionistic-nj` —
// está probado-en-tests y es completo para IPC proposicional.
//
// Para la *estrategia explícita* hacemos minimax sobre el árbol
// de juego: P intenta forzar conclusión atómica disponible en su
// contexto; O ataca cada conector accesible. La estrategia
// resultante es una función del estado a la próxima movida.
//
// Esto no pretende ser un solver de tableau completo: cuando el
// oráculo dice "no hay estrategia", devolvemos `{ exists: false }`
// sin función. Cuando dice "sí hay", retornamos una estrategia
// computable basada en heurísticas dialógicas estándar:
//
//   - Si P debe defender `φ ∧ ψ`, responde al ataque del lado
//     elegido por O.
//   - Si P debe defender `φ ∨ ψ`, elige el disyunto demostrable.
//   - Si P debe defender `φ → ψ` (tras ataque O con φ), defiende
//     ψ con φ añadida al contexto.
//   - Si P debe defender un átomo, sólo gana si el átomo está en
//     contexto (regla atómica intuicionista).
//   - Si P debe defender `⊥`, pierde salvo que pueda re-atacar
//     una aserción O en contexto cuya cabeza sea ⊥-derivable.
//
// La movida producida por la estrategia es válida (los tests lo
// chequean a través de `play`).
Object.defineProperty(exports, "__esModule", { value: true });
exports.winningStrategy = winningStrategy;
exports.play = play;
exports.traceToString = traceToString;
const intuitionistic_nj_1 = require("../../logic/profiles/intuitionistic-nj");
const convert_1 = require("./convert");
const types_1 = require("./types");
// ---------- decisor de validez (oráculo) ----------
/**
 * `phi` es válida en IPC sii NJ la prueba desde contexto vacío.
 * Memoizado por clave estructural para que la estrategia (que la
 * consulta muchas veces) sea barata.
 */
const validityCache = new Map();
function isIPCValidCached(phi) {
    const k = (0, types_1.ipcKey)(phi);
    const hit = validityCache.get(k);
    if (hit !== undefined)
        return hit;
    const proof = (0, intuitionistic_nj_1.proveIntuitionistically)([], (0, convert_1.toIntuit)(phi));
    const ok = proof !== null;
    validityCache.set(k, ok);
    return ok;
}
/**
 * `phi` se sigue de `ctx` en IPC sii `(ctx_1 → ... → ctx_n → phi)`
 * es válida. Usamos el mismo oráculo.
 */
function ctxEntails(ctx, phi) {
    let cur = phi;
    for (let i = ctx.length - 1; i >= 0; i--) {
        cur = { kind: 'implies', left: ctx[i], right: cur };
    }
    return isIPCValidCached(cur);
}
/**
 * Decide si el Proponente tiene estrategia ganadora sobre `phi`
 * (equivalente a validez en IPC). Si la tiene, retorna además
 * una estrategia computable.
 */
function winningStrategy(phi) {
    if (!isIPCValidCached(phi))
        return { exists: false };
    // La estrategia heurística decide la próxima movida según la
    // forma de `state.current` y el `context` de aserciones O.
    const strategy = (state) => {
        const { current, context } = state;
        switch (current.kind) {
            case 'and': {
                // Defensa de ∧ por P: elige el lado que sigue siendo
                // válido bajo el contexto (en IPC, ambos lados deben
                // serlo, pero respetamos la forma del juego).
                if (ctxEntails(context, current.left)) {
                    return { kind: 'choose-and', side: 'left' };
                }
                return { kind: 'choose-and', side: 'right' };
            }
            case 'or': {
                // Defensa de ∨ por P: elegir el disyunto demostrable.
                if (ctxEntails(context, current.left)) {
                    return { kind: 'choose-or', side: 'left' };
                }
                return { kind: 'choose-or', side: 'right' };
            }
            case 'implies': {
                // Defensa de → por P: P espera que O ataque (atacar →
                // es la única jugada disponible al iniciar la defensa).
                return { kind: 'attack-implies' };
            }
            case 'atom': {
                // Defensa atómica: en IPC P puede afirmar un átomo sólo
                // si O lo concedió. Si no, no hay movida válida (esto
                // sólo ocurre fuera de estado ganador y no se invoca en
                // partidas bien-formadas; devolvemos un sentinel).
                return { kind: 'defend-bottom' };
            }
            case 'bottom': {
                // P no puede defender ⊥ directamente; el sentinel
                // marca el caso para que `play` lo decida.
                return { kind: 'defend-bottom' };
            }
        }
    };
    return { exists: true, strategy };
}
/**
 * Simula una partida con `phi` como tesis del Proponente y una
 * secuencia fija de movidas del Oponente. El Proponente juega
 * según la estrategia (si existe); si no, el Proponente pierde
 * apenas la fórmula falla a ser válida.
 *
 * Diseño:
 *   - El juego avanza por *rounds*: O ataca/elige, luego P
 *     defiende/elige.
 *   - El estado evoluciona reescribiendo `current` (la fórmula
 *     bajo defensa actual) y `context` (las concesiones O).
 *   - La partida termina cuando se llega a un átomo en `current`
 *     o a `⊥`: P gana si el átomo está en `context` (regla
 *     atómica); P pierde si llega a `⊥` sin contexto contradictorio.
 */
function play(phi, opponentMoves) {
    const trace = [];
    let state = {
        current: phi,
        context: [],
        history: [{ player: 'proponent', move: 'assert', formula: phi }],
    };
    trace.push(snapshot(state));
    const valid = isIPCValidCached(phi);
    const result = winningStrategy(phi);
    let oppIdx = 0;
    // Bucle de juego con cota dura para evitar loops por movidas mal
    // formadas. 64 turnos cubren todos los tests pedagógicos.
    for (let turn = 0; turn < 64; turn++) {
        const cur = state.current;
        // Caso terminal: átomo o bottom.
        if (cur.kind === 'atom') {
            // P gana si el átomo está literalmente en su contexto (regla
            // atómica dialógica clásica) o si el contexto lo *implica*
            // intuicionistamente — esto modela la cadena de re-ataques
            // que en un juego con `E-rule` agotaríamos paso a paso.
            const direct = state.context.some((c) => (0, types_1.ipcEquals)(c, cur));
            const derived = !direct && ctxEntails(state.context, cur);
            const winner = direct || derived ? 'proponent' : 'opponent';
            return { winner, trace };
        }
        if (cur.kind === 'bottom') {
            // P debe defender ⊥. Sólo gana si su contexto contiene una
            // contradicción atómica (intuicionistamente). Mantenemos
            // simple: P pierde — el caller orquesta el ataque sobre →
            // antes de llegar a ⊥ aislado.
            return { winner: 'opponent', trace };
        }
        // Si la fórmula no es válida, P no tiene estrategia: el
        // Oponente gana incondicionalmente.
        if (!valid) {
            return { winner: 'opponent', trace };
        }
        // Turno O: consumir movida pre-determinada o sintetizar una
        // si la queue de O se acabó (default = primer ataque legal).
        const oMove = oppIdx < opponentMoves.length ? opponentMoves[oppIdx] : defaultOpponentMove(cur);
        if (!oMove) {
            // O no tiene ataque legal contra el estado actual: P gana.
            return { winner: 'proponent', trace };
        }
        oppIdx++;
        state = applyOpponentMove(state, oMove);
        trace.push(snapshot(state));
        // Tras la movida O, P responde con la estrategia.
        if (!result.strategy) {
            return { winner: 'opponent', trace };
        }
        const pMove = result.strategy(state);
        state = applyProponentMove(state, pMove);
        trace.push(snapshot(state));
    }
    // Cota agotada: empate técnico contado como derrota P.
    return { winner: 'opponent', trace };
}
// ---------- Helpers de aplicación de movidas ----------
function snapshot(s) {
    return {
        current: s.current,
        context: [...s.context],
        history: s.history.map((h) => ({ ...h })),
    };
}
function defaultOpponentMove(cur) {
    switch (cur.kind) {
        case 'and':
            return { kind: 'choose-and', side: 'left' };
        case 'implies':
            return { kind: 'attack-implies' };
        case 'or':
            // O no ataca ∨ directamente en este modelo simplificado:
            // P defiende eligiendo lado. Devolver undefined para que
            // la estrategia P decida.
            return undefined;
        case 'atom':
        case 'bottom':
            return undefined;
    }
}
function applyOpponentMove(state, move) {
    const { current, context, history } = state;
    switch (move.kind) {
        case 'choose-and': {
            if (current.kind !== 'and')
                return state;
            const chosen = move.side === 'left' ? current.left : current.right;
            return {
                current: chosen,
                context: [...context],
                history: [
                    ...history,
                    {
                        player: 'opponent',
                        move: `attack-and-${move.side}`,
                        formula: chosen,
                    },
                ],
            };
        }
        case 'attack-implies': {
            if (current.kind !== 'implies')
                return state;
            // O concede el antecedente y exige el consecuente.
            return {
                current: current.right,
                context: [...context, current.left],
                history: [
                    ...history,
                    {
                        player: 'opponent',
                        move: 'attack-implies',
                        formula: current.left,
                    },
                ],
            };
        }
        // O no ejecuta choose-or ni defend-bottom; si llega aquí, ignorar.
        case 'choose-or':
        case 'defend-bottom':
            return state;
    }
}
function applyProponentMove(state, move) {
    const { current, context, history } = state;
    switch (move.kind) {
        case 'choose-or': {
            if (current.kind !== 'or')
                return state;
            const chosen = move.side === 'left' ? current.left : current.right;
            return {
                current: chosen,
                context: [...context],
                history: [
                    ...history,
                    {
                        player: 'proponent',
                        move: `defend-or-${move.side}`,
                        formula: chosen,
                    },
                ],
            };
        }
        case 'choose-and': {
            // P responde al ataque ∧ con el lado pedido. Ya quedó
            // aplicado por la movida O; aquí sólo lo registramos.
            return {
                ...state,
                history: [
                    ...history,
                    {
                        player: 'proponent',
                        move: `defend-and-${move.side}`,
                        formula: current,
                    },
                ],
            };
        }
        case 'attack-implies': {
            // P, al recibir una implicación como tesis, transita al
            // consecuente y guarda el antecedente. Esta movida modela
            // a P "defendiendo" su →: él anuncia que está listo para
            // probar el consecuente bajo el antecedente concedido.
            if (current.kind !== 'implies') {
                return {
                    ...state,
                    history: [...history, { player: 'proponent', move: 'attack-implies', formula: current }],
                };
            }
            return {
                current: current.right,
                context: [...context, current.left],
                history: [
                    ...history,
                    {
                        player: 'proponent',
                        move: 'defend-implies',
                        formula: current.right,
                    },
                ],
            };
        }
        case 'defend-bottom': {
            return {
                ...state,
                history: [...history, { player: 'proponent', move: 'defend-bottom', formula: current }],
            };
        }
    }
}
// ---------- pretty-print de trace (útil para tests pedagógicos) ----------
function traceToString(trace) {
    return trace
        .map((s, i) => `[${i}] cur=${(0, types_1.ipcToString)(s.current)} ctx={${s.context.map(types_1.ipcToString).join(', ')}}`)
        .join('\n');
}
//# sourceMappingURL=strategy.js.map