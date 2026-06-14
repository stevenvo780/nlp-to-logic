"use strict";
// ============================================================
// BAN Logic — Catálogo de protocolos
// ============================================================
//
// Protocolos clásicos modelados en estilo BAN para validar el motor.
//
// - Needham-Schroeder symmetric (1978): autenticación basada en
//   servidor de confianza. BAN-correcto bajo assumptions estándar
//   (frescura de los nonces).
//
// - Needham-Schroeder public-key (1978): el famoso protocolo con
//   el "Lowe attack" (1995). Sin las correcciones de Lowe, NO logra
//   autenticar B con A (deja un goal sin probar). Lo modelamos así
//   para que `analyzeProtocol` lo refleje.
//
// - Kerberos (variant clásica simplificada): cliente C, servidor S
//   con la KDC, autenticación mutua.
Object.defineProperty(exports, "__esModule", { value: true });
exports.protocolUtils = void 0;
exports.needhamSchroederSymmetric = needhamSchroederSymmetric;
exports.needhamSchroederPublicKey = needhamSchroederPublicKey;
exports.kerberos = kerberos;
const terms_1 = require("./terms");
/**
 * Needham-Schroeder shared-key (simplificado para BAN).
 *
 * 1. A → S : A, B, N_a
 * 2. S → A : {N_a, K_ab, B, {K_ab, A}_{K_bs}}_{K_as}
 * 3. A → B : {K_ab, A}_{K_bs}
 * 4. B → A : {N_b}_{K_ab}
 * 5. A → B : {N_b - 1}_{K_ab}   (representamos como nonce(N_b'))
 */
function needhamSchroederSymmetric() {
    const A = (0, terms_1.principal)('A');
    const B = (0, terms_1.principal)('B');
    const S = (0, terms_1.principal)('S');
    const N_a = (0, terms_1.nonce)('N_a');
    const N_b = (0, terms_1.nonce)('N_b');
    const N_b_prime = (0, terms_1.nonce)("N_b'");
    const K_ab = (0, terms_1.key)('K_ab', ['A', 'B']);
    const K_as = (0, terms_1.key)('K_as', ['A', 'S']);
    const K_bs = (0, terms_1.key)('K_bs', ['B', 'S']);
    // Goal final: A cree que B cree K_ab (autenticación mutua de la clave).
    const goal1 = (0, terms_1.believes)(A, (0, terms_1.believes)(B, (0, terms_1.sharedKey)(A, B, K_ab)));
    const goal2 = (0, terms_1.believes)(B, (0, terms_1.believes)(A, (0, terms_1.sharedKey)(A, B, K_ab)));
    return {
        name: 'Needham-Schroeder-symmetric',
        participants: ['A', 'B', 'S'],
        initialAssumptions: [
            // Claves compartidas con S.
            (0, terms_1.believes)(A, (0, terms_1.sharedKey)(A, S, K_as)),
            (0, terms_1.believes)(B, (0, terms_1.sharedKey)(B, S, K_bs)),
            (0, terms_1.believes)(S, (0, terms_1.sharedKey)(A, S, K_as)),
            (0, terms_1.believes)(S, (0, terms_1.sharedKey)(B, S, K_bs)),
            // S decide la clave (jurisdicción).
            (0, terms_1.believes)(A, (0, terms_1.controls)(S, (0, terms_1.sharedKey)(A, B, K_ab))),
            (0, terms_1.believes)(B, (0, terms_1.controls)(S, (0, terms_1.sharedKey)(A, B, K_ab))),
            // S cree la clave que él mismo emite.
            (0, terms_1.believes)(S, (0, terms_1.sharedKey)(A, B, K_ab)),
            // Frescuras.
            (0, terms_1.believes)(A, (0, terms_1.fresh)(N_a)),
            (0, terms_1.believes)(B, (0, terms_1.fresh)(N_b)),
            (0, terms_1.believes)(S, (0, terms_1.fresh)(K_ab)),
            (0, terms_1.believes)(A, (0, terms_1.fresh)(K_ab)),
            // En el handshake nonce N_b, A confirma que sigue vivo. Para que
            // B termine creyendo K_ab cree A, B asume frescura de la sesión
            // como sigue:
            (0, terms_1.believes)(B, (0, terms_1.fresh)(N_b_prime)),
        ],
        steps: [
            // Idealización paso 2: S → A : { N_a, K_ab, A↔K_ab B }_{K_as}
            {
                from: 'S',
                to: 'A',
                message: (0, terms_1.encrypted)((0, terms_1.message)(N_a, K_ab), K_as),
            },
            // Idealización paso 3: A → B : { K_ab, A↔K_ab B }_{K_bs}
            {
                from: 'A',
                to: 'B',
                message: (0, terms_1.encrypted)(K_ab, K_bs),
            },
            // Idealización paso 4: B → A : { N_b, A↔K_ab B }_{K_ab}
            {
                from: 'B',
                to: 'A',
                message: (0, terms_1.encrypted)((0, terms_1.message)(N_b), K_ab),
            },
            // Idealización paso 5: A → B : { N_b', A↔K_ab B }_{K_ab}
            {
                from: 'A',
                to: 'B',
                message: (0, terms_1.encrypted)((0, terms_1.message)(N_b_prime), K_ab),
            },
        ],
        goals: [goal1, goal2],
    };
}
/**
 * Needham-Schroeder public-key (Lowe attack territory).
 *
 * Original:
 *   1. A → B : {N_a, A}_{K_b}
 *   2. B → A : {N_a, N_b}_{K_a}
 *   3. A → B : {N_b}_{K_b}
 *
 * El "Lowe attack" (1995) muestra que un atacante M puede intercalar
 * y hacer creer a B que está hablando con A cuando en realidad A
 * habla con M. Modelamos el protocolo TAL CUAL, sin la corrección
 * de Lowe; el resultado: el goal "B|≡A|≡(sesión con B)" NO se
 * deriva.
 */
