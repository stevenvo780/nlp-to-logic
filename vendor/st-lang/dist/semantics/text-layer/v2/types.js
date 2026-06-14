"use strict";
/**
 * ST Text Layer 2.0 — tipos del grafo de claims con dependencias.
 *
 * Una Claim es una afirmación formal con dependencias explícitas hacia
 * otras claims. El grafo permite validación topológica e invalidación
 * propagada: si una claim base falla, todas las claims que dependen
 * transitivamente de ella se marcan inválidas.
 */
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map