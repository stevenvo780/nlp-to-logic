"use strict";
// ============================================================
// Algebraic effects + free monads — Tipos núcleo
// ============================================================
//
// Modelamos efectos algebraicos como un free monad explícito sobre
// una firma de operaciones discriminadas por `tag`. La forma `Eff<E, A>`
// es un árbol cuyas hojas son `pure` (valores) y cuyos nodos internos
// son `impure` (operación + continuación). Un `handler` interpreta
// una operación concreta y reduce el árbol.
//
// Convenciones:
//   - `Effect<Name, In, Out>` es una *fila* de tipo a nivel de tipos:
//     "este programa puede ejecutar la operación `Name` con input `In`
//      esperando salida `Out`". El campo `output` es phantom.
//   - El runtime sólo consume `tag` e `input`; el `output` vive en la
//     posición de continuación (argumento de la k-función).
//   - Mantenemos `unknown` en el runtime para no falsear unsoundness y
//     usamos los tipos exclusivamente para guiar al consumidor.
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map