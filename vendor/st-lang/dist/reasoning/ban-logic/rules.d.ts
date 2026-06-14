import type { BANFormula } from './types';
/**
 * R1 — Message-meaning (shared key).
 *
 * Si P cree A↔K B y P ve {X}_K, entonces P cree que A dijo X
 * (asumiendo P ≠ originador, y la clave es genuinamente compartida
 * solo entre A y B + posibles autoridades).
 *
 * Devuelve la primera derivación posible o null. La variante que enumera
 * TODAS está en `saturate()`.
 */
export declare function applyMessageMeaningShared(state: ReadonlyArray<BANFormula>, beliefP: BANFormula): BANFormula | null;
/**
 * R2 — Message-meaning (public key).
 *
 * Si P cree |→K Q y P ve {X}_{K^-1} (cifrado con la clave privada de Q),
 * entonces P cree que Q dijo X.
 *
 * Modelo: tratamos `encrypted(X, privateKey_Q)` como "Q firmó X".
 * Convención de naming: si la clave pública se llama K, la privada
 * compartirá el nombre con sufijo "_inv" o es identificable porque
 * el atributo `shared` corresponde a Q.
 *
 * Para simplificar el motor, modelamos firma como `encrypted(X, K)` donde
 * K es la clave pública y publicKey(Q, K). El "sentido directo" en
 * la verdad: solo Q pudo haber producido ese ciphertext porque solo
 * Q tiene la inversa. Así que la regla R2 dice: si P|≡|→K Q y P◁{X}_K
 * entonces P|≡ Q|~ X. Esto es la versión "firma con clave pública".
 */
export declare function applyMessageMeaningPublic(state: ReadonlyArray<BANFormula>, beliefP: BANFormula): BANFormula | null;
/**
 * R3 — Message-meaning (shared secret).
 *
 * Si P cree A⇌Y B y P ve un mensaje compound que combina X con Y
 * (modelo `compound([X, Y])`), entonces P cree que A dijo X.
 */
export declare function applyMessageMeaningSecret(state: ReadonlyArray<BANFormula>, beliefP: BANFormula): BANFormula | null;
/**
 * R4 — Nonce-verification.
 *
 * Si P cree que X es fresco y P cree que Q dijo X, entonces P cree
 * que Q realmente cree X (porque sólo lo pudo haber dicho recientemente).
 */
export declare function applyNonceVerification(state: ReadonlyArray<BANFormula>, beliefP: BANFormula): BANFormula | null;
/**
 * R5 — Jurisdiction.
 *
 * Si P cree que Q tiene jurisdicción sobre X (P|≡ Q|⇒ X) y P cree
 * que Q cree X (P|≡ Q|≡ X), entonces P cree X.
 */
export declare function applyJurisdiction(state: ReadonlyArray<BANFormula>, beliefP: BANFormula): BANFormula | null;
/**
 * R10 — Seeing encrypted: si P tiene la clave, ver {X}_K implica ver X.
 */
export declare function applySeeingEncrypted(state: ReadonlyArray<BANFormula>, beliefP: BANFormula): BANFormula | null;
/**
 * Decomposición de "ver compound": P ◁ <X1,...,Xn>  ⇒  P ◁ Xi  (todos).
 * Devuelve la primera Xi que NO esté ya en state (para evitar duplicados).
 */
export declare function applySeesCompound(state: ReadonlyArray<BANFormula>, beliefP: BANFormula): BANFormula | null;
/**
 * Belief-conjunction descomposición.
 */
export declare function applyBeliefConjunction(beliefP: BANFormula): BANFormula | null;
export declare function applyBeliefConjunctionRight(beliefP: BANFormula): BANFormula | null;
/**
 * Said-conjunction descomposición.
 */
export declare function applySaidConjunction(beliefP: BANFormula): BANFormula | null;
/**
 * Propagación de frescura: si P|≡#X y X aparece dentro de un compound C
 * que está en state, entonces P|≡#C.
 */
export declare function applyFreshnessPropagation(state: ReadonlyArray<BANFormula>, beliefP: BANFormula): BANFormula | null;
export declare const RULES_REGISTRY: {
    readonly R1_messageMeaningShared: typeof applyMessageMeaningShared;
    readonly R2_messageMeaningPublic: typeof applyMessageMeaningPublic;
    readonly R3_messageMeaningSecret: typeof applyMessageMeaningSecret;
    readonly R4_nonceVerification: typeof applyNonceVerification;
    readonly R5_jurisdiction: typeof applyJurisdiction;
    readonly R10_seeingEncrypted: typeof applySeeingEncrypted;
};
//# sourceMappingURL=rules.d.ts.map