"use strict";
// ============================================================
// ST Proof Certificate — Tipos públicos
// ============================================================
//
// Formato canónico portable para certificados de prueba inspirado
// en LFSC (LF + Side Conditions) y Dedukti. La filosofía es
// "check-only": el verificador NO hace búsqueda de prueba ni
// resuelve fórmulas — sólo comprueba que cada paso aplica
// correctamente una regla declarada sobre premisas ya derivadas.
//
// Las fórmulas viajan como strings en una representación canónica
// definida por la profile/perfil. El verificador trata strings con
// comparación literal previa normalización (trim + colapsar
// whitespace interno). Esto hace al certificado independiente del
// AST interno del prover y permite intercambio entre herramientas.
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map