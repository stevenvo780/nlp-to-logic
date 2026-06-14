import type { Agent, MechanismOutcome } from './types';
/**
 * VCG mechanism: allocation maximiza welfare; pago de cada agente =
 * externalidad = (welfare óptimo de los demás cuando él NO participa)
 *                - (welfare de los demás en la allocation elegida).
 *
 * Devuelve allocation y payments. Payments son ≥ 0 si valuations son
 * monotónicas (las nuestras lo son).
 */
export declare function vcgMechanism(agents: Agent[], items: string[]): MechanismOutcome;
/**
 * Welfare social bajo una allocation: suma de valuations de los agentes
 * por lo que recibieron.
 */
export declare function socialWelfare(outcome: MechanismOutcome, agents: Agent[]): number;
/**
 * Strategy-proofness empírica: tomamos `samples` reportes aleatorios de
 * un agente (manteniendo a los demás truthful), corremos el mechanism,
 * y verificamos que la utilidad del agente que miente no supere la
 * utilidad reportando truthfully. Si para alguna sample el misreport
 * mejora estrictamente, retornamos false.
 *
 * Utilidad cuasi-lineal: v(allocation_i) - payment_i.
 *
 * Esto es probabilístico: con `samples=0` no chequeamos nada y devolvemos
 * true. Útil sobretodo para testing.
 */
export declare function isStrategyProof(mechanism: (agents: Agent[]) => MechanismOutcome, samples?: number): boolean;
//# sourceMappingURL=vcg.d.ts.map