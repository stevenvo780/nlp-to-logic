"use strict";
// ============================================================
// ST Categorical — Tipos públicos
// ============================================================
// Definiciones de interfaz para Category, Functor,
// NaturalTransformation, Cone, Diagram y MonoidalCategory.
//
// Decisión de diseño: cada morfismo se identifica por su `id`
// (clave estable string-able). La categoría es responsable de
// resolver compose / source / target a partir de la identidad
// del morfismo. Esto permite igualdad estructural simple por
// `id`, sin tener que comparar callbacks o funciones.
// ============================================================
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map