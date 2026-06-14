"use strict";
// Tipos públicos del solver CDCL incremental.
//
// La diferencia conceptual con `solveCDCLv2` (one-shot) es que aquí el solver
// es un objeto vivo: se le agregan cláusulas, se llama `solve()` varias veces,
// y mantiene su pool de cláusulas aprendidas + heurísticas entre llamadas.
//
// Los `assumptions` son literales que se asumen `true` para una única query.
// Si la query es UNSAT bajo esas asumptions, se devuelve el subconjunto
// `failedAssumptions` que causó el conflicto (subset minimal del prefix
// derivado en O(|trail|)). Eso es la base de MUS extraction y debugging.
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map