function needhamSchroederPublicKey() {
    const A = (0, terms_1.principal)('A');
    const B = (0, terms_1.principal)('B');
    const N_a = (0, terms_1.nonce)('N_a');
    const N_b = (0, terms_1.nonce)('N_b');
    // Claves públicas modeladas como `key` con shared = [owner, owner]
    // como hack mnemotécnico; el motor usa `publicKey` para R2.
    const K_a = (0, terms_1.key)('K_a');
    const K_b = (0, terms_1.key)('K_b');
    // En BAN original con Lowe: el goal de B "A cree que está hablando
    // con B" no se cumple sin Lowe-fix. Lo dejamos como goal para que el
    // análisis lo reporte como UNSATISFIED.
    const goalA = (0, terms_1.believes)(A, (0, terms_1.believes)(B, (0, terms_1.sees)(B, N_a)));
    const goalB = (0, terms_1.believes)(B, (0, terms_1.believes)(A, (0, terms_1.sees)(A, N_b)));
    return {
        name: 'Needham-Schroeder-public-key',
        participants: ['A', 'B'],
        initialAssumptions: [
            // Nadie comparte secret state inicial real con el otro; solo PKs.
            // Modelamos como sharedKey "público" para R1 (BAN no distingue
            // semánticamente shared vs public para el análisis de pares).
            (0, terms_1.believes)(A, { kind: 'publicKey', principal: B, key: K_b }),
            (0, terms_1.believes)(B, { kind: 'publicKey', principal: A, key: K_a }),
            (0, terms_1.believes)(A, (0, terms_1.fresh)(N_a)),
            (0, terms_1.believes)(B, (0, terms_1.fresh)(N_b)),
        ],
        steps: [
            // 1. A → B : {N_a, A}_{K_b}
            { from: 'A', to: 'B', message: (0, terms_1.encrypted)((0, terms_1.message)(N_a, A), K_b) },
            // 2. B → A : {N_a, N_b}_{K_a}   ← OJO: NO incluye B (origen del Lowe attack)
            { from: 'B', to: 'A', message: (0, terms_1.encrypted)((0, terms_1.message)(N_a, N_b), K_a) },
            // 3. A → B : {N_b}_{K_b}
            { from: 'A', to: 'B', message: (0, terms_1.encrypted)(N_b, K_b) },
        ],
        goals: [goalA, goalB],
    };
}
/**
 * Kerberos (simplificación BAN).
 *
 * 1. C → S : C, T, N_c
 * 2. S → C : {N_c, T_C, K_ct}_{K_cs}, {C, T_C, K_ct}_{K_ts}
 * 3. C → T : {C, T_C, K_ct}_{K_ts}, {C, t}_{K_ct}
 * 4. T → C : {t + 1}_{K_ct}
 *
 * Goal: C cree que T comparte K_ct con C; T cree lo mismo.
 */
