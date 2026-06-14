"use strict";
// ============================================================
// ST Abduction — Tipos públicos
// ============================================================
//
// Razonamiento abductivo (Peirce 1903; Reiter 1987): dado un
// background knowledge KB y una observación O, encontrar
// hipótesis H ⊆ Abducibles tal que:
//
//   1. KB ∪ H ⊨ O       (la hipótesis explica la observación)
//   2. KB ∪ H consistent (la hipótesis es compatible con KB)
//   3. H es minimal (no hay H' ⊂ H que cumpla 1 y 2)
//
// Usos típicos:
//   - Diagnóstico (¿qué fallas explican estos síntomas?)
//   - Inferencia best-fit (la hipótesis más simple/barata gana)
//   - Generación de explicaciones (debugging de cadenas causales)
//
// El espacio de hipótesis se enumera sobre 2^|abducibles|. Para
// |abducibles| ≲ 16 la enumeración exhaustiva es viable. Para más
// grande, conviene un oráculo SAT incremental.
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map