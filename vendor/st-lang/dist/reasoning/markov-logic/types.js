"use strict";
// ============================================================
// Markov Logic Networks — Types
// ============================================================
//
// Una Markov Logic Network (MLN) combina lógica de primer orden
// con redes de Markov. Cada fórmula `F` lleva un peso real `w`.
// La distribución sobre mundos posibles `W` es:
//
//   P(W) = (1/Z) · exp( Σ_i  w_i · n_i(W) )
//
// donde `n_i(W)` cuenta las grounding instances de `F_i` SATISFECHAS
// en `W`. Pesos +∞ equivalen a restricciones duras (hard constraints).
//
// Referencia: Richardson & Domingos, "Markov Logic Networks" (2006).
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map