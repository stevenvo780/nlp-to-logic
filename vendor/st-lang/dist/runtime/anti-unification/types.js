"use strict";
// ============================================================
// ST Anti-Unification — Tipos públicos
// ============================================================
//
// Anti-unification (también: lgg = least general generalization,
// most-specific generalization) es el dual de la unificación.
//
// Dados dos términos t1, t2, calcula el TERM más específico g
// tal que existen sustituciones σ1, σ2 con:
//
//   σ1(g) = t1      y      σ2(g) = t2
//
// Aplicaciones:
//   - Machine learning de patrones (Plotkin 1970, Reynolds 1970).
//   - Descubrimiento de generalizations en demostraciones.
//   - Inducción por ejemplo en programación lógica.
//   - Síntesis de lemas en sistemas de prueba.
//
// La firma del módulo usa un Term ligeramente más expresivo que
// term-rewriting/types.ts: admite `const` explícitamente además
// de `var` y `func`. En la práctica `const` es azúcar para `func`
// con `args: []`, pero se mantiene como kind separado por claridad
// pedagógica (el módulo es referenciado desde ejemplos educativos).
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map