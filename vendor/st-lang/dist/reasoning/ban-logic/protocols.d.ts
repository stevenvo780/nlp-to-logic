import { key, principal } from './terms';
import type { BANFormula, Protocol } from './types';
/**
 * Needham-Schroeder shared-key (simplificado para BAN).
 *
 * 1. A → S : A, B, N_a
 * 2. S → A : {N_a, K_ab, B, {K_ab, A}_{K_bs}}_{K_as}
 * 3. A → B : {K_ab, A}_{K_bs}
 * 4. B → A : {N_b}_{K_ab}
 * 5. A → B : {N_b - 1}_{K_ab}   (representamos como nonce(N_b'))
 */
export declare function needhamSchroederSymmetric(): Protocol;
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
export declare function needhamSchroederPublicKey(): Protocol;
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
export declare function kerberos(): Protocol;
export declare const protocolUtils: {
    believes: (p: import("./types").BANTerm, f: BANFormula) => BANFormula;
    sharedKey: (a: import("./types").BANTerm, b: import("./types").BANTerm, k: import("./types").BANTerm) => BANFormula;
    publicKey: (p: ReturnType<typeof principal>, k: ReturnType<typeof key>) => BANFormula;
    jurisdiction: (p: import("./types").BANTerm, f: BANFormula) => BANFormula;
    saidMessage: (p: import("./types").BANTerm, w: import("./types").BANTerm) => BANFormula;
    fresh: (w: import("./types").BANTerm) => BANFormula;
    encrypted: (msg: import("./types").BANTerm, k: import("./types").BANTerm) => import("./types").BANTerm;
    sees: (p: import("./types").BANTerm, w: import("./types").BANTerm) => BANFormula;
    message: (...content: import("./types").BANTerm[]) => import("./types").BANTerm;
    nonce: (name: string) => import("./types").BANTerm;
    key: (name: string, shared?: [string, string]) => import("./types").BANTerm;
    principal: (name: string) => import("./types").BANTerm;
    controls: (p: import("./types").BANTerm, f: BANFormula) => BANFormula;
};
//# sourceMappingURL=protocols.d.ts.map