"use strict";
// ============================================================
// CSP Hoare — Tipos del cálculo de procesos secuenciales comunicantes
// ============================================================
// Comunicating Sequential Processes (Hoare 1978/1985): procesos que
// se sincronizan mediante eventos atómicos compartidos. Diferente del
// π-cálculo: los eventos NO transportan valores; lo que importa es la
// ocurrencia sincronizada del nombre.
//
// Operadores estándar:
//   STOP            — proceso muerto, no acepta nada.
//   SKIP            — termina exitosamente (evento ✓ implícito).
//   a → P           — prefijo: ejecuta el evento `a`, luego se comporta como P.
//   P □ Q           — elección externa: el entorno decide entre los primeros
//                     eventos ofrecidos por P y Q.
//   P ⊓ Q           — elección interna: el proceso decide; el entorno solo
//                     ve el resultado. Introduce no-determinismo.
//   P |[A]| Q       — paralelo sincronizado: los eventos en A deben darse en
//                     ambos lados simultáneamente; los demás se entrelazan.
//   P ||| Q         — entrelazado puro (paralelo con alfabeto vacío).
//   P ; Q           — composición secuencial: Q comienza cuando P termina (SKIP).
//   P \ A           — ocultación: los eventos en A se vuelven internos (τ).
//   P[f]            — renombrado funcional de eventos.
//   μ X . P         — recursión: el proceso se reescribe a sí mismo.
//   X               — variable de proceso (referencia a μ).
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.TICK = void 0;
/** Evento especial que marca la terminación exitosa (✓ / "tick"). */
exports.TICK = '✓';
//# sourceMappingURL=types.js.map