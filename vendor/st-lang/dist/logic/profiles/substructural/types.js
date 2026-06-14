"use strict";
// ============================================================
// Substructural Logics — Types (Linear + Affine)
// ============================================================
//
// Logicas substructurales (Girard 1987 para Linear Logic, y Affine
// como su variante con weakening) controlan los recursos:
//
//   - Linear:  ni contraction ni weakening. Cada formula del
//              contexto se usa exactamente una vez.
//   - Affine:  weakening permitido (descartar hipotesis), pero NO
//              contraction (no duplicar). Cada formula se usa a lo
//              sumo una vez.
//
// Conectivos del fragmento implementado:
//   ⊗  (tensor)     — conjuncion multiplicativa, recursos juntos
//   ⊸  (lollipop)   — implicacion lineal, consume premisa
//   &  (with)       — conjuncion aditiva, elige uno de dos
//   ⊕  (plus)       — disyuncion aditiva, alguno de los dos
//   1               — unidad multiplicativa de ⊗
//   !  (bang)       — exponencial "of course", habilita contraction
//                     y weakening para el sub-recurso marcado
//   ?  (whynot)     — exponencial dual del bang (presente como
//                     constructor; en el fragmento intuicionista
//                     fragmentario no se utiliza en reglas activas)
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map