"use strict";
// ============================================================
// Mechanism design — tipos compartidos
// ============================================================
//
// Modelamos mechanism design discreto sobre un conjunto finito de
// outcomes (típicamente: asignar ítems a agentes). Cada agente reporta
// una valuation `Map<outcomeId, number>`. El mechanism elige una
// allocation y cobra pagos.
//
// El bundle de un agente en una allocation es el conjunto de outcomes
// que se le asignan. Modelamos allocation como `Map<agentId, itemId>`
// para el caso single-unit (cada item a un solo agente). Para
// combinatorial auctions se generaliza con bundles, pero el `MechanismOutcome`
// público mantiene el tipo Map<string,string> según contrato.
//
// Los pagos son no-negativos cuando el mechanism es individually
// rational; aceptamos negativos en VCG con bundles porque las pivots
// pueden compensar (típicamente VCG cobra >= 0 si la valuation es
// monotónica, lo que asumimos por construcción de ejemplos).
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=types.js.map