"use strict";
/**
 * MDX bridge — tipos públicos para conversión bidireccional Claim[] ↔ MDX.
 *
 * Una Claim se serializa en MDX con dos formatos posibles:
 *
 *   1. "comment" (compacto, una sola línea, atributos HTML):
 *      <!-- st:claim id="c1" profile="classical.propositional" formula="A->B" deps="c0" -->
 *
 *   2. "fence" (legible, multi-línea):
 *      ```st-claim id=c1 profile=classical.propositional deps=c0
 *      A->B
 *      ```
 *
 * En ambos formatos los IDs son únicos por documento. El parser conserva el
 * texto crudo del bloque en `rawBlock` para poder reescribir o comparar.
 */
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map