function kerberos() {
    const C = (0, terms_1.principal)('C');
    const T = (0, terms_1.principal)('T');
    const S = (0, terms_1.principal)('S');
    const N_c = (0, terms_1.nonce)('N_c');
    const t = (0, terms_1.nonce)('t');
    const K_cs = (0, terms_1.key)('K_cs', ['C', 'S']);
    const K_ts = (0, terms_1.key)('K_ts', ['T', 'S']);
    const K_ct = (0, terms_1.key)('K_ct', ['C', 'T']);
    const goalC = (0, terms_1.believes)(C, (0, terms_1.sharedKey)(C, T, K_ct));
    const goalT = (0, terms_1.believes)(T, (0, terms_1.sharedKey)(C, T, K_ct));
    return {
        name: 'Kerberos',
        participants: ['C', 'T', 'S'],
        initialAssumptions: [
            (0, terms_1.believes)(C, (0, terms_1.sharedKey)(C, S, K_cs)),
            (0, terms_1.believes)(T, (0, terms_1.sharedKey)(T, S, K_ts)),
            (0, terms_1.believes)(S, (0, terms_1.sharedKey)(C, S, K_cs)),
            (0, terms_1.believes)(S, (0, terms_1.sharedKey)(T, S, K_ts)),
            (0, terms_1.believes)(C, (0, terms_1.controls)(S, (0, terms_1.sharedKey)(C, T, K_ct))),
            (0, terms_1.believes)(T, (0, terms_1.controls)(S, (0, terms_1.sharedKey)(C, T, K_ct))),
            (0, terms_1.believes)(S, (0, terms_1.sharedKey)(C, T, K_ct)),
            (0, terms_1.believes)(C, (0, terms_1.fresh)(N_c)),
            (0, terms_1.believes)(T, (0, terms_1.fresh)(t)),
            (0, terms_1.believes)(C, (0, terms_1.fresh)(K_ct)),
            (0, terms_1.believes)(T, (0, terms_1.fresh)(K_ct)),
        ],
        steps: [
            // 2. S → C : { N_c, K_ct }_{K_cs}
            { from: 'S', to: 'C', message: (0, terms_1.encrypted)((0, terms_1.message)(N_c, K_ct), K_cs) },
            // 3. C → T : { C, K_ct }_{K_ts}
            { from: 'C', to: 'T', message: (0, terms_1.encrypted)((0, terms_1.message)(C, K_ct), K_ts) },
            // 3b. C → T : { t }_{K_ct}
            { from: 'C', to: 'T', message: (0, terms_1.encrypted)(t, K_ct) },
        ],
        goals: [goalC, goalT],
    };
}
// Exports de utilidades para referencia rápida en tests:
exports.protocolUtils = {
    believes: terms_1.believes,
    sharedKey: terms_1.sharedKey,
    publicKey: (p, k) => ({
        kind: 'publicKey',
        principal: p,
        key: k,
    }),
    jurisdiction: terms_1.jurisdiction,
    saidMessage: terms_1.saidMessage,
    fresh: terms_1.fresh,
    encrypted: terms_1.encrypted,
    sees: terms_1.sees,
    message: terms_1.message,
    nonce: terms_1.nonce,
    key: terms_1.key,
    principal: terms_1.principal,
    controls: terms_1.controls,
};
//# sourceMappingURL=protocols.js.map