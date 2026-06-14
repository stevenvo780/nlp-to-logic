"use strict";
// ============================================================
// π-calculus — tipos del álgebra de procesos de Milner.
// ============================================================
// Sintaxis (subset estándar monádico):
//   0                      proceso nulo (nil)
//   c(x).P                 input: recibe valor por canal c, lo liga a x, sigue P
//   c̄⟨v⟩.P                output: envía v por canal c, sigue P
//   P | Q                  composición paralela
//   (ν c) P                restricción / canal nuevo (scope local)
//   !P                     replicación (infinitas copias en paralelo)
//   P + Q                  suma / choice no-determinista
//   [x = y].P              match: continúa solo si x ≡ y
//
// Convenciones de nombres:
//   - Los "names" son strings; un canal y un valor pueden coincidir
//     sintácticamente (uniformidad de nombres es la firma del π-calculus).
//   - Las ligaduras (input y new) pueden requerir α-conversión durante
//     la sustitución para evitar capturas.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map