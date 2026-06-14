"use strict";
// ============================================================
// BAN Logic — Tipos públicos
// ============================================================
//
// Burrows-Abadi-Needham logic (1989): cálculo modal de creencias para
// análisis de protocolos criptográficos de autenticación.
//
// Símbolos (notación estándar BAN):
//
//   P |≡ X      "P believes X"               P cree X
//   P ◁  X      "P sees X"                   P ve X (recibió un mensaje con X)
//   P |~ X      "P once said X"              P dijo X alguna vez
//   P |⇒ X      "P has jurisdiction over X"  P es autoridad sobre X
//   #(X)        "fresh X"                    X es fresco (nonce reciente)
//   P ↔K Q      "K is shared between P, Q"   K es clave compartida
//   |→K P       "K is public key for P"      K es la clave pública de P
//   P ⇌X Q      "X is shared secret"         X es un secreto compartido
//   {X}_K       "X encrypted with K"         X cifrado con K
//   <X>_Y       "X combined with secret Y"   X concatenado con secreto Y
//   H(X)        "hash of X"                  hash de X
//
// Reglas de inferencia clásicas (10): message-meaning (3 variantes:
// shared-key, public-key, shared-secret), nonce-verification,
// jurisdiction, freshness propagation, belief conjunction, seeing rules.
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map