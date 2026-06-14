"use strict";
// ============================================================
// Higher-Order Logic (HOL Light style) — Tipos
// ============================================================
//
// HOL = lógica de tipos simples + λ-binding + igualdad primitiva.
// Inspirado en HOL Light / Isabelle/HOL: un núcleo deductivo
// minimal con 10 reglas primitivas; el resto del aparato lógico
// (conectivas, cuantificadores) se define en términos de la
// igualdad polimórfica.
//
// Convención de typing: `bool` es el tipo de proposiciones,
// `ind` el tipo de individuos. Los tipos compuestos se forman
// con `fun(A, B)` que corresponde a `A → B`. Las variables de
// tipo (`tvar`) permiten polimorfismo paramétrico (let-style).
//
// Convención de terms (siguiendo HOL Light):
//   - `var`  variable libre de un tipo
//   - `const` constante (igualdad, conectivas definidas, etc.)
//   - `comb f x` aplicación de funciones (f x)
//   - `abs x.t` λ-abstracción
//
// Nota sobre nombres de variables: dos `var` con el mismo
// nombre PERO distinto tipo son variables distintas (HOL Light).
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map