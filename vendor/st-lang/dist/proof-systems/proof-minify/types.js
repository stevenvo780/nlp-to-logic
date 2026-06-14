"use strict";
// ============================================================
// ST Proof Minification — Tipos públicos
// ============================================================
//
// Representación genérica de un árbol de prueba que sirve tanto para
// natural deduction (intro/elim), cálculo de secuentes (G3, cut),
// resolución, paso modus-ponens encadenado, etc. La idea es que el
// reductor sea agnóstico al perfil lógico y opere sobre la estructura
// `(conclusion, rule, premises)` con strings textuales.
//
// El minificador NO valida que la prueba sea correcta — asume que el
// input ya es válido y se limita a aplicar transformaciones que
// preservan la conclusión y la corrección del árbol.
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map