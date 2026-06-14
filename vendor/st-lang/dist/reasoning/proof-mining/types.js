"use strict";
// ============================================================
// ST Proof Mining — Tipos públicos
// ============================================================
//
// Proof mining (a.k.a. lemma extraction) toma un corpus de pruebas
// ya derivadas y extrae sub-pruebas reutilizables como lemmas
// independientes. La idea: si la misma estructura aparece en 2+
// pruebas, conviene cachearla con su propia entry para que futuras
// derivaciones la reusen sin re-trabajar.
//
// Diferencia con `lemma-synthesis`:
//   - lemma-synthesis ENUMERA conjeturas a partir de una signatura
//     y un evaluador (theory exploration estilo QuickSpec).
//   - proof-mining EXTRAE lemmas de pruebas que ya existen
//     (bottom-up desde el corpus, sin enumeración).
//
// Pipeline:
//   1. extract: encontrar sub-trees comunes entre pruebas.
//   2. generalize: anti-unify para subir el nivel de abstracción.
//   3. rank: ordenar por usefulness (savings · frecuencia · generalidad).
//   4. persist: meter en TheoremCache con hash α-canónico.
